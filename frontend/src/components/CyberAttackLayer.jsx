import React, { useState, useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

const API_BASE = `http://${window.location.hostname}:8000`;

const TOTAL_CYCLE = 2200;
const DRAW_DURATION = 1200;
const HOLD_DURATION = 200;
const ERASE_DURATION = 800;

function computeArcPoints(fromLon, fromLat, toLon, toLat) {
    const N = 60;
    const dLon = (toLon - fromLon) * Math.PI / 180;
    const dLat = (toLat - fromLat) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
        Math.cos(fromLat * Math.PI/180) *
        Math.cos(toLat   * Math.PI/180) *
        Math.sin(dLon/2)**2;
    const distDeg    = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 180/Math.PI;
    // Increased peakHeight for better visibility on globe
    const peakHeight = Math.min(2000000, Math.max(400000, distDeg * 25000));

    return Array.from({ length: N + 1 }, (_, i) => {
        const t = i / N;
        return {
            lon:    fromLon + (toLon - fromLon) * t,
            lat:    fromLat + (toLat - fromLat) * t,
            height: Math.sin(Math.PI * t) * peakHeight,
        };
    });
}

const CyberAttackLayer = ({ isLayerVisible }) => {
    const [attacks, setAttacks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedAttack, setSelectedAttack] = useState(null);
    
    const arcPointsCache = useRef(new Map());
    const animStates = useRef(new Map());
    const rafHandle = useRef(null);
    const handlerRef = useRef(null);
    const viewerRefLocal = useRef(null);

    // Initial load and Stats
    useEffect(() => {
        let mounted = true;
        
        const fetchCyberData = async () => {
            if (!isLayerVisible) return;
            try {
                const statRes = await fetch(`${API_BASE}/api/cyber/stats`);
                if (statRes.ok && mounted) {
                    setStats(await statRes.json());
                }

                const attackRes = await fetch(`${API_BASE}/api/cyber/attacks`);
                if (attackRes.ok && mounted) {
                    const data = await attackRes.json();
                    setAttacks(data.attacks || []);
                    setLoading(false);
                }
            } catch (err) {
                console.error("[CYBER] Error fetching data:", err);
                if (mounted) setLoading(false);
            }
        };

        fetchCyberData();
        const intId = setInterval(fetchCyberData, 60000);
        return () => {
            mounted = false;
            clearInterval(intId);
        };
    }, [isLayerVisible]);

    // Data Source and Entity Management
    useEffect(() => {
        if (!isLayerVisible) {
            if (viewerRefLocal.current) {
                const ds = viewerRefLocal.current.dataSources.getByName('cyber-attacks')[0];
                if (ds) ds.show = false;
            }
            return;
        }

        const attachToViewer = () => {
            const viewer = window.cesiumViewer;
            if (!viewer) {
                // Poll until window.cesiumViewer is ready
                setTimeout(attachToViewer, 500);
                return;
            }
            viewerRefLocal.current = viewer;

            let ds = viewer.dataSources.getByName('cyber-attacks')[0];
            if (!ds) {
                ds = new Cesium.CustomDataSource('cyber-attacks');
                viewer.dataSources.add(ds);
            }
            ds.show = true;
            ds.entities.removeAll();
            arcPointsCache.current.clear();

            attacks.forEach(attack => {
                const points = computeArcPoints(
                    parseFloat(attack.from_lon), parseFloat(attack.from_lat),
                    parseFloat(attack.to_lon),   parseFloat(attack.to_lat)
                );
                arcPointsCache.current.set(attack.id, points);

                if (!animStates.current.has(attack.id)) {
                    animStates.current.set(attack.id, {
                        elapsed: Math.random() * TOTAL_CYCLE,
                        lastTime: performance.now(),
                    });
                }

                ds.entities.add({
                    id: attack.id,
                    polyline: {
                        // Use Dynamic positions via Callback
                        positions: new Cesium.CallbackProperty(() => {
                            const state = animStates.current.get(attack.id);
                            if (!state) return [];
                            
                            let startFraction, endFraction;
                            if (state.elapsed < DRAW_DURATION) {
                                endFraction = state.elapsed / DRAW_DURATION;
                                startFraction = 0;
                            } else if (state.elapsed < DRAW_DURATION + HOLD_DURATION) {
                                startFraction = 0;
                                endFraction = 1;
                            } else {
                                const ep = (state.elapsed - DRAW_DURATION - HOLD_DURATION) / ERASE_DURATION;
                                startFraction = ep;
                                endFraction = 1;
                            }

                            const all = arcPointsCache.current.get(attack.id);
                            if (!all) return [];
                            const N = all.length - 1;
                            const si = Math.floor(startFraction * N);
                            const ei = Math.max(si + 1, Math.ceil(endFraction * N));
                            
                            return all.slice(si, ei + 1).map(p => 
                                Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height)
                            );
                        }, false),
                        width: attack.severity === 'HIGH' ? 4 : 2,
                        material: new Cesium.PolylineGlowMaterialProperty({
                            glowPower: 0.25,
                            taperPower: 0.7,
                            color: Cesium.Color.fromCssColorString(attack.color || '#ff0000'),
                        }),
                        arcType: Cesium.ArcType.NONE,
                        clampToGround: false
                    },
                    properties: { ...attack, _isCyberAttack: true }
                });
            });
        };

        attachToViewer();
    }, [attacks, isLayerVisible]);

    // Independent Animation Loop
    useEffect(() => {
        if (!isLayerVisible) return;

        const loop = (timestamp) => {
            animStates.current.forEach((state) => {
                const dt = Math.min(timestamp - state.lastTime, 100);
                state.lastTime = timestamp;
                state.elapsed = (state.elapsed + dt) % TOTAL_CYCLE;
            });
            rafHandle.current = requestAnimationFrame(loop);
        };

        rafHandle.current = requestAnimationFrame(loop);
        return () => {
            if (rafHandle.current) cancelAnimationFrame(rafHandle.current);
        };
    }, [isLayerVisible]);

    // Click Handler
    useEffect(() => {
        const viewer = window.cesiumViewer;
        if (!viewer) return;

        handlerRef.current = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        handlerRef.current.setInputAction((click) => {
            const picked = viewer.scene.pick(click.position);
            if (Cesium.defined(picked) && picked.id && picked.id.properties?._isCyberAttack) {
                const p = picked.id.properties;
                const d = {};
                p.propertyNames.forEach(n => d[n] = p[n].getValue());
                setSelectedAttack(d);
            } else {
                setSelectedAttack(null);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        return () => {
            if (handlerRef.current) handlerRef.current.destroy();
        };
    }, [isLayerVisible]);

    if (!isLayerVisible) return null;

    return (
        <>
            <div className="cyber-stats-panel glass-tactical border-red-500/30">
                <div className="panel-label">
                    <span className="status-dot active bg-red-500 shadow-[0_0_8px_red]" />
                    LIVE CYBER THREAT FEED
                </div>
                <div className="cyber-total my-4">
                    <span className="total-num text-4xl block font-bold text-red-500 tracking-tighter">
                        {stats ? stats.total : '---'}
                    </span>
                    <span className="total-label text-[10px] opacity-40 uppercase tracking-widest">Global Inbound Vectors</span>
                </div>
                
                {stats && stats.by_type && (
                    <div className="space-y-3">
                        <div className="text-[10px] text-red-400/50 uppercase tracking-widest border-b border-red-500/10 pb-1">Topology Breakdown</div>
                        {Object.entries(stats.by_type).slice(0, 5).map(([t, c]) => (
                            <div key={t} className="flex items-center justify-between text-[11px]">
                                <span className="text-red-300 opacity-60 uppercase">{t}</span>
                                <span className="font-mono text-red-500">{c}</span>
                            </div>
                        ))}
                        
                        <div className="mt-4 grid grid-cols-2 gap-4 pt-2 border-t border-red-500/10">
                            <div>
                                <div className="text-[8px] opacity-40 uppercase mb-1">Top Origins</div>
                                {stats.top_sources.slice(0, 3).map(([n, c], i) => (
                                    <div key={i} className="text-[9px] flex justify-between">
                                        <span className="truncate pr-1 text-red-200/50">{n.substring(0,8)}</span>
                                        <span className="text-red-500">{c}</span>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="text-[8px] opacity-40 uppercase mb-1">Top Targets</div>
                                {stats.top_targets.slice(0, 3).map(([n, c], i) => (
                                    <div key={i} className="text-[9px] flex justify-between">
                                        <span className="truncate pr-1 text-gray-400">{n.substring(0,8)}</span>
                                        <span className="text-red-500">{c}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {selectedAttack && (
                <div className="cyber-popup glass-tactical border-red-500 p-4 w-80">
                    <button className="absolute top-2 right-2 text-white/40 hover:text-white" onClick={() => setSelectedAttack(null)}>×</button>
                    <div className="text-sm font-bold text-red-500 mb-2 tracking-tighter uppercase">
                        {selectedAttack.attack_type} DETECTED
                    </div>
                    <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                            <span className="opacity-40 uppercase">Attacker IP</span>
                            <span className="text-white font-mono">{selectedAttack.attacker_ip}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1 pt-1">
                            <span className="opacity-40 uppercase">Origin</span>
                            <span className="text-red-400 font-bold">{selectedAttack.from_name} ({selectedAttack.from_cc})</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1 pt-1">
                            <span className="opacity-40 uppercase">Vector</span>
                            <span className="text-red-400 font-bold">{selectedAttack.to_name} ({selectedAttack.to_cc})</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1 pt-1">
                            <span className="opacity-40 uppercase">Provider</span>
                            <span className="truncate w-32 text-right">{selectedAttack.isp}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="text-red-600 font-black tracking-widest">{selectedAttack.severity} SEVERITY</span>
                            <span className="opacity-60 italic">OSINT: {selectedAttack.source}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CyberAttackLayer;

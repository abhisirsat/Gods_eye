import React, { useState, useEffect } from 'react';
import { Satellite, MapPin, Crosshair, Loader2 } from 'lucide-react';

const API_BASE = `http://${window.location.hostname}:8000`;

const SatellitePanel = ({ onSelectSatellite, isVisible }) => {
    const [targets, setTargets] = useState([]);
    const [passes, setPasses] = useState(null);
    const [loadingPasses, setLoadingPasses] = useState(false);
    // Default observer coordinates: Washington D.C for context
    const [observerLoc, setObserverLoc] = useState({ lat: 38.8951, lng: -77.0364 }); 

    useEffect(() => {
        if (!isVisible) return;
        fetch(`${API_BASE}/api/satellites/advanced/priority`)
            .then(res => res.json())
            .then(data => setTargets(data.satellites || []))
            .catch(err => console.error("Priority fetch error:", err));
    }, [isVisible]);

    const fetchPasses = async (norad_id) => {
        setLoadingPasses(true);
        setPasses(null);
        try {
            const res = await fetch(`${API_BASE}/api/satellites/advanced/passes?norad_id=${norad_id}&lat=${observerLoc.lat}&lng=${observerLoc.lng}&days=2`);
            const data = await res.json();
            setPasses({ satellite_id: norad_id, data: data.passes || [] });
        } catch (err) {
            console.error("Passes fetch error:", err);
            setPasses({ satellite_id: norad_id, data: [] });
        }
        setLoadingPasses(false);
    };

    if (!isVisible) return null;

    return (
        <div className="absolute top-[28rem] right-4 w-80 glass-tactical border-cyan-500/30 p-4 z-40 text-cyan-500 pointer-events-auto shadow-[0_0_15px_rgba(0,242,255,0.1)]">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-2 mb-4 border-b border-cyan-500/30 pb-2">
                <Satellite size={14} /> ORBITAL ASSET TRACKING
            </h2>
            
            <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {targets.map(sat => (
                    <div key={sat.id} className="text-xs bg-black/40 p-2.5 border border-cyan-500/10 hover:border-cyan-500/50 transition-colors group">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: sat.color, color: sat.color }}></span>
                                {sat.name}
                            </span>
                            <span className="text-[8px] tracking-widest opacity-80 border px-1 border-cyan-500/30 text-cyan-400 bg-cyan-900/20">{sat.type}</span>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-[9px] opacity-60 uppercase font-mono tracking-wider">OBJ: {sat.id} | CC: {sat.country}</span>
                            <div className="flex gap-1.5">
                                <button 
                                    onClick={() => fetchPasses(sat.id)}
                                    className="p-1.5 text-cyan-500 bg-cyan-900/30 hover:bg-cyan-500 hover:text-black rounded transition-colors" 
                                    title="Predict Passes (D.C.)">
                                    <MapPin size={12} />
                                </button>
                                <button 
                                    onClick={() => onSelectSatellite(`SAT_${sat.id}`)}
                                    className="p-1.5 text-cyan-500 bg-cyan-900/30 hover:bg-cyan-500 hover:text-black rounded transition-colors" 
                                    title="Track Asset on Globe">
                                    <Crosshair size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Passes Predictions Section */}
            {(passes || loadingPasses) && (
                <div className="bg-cyan-950/20 p-2.5 border border-cyan-500/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw0IDRaTTAgNEw0IDBaIiBzdHJva2U9IiMwMGZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] pointer-events-none opacity-50 mix-blend-screen"></div>
                    <h3 className="text-[9px] tracking-[0.2em] font-black mb-2 flex justify-between relative z-10 text-cyan-300">
                        <span>PREDICTED PASSES {passes && `[OBJ: ${passes.satellite_id}]`}</span>
                        {loadingPasses && <Loader2 size={10} className="animate-spin text-cyan-500" />}
                    </h3>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 relative z-10">
                        {passes && passes.data.length === 0 ? (
                            <div className="text-[10px] text-cyan-500/50 italic py-2 text-center uppercase">No passes in next 48h</div>
                        ) : passes && (
                            passes.data.map((p, i) => {
                                const startD = new Date(p.startUTC * 1000);
                                return (
                                    <div key={i} className="text-[9px] font-mono flex items-center justify-between border-b border-cyan-500/10 pb-1.5 group hover:border-cyan-500/30 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-white">{startD.toLocaleDateString()}</span>
                                            <span className="text-cyan-400 font-bold">{startD.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-yellow-500/80 tracking-widest">DUR: {p.duration}s</span>
                                            {p.mag !== undefined && <span className="opacity-70">MAG: {p.mag}</span>}
                                            {p.maxEl !== undefined && <span className="opacity-70 text-cyan-600">ELEV: {p.maxEl}°</span>}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SatellitePanel;

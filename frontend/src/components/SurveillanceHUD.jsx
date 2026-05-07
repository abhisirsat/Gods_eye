import React, { useState, useEffect, useRef } from 'react';
import { Camera, Map, ShieldAlert, X, Radio, Eye, Globe, WifiOff, AlertTriangle } from 'lucide-react';
import Hls from 'hls.js';

const SurveillanceHUD = ({ isOpen, onClose, selectedHotspot, selectedCam }) => {
    const [typingText, setTypingText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (selectedHotspot) {
            simulateIntelligenceBriefing(selectedHotspot.intelligence);
        }
    }, [selectedHotspot]);

    useEffect(() => {
        let hls = null;
        if (selectedCam && selectedCam.stream_type === 'HLS' && videoRef.current && selectedCam.status !== 'OFFLINE') {
            if (Hls.isSupported()) {
                hls = new Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(selectedCam.url);
                hls.attachMedia(videoRef.current);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
                });
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = selectedCam.url;
                videoRef.current.addEventListener('loadedmetadata', () => {
                    videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
                });
            }
        }
        return () => { if (hls) hls.destroy(); };
    }, [selectedCam, isOpen]);

    const simulateIntelligenceBriefing = (text) => {
        setIsThinking(true);
        setTypingText('');
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setTypingText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(interval);
                setIsThinking(false);
            }
        }, 30);
    };

    if (!isOpen) return null;
    const isOffline = selectedCam?.status === 'OFFLINE';

    return (
        <div
            className="fixed top-20 right-4 w-[400px] flex flex-col font-mono z-[2000] fui-panel"
            style={{
                maxHeight: '85vh',
                animation: 'count-up 0.3s ease-out both',
                boxShadow: '0 0 50px rgba(0,0,0,0.9), 0 0 30px rgba(170,255,0,0.08)',
            }}
        >
            {/* ── Header ── */}
            <div
                className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(170,255,0,0.12)] shrink-0 relative overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.6)' }}
            >
                {/* Scan sweep */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(170,255,0,0.05), transparent)',
                        animation: 'scanbar 4s ease-in-out infinite',
                        width: '40%',
                    }}
                />
                <div className="flex items-center gap-2.5 relative z-10">
                    <div className="relative">
                        <ShieldAlert
                            className="w-4 h-4"
                            style={{ color: selectedHotspot?.severity === 'CRITICAL' ? '#ff1a1a' : '#aaff00' }}
                        />
                        <div
                            className="absolute -inset-1 rounded-full blur-sm opacity-60"
                            style={{ background: selectedHotspot?.severity === 'CRITICAL' ? 'rgba(255,26,26,0.3)' : 'rgba(170,255,0,0.3)', animation: 'pulse-soft 2s ease-in-out infinite' }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <span
                            className="tracking-[0.2em] uppercase"
                            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', fontWeight: 700, color: '#aaff00' }}
                        >
                            {selectedHotspot ? 'SECTOR ANALYSIS' : 'SURVEILLANCE LINK'}
                        </span>
                        <span className="font-mono text-[7px] text-[rgba(170,255,0,0.4)] tracking-widest">
                            {selectedHotspot ? `HOTSPOT: ${selectedHotspot.id || 'UNKNOWN'}` : `NODE: ${selectedCam?.id || 'DISCONNECTED'}`}
                        </span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="fui-btn p-1.5 relative z-10"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* ── Main content ── */}
            <div
                className="flex flex-col gap-3 p-4 overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(170,255,0,0.2) transparent' }}
            >
                {/* Video/visual area */}
                <div
                    className="relative aspect-video border border-[rgba(170,255,0,0.15)] overflow-hidden"
                    style={{ background: '#050805' }}
                >
                    {/* Scanline overlay */}
                    <div className="absolute inset-0 pointer-events-none z-30"
                        style={{
                            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
                        }}
                    />
                    {/* Corner brackets on video */}
                    {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((cls, i) => (
                        <div key={i} className={`absolute w-4 h-4 ${cls} border-[rgba(170,255,0,0.5)] z-40 pointer-events-none`} />
                    ))}

                    {isOffline ? (
                        <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: '#070707' }}>
                            <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")", backgroundSize: '200% 200%', animation: 'static-noise 0.2s steps(4) infinite' }} />
                            <Radio className="w-10 h-10 z-20" style={{ color: 'rgba(255,26,26,0.4)', animation: 'pulse-soft 1.5s ease-in-out infinite' }} />
                            <div className="mt-3 flex flex-col items-center z-20">
                                <span className="font-mono text-[10px] font-bold tracking-[0.4em]" style={{ color: '#ff1a1a', animation: 'blink 1s step-end infinite' }}>SIGNAL_LOST</span>
                                <span className="font-mono text-[7px] text-[rgba(255,26,26,0.4)] uppercase mt-1">CHECK CARRIER // ENCRYPTION FAILURE</span>
                            </div>
                        </div>
                    ) : selectedCam ? (
                        <div className="w-full h-full relative">
                            {selectedCam.stream_type === 'EMBED' ? (
                                <div className="w-full h-full relative group">
                                    <iframe src={selectedCam.url} className="w-full h-full border-0 brightness-110" title="OSINT Surveillance Feed" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                                    <div className="absolute inset-0 pointer-events-none z-40" style={{ background: 'rgba(170,255,0,0.03)', mixBlendMode: 'overlay' }} />
                                </div>
                            ) : (
                                <video ref={videoRef} className="w-full h-full object-cover" style={{ filter: 'grayscale(0.3) contrast(1.1) brightness(0.8)' }} muted playsInline autoPlay />
                            )}
                            {/* LIVE badge */}
                            <div className="absolute top-2 left-2 px-2 py-0.5 border flex items-center gap-1.5 z-40" style={{ background: 'rgba(255,26,26,0.85)', borderColor: 'rgba(255,100,100,0.4)' }}>
                                <div className="w-1.5 h-1.5 bg-white rounded-full" style={{ animation: 'blink 1s step-end infinite' }} />
                                <span className="font-mono text-[8px] text-white font-bold tracking-widest">LIVE // {selectedCam.source}</span>
                            </div>
                            <div className="absolute top-2 right-2 z-40 px-2 py-0.5 border font-mono text-[7px] font-bold tracking-widest" style={{ background: 'rgba(0,0,0,0.7)', borderColor: 'rgba(170,255,0,0.2)', color: 'rgba(170,255,0,0.7)' }}>
                                FEED_ID: {selectedCam.id}
                            </div>
                        </div>
                    ) : selectedHotspot ? (
                        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'rgba(0,10,0,0.5)' }}>
                            <Globe className="w-14 h-14" style={{ color: 'rgba(170,255,0,0.15)', animation: 'radar-spin 10s linear infinite' }} />
                            <div className="mt-2 text-center z-10">
                                <span className="font-mono text-[9px] text-[rgba(170,255,0,0.6)] font-bold uppercase tracking-[0.3em] block">Satellite Recon</span>
                                <span className="font-mono text-[7px] text-[rgba(170,255,0,0.3)] uppercase">Resolving 0.5m Optical Imagery...</span>
                            </div>
                            <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: 'rgba(170,255,0,0.1)', animation: 'scanbar-v 4s linear infinite' }} />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <WifiOff className="w-10 h-10 opacity-10" style={{ color: '#aaff00' }} />
                        </div>
                    )}

                    {/* Coordinates overlay */}
                    <div className="absolute bottom-2 left-2 flex gap-3 text-[7px] font-bold z-40 px-2 py-0.5 border" style={{ background: 'rgba(0,0,0,0.75)', borderColor: 'rgba(170,255,0,0.12)', color: 'rgba(170,255,0,0.5)' }}>
                        <span>LAT: {(selectedHotspot?.lat || selectedCam?.lat || 0).toFixed(4)}</span>
                        <span>LNG: {(selectedHotspot?.lng || selectedCam?.lng || 0).toFixed(4)}</span>
                        <span>ALT: 450KM</span>
                    </div>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-3 gap-1.5">
                    {[
                        { label: 'SOURCE',   val: selectedCam?.source || selectedHotspot?.source || 'OSINT_CORE' },
                        { label: 'CATEGORY', val: selectedCam?.category || (selectedHotspot ? 'TACTICAL' : 'N/A') },
                        { label: 'MODALITY', val: selectedCam?.stream_type || 'MULTI-SPEC' },
                    ].map(({ label, val }) => (
                        <div key={label} className="fui-panel px-2 py-1.5">
                            <div className="fui-label text-[6px] mb-1">{label}</div>
                            <div className="font-mono text-[8px] font-bold truncate" style={{ color: '#aaff00' }}>{val}</div>
                        </div>
                    ))}
                </div>

                {/* AIGS Intelligence Digest */}
                <div className="fui-panel px-3 py-3 flex flex-col gap-2 relative">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <Eye className="w-3 h-3" style={{ color: '#aaff00' }} />
                            <span className="tracking-widest uppercase" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', fontWeight: 700, color: '#aaff00' }}>
                                AIGS Digest // {selectedHotspot?.severity || 'NOMINAL'}
                            </span>
                        </div>
                        <div className="font-mono text-[7px] text-[rgba(170,255,0,0.3)] italic">CON_ID: 0x8F22A</div>
                    </div>
                    <div className="font-mono text-[10px] leading-relaxed min-h-[80px]" style={{ color: 'rgba(200,255,180,0.75)' }}>
                        {selectedHotspot ? (
                            <>
                                <div className="font-bold mb-1 uppercase tracking-tight text-[11px]" style={{ color: '#aaff00' }}>OBJECTIVE: {selectedHotspot.name}</div>
                                <div className="text-[9px] border-l-2 border-[rgba(170,255,0,0.25)] pl-2 italic mb-2" style={{ color: 'rgba(170,255,0,0.4)' }}>
                                    Activity Vector: {selectedHotspot.activity}
                                </div>
                                <div style={{ color: 'rgba(210,255,190,0.85)' }}>
                                    {typingText}
                                    {isThinking && <span className="inline-block w-1.5 h-3 ml-1 bg-[#aaff00]" style={{ animation: 'blink 0.8s step-end infinite' }} />}
                                </div>
                            </>
                        ) : selectedCam ? (
                            <div className="space-y-1">
                                <div className="font-bold uppercase tracking-tight text-[11px]" style={{ color: '#aaff00' }}>SENSOR_NODE: {selectedCam.name}</div>
                                <p className="opacity-80">Optical feed verified. Signal harmonics indicate stable throughput. AI pre-processing identifies <span style={{ color: '#aaff00' }}>[{selectedCam.category}]</span>-class infrastructure. Sentinel protocol active.</p>
                            </div>
                        ) : (
                            <div className="h-[80px] flex flex-col items-center justify-center opacity-20 gap-2">
                                <AlertTriangle className="w-6 h-6" />
                                <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Awaiting Target Designation</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-1.5 right-2 font-mono text-[6px] text-[rgba(170,255,0,0.15)] uppercase">SENTINEL_PROCESSOR_v12.4.9</div>
                </div>

                {/* Signal metrics */}
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: 'Signal Integrity', val: (selectedCam && !isOffline) ? '98%' : '12%', pct: (selectedCam && !isOffline) ? 98 : 12, color: '#aaff00' },
                        { label: 'Local Hostility',  val: selectedHotspot?.severity || 'LOW', pct: selectedHotspot ? (selectedHotspot.severity === 'CRITICAL' ? 100 : 65) : 5, color: selectedHotspot?.severity === 'CRITICAL' ? '#ff1a1a' : '#aaff00' },
                    ].map(({ label, val, pct, color }) => (
                        <div key={label} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="fui-label text-[7px]">{label}</span>
                                <span className="font-mono text-[8px] font-bold" style={{ color }}>{val}</span>
                            </div>
                            <div className="fui-bar-track">
                                <div className="fui-bar-fill" style={{ '--bar-width': `${pct}%`, width: `${pct}%`, background: `linear-gradient(90deg, rgba(${color === '#ff1a1a' ? '255,26,26' : '170,255,0'},0.4), ${color})`, boxShadow: `0 0 8px ${color}60` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-4 py-2 border-t border-[rgba(170,255,0,0.1)] flex justify-between items-center shrink-0" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: isOffline ? '#ff1a1a' : '#aaff00', boxShadow: isOffline ? '0 0 5px rgba(255,26,26,0.8)' : '0 0 5px rgba(170,255,0,0.8)', animation: 'blink 1.5s step-end infinite' }}
                        />
                        <span className="font-mono text-[8px] font-bold uppercase" style={{ color: isOffline ? '#ff4444' : '#aaff00' }}>
                            {isOffline ? 'LINK FAILED' : 'ENCRYPTION ACTIVE'}
                        </span>
                    </div>
                    <span className="font-mono text-[7px] text-[rgba(170,255,0,0.35)]">
                        BW: <span style={{ color: 'rgba(170,255,0,0.6)' }}>{(Math.random() * 450 + 200).toFixed(0)}MBPS</span>
                    </span>
                </div>
                <div className="font-mono text-[7px] text-[rgba(170,255,0,0.2)] italic tracking-widest">AIGS_COGNITIVE_LAYER</div>
            </div>

            <style>{`
                @keyframes static-noise {
                    0%   { background-position: 0 0 }
                    10%  { background-position: -5% -10% }
                    50%  { background-position: -10% 15% }
                    100% { background-position: 0 0 }
                }
            `}</style>
        </div>
    );
};

export default SurveillanceHUD;

import React, { useState, useEffect } from 'react';
import {
    Play, Pause, RotateCcw,
    Activity, Zap, Shield, Camera, Ship, Plane,
    Radio, Satellite, MapPin, Database, Wind, Flame, Network
} from 'lucide-react';

const TimelineSlider = ({ layers, setLayers }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [mode, setMode] = useState('LIVE');
    const [speed, setSpeed] = useState(1);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        let interval;
        if (isPlaying || mode === 'LIVE') {
            interval = setInterval(() => {
                setCurrentTime(prev => {
                    if (mode === 'LIVE') return new Date();
                    return new Date(prev.getTime() + 1000 * speed);
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, speed, mode]);

    const playbackSpeeds = [
        { label: '1m/s',  value: 60 },
        { label: '3m/s',  value: 180 },
        { label: '5m/s',  value: 300 },
        { label: '15m/s', value: 900 },
        { label: '1h/s',  value: 3600 },
    ];

    const layerToggles = [
        { id: 'flights',          label: 'Flights',      icon: Plane,    color: '#aaff00' },
        { id: 'military_flights', label: 'Military',     icon: Shield,   color: '#ff1a1a' },
        { id: 'jamming',          label: 'GPS Jam',      icon: Zap,      color: '#ffaa00' },
        { id: 'ships',            label: 'Maritime',     icon: Ship,     color: '#aaff00' },
        { id: 'satellites',       label: 'Satellites',   icon: Satellite,color: '#aaff00' },
        { id: 'surveillance',     label: 'CCTV',         icon: Camera,   color: '#aaff00' },
        { id: 'infrastructure',   label: 'Infra',        icon: Network,  color: '#88ccff' },
        { id: 'signals',          label: 'SIGINT',       icon: Radio,    color: '#aaff00' },
        { id: 'news',             label: 'Intel',        icon: Activity, color: '#aaff00' },
        { id: 'weather',          label: 'Atmosphere',   icon: Wind,     color: '#aaaaff' },
        { id: 'fire',             label: 'Kinetic',      icon: Flame,    color: '#ff4400' },
        { id: 'cyber_attacks',    label: 'Cyber',        icon: Zap,      color: '#ff1a1a' },
        { id: 'airspace',         label: 'Airspace',     icon: MapPin,   color: '#ffaa00' },
    ];

    return (
        <div className="absolute bottom-8 left-4 right-4 z-20 flex flex-col gap-2 pointer-events-none depth-panel-bottom">

            {/* ── Top row: mode toggle + status ── */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3 pointer-events-auto">
                    {/* LIVE / PLAYBACK segmented toggle */}
                    <div className="fui-segment">
                        <button
                            onClick={() => setMode('LIVE')}
                            className={`fui-segment-btn ${mode === 'LIVE' ? 'active' : ''}`}
                            style={mode === 'LIVE' ? { color: '#aaff00', boxShadow: 'inset 0 -2px 0 #aaff00' } : {}}
                        >
                            ● LIVE
                        </button>
                        <button
                            onClick={() => setMode('PLAYBACK')}
                            className={`fui-segment-btn ${mode === 'PLAYBACK' ? 'active' : ''}`}
                            style={mode === 'PLAYBACK' ? { color: '#ffaa00', boxShadow: 'inset 0 -2px 0 #ffaa00' } : {}}
                        >
                            ▶ PLAYBACK
                        </button>
                    </div>

                    {/* Speed buttons (playback only) */}
                    {mode === 'PLAYBACK' && (
                        <div className="flex gap-1">
                            {playbackSpeeds.map(ps => (
                                <button
                                    key={ps.label}
                                    onClick={() => setSpeed(ps.value)}
                                    className="fui-btn px-2 py-1"
                                    style={speed === ps.value ? { background: 'rgba(170,255,0,0.18)', borderColor: '#aaff00', color: '#aaff00', boxShadow: '0 0 8px rgba(170,255,0,0.3)' } : {}}
                                >
                                    {ps.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status + time */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-1.5 h-1.5 rounded-full bg-[#aaff00]"
                            style={{ boxShadow: '0 0 6px rgba(170,255,0,0.8)', animation: 'blink 1.5s step-end infinite' }}
                        />
                        <span className="font-mono text-[8px] text-[rgba(170,255,0,0.4)] tracking-widest uppercase">
                            STREAMING_ENCRYPTED
                        </span>
                    </div>
                    <div
                        className="px-3 py-1 border border-[rgba(170,255,0,0.3)] font-mono tabular-nums"
                        style={{
                            background: 'rgba(0,0,0,0.75)',
                            fontFamily: 'Orbitron, sans-serif',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#aaff00',
                            textShadow: '0 0 8px rgba(170,255,0,0.5)',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {currentTime.toISOString().replace('T', ' ').split('.')[0]} UTC
                    </div>
                </div>
            </div>

            {/* ── Scrubber bar ── */}
            <div
                className="fui-panel fui-panel-scan px-5 py-2.5 flex items-center gap-4 pointer-events-auto"
                style={{ minHeight: '48px' }}
            >
                {/* Play/Pause */}
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="fui-btn px-2 py-1.5 shrink-0"
                    style={{ borderColor: 'rgba(170,255,0,0.4)', fontSize: '13px' }}
                >
                    {isPlaying
                        ? <Pause size={14} fill="currentColor" color="#aaff00" />
                        : <Play  size={14} fill="currentColor" color="#aaff00" />
                    }
                </button>

                {/* Timeline track */}
                <div className="flex-1 flex flex-col gap-1">
                    <div className="relative h-1.5 bg-[rgba(170,255,0,0.06)] rounded-none cursor-pointer group border border-[rgba(170,255,0,0.1)]">
                        {/* Fill */}
                        <div
                            className="absolute top-0 left-0 h-full"
                            style={{ width: '75%', background: 'linear-gradient(90deg, rgba(170,255,0,0.3), rgba(170,255,0,0.7))', boxShadow: '0 0 10px rgba(170,255,0,0.4)' }}
                        >
                            {/* Scrubber head */}
                            <div
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-[#aaff00]"
                                style={{ boxShadow: '0 0 8px rgba(170,255,0,0.8)' }}
                            />
                        </div>
                        {/* Tick marks */}
                        <div className="absolute inset-0 flex justify-between items-end px-1 pb-2.5">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="w-px bg-[rgba(170,255,0,0.25)]" style={{ height: i % 3 === 0 ? '6px' : '3px' }} />
                            ))}
                        </div>
                    </div>
                    {/* Time labels */}
                    <div className="flex justify-between px-1">
                        {['00:00', '06:00', '12:00', '18:00', '24:00'].map(t => (
                            <span key={t} className="font-mono text-[7px] text-[rgba(170,255,0,0.25)]">{t}</span>
                        ))}
                    </div>
                </div>

                {/* Reset */}
                <button
                    onClick={() => { setCurrentTime(new Date()); setMode('LIVE'); }}
                    className="fui-btn px-2 py-1.5 shrink-0"
                >
                    <RotateCcw size={12} color="rgba(170,255,0,0.6)" />
                </button>
            </div>

            {/* ── Layer Toggles ── */}
            <div className="flex flex-wrap justify-center gap-1 pointer-events-auto">
                {layerToggles.map(layer => {
                    const Icon  = layer.icon;
                    const isActive = layers ? layers[layer.id] : true;
                    return (
                        <button
                            key={layer.id}
                            id={`layer-toggle-${layer.id}`}
                            onClick={() => setLayers && setLayers(prev => ({ ...prev, [layer.id]: !prev[layer.id] }))}
                            className="relative flex items-center gap-2 px-3 py-1.5 transition-all overflow-hidden group"
                            style={{
                                background: isActive ? `rgba(${layer.color === '#ff1a1a' ? '255,26,26' : layer.color === '#ffaa00' ? '255,170,0' : '170,255,0'},0.10)` : 'rgba(0,0,0,0.6)',
                                border: `1px solid ${isActive ? (layer.color + '66') : 'rgba(170,255,0,0.08)'}`,
                                opacity: isActive ? 1 : 0.45,
                                filter: isActive ? 'none' : 'grayscale(80%)',
                                backdropFilter: 'blur(6px)',
                            }}
                        >
                            {/* Scan sweep on hover */}
                            <div
                                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 pointer-events-none"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(170,255,0,0.08), transparent)' }}
                            />
                            <Icon size={10} color={isActive ? layer.color : 'rgba(170,255,0,0.3)'} />
                            <span
                                className="font-mono font-bold uppercase tracking-widest"
                                style={{ fontSize: '8px', color: isActive ? 'rgba(200,255,120,0.9)' : 'rgba(170,255,0,0.3)' }}
                            >
                                {layer.label}
                            </span>
                            {isActive && (
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-0.5"
                                    style={{ background: layer.color, boxShadow: `0 0 6px ${layer.color}` }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelineSlider;

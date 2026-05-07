import React, { useState, useEffect } from 'react';

/* Animated data row (reference: "CONTROLLER TEST" panel) */
const DataRow = ({ label, subLabel, value, unit = 'pt.', maxVal = 1000, delay = 0 }) => {
    const [displayVal, setDisplayVal] = useState(0);
    const pct = Math.min((value / maxVal) * 100, 100);

    useEffect(() => {
        const t = setTimeout(() => {
            let start = 0;
            const step = value / 30;
            const iv = setInterval(() => {
                start = Math.min(start + step, value);
                setDisplayVal(Math.floor(start));
                if (start >= value) clearInterval(iv);
            }, 40);
            return () => clearInterval(iv);
        }, delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return (
        <div className="fui-data-row">
            <div className="flex flex-col flex-1 min-w-0">
                <span className="font-mono text-[10px] font-bold tracking-wider text-[rgba(200,255,120,0.9)] uppercase truncate">
                    {label}
                </span>
                {subLabel && (
                    <span className="font-mono text-[7px] text-[rgba(170,255,0,0.3)] tracking-widest">
                        {subLabel}
                    </span>
                )}
                {/* Fill bar */}
                <div className="mt-1 fui-bar-track">
                    <div className="fui-bar-fill" style={{ '--bar-width': `${pct}%`, width: `${pct}%` }} />
                </div>
            </div>
            <div className="flex items-baseline gap-1 ml-2 shrink-0">
                <span
                    style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '20px', fontWeight: 700, color: '#aaff00', textShadow: '0 0 12px rgba(170,255,0,0.6)', minWidth: '52px', textAlign: 'right' }}
                >
                    {displayVal}
                </span>
                <span className="font-mono text-[9px] text-[rgba(170,255,0,0.5)]">{unit}</span>
            </div>
        </div>
    );
};

const intelRows = [
    { label: 'CODE TRACE PANEL',    subLabel: 'SIGINT CORE RESEARCH',   value: 568, unit: 'pt.', maxVal: 1000 },
    { label: 'OOT CODE REFERENCE',  subLabel: 'SIGINT CORE RESEARCH',   value: 55,  unit: 'pt.', maxVal: 1000 },
    { label: 'TIMING SPIN MOTION',  subLabel: 'SIGINT CORE RESEARCH',   value: 5,   unit: 'pt.', maxVal: 1000 },
    { label: 'SECTOR CLAMP',        subLabel: 'SIGINT CORE RESEARCH',   value: 326, unit: 'pt.', maxVal: 1000 },
    { label: 'GEN BREAKER OPEN',    subLabel: 'SIGINT CORE RESEARCH',   value: 877, unit: 'pt.', maxVal: 1000 },
    { label: 'MECH DOT STOP',       subLabel: 'SIGINT CORE RESEARCH',   value: 45,  unit: 'pt.', maxVal: 1000 },
];

const rightStats = [
    { label: 'ASF',   value: '351', sub: '27' },
    { label: 'IPN',   value: '42',  sub: '19' },
];

/* Toggle switch */
const FuiSwitch = ({ label, active, onToggle }) => (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-[rgba(170,255,0,0.06)]">
        <span className="font-mono text-[9px] font-bold tracking-widest text-[rgba(170,255,0,0.6)] uppercase">{label}</span>
        <button
            onClick={onToggle}
            className="fui-toggle"
            style={{
                background: active ? 'rgba(170,255,0,0.12)' : 'rgba(0,0,0,0.6)',
                borderColor: active ? 'rgba(170,255,0,0.7)' : 'rgba(170,255,0,0.25)',
                boxShadow: active ? '0 0 8px rgba(170,255,0,0.3)' : 'none',
            }}
        >
            <div
                className="fui-toggle-knob"
                style={{ left: active ? '18px' : '2px', background: active ? '#aaff00' : 'rgba(170,255,0,0.3)' }}
            />
        </button>
    </div>
);

const Sidebar = ({ onSelectCamera, visuals, setVisuals }) => {
    const { panoptic, sharpen } = visuals;
    const updateVisual = (key, val) => setVisuals(prev => ({ ...prev, [key]: val }));

    return (
        <>
            {/* ── LEFT PANEL: Controller Test / Data Cluster ── */}
            <div
                className="absolute top-44 left-5 bottom-44 w-72 z-20 flex flex-col gap-2 pointer-events-none"
                style={{ maxWidth: '280px' }}
            >
                {/* Header buttons */}
                <div className="flex flex-col gap-1 pointer-events-auto">
                    {['DATA LAYERS', 'SCENES', 'ASSET MGMT'].map((label, i) => (
                        <button
                            key={label}
                            className="fui-btn flex items-center justify-between px-3 py-2 text-left"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <span>{label}</span>
                            <div className="w-4 h-4 border border-[rgba(170,255,0,0.3)] flex items-center justify-center">
                                <span className="text-[10px] text-[rgba(170,255,0,0.5)]">+</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* CONTROLLER TEST panel */}
                <div className="flex-1 fui-panel fui-panel-scan flex flex-col overflow-hidden pointer-events-auto depth-panel-left">
                    {/* Panel Header */}
                    <div className="px-3 py-2 border-b border-[rgba(170,255,0,0.12)] flex items-center justify-between shrink-0">
                        <div className="flex flex-col">
                            <span
                                className="tracking-wider uppercase"
                                style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: '#aaff00', textShadow: '0 0 10px rgba(170,255,0,0.5)' }}
                            >
                                CONTROLLER TEST
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="status-dot active" />
                                <span className="fui-label text-[7px]">Research TF (3)</span>
                                {/* SO-5 / SO-7 badges */}
                                <div className="flex gap-1">
                                    {['SO-5', 'SO-7'].map(b => (
                                        <span key={b} className="px-1 py-0.5 text-[7px] font-bold font-mono bg-[rgba(170,255,0,0.15)] border border-[rgba(170,255,0,0.4)] text-[#aaff00]">
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data rows */}
                    <div className="flex-1 overflow-y-auto">
                        {intelRows.map((row, i) => (
                            <DataRow key={row.label} {...row} delay={i * 150} />
                        ))}
                    </div>

                    {/* Bottom accent */}
                    <div className="px-3 py-1.5 border-t border-[rgba(170,255,0,0.08)] flex justify-between items-center shrink-0">
                        <span className="fui-label text-[7px]">GLOBAL WI // SENSOR PANEL</span>
                        <div className="status-dot active" />
                    </div>
                </div>

                {/* Phase Fader cluster (bottom left, like reference) */}
                <div className="fui-panel px-3 py-2 flex items-center justify-between pointer-events-auto">
                    <div className="flex flex-col">
                        <span
                            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '24px', fontWeight: 900, color: '#aaff00', textShadow: '0 0 12px rgba(170,255,0,0.5)', lineHeight: 1 }}
                        >
                            52
                        </span>
                        <span className="fui-label text-[7px] mt-0.5">PHASE FADER</span>
                        <span className="font-mono text-[8px] text-[rgba(170,255,0,0.4)] mt-0.5">2.0/+24</span>
                    </div>
                    <div className="border-l border-[rgba(170,255,0,0.1)] pl-3 flex flex-col gap-0.5">
                        <div className="flex justify-between gap-4">
                            <span className="fui-label text-[7px]">WAVE SP</span>
                            <span className="font-mono text-[9px] text-[rgba(170,255,0,0.7)] font-bold uppercase">ER-2</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="fui-label text-[7px]">MODULE</span>
                            <span className="font-mono text-[9px] text-[rgba(170,255,0,0.7)]">SO / EN-2</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="fui-label text-[7px]">LAST TRACE</span>
                            <span className="font-mono text-[9px] text-[rgba(170,255,0,0.7)]">76-54/45</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL: Visual Intel ── */}
            <div
                className="absolute top-44 right-5 bottom-44 w-68 z-20 flex flex-col gap-2 pointer-events-none"
                style={{ maxWidth: '260px' }}
            >
                {/* Status readout cluster (ASF / IPN like reference) */}
                <div className="fui-panel px-3 py-2 pointer-events-auto depth-panel-right">
                    {rightStats.map(({ label, value, sub }) => (
                        <div key={label} className="flex items-center justify-between py-1 border-b border-[rgba(170,255,0,0.06)] last:border-b-0">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-[rgba(170,255,0,0.4)] flex items-center justify-center">
                                    <div className="w-1 h-1 bg-[#aaff00] rounded-full" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-mono text-[9px] font-bold text-[rgba(170,255,0,0.8)]">{value}</span>
                                    <span className="fui-label text-[7px]">{sub}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <span
                                    style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, color: '#aaff00' }}
                                >
                                    {label}
                                </span>
                                <span className="fui-btn px-2 py-0.5 text-[8px]">CLAMP</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Visual controls */}
                <div className="fui-panel flex flex-col pointer-events-auto depth-panel-right overflow-hidden">
                    <div className="px-3 py-2 border-b border-[rgba(170,255,0,0.1)]">
                        <span
                            className="tracking-widest uppercase"
                            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '10px', fontWeight: 700, color: 'rgba(170,255,0,0.7)' }}
                        >
                            VISUAL INTEL
                        </span>
                    </div>

                    {/* Toggles */}
                    <FuiSwitch label="SHARPEN"  active={sharpen}  onToggle={() => updateVisual('sharpen', !sharpen)} />
                    <FuiSwitch label="PANOPTIC" active={panoptic} onToggle={() => updateVisual('panoptic', !panoptic)} />

                    {/* Layout selector */}
                    <div className="px-3 py-2 border-b border-[rgba(170,255,0,0.06)]">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="fui-label text-[7px]">LAYOUT</span>
                        </div>
                        <div className="fui-segment">
                            {['TACTICAL', 'MINIMAL', 'FULL'].map(l => (
                                <button
                                    key={l}
                                    className={`fui-segment-btn ${l === 'TACTICAL' ? 'active' : ''}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Panoptic big button */}
                    <button
                        onClick={() => updateVisual('panoptic', !panoptic)}
                        className="fui-btn mx-3 my-2 py-2.5 flex items-center justify-between px-3"
                        style={panoptic ? { background: 'rgba(170,255,0,0.18)', borderColor: '#aaff00', color: '#aaff00', boxShadow: '0 0 16px rgba(170,255,0,0.4)' } : {}}
                    >
                        <span>PANOPTIC MODE</span>
                        <span>{panoptic ? 'ON' : 'OFF'}</span>
                    </button>

                    {/* Synch confidence */}
                    <div className="px-3 pb-2 space-y-1">
                        <div className="flex justify-between">
                            <span className="fui-label text-[7px]">SYNCH CONFIDENCE</span>
                            <span className="font-mono text-[8px] text-[rgba(170,255,0,0.7)]">98%</span>
                        </div>
                        <div className="fui-bar-track">
                            <div className="fui-bar-fill" style={{ '--bar-width': '98%', width: '98%' }} />
                        </div>
                        {panoptic && (
                            <div className="flex items-center gap-2 mt-1">
                                <div className="status-dot active" />
                                <span className="fui-label text-[7px]">STREAMING ACTIVE</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer readouts */}
                <div className="mt-auto flex flex-col gap-1 pointer-events-auto">
                    <button className="fui-btn py-2 w-full tracking-[0.3em]">
                        CLEAN UI
                    </button>
                    <div className="fui-panel px-3 py-2 flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="fui-label text-[7px]">GSD</span>
                            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#aaff00', textShadow: '0 0 8px rgba(170,255,0,0.5)' }}>
                                1404.42M
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="fui-label text-[7px]">NIIRS</span>
                            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#ff1a1a', textShadow: '0 0 8px rgba(255,26,26,0.5)' }}>
                                8.0
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

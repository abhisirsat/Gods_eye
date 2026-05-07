import React, { useState, useEffect } from 'react';

/* Animated circular radar spinner */
const RadarSpinner = () => (
    <div className="relative w-10 h-10 shrink-0">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-[rgba(170,255,0,0.2)]" />
        {/* Spinning arc */}
        <div
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#aaff00]"
            style={{ animation: 'radar-spin 3s linear infinite', boxShadow: '0 0 8px rgba(170,255,0,0.4)' }}
        />
        {/* Reverse inner arc */}
        <div
            className="absolute inset-2 rounded-full border-b border-[rgba(170,255,0,0.35)]"
            style={{ animation: 'radar-spin 5s linear infinite reverse' }}
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#aaff00]" style={{ boxShadow: '0 0 6px rgba(170,255,0,1)' }} />
        </div>
    </div>
);

/* Elapsed mission clock */
const MissionClock = () => {
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const start = Date.now();
        const iv = setInterval(() => setElapsed(Date.now() - start), 1000);
        return () => clearInterval(iv);
    }, []);
    const h = String(Math.floor(elapsed / 3600000)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
    return <span className="tabular-nums">{h}:{m}:{s}</span>;
};

const TopLeftHUD = () => {
    return (
        <div
            className="absolute top-5 left-5 z-20 pointer-events-none select-none depth-panel-left"
            style={{ maxWidth: '280px' }}
        >
            {/* ── Main identity panel ── */}
            <div className="fui-panel fui-panel-scan px-4 pt-4 pb-3">
                {/* Logo row */}
                <div className="flex items-center gap-3 mb-3">
                    <RadarSpinner />
                    <div className="flex flex-col">
                        <h1
                            className="leading-none tracking-[0.2em] uppercase num-reveal"
                            style={{
                                fontFamily: 'Orbitron, sans-serif',
                                fontSize: '20px',
                                fontWeight: 900,
                                color: '#aaff00',
                                textShadow: '0 0 15px rgba(170,255,0,0.7), 0 0 35px rgba(170,255,0,0.2)',
                            }}
                        >
                            GOD'S EYE
                        </h1>
                        <span className="fui-label mt-0.5 text-[7px]">
                            OMNISCIENT SURVEILLANCE NET
                        </span>
                    </div>
                </div>

                {/* Accent bar */}
                <div className="accent-bar mb-3" />

                {/* Classification tape */}
                <div className="flex items-center gap-2 mb-3 px-2 py-1 bg-[rgba(255,26,26,0.12)] border border-[rgba(255,26,26,0.3)]">
                    <div className="status-dot alert" />
                    <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-[#ff4444] uppercase">
                        TOP SECRET // SI-TK // NOFORN
                    </span>
                </div>

                {/* Mission status cluster */}
                <div className="flex flex-col gap-2 border-l-2 border-[rgba(170,255,0,0.2)] pl-3">
                    {/* Designation */}
                    <div className="flex justify-between items-baseline">
                        <span className="fui-label text-[8px]">DESIGNATION</span>
                        <span className="font-mono text-[10px] font-bold text-[rgba(170,255,0,0.8)] tracking-wider">
                            KH11-4176 OPS-4179
                        </span>
                    </div>

                    {/* Status + dots */}
                    <div className="flex items-center justify-between">
                        <span
                            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 700, color: '#aaff00', textShadow: '0 0 12px rgba(170,255,0,0.5)' }}
                        >
                            NORMAL
                        </span>
                        <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                                <div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-[rgba(170,255,0,0.5)]"
                                    style={{ animation: `blink ${1 + i * 0.3}s step-end infinite` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Stream progress bar */}
                    <div className="space-y-1 mt-1">
                        <div className="flex justify-between">
                            <span className="fui-label text-[7px]">UPLINK QUALITY</span>
                            <span className="font-mono text-[8px] text-[rgba(170,255,0,0.7)]">98%</span>
                        </div>
                        <div className="fui-bar-track">
                            <div className="fui-bar-fill" style={{ '--bar-width': '98%', width: '98%' }} />
                        </div>
                    </div>

                    {/* Mission elapsed */}
                    <div className="flex justify-between items-baseline mt-1">
                        <span className="fui-label text-[7px]">MISSION ELAPSED</span>
                        <span className="font-mono text-[10px] font-bold text-[rgba(170,255,0,0.8)] tabular-nums">
                            <MissionClock />
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Sub-panel: quick stats ── */}
            <div className="mt-1.5 grid grid-cols-3 gap-1">
                {[
                    { label: 'NODES', value: '347' },
                    { label: 'FEEDS', value: '84' },
                    { label: 'THREATS', value: '12' },
                ].map(({ label, value }) => (
                    <div key={label} className="fui-panel px-2 py-1.5 flex flex-col items-center gap-0.5">
                        <span className="fui-label text-[7px]">{label}</span>
                        <span
                            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#aaff00', textShadow: '0 0 10px rgba(170,255,0,0.6)' }}
                        >
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopLeftHUD;

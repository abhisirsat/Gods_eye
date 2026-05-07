import React, { useState, useEffect } from 'react';

/* Signal strength pixel bars */
const SignalBars = ({ strength = 4, max = 5 }) => (
    <div className="flex items-end gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
            <div
                key={i}
                className="w-1"
                style={{
                    height: `${6 + i * 3}px`,
                    background: i < strength
                        ? `rgba(170,255,0,${0.4 + i * 0.12})`
                        : 'rgba(170,255,0,0.1)',
                    boxShadow: i < strength ? '0 0 4px rgba(170,255,0,0.5)' : 'none',
                }}
            />
        ))}
    </div>
);

/* Animated data counter that randomly ticks */
const TickingCounter = ({ base, label }) => {
    const [val, setVal] = useState(base);
    useEffect(() => {
        const iv = setInterval(() => {
            setVal(v => v + Math.floor(Math.random() * 3 - 1));
        }, 2500);
        return () => clearInterval(iv);
    }, []);
    return (
        <div className="flex flex-col items-end">
            <span className="fui-label text-[7px]">{label}</span>
            <span
                style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700, color: '#aaff00', textShadow: '0 0 12px rgba(170,255,0,0.6)' }}
            >
                {val}
            </span>
        </div>
    );
};

const TopRightHUD = ({ signalReceived }) => {
    const [time, setTime] = useState(new Date().toISOString());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toISOString()), 100);
        return () => clearInterval(timer);
    }, []);

    const [date, clock] = time.split('T');
    const clockStr = clock.replace('Z', '');

    return (
        <div
            className="absolute top-5 right-5 z-20 pointer-events-none select-none depth-panel-right"
            style={{ maxWidth: '280px' }}
        >
            {/* ── Main telemetry panel ── */}
            <div className="fui-panel fui-panel-scan px-4 pt-4 pb-3">

                {/* Core status tag */}
                <div className="flex items-center justify-end gap-2 mb-3">
                    <span className="fui-label text-[8px]">CORE.07</span>
                    <div className="w-8 h-8 flex items-center justify-center border border-[rgba(170,255,0,0.4)]"
                        style={{ background: 'rgba(170,255,0,0.08)', boxShadow: '0 0 10px rgba(170,255,0,0.2)' }}>
                        {/* 4-dot grid like reference image */}
                        <div className="grid grid-cols-2 gap-0.5">
                            {[0,1,2,3].map(i => (
                                <div key={i} className="w-1 h-1 bg-[#aaff00]"
                                    style={{ opacity: Math.random() > 0.3 ? 1 : 0.3, boxShadow: '0 0 3px rgba(170,255,0,0.8)' }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Accent bar */}
                <div className="accent-bar mb-3" />

                <div className="flex flex-col items-end gap-3">
                    {/* Active mode */}
                    <div className="flex flex-col items-end">
                        <span className="fui-label text-[7px]">ACTIVE STYLE</span>
                        <span
                            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700, color: '#aaff00', textShadow: '0 0 12px rgba(170,255,0,0.5)' }}
                        >
                            NORMAL
                        </span>
                    </div>

                    {/* REC + Date */}
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="fui-label text-[7px] text-[rgba(255,26,26,0.7)]">● REC</span>
                            <span className="font-mono text-[11px] font-bold text-[rgba(170,255,0,0.85)] tracking-wider">{date}</span>
                        </div>
                        <div
                            className="w-2 h-2 rounded-full bg-[#ff1a1a]"
                            style={{ animation: 'blink 1s step-end infinite', boxShadow: '0 0 8px rgba(255,26,26,0.8)' }}
                        />
                    </div>

                    {/* Clock */}
                    <div className="flex flex-col items-end border-r-2 border-[rgba(170,255,0,0.2)] pr-3">
                        <span className="fui-label text-[7px]">TIME (UTC)</span>
                        <span
                            className="tabular-nums num-reveal"
                            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '22px', fontWeight: 900, color: signalReceived ? '#ff1a1a' : '#aaff00', textShadow: signalReceived ? '0 0 20px rgba(255,26,26,0.8)' : '0 0 15px rgba(170,255,0,0.7)', transition: 'all 0.3s' }}
                        >
                            {clockStr.slice(0, 8)}
                        </span>
                        <span className="font-mono text-[8px] text-[rgba(170,255,0,0.4)] tabular-nums">.{clockStr.slice(9, 12) || '000'}</span>
                    </div>

                    {/* Signal bars + orb/pass */}
                    <div className="flex items-end justify-between w-full border-t border-[rgba(170,255,0,0.08)] pt-2">
                        <div className="flex flex-col gap-0.5">
                            <span className="fui-label text-[7px]">SIGNAL</span>
                            <SignalBars strength={4} />
                        </div>
                        <TickingCounter base={47857} label="ORB" />
                        <TickingCounter base={273} label="PASS" />
                    </div>

                    {/* Match / RFP style cluster (from reference) */}
                    <div className="w-full border-t border-[rgba(170,255,0,0.08)] pt-2 flex justify-between">
                        <div className="flex flex-col">
                            <span className="fui-label text-[7px]">MATCH</span>
                            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 700, color: '#aaff00' }}>
                                132
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="fui-label text-[7px]">LINK</span>
                            <span className="font-mono text-[10px] text-[rgba(170,255,0,0.7)]">A7</span>
                        </div>
                        <div
                            className="px-2 flex items-center justify-center border border-[rgba(170,255,0,0.5)] text-[10px] font-bold"
                            style={{ background: 'rgba(170,255,0,0.15)', color: '#aaff00', fontFamily: 'Orbitron, sans-serif', boxShadow: '0 0 8px rgba(170,255,0,0.2)' }}
                        >
                            RFP
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopRightHUD;

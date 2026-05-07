import React from 'react';

/* Corner bracket frame element */
const CornerBracket = ({ pos, size = 16, thick = 2, color = 'rgba(170,255,0,0.5)', animated = false }) => {
    const styles = {
        'tl': { top: 0, left: 0, borderTop: `${thick}px solid ${color}`, borderLeft: `${thick}px solid ${color}` },
        'tr': { top: 0, right: 0, borderTop: `${thick}px solid ${color}`, borderRight: `${thick}px solid ${color}` },
        'bl': { bottom: 0, left: 0, borderBottom: `${thick}px solid ${color}`, borderLeft: `${thick}px solid ${color}` },
        'br': { bottom: 0, right: 0, borderBottom: `${thick}px solid ${color}`, borderRight: `${thick}px solid ${color}` },
    };
    return (
        <div
            style={{
                position: 'absolute',
                width: size, height: size,
                ...styles[pos],
                pointerEvents: 'none',
                animation: animated ? 'border-corner-glow 3s ease-in-out infinite' : 'none',
            }}
        />
    );
};

const HUDOverlay = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[15] overflow-hidden">

            {/* ── Full screen grid background ── */}
            <div
                className="absolute inset-0 opacity-100"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(170,255,0,0.018) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(170,255,0,0.018) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* ── Outer corner brackets (large) ── */}
            <div className="absolute inset-4">
                {['tl','tr','bl','br'].map(pos => (
                    <CornerBracket key={pos} pos={pos} size={24} thick={2} color="rgba(170,255,0,0.45)" animated />
                ))}
            </div>

            {/* ── Inner corner brackets (smaller, dimmer) ── */}
            <div className="absolute inset-10 opacity-30">
                {['tl','tr','bl','br'].map(pos => (
                    <CornerBracket key={pos} pos={pos} size={14} thick={1} color="rgba(170,255,0,0.6)" />
                ))}
            </div>

            {/* ── Horizontal guide lines (top + bottom edge lines) ── */}
            <div className="absolute top-16 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[rgba(170,255,0,0.12)] to-transparent" />
            <div className="absolute bottom-16 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[rgba(170,255,0,0.12)] to-transparent" />

            {/* ── Vertical panel dividers ── */}
            <div className="absolute top-16 bottom-16 left-[300px] w-px bg-gradient-to-b from-transparent via-[rgba(170,255,0,0.06)] to-transparent" />
            <div className="absolute top-16 bottom-16 right-[300px] w-px bg-gradient-to-b from-transparent via-[rgba(170,255,0,0.06)] to-transparent" />

            {/* ── Center crosshair / tactical reticle ── */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {/* Outer rotating ring */}
                <div
                    className="absolute -inset-8 rounded-full border border-[rgba(170,255,0,0.08)]"
                    style={{ animation: 'radar-spin 12s linear infinite' }}
                />
                {/* Mid ring with gap */}
                <div
                    className="absolute -inset-5 rounded-full border-t border-[rgba(170,255,0,0.15)] border-b border-[rgba(170,255,0,0.15)]"
                    style={{ animation: 'radar-spin 8s linear infinite reverse' }}
                />
                {/* Crosshair lines */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* H line left */}
                    <div className="absolute left-0 top-1/2 w-4 h-px bg-[rgba(170,255,0,0.3)]" />
                    {/* H line right */}
                    <div className="absolute right-0 top-1/2 w-4 h-px bg-[rgba(170,255,0,0.3)]" />
                    {/* V line top */}
                    <div className="absolute top-0 left-1/2 h-4 w-px bg-[rgba(170,255,0,0.3)]" />
                    {/* V line bottom */}
                    <div className="absolute bottom-0 left-1/2 h-4 w-px bg-[rgba(170,255,0,0.3)]" />
                    {/* Center dot */}
                    <div
                        className="w-1.5 h-1.5 rounded-full bg-[rgba(170,255,0,0.5)]"
                        style={{ boxShadow: '0 0 8px rgba(170,255,0,0.6)', animation: 'pulse-soft 3s ease-in-out infinite' }}
                    />
                </div>
            </div>

            {/* ── Vertical scan line on globe area ── */}
            <div
                className="absolute top-16 bottom-16 left-1/2 w-px"
                style={{
                    background: 'linear-gradient(transparent, rgba(170,255,0,0.15), transparent)',
                    animation: 'scanbar-v 8s linear infinite',
                    transformOrigin: 'top',
                }}
            />

            {/* ── Bottom status bar ── */}
            <div className="absolute bottom-4 left-8 right-8 flex items-center justify-between px-4 py-1 border border-[rgba(170,255,0,0.08)] bg-[rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                        <div className="status-dot active" />
                        <span className="font-mono text-[8px] text-[rgba(170,255,0,0.5)] tracking-widest">STREAMING_ENCRYPTED_LINK</span>
                    </div>
                    <span className="font-mono text-[8px] text-[rgba(170,255,0,0.3)] tracking-widest">
                        FRAME: <span className="text-[rgba(170,255,0,0.6)]">60fps</span>
                    </span>
                    <span className="font-mono text-[8px] text-[rgba(170,255,0,0.3)] tracking-widest">
                        LATENCY: <span className="text-[rgba(170,255,0,0.6)]">12ms</span>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-mono text-[8px] text-[rgba(170,255,0,0.3)] tracking-widest">
                        SENTINEL_PROCESSOR_v12.4.9
                    </span>
                    <span className="font-mono text-[7px] text-[rgba(170,255,0,0.2)] tracking-[0.3em]">// EYES ONLY</span>
                </div>
            </div>

            {/* ── Top-center label bar ── */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-1">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[rgba(170,255,0,0.4)]" />
                <span className="font-mono text-[9px] text-[rgba(170,255,0,0.45)] tracking-[0.4em] uppercase">
                    NAVIGATE PREF LOCATION
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[rgba(170,255,0,0.4)]" />
            </div>
        </div>
    );
};

export default HUDOverlay;

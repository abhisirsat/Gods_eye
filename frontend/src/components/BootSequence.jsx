import React, { useState, useEffect, useRef } from 'react';

const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:<>?/\\ΑΒΓΔΞΨΩαβγδ';

const MatrixRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        const fontSize = 12;
        const cols = Math.floor(canvas.width / fontSize);
        const drops = Array(cols).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(6,8,10,0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${fontSize}px 'Share Tech Mono'`;

            for (let i = 0; i < drops.length; i++) {
                const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
                const opacity = Math.random() > 0.5 ? 0.9 : 0.4;
                ctx.fillStyle = i % 7 === 0
                    ? `rgba(255,255,255,${opacity})`
                    : `rgba(170,255,0,${opacity * 0.6})`;
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const id = setInterval(draw, 40);
        const onResize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);
        return () => { clearInterval(id); window.removeEventListener('resize', onResize); };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />;
};

const bootLines = [
    { text: '> GODS EYE INTELLIGENCE TERMINAL v1.0.4-BETA', type: 'title' },
    { text: '> UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE', type: 'warn' },
    { text: '', type: 'gap' },
    { text: '> INITIALIZING GEOSPATIAL ENGINE: CESIUM_JS v1.1........', type: 'normal', dot: true },
    { text: '> ESTABLISHING SATCOM UPLINK..................', type: 'normal', dot: true },
    { text: '> LOADING OSINT AGGREGATION MODULES..........', type: 'normal', dot: true },
    { text: '> AUTHENTICATING NODE_01......................', type: 'normal', bar: 72 },
    { text: '> DEPLOYING SIGINT SENSOR ARRAY..............', type: 'normal', dot: true },
    { text: '> CALIBRATING ATMOSPHERIC PROCESSORS.........', type: 'normal', dot: true },
    { text: '> INITIATING LIVE STREAM PIPELINE............', type: 'normal', dot: true },
    { text: '', type: 'gap' },
    { text: '> ACCESS GRANTED // TOP SECRET // SI-TK // NOFORN', type: 'success' },
    { text: '', type: 'gap' },
    { text: '> SYSTEM READY.', type: 'ready' },
];

const BootLine = ({ line, index, show }) => {
    const [barWidth, setBarWidth] = useState(0);
    const [dot, setDot] = useState('');

    useEffect(() => {
        if (!show) return;
        if (line.bar !== undefined) {
            const t = setTimeout(() => setBarWidth(line.bar), 100);
            return () => clearTimeout(t);
        }
        if (line.dot) {
            let n = 0;
            const iv = setInterval(() => {
                const states = ['', '.', '..', '...', '....'];
                n = (n + 1) % states.length;
                setDot(states[n]);
            }, 120);
            const done = setTimeout(() => {
                clearInterval(iv);
                setDot(' OK');
            }, 700);
            return () => { clearInterval(iv); clearTimeout(done); };
        }
    }, [show]);

    if (!show) return null;
    if (line.type === 'gap') return <div className="h-2" />;

    const colorMap = {
        title:   'text-[#aaff00] font-bold text-[11px] tracking-[0.3em]',
        warn:    'text-[#ffaa00] text-[9px] tracking-[0.4em]',
        normal:  'text-[rgba(170,255,0,0.7)] text-[10px] tracking-[0.2em]',
        success: 'text-[#aaff00] font-bold text-[12px] tracking-[0.35em]',
        ready:   'text-white font-bold text-[13px] tracking-[0.5em]',
    };

    return (
        <div
            className="flex items-center gap-3 font-mono"
            style={{ animation: `count-up 0.3s ease-out both` }}
        >
            <span className="opacity-30 text-[8px] text-[#aaff00] shrink-0 w-20 text-right">
                [{new Date().toISOString().split('T')[1].split('.')[0]}]
            </span>
            <span className={colorMap[line.type]}>
                {line.text}
                {line.dot && <span className="text-[#aaff00]">{dot}</span>}
            </span>
            {line.bar !== undefined && (
                <div className="flex items-center gap-2 ml-2">
                    <div className="w-32 h-1.5 bg-black border border-[rgba(170,255,0,0.2)] overflow-hidden">
                        <div
                            className="h-full bg-[#aaff00] transition-all duration-1000 ease-out"
                            style={{ width: `${barWidth}%`, boxShadow: '0 0 6px rgba(170,255,0,0.6)' }}
                        />
                    </div>
                    <span className="text-[#aaff00] text-[9px] tabular-nums">{barWidth}%</span>
                </div>
            )}
        </div>
    );
};

const BootSequence = ({ onComplete }) => {
    const [shown, setShown] = useState(0);

    useEffect(() => {
        let i = 0;
        const iv = setInterval(() => {
            i++;
            setShown(i);
            if (i >= bootLines.length) {
                clearInterval(iv);
                setTimeout(onComplete, 1000);
            }
        }, 280);
        return () => clearInterval(iv);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[200] bg-[#06080a] overflow-hidden select-none flex flex-col">
            {/* Matrix rain background */}
            <MatrixRain />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[rgba(6,8,10,0.75)] pointer-events-none" />

            {/* Scanline overlay */}
            <div className="scanline absolute inset-0" />

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#aaff00] opacity-60" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#aaff00] opacity-60" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#aaff00] opacity-60" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#aaff00] opacity-60" />

            {/* Main terminal panel */}
            <div className="relative z-10 flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full px-16 py-12">

                {/* Logo */}
                <div className="mb-10 flex flex-col">
                    <div className="flex items-center gap-4 mb-3">
                        {/* Spinning radar icon */}
                        <div className="relative w-12 h-12 shrink-0">
                            <div className="absolute inset-0 border-2 border-[rgba(170,255,0,0.3)] rounded-full" />
                            <div
                                className="absolute inset-1 border-t-2 border-[#aaff00] rounded-full"
                                style={{ animation: 'radar-spin 2s linear infinite', boxShadow: '0 0 10px rgba(170,255,0,0.4)' }}
                            />
                            <div
                                className="absolute inset-2 border-r-2 border-[rgba(170,255,0,0.4)] rounded-full"
                                style={{ animation: 'radar-spin 3s linear infinite reverse' }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-[#aaff00] rounded-full" style={{ boxShadow: '0 0 8px rgba(170,255,0,0.9)' }} />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-[0.25em] uppercase leading-none"
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    color: '#aaff00',
                                    textShadow: '0 0 20px rgba(170,255,0,0.7), 0 0 60px rgba(170,255,0,0.3)',
                                }}>
                                GOD'S EYE
                            </h1>
                            <div className="text-[9px] tracking-[0.6em] text-[rgba(170,255,0,0.4)] uppercase mt-1">
                                GLOBAL OMNISCIENT DIGITAL SENTINEL // PANOPTIC INTELLIGENCE NETWORK
                            </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[rgba(170,255,0,0.5)] to-transparent" />
                </div>

                {/* Boot lines */}
                <div className="flex flex-col gap-1.5">
                    {bootLines.map((line, i) => (
                        <BootLine key={i} line={line} index={i} show={i < shown} />
                    ))}
                </div>

                {/* Cursor */}
                {shown < bootLines.length && (
                    <div
                        className="mt-4 w-2.5 h-5 bg-[#aaff00]"
                        style={{ animation: 'blink 1s step-end infinite', boxShadow: '0 0 10px rgba(170,255,0,0.9)' }}
                    />
                )}
            </div>

            {/* Bottom status bar */}
            <div className="relative z-10 px-6 py-2 flex items-center justify-between text-[8px] font-mono text-[rgba(170,255,0,0.35)] border-t border-[rgba(170,255,0,0.1)]">
                <span>GODS EYE v1.0.4-BETA // SECURE TERMINAL // UNAUTHORIZED ACCESS PROHIBITED</span>
                <span className="text-[rgba(170,255,0,0.5)]">AES-256-GCM ENCRYPTED</span>
            </div>
        </div>
    );
};

export default BootSequence;

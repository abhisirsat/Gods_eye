/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#06080a',
                primary:    '#aaff00',   // FUI yellow-green
                secondary:  '#88cc00',
                accent:     '#ff1a1a',   // Red alerts
                warn:       '#ffaa00',
                terminal: {
                    green: '#aaff00',
                    dim:   '#2a3300',
                },
                fui: {
                    900: '#06080a',
                    800: '#0d110a',
                    700: '#141a10',
                    border:  'rgba(170,255,0,0.30)',
                    glow:    'rgba(170,255,0,0.60)',
                    dim:     'rgba(170,255,0,0.12)',
                }
            },
            fontFamily: {
                mono: ['Share Tech Mono', 'monospace'],
                hud:  ['Orbitron', 'sans-serif'],
            },
            animation: {
                'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'blink':         'blink 1s step-end infinite',
                'spin-slow':     'spin 8s linear infinite',
                'spin-reverse':  'spin-reverse 12s linear infinite',
                'scanbar':       'scanbar 4s ease-in-out infinite',
                'scanbar-v':     'scanbar-v 6s linear infinite',
                'border-pulse':  'border-pulse 2s ease-in-out infinite',
                'depth-float':   'depth-float 6s ease-in-out infinite',
                'data-tick':     'data-tick 2s ease-in-out infinite',
                'matrix-rain':   'matrix-rain linear infinite',
                'radar':         'radar-spin 4s linear infinite',
                'glitch':        'hud-glitch 0.2s steps(1) 4',
            },
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%':       { opacity: '0' },
                },
                'spin-reverse': {
                    from: { transform: 'rotate(360deg)' },
                    to:   { transform: 'rotate(0deg)' },
                },
                scanbar: {
                    '0%':   { transform: 'translateX(-100%)', opacity: '0' },
                    '20%':  { opacity: '1' },
                    '80%':  { opacity: '1' },
                    '100%': { transform: 'translateX(100%)', opacity: '0' },
                },
                'scanbar-v': {
                    '0%':   { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                'border-pulse': {
                    '0%, 100%': { boxShadow: '0 0 8px rgba(170,255,0,0.3), inset 0 0 8px rgba(170,255,0,0.05)' },
                    '50%':       { boxShadow: '0 0 20px rgba(170,255,0,0.6), inset 0 0 12px rgba(170,255,0,0.12)' },
                },
                'depth-float': {
                    '0%, 100%': { transform: 'perspective(1000px) rotateX(-2deg) translateY(0px)' },
                    '50%':       { transform: 'perspective(1000px) rotateX(-2deg) translateY(-3px)' },
                },
                'data-tick': {
                    '0%, 90%, 100%': { opacity: '1' },
                    '95%':            { opacity: '0.2' },
                },
                'matrix-rain': {
                    '0%':   { transform: 'translateY(-100%)', opacity: '1' },
                    '90%':  { opacity: '1' },
                    '100%': { transform: 'translateY(1000%)', opacity: '0' },
                },
                'radar-spin': {
                    from: { transform: 'rotate(0deg)' },
                    to:   { transform: 'rotate(360deg)' },
                },
                'hud-glitch': {
                    '0%':   { clipPath: 'inset(10% 0 80% 0)', transform: 'translate(-2px)' },
                    '33%':  { clipPath: 'inset(60% 0 20% 0)', transform: 'translate(2px)' },
                    '66%':  { clipPath: 'inset(30% 0 50% 0)', transform: 'translate(-1px)' },
                    '100%': { clipPath: 'inset(0)', transform: 'translate(0)' },
                },
            },
            dropShadow: {
                'fui':   '0 0 12px rgba(170,255,0,0.7)',
                'alert': '0 0 10px rgba(255,26,26,0.7)',
            },
            boxShadow: {
                'fui':       '0 0 16px rgba(170,255,0,0.55), 0 0 40px rgba(170,255,0,0.15)',
                'fui-inset': 'inset 0 0 20px rgba(170,255,0,0.08)',
                'fui-sm':    '0 0 8px rgba(170,255,0,0.4)',
                'alert':     '0 0 12px rgba(255,26,26,0.6)',
            },
        },
    },
    plugins: [],
}

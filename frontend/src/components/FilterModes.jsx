import React from 'react';

const MODES = [
    { id: 'NORMAL',      label: 'NORMAL',   short: 'NRM' },
    { id: 'NIGHT_VISION', label: 'NVIS',    short: 'NVS' },
    { id: 'FLIR',        label: 'FLIR',     short: 'FLR' },
    { id: 'CRT',         label: 'CRT',      short: 'CRT' },
    { id: 'CEL',         label: 'CEL',      short: 'CEL' },
    { id: 'BLACKOUT',    label: 'BLACKOUT', short: 'BLK' },
];

const FilterModes = ({ activeMode, onModeChange }) => {
    return (
        <div className="flex flex-col gap-1 pointer-events-auto" style={{ width: '110px' }}>
            {/* Header */}
            <div className="px-2 py-1 flex items-center gap-1.5 border-b border-[rgba(170,255,0,0.15)]"
                style={{ background: 'rgba(0,0,0,0.7)' }}>
                <div className="w-1 h-1 rounded-full bg-[#aaff00]" style={{ boxShadow: '0 0 4px rgba(170,255,0,0.8)' }} />
                <span className="font-mono text-[8px] text-[rgba(170,255,0,0.5)] tracking-[0.3em] uppercase">FILTER</span>
            </div>

            {/* Mode buttons */}
            {MODES.map((mode) => {
                const isActive = activeMode === mode.id;
                return (
                    <button
                        key={mode.id}
                        id={`filter-mode-${mode.id.toLowerCase()}`}
                        onClick={() => onModeChange(mode.id)}
                        className="relative flex items-center gap-2 px-2 py-2 transition-all overflow-hidden text-left group"
                        style={{
                            background: isActive
                                ? 'rgba(170,255,0,0.14)'
                                : 'rgba(0,0,0,0.65)',
                            border: isActive
                                ? '1px solid rgba(170,255,0,0.5)'
                                : '1px solid rgba(170,255,0,0.10)',
                            color: isActive ? '#aaff00' : 'rgba(170,255,0,0.4)',
                            boxShadow: isActive ? '0 0 12px rgba(170,255,0,0.2), inset 0 0 8px rgba(170,255,0,0.05)' : 'none',
                        }}
                    >
                        {/* Active left-edge indicator */}
                        {isActive && (
                            <div
                                className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#aaff00]"
                                style={{ boxShadow: '0 0 6px rgba(170,255,0,0.8)' }}
                            />
                        )}

                        {/* Hover scan sweep */}
                        <div
                            className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(170,255,0,0.08), transparent)' }}
                        />

                        {/* Short code */}
                        <div
                            className="w-7 text-center shrink-0"
                            style={{
                                fontFamily: 'Orbitron, sans-serif',
                                fontSize: '8px',
                                fontWeight: 700,
                                color: isActive ? '#aaff00' : 'rgba(170,255,0,0.3)',
                            }}
                        >
                            {mode.short}
                        </div>

                        <span className="font-mono text-[9px] font-bold tracking-wider truncate">
                            {mode.label}
                        </span>

                        {/* Active dot */}
                        {isActive && (
                            <div
                                className="ml-auto w-1 h-1 rounded-full bg-[#aaff00] shrink-0"
                                style={{ boxShadow: '0 0 4px rgba(170,255,0,1)', animation: 'pulse-soft 2s ease-in-out infinite' }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default FilterModes;

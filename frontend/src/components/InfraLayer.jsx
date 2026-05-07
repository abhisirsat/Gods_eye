import React, { useState, useEffect } from 'react';
import { Activity, Network, ShieldAlert, ChevronDown, ChevronRight, ServerCrash } from 'lucide-react';

const API_BASE = `http://${window.location.hostname}:8000`;

const InfraLayer = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [stats, setStats] = useState({ cables: 0, outages: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        
        const fetchInfraData = async () => {
            try {
                // Fetch cable count
                const cableRes = await fetch(`${API_BASE}/api/infra/undersea-cables`);
                let cableCount = 0;
                if (cableRes.ok) {
                    const data = await cableRes.json();
                    if (data.features) cableCount = data.features.length;
                }

                // Fetch outages
                const outageRes = await fetch(`${API_BASE}/api/infra/internet-outages`);
                let outages = [];
                if (outageRes.ok) {
                    const data = await outageRes.json();
                    if (data.outages) outages = data.outages;
                }

                if (mounted) {
                    setStats({ cables: cableCount, outages });
                    setLoading(false);
                }
            } catch (error) {
                console.error("INFRA LAYER FETCH ERROR:", error);
                if (mounted) setLoading(false);
            }
        };

        fetchInfraData();
        // Poll every 5 minutes
        const intId = setInterval(fetchInfraData, 300000);
        return () => {
            mounted = false;
            clearInterval(intId);
        };
    }, []);

    const getFlagEmoji = (countryCode) => {
        if (!countryCode || countryCode === 'UNKNOWN') return '🌐';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    return (
        <div className="absolute top-[350px] right-6 w-72 z-30 pointer-events-none">
            <div className="glass-tactical border-primary/20 bg-black/80 pointer-events-auto rounded flex flex-col overflow-hidden shadow-lg shadow-primary/5">
                
                {/* Header */}
                <div 
                    className="flex items-center justify-between p-3 border-b border-primary/20 cursor-pointer hover:bg-primary/5 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-2">
                        <Network size={14} className="text-primary" />
                        <span className="text-[11px] font-bold tracking-[0.2em] text-primary">INFRA & TELEGEO</span>
                    </div>
                    {isExpanded ? <ChevronDown size={14} className="text-primary/50" /> : <ChevronRight size={14} className="text-primary/50" />}
                </div>

                {/* Content */}
                {isExpanded && (
                    <div className="p-3 flex flex-col gap-4">
                        
                        {/* Status Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col bg-primary/5 border border-primary/10 p-2 rounded">
                                <span className="text-[9px] uppercase tracking-widest text-primary/60">Undersea Cables</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-lg font-mono text-primary font-bold">
                                        {loading ? '...' : stats.cables}
                                    </span>
                                    <span className="text-[8px] text-primary/40">ACTIVE</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col bg-accent/5 border border-accent/20 p-2 rounded">
                                <span className="text-[9px] uppercase tracking-widest text-accent/60">Censorship Events</span>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-lg font-mono text-accent font-bold">
                                        {loading ? '...' : stats.outages.length}
                                    </span>
                                    <span className="text-[8px] text-accent/40">OONI</span>
                                </div>
                            </div>
                        </div>

                        {/* Outage Alerts List */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 border-b border-primary/10 pb-1">
                                <Activity size={10} className="text-primary/60" />
                                <span className="text-[9px] font-bold tracking-[0.1em] text-primary/60">ACTIVE ANOMALIES</span>
                            </div>
                            
                            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto scrollbar-hide">
                                {loading && <span className="text-[10px] text-primary/40 italic">Scanning network...</span>}
                                {!loading && stats.outages.length === 0 && (
                                    <span className="text-[10px] text-primary/40 italic">No critical anomalies detected.</span>
                                )}
                                
                                {!loading && stats.outages.map((o, i) => (
                                    <div key={i} className="flex flex-col bg-black/40 border border-primary/10 p-2 rounded relative overflow-hidden group hover:border-accent/40 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{getFlagEmoji(o.country)}</span>
                                                <span className="text-[10px] font-bold text-white tracking-widest">{o.country}</span>
                                            </div>
                                            <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${o.severity === 'HIGH' ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-warning/20 text-warning border border-warning/30'}`}>
                                                {o.severity}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 mt-2">
                                            <ServerCrash size={10} className={o.severity === 'HIGH' ? 'text-accent' : 'text-warning'} />
                                            <span className="text-[9px] text-primary/60 uppercase tracking-tighter">
                                                {o.type} DETECTED
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default InfraLayer;

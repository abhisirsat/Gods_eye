import React, { useState, useCallback } from 'react';
import Globe from './components/Globe';
import TopLeftHUD from './components/TopLeftHUD';
import TopRightHUD from './components/TopRightHUD';
import Sidebar from './components/Sidebar';
import BootSequence from './components/BootSequence';
import TimelineSlider from './components/TimelineSlider';
import HUDOverlay from './components/HUDOverlay';
import FilterModes from './components/FilterModes';
import InfraLayer from './components/InfraLayer';
import CyberAttackLayer from './components/CyberAttackLayer';
import SatellitePanel from './components/SatellitePanel';

function App() {
    const [booting, setBooting] = useState(true);
    const [selectedCamId, setSelectedCamId] = useState(null);
    const [signalReceived, setSignalReceived] = useState(false);
    const [layers, setLayers] = useState({
        flights: true,
        military_flights: true,
        ships: true,
        satellites: true,
        surveillance: true,
        jamming: true,
        signals: true,
        news: true,
        weather: false,
        fire: false,
        infrastructure: true,
        cyber_attacks: true,
        airspace: true
    });
    const [visuals, setVisuals] = useState({
        sharpen: true,
        panoptic: true,
        filterMode: 'NORMAL'
    });

    const handleBootComplete = useCallback(() => {
        setBooting(false);
    }, []);

    const handleSelectCamera = (cam) => {
        setSelectedCamId(`WEBCAM_${cam.id}`);
        setTimeout(() => setSelectedCamId(null), 1000);
    };

    if (booting) {
        return <BootSequence onComplete={handleBootComplete} />;
    }

    return (
        <div
            className="relative w-screen h-screen overflow-hidden select-none font-mono"
            style={{ background: '#06080a', color: '#aaff00' }}
        >
            {/* ── Global FUI grid overlay ── */}
            <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(170,255,0,0.018) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(170,255,0,0.018) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* ── HUD Overlay (reticle, corner brackets, grid lines) ── */}
            <HUDOverlay />

            {/* ── Top HUDs ── */}
            <TopLeftHUD />
            <TopRightHUD signalReceived={signalReceived} />

            {/* ── Main Globe ── */}
            <main className="absolute inset-0 z-[2]">
                <Globe
                    selectedId={selectedCamId}
                    layers={layers}
                    visuals={visuals}
                    onSignalReceived={() => {
                        setSignalReceived(true);
                        setTimeout(() => setSignalReceived(false), 1500);
                    }}
                />
            </main>

            {/* ── Side Data Panels ── */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <Sidebar onSelectCamera={handleSelectCamera} visuals={visuals} setVisuals={setVisuals} />
            </div>

            {/* ── Infrastructure / Telegeography ── */}
            <InfraLayer />

            {/* ── Cyber Attack Tracker ── */}
            <CyberAttackLayer isLayerVisible={layers.cyber_attacks} />

            {/* ── Satellite Panel ── */}
            <SatellitePanel isVisible={layers.satellites} onSelectSatellite={(id) => setSelectedCamId(id)} />

            {/* ── Timeline ── */}
            <TimelineSlider layers={layers} setLayers={setLayers} />

            {/* ── Filter Modes (left, above timeline) ── */}
            <div className="absolute bottom-44 left-5 z-20">
                <FilterModes
                    activeMode={visuals.filterMode}
                    onModeChange={(mode) => setVisuals(v => ({ ...v, filterMode: mode }))}
                />
            </div>

            {/* ── CRT overlay (light scanlines) ── */}
            <div className="scanline pointer-events-none" style={{ zIndex: 9990 }} />

            {/* ── Subtle vignette / flicker ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    zIndex: 9991,
                    background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%)',
                    animation: 'flicker-fast 0.2s infinite',
                }}
            />

            {/* ── Signal flash overlay ── */}
            {signalReceived && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        zIndex: 9992,
                        background: 'rgba(170,255,0,0.04)',
                        boxShadow: 'inset 0 0 80px rgba(170,255,0,0.15)',
                        animation: 'count-up 0.3s ease-out both',
                    }}
                />
            )}
        </div>
    );
}

export default App;

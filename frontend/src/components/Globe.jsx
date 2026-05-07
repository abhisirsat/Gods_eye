import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import SurveillanceHUD from './SurveillanceHUD';
import { Camera, ShieldAlert, Zap } from 'lucide-react';

const Globe = ({ selectedId, layers, visuals, onSignalReceived }) => {
    const cesiumContainer = useRef(null);
    const creditRef = useRef(null);
    const viewerRef = useRef(null);

    const [surveillanceData, setSurveillanceData] = useState({
        hotspots: [],
        webcams: [],
        liveEvents: []
    });

    // Dynamic API Base to allow network access (e.g., via IP)
    const API_BASE = `http://${window.location.hostname}:8000`;

    const [hudState, setHudState] = useState({
        isOpen: false,
        selectedHotspot: null,
        selectedCam: null
    });

    const entitiesRef = useRef({
        flights: new Map(), // Map<icao24, Entity>
        ships: new Map(),   // Map<name, Entity>
        satellites: new Map(), // Map<satId, Entity>
        jamming: [],
        events: [],
        surveillance: new Map(), // Map<id, Entity>
        satelliteLinks: new Map() // Map<satId, Entity[]>
    });
    const dataSourcesRef = useRef({
        ewJamming: null,
        sigintNodes: null,
        ewSpoofing: null,
        internetOutages: null
    });
    const hotspots = [
        { name: "WASHINGTON", lat: 38.9072, lng: -77.0369 },
        { name: "MOSCOW", lat: 55.7558, lng: 37.6173 },
        { name: "BEIJING", lat: 39.9042, lng: 116.4074 },
        { name: "NEW DELHI", lat: 28.6139, lng: 77.2090 },
        { name: "LONDON", lat: 51.5074, lng: -0.1278 },
        { name: "PARIS", lat: 48.8566, lng: 2.3522 },
        { name: "TOKYO", lat: 35.6762, lng: 139.6503 }
    ];
    const selectedIdRef = useRef(null);
    const layersRef = useRef(layers);

    // Sync layers ref
    useEffect(() => {
        layersRef.current = layers;
    }, [layers]);

    useEffect(() => {
        if (!cesiumContainer.current) return;

        const token = import.meta.env.VITE_CESIUM_ION_TOKEN;
        if (!token) {
            console.error("GOD'S EYE: VITE_CESIUM_ION_TOKEN is missing in .env");
        }
        Cesium.Ion.defaultAccessToken = token || '';

        const viewer = new Cesium.Viewer(cesiumContainer.current, {
            terrain: Cesium.Terrain.fromWorldTerrain({
                requestVertexNormals: false,
                requestWaterMask: false
            }),
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            scene3DOnly: true,
            shouldAnimate: true,
            shadows: false,
            terrainShadows: Cesium.ShadowMode.DISABLED,
            creditContainer: creditRef.current,
            skyBox: false,
            skyAtmosphere: false,
        });

        viewer.scene.backgroundColor = Cesium.Color.BLACK;
        viewer.scene.globe.baseColor = Cesium.Color.BLACK;
        viewer.scene.globe.enableLighting = true; 
        viewer.scene.fog.enabled = true;
        viewer.scene.shadowMap.enabled = false;
        
        // Fix for blurred/glitching icons:
        // Use logarithmic depth but force high pixel density for sharp labels
        viewer.scene.logarithmicDepthBuffer = true;
        viewer.resolutionScale = window.devicePixelRatio || 1.0;
        
        // Fix for icons visible through the globe
        viewer.scene.globe.depthTestAgainstTerrain = true;

        viewer.selectedEntityChanged.addEventListener((entity) => {
            const oldId = selectedIdRef.current;
            const newId = entity ? entity.id : null;
            selectedIdRef.current = newId;

            // Handle Surveillance HUD
            if (entity && entity._isSurveillance) {
                if (entity._dataType === 'hotspot') {
                    setHudState({ isOpen: true, selectedHotspot: entity._data, selectedCam: null });
                } else if (entity._dataType === 'webcam') {
                    setHudState({ isOpen: true, selectedHotspot: null, selectedCam: entity._data });
                }
            }

            // Reset old entity path
            if (oldId) {
                const e = viewer.entities.getById(oldId);
                if (e && e.path) e.path.show = false;
            }
            // Show new entity path
            if (entity && entity.path) {
                entity.path.show = true;
            }
        });

        viewerRef.current = viewer;
        window.cesiumViewer = viewer; // Expose globally for layers

        // Handle external selection
        if (selectedId) {
            const entity = viewer.entities.getById(selectedId);
            if (entity) {
                viewer.selectedEntity = entity;
                viewer.flyTo(entity, {
                    duration: 2.0,
                    offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 2000)
                });
            }
        }

        // Initialize custom data sources
        dataSourcesRef.current.ewJamming = new Cesium.CustomDataSource('ew-jamming');
        viewer.dataSources.add(dataSourcesRef.current.ewJamming);

        dataSourcesRef.current.sigintNodes = new Cesium.CustomDataSource('sigint-nodes');
        viewer.dataSources.add(dataSourcesRef.current.sigintNodes);

        dataSourcesRef.current.ewSpoofing = new Cesium.CustomDataSource('ew-spoofing');
        viewer.dataSources.add(dataSourcesRef.current.ewSpoofing);

        dataSourcesRef.current.internetOutages = new Cesium.CustomDataSource('internet-outages');
        viewer.dataSources.add(dataSourcesRef.current.internetOutages);

        // Task 4: Infrastructure & Telegeography Layer
        dataSourcesRef.current.infraCables = new Cesium.CustomDataSource('infra-cables');
        viewer.dataSources.add(dataSourcesRef.current.infraCables);

        dataSourcesRef.current.infraDatacenters = new Cesium.CustomDataSource('infra-datacenters');
        viewer.dataSources.add(dataSourcesRef.current.infraDatacenters);

        dataSourcesRef.current.airspaceZones = new Cesium.CustomDataSource('airspace-zones');
        viewer.dataSources.add(dataSourcesRef.current.airspaceZones);

        // Initial Fetch
        fetchAndRenderFlights();
        fetchAndRenderShips();
        fetchAndRenderSatellites();
        fetchAndRenderJammingZones();
        fetchAndRenderSIGINTNodes();
        // fetchAndRenderSpoofingAlerts(); // Disabled per user request - too many clusters
        fetchAndRenderInternetOutages();
        fetchAndRenderEvents();
        fetchAndRenderSurveillance();
        fetchAndRenderUnderseaCables();
        fetchAndRenderDataCenters();
        fetchAndRenderAirspace();

        // Data Polling Intervals
        const intervals = [
            setInterval(fetchAndRenderFlights, 15000),
            setInterval(fetchAndRenderShips, 60000),
            setInterval(fetchAndRenderSatellites, 30000),
            setInterval(fetchAndRenderJammingZones, 120000),
            setInterval(fetchAndRenderSIGINTNodes, 3600000), // static
            // setInterval(fetchAndRenderSpoofingAlerts, 15000), // Disabled per user request
            setInterval(fetchAndRenderInternetOutages, 300000), // Cloudflare Radar is low freq
            setInterval(fetchAndRenderEvents, 60000),
            setInterval(fetchAndRenderSurveillance, 60000),
            setInterval(fetchAndRenderUnderseaCables, 86400000), // Cache is daily
            setInterval(fetchAndRenderDataCenters, 86400000), // Static
            setInterval(fetchAndRenderAirspace, 300000), // 5 min
        ];

        return () => {
            intervals.forEach(clearInterval);
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, [selectedId]); // Remove 'layers' dependency to prevent re-mount on toggle

    // Sync Layers Visibility without re-mounting
    useEffect(() => {
        const v = viewerRef.current;
        if (!v) return;

        // Flights
        entitiesRef.current.flights.forEach(e => e.show = !!layers.flights);
        // Ships
        entitiesRef.current.ships.forEach(e => e.show = !!layers.ships);
        // Satellites
        entitiesRef.current.satellites.forEach(e => e.show = !!layers.satellites);
        // Satellite Spiderwebs
        entitiesRef.current.satelliteLinks.forEach(links => {
            links.forEach(l => l.show = !!layers.satellites && (visuals?.panoptic ?? true));
        });
        // Jamming
        entitiesRef.current.jamming.forEach(e => e.show = !!layers.jamming);
        if (dataSourcesRef.current.ewJamming) dataSourcesRef.current.ewJamming.show = !!layers.jamming;
        if (dataSourcesRef.current.sigintNodes) dataSourcesRef.current.sigintNodes.show = !!layers.jamming;
        // if (dataSourcesRef.current.ewSpoofing) dataSourcesRef.current.ewSpoofing.show = !!layers.jamming; // Disabled
        if (dataSourcesRef.current.internetOutages) dataSourcesRef.current.internetOutages.show = true; // Always visible for critical intel
        // Events
        entitiesRef.current.events.forEach(e => e.show = !!(layers.events || layers.news));
        // Surveillance
        entitiesRef.current.surveillance.forEach(e => e.show = !!layers.surveillance);
        
        // Infra
        if (dataSourcesRef.current.infraCables) dataSourcesRef.current.infraCables.show = !!layers.infrastructure;
        if (dataSourcesRef.current.infraDatacenters) dataSourcesRef.current.infraDatacenters.show = !!layers.infrastructure;
        if (dataSourcesRef.current.airspaceZones) dataSourcesRef.current.airspaceZones.show = !!layers.airspace;
    }, [layers, visuals?.panoptic]);

    // Handle Visual Post-Processing & Filter Modes
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        const applyImagery = async () => {
            const imageryLayers = viewer.imageryLayers;
            if (viewer._customImagery) {
                imageryLayers.remove(viewer._customImagery);
                viewer._customImagery = null;
            }

            const mode = visuals.filterMode || 'NORMAL';
            if (['NIGHT_VISION', 'FLIR', 'BLACKOUT'].includes(mode)) {
                try {
                    viewer._customImagery = imageryLayers.addImageryProvider(
                        new Cesium.OpenStreetMapImageryProvider({
                            url: 'https://a.tile.openstreetmap.org/'
                        })
                    );
                } catch (e) {
                    console.error("Failed to load custom imagery", e);
                }
            }
        };

        applyImagery();

    }, [visuals.filterMode, visuals.sharpen, visuals.panoptic]);

    // Compute CSS filter string for rendering
    const mode = visuals.filterMode || 'NORMAL';
    let baseFilter = '';
    if (mode === 'NIGHT_VISION') baseFilter = 'brightness(0.7) contrast(1.4) sepia(1) hue-rotate(60deg) saturate(4)';
    else if (mode === 'FLIR') baseFilter = 'brightness(0.9) contrast(1.3) sepia(1) hue-rotate(0deg) saturate(3)';
    else if (mode === 'CRT') baseFilter = 'brightness(1.1) contrast(1.2)';
    else if (mode === 'CEL') baseFilter = 'contrast(1.6) saturate(0.4)';
    else if (mode === 'BLACKOUT') baseFilter = 'brightness(0.4) contrast(2) grayscale(1)';

    const extra = [];
    if (visuals.sharpen) extra.push('contrast(1.1) brightness(1.05) saturate(1.1)');
    if (visuals.panoptic) extra.push('hue-rotate(-5deg) contrast(1.2)');
    if (baseFilter) extra.unshift(baseFilter);
    const cssFilter = extra.join(' ');

    // Tactical Icon Generation (Neon SVG)
    const getAircraftIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            <circle cx="12" cy="12" r="10" stroke-opacity="0.2" fill="${color}" fill-opacity="0.1"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getFighterIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 400 450" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M326.34,219.49l-90-62v-27l-23.033-43.71C207.575,3.201,194.745,0,194.745,0s-12.83,3.201-18.563,86.78l-23.033,43.71v27 l-90,62v51l86.143,24.971c-0.041,0.285-0.07,0.574-0.07,0.868v28.158l-20.171,1.659v36l24.325,8.929l24.675-8.929v-18.753 l2.977,0.939c6.115,42.206,13.717,45.158,13.717,45.158s7.602-2.952,13.717-45.158l2.977-0.939v18.753l24.675,8.929l24.325-8.929 v-36l-20.171-1.659v-28.158c0-0.294-0.028-0.583-0.07-0.868l86.143-24.971V219.49z M93.15,247.951v-12.698l64.086-44.148 l0.068,75.444L93.15,247.951z M182.8,332.308l-21.577-6.801v-24.778l21.577-6.801V332.308z M228.268,325.507l-21.577,6.801v-38.38 l21.577,6.801V325.507z M296.34,247.951l-64.154,18.598l0.068-75.444l64.086,44.148V247.951z" fill="${color}" fill-opacity="0.2"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getBomberIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">
            <path d="M 256,124.969 L 0,352.094 L 29.578,387.031 L 115.563,317.125 L 185.438,376.281 L 218.375,343.344 L 256,380.969 L 293.625,343.344 L 326.563,376.281 L 396.422,317.125 L 482.438,387.031 L 512,352.094 Z" fill="${color}" fill-opacity="0.2"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getTransportIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 120 120" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M38.14,115.91c0-10.58,5.81-15.56,13.46-21.3l0-27.68L1.37,89.25c0-19.32-6.57-17.9,9.05-27.72l0.15-0.09 V49.37h11.22v5.08l8.24-5.13V35.8h11.22v6.54l10.36-6.45V7.3c0-4.02,4.37-7.3,9.7-7.3l0,0c5.34,0,9.7,3.29,9.7,7.3v28.58 l10.47,6.52V35.8l11.22,0v13.59l8.24,5.13v-5.15l11.21,0v12.14c15.56,9.67,9.61,7.78,9.61,27.74L71.01,66.91v27.58 c8.14,5.43,13.46,9.6,13.46,21.43l-12.81,0.11c-2.93-2.3-4.96-4.05-6.52-5.26c-1.18,0.39-2.48,0.6-3.83,0.6h0 c-1.53,0-2.99-0.27-4.28-0.76c-1.68,1.22-3.9,3.04-7.21,5.42L38.14,115.91z" fill="${color}" fill-opacity="0.2"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getUAVIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15.612 11.842l1.452-2.622a1.954 1.954 0 0 0 .247-.95 1.572 1.572 0 0 0-.029-.28l2.364 2.364.707-.707-6-6-.707.707 2.365 2.364a1.572 1.572 0 0 0-.28-.029 1.958 1.958 0 0 0-.95.246l-2.623 1.453-7.092-7.092a1.019 1.019 0 0 0-1.435 0l-1.097 1.1a1.875 1.875 0 0 0-.295 2.264 30.92 30.92 0 0 0 5.349 6.612l.852.852-3.155 3.959-1.834-.936a1.06 1.06 0 0 0-1.295.162l-.851.851a1.032 1.032 0 0 0-.158 1.265l1.771 2.95-.772.772a.5.5 0 1 0 .707.707l.772-.771 2.951 1.77a1.03 1.03 0 0 0 1.264-.156l.851-.851a1.047 1.047 0 0 0 .178-1.267l-.951-1.863 3.959-3.155.845.844a30.966 30.966 0 0 0 6.619 5.357 1.876 1.876 0 0 0 2.266-.296l1.094-1.095a1.015 1.015 0 0 0 .001-1.437zm-.345-4.033a.956.956 0 0 1 .463-.12.58.58 0 0 1 .58.58.953.953 0 0 1-.12.465l-1.314 2.373-1.983-1.984zm5.632 12.95a.873.873 0 0 1-1.056.137 29.953 29.953 0 0 1-6.406-5.19l-1.484-1.484-5.297 4.22 1.323 2.591-.002.09.008.014-.895.858-2.736-1.642.5-.5a.5.5 0 0 0-.707-.706l-.497.496-1.64-2.776.853-.852 2.696 1.329 4.22-5.297-1.492-1.491a29.906 29.906 0 0 1-5.183-6.399.874.874 0 0 1 .137-1.055l1.12-1.098 17.634 17.658z" fill="${color}" fill-opacity="0.2"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getPropIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M2 10h20M5 10l-1-2h2l1 2M17 10l1-2h2l-1 2" fill="${color}" fill-opacity="0.2"/>
            <path d="M12 2l-2 2h4l-2-2zM12 22l-1-2h2l-1 2z"/>
            <circle cx="12" cy="10" r="1.5" stroke-width="1"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getSupersonicIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L6 22l6-4 6 4-6-20z" fill="${color}" fill-opacity="0.3"/>
            <path d="M9 16l-3 4M15 16l3 4"/>
            <path d="M12 2v16"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getVesselIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L8 6v12l4 4 4-4V6l-4-4z" fill="${color}" fill-opacity="0.2"/>
            <circle cx="12" cy="12" r="10" stroke-opacity="0.1"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getTankerIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 32 32" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 2L12 5v22l4 3 4-3V5l-4-3z" fill="${color}" fill-opacity="0.2"/>
            <rect x="13" y="22" width="6" height="4" fill="${color}" fill-opacity="0.4"/>
            <path d="M16 2v4M13 10h6M13 15h6M13 20h6"/>
            <circle cx="16" cy="16" r="14" stroke-opacity="0.1"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getCargoIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 32 32" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 2L11 6v21l5 3 5-3V6l-5-4z" fill="${color}" fill-opacity="0.1"/>
            <rect x="12" y="8" width="8" height="3" fill="${color}" fill-opacity="0.3"/>
            <rect x="12" y="12" width="8" height="3" fill="${color}" fill-opacity="0.3"/>
            <rect x="12" y="16" width="8" height="3" fill="${color}" fill-opacity="0.3"/>
            <rect x="13" y="24" width="6" height="3" fill="${color}" fill-opacity="0.5"/>
            <circle cx="16" cy="16" r="14" stroke-opacity="0.1"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getDestroyerIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 32 32" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 2L13 7v18l3 5 3-5V7l-3-5z" fill="${color}" fill-opacity="0.2"/>
            <circle cx="16" cy="12" r="1.5" fill="${color}"/>
            <rect x="14" y="16" width="4" height="6" fill="${color}" fill-opacity="0.4"/>
            <path d="M16 22l-2 3h4l-2-3z"/>
            <circle cx="16" cy="16" r="14" stroke-opacity="0.1"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getSigintNodeIcon = () => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ff00ff">
            <polygon points="12,2 22,12 12,22 2,12" opacity="0.8"/>
            <polygon points="12,6 18,12 12,18 6,12" fill="#000000"/>
            <circle cx="12" cy="12" r="3" fill="#ffffff" />
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getHotspotIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/>
            <circle cx="12" cy="12" r="3" fill="${color}"/>
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getWebcamIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getSurveillanceEventIcon = (type, color) => {
        let path = "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01";
        if (type === 'wildfire') path = "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1.5-3.045 0 1.95 2.05 3.045 2 4.045z";

        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="${path}" fill="${color}" fill-opacity="0.2"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    const getSatelliteIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Core Body -->
            <rect x="9" y="8" width="6" height="8" rx="0.5" fill="${color}" fill-opacity="0.15"/>
            <rect x="10.5" y="10" width="3" height="4" rx="0.2" fill="${color}" fill-opacity="0.3"/>
            
            <!-- Solar Arrays -->
            <path d="M2 9h7v6H2z" fill="${color}" fill-opacity="0.1"/>
            <path d="M15 9h7v6h-7z" fill="${color}" fill-opacity="0.1"/>
            <path d="M2 11h7M2 13h7M4.5 9v6M19.5 9v6M15 11h7M15 13h7" stroke-width="0.5" stroke-opacity="0.5"/>
            
            <!-- Antennas & Sensors -->
            <path d="M12 8V5M11 5h2M12 16v3M10 19h4" stroke-width="1"/>
            <circle cx="12" cy="12" r="1" fill="${color}"/>
            
            <!-- High-Tech Detailing -->
            <path d="M9 8l-2-2M15 8l2-2M9 16l-2 2M15 16l2 2" stroke-width="0.8" stroke-opacity="0.6"/>
            <circle cx="12" cy="4" r="0.8" fill="${color}"/>
        </svg>`;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    };

    // Helper to check if viewer is ready for entities
    const getViewer = () => {
        const v = viewerRef.current;
        if (v && !v.isDestroyed()) return v;
        return null;
    };

    const getMapBounds = () => {
        const viewer = getViewer();
        if (!viewer) return null;
        try {
            const rect = viewer.camera.computeViewRectangle();
            if (!rect) return null;
            return {
                west: Number(Cesium.Math.toDegrees(rect.west).toFixed(4)),
                south: Number(Cesium.Math.toDegrees(rect.south).toFixed(4)),
                east: Number(Cesium.Math.toDegrees(rect.east).toFixed(4)),
                north: Number(Cesium.Math.toDegrees(rect.north).toFixed(4))
            };
        } catch (e) { return null; }
    };

    // Data Fetching & Rendering Functions
    const fetchAndRenderFlights = async () => {
        const viewer = getViewer();
        if (!viewer) return;
        try {
            const response = await fetch(`${API_BASE}/api/flights/`);
            const flights = await response.json();
            if (flights.length > 0 && onSignalReceived) onSignalReceived();

            const v = getViewer();
            if (!v) return;

            const now = Cesium.JulianDate.now();
            const currentIcaos = new Set();

            flights.forEach(f => {
                const icao = f.icao24.toLowerCase();
                currentIcaos.add(icao);

                const lat = Number(f.latitude) || 0;
                const lon = Number(f.longitude) || 0;
                let alt = Number(f.altitude);
                if (isNaN(alt)) alt = 0;
                const heading = Number(f.heading) || 0;
                const velocity = Number(f.velocity) || 0;

                const callsign = (f.callsign || "UNKNOWN").trim();
                const type = (f.type || "").toUpperCase();
                const isMilitary = callsign.includes('MIL') || callsign.includes('FTR') || callsign.includes('BMR') ||
                    type.includes('F16') || type.includes('F35') || type.includes('F22') ||
                    type.includes('B52') || type.includes('C17') || type.includes('C130') ||
                    type.includes('VANGUARD') || type.includes('RAVEN');

                let iconType = 'GENERAL';
                if (type.includes('F16') || type.includes('F35') || type.includes('F22') || type.includes('MIG') || type.includes('SU-')) iconType = 'FIGHTER';
                else if (type.includes('B52') || type.includes('B2') || type.includes('TU-')) iconType = 'BOMBER';
                else if (type.includes('C17') || type.includes('C130') || type.includes('KC135')) iconType = 'TRANSPORT';
                else if (type.includes('RQ-') || type.includes('MQ-') || type.includes('UAV')) iconType = 'UAV';
                else if (type.includes('C15') || type.includes('C172') || type.includes('BE36') || type.includes('PA28')) iconType = 'PROP';
                else if (type.includes('CONC') || type.includes('TU144')) iconType = 'SUPERSONIC';

                const altFt = alt * 3.28084;

                let neonColor = '#00f2ff';
                let cesiumColor = Cesium.Color.CYAN;

                if (isMilitary) {
                    neonColor = '#ff004c';
                    cesiumColor = Cesium.Color.RED;
                } else {
                    if (altFt > 35000) { neonColor = '#00f2ff'; cesiumColor = Cesium.Color.CYAN; }
                    else if (altFt > 25000) { neonColor = '#00ff88'; cesiumColor = Cesium.Color.GREEN; }
                    else if (altFt > 10000) { neonColor = '#ffcc00'; cesiumColor = Cesium.Color.fromCssColorString('#ffcc00'); }
                    else { neonColor = '#ff8800'; cesiumColor = Cesium.Color.ORANGE; }
                }

                let entity = entitiesRef.current.flights.get(icao);

                if (!entity) {
                    const position = new Cesium.SampledPositionProperty();
                    position.backwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
                    position.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
                    position.setInterpolationOptions({
                        interpolationDegree: 1,
                        interpolationAlgorithm: Cesium.LinearApproximation
                    });

                    entity = v.entities.add({
                        id: icao,
                        name: `Flight: ${callsign}`,
                        position: position,
                        billboard: {
                            image: iconType === 'FIGHTER' ? getFighterIcon(neonColor) :
                                iconType === 'BOMBER' ? getBomberIcon(neonColor) :
                                    iconType === 'TRANSPORT' ? getTransportIcon(neonColor) :
                                        iconType === 'UAV' ? getUAVIcon(neonColor) :
                                            iconType === 'PROP' ? getPropIcon(neonColor) :
                                                iconType === 'SUPERSONIC' ? getSupersonicIcon(neonColor) :
                                                    getAircraftIcon(neonColor),
                            width: 28,
                            height: 28,
                            rotation: Cesium.Math.toRadians(heading),
                            color: Cesium.Color.WHITE,
                            disableDepthTestDistance: 0, // Icons will be hidden by the globe depth
                        },
                        label: {
                            text: callsign,
                            font: '10px monospace',
                            fillColor: cesiumColor,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -20),
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 800000.0)
                        },
                        path: {
                            show: false,
                            leadTime: 0,
                            trailTime: 120,
                            width: 1,
                            material: new Cesium.ColorMaterialProperty(cesiumColor.withAlpha(0.3))
                        },
                        description: `<b>Callsign:</b> ${f.callsign}<br/>
                                     <b>Reg:</b> ${f.registration || 'N/A'}<br/>
                                     <b>Type:</b> ${f.type || 'N/A'}<br/>
                                     <b>Source:</b> ${f.source || 'Unknown'}<br/>
                                     <b>Altitude:</b> ${Math.round(altFt).toLocaleString()} ft<br/>
                                     <b>Velocity:</b> ${Math.round(velocity * 1.94384)} knots`
                    });
                    entitiesRef.current.flights.set(icao, entity);
                }

                entity.show = !!layersRef.current.flights;
                const posNow = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
                entity.position.addSample(now, posNow);

                if (velocity > 0) {
                    const secondsToPredict = 5;
                    const knotsToMps = 0.514444;
                    let mps = velocity;
                    if (f.source === 'ADSB.lol') mps = velocity * knotsToMps;
                    const distance = mps * secondsToPredict;
                    const headingRad = Cesium.Math.toRadians(heading);
                    const deltaX = distance * Math.sin(headingRad);
                    const deltaY = distance * Math.cos(headingRad);
                    const dLat = (deltaY / 111320);
                    const dLon = (deltaX / (111320 * Math.cos(Cesium.Math.toRadians(lat))));
                    const futureTime = Cesium.JulianDate.addSeconds(now, secondsToPredict, new Cesium.JulianDate());
                    const posFuture = Cesium.Cartesian3.fromDegrees(lon + dLon, lat + dLat, alt);
                    entity.position.addSample(futureTime, posFuture);
                }

                entity.billboard.image = iconType === 'FIGHTER' ? getFighterIcon(neonColor) :
                    iconType === 'BOMBER' ? getBomberIcon(neonColor) :
                        iconType === 'TRANSPORT' ? getTransportIcon(neonColor) :
                            iconType === 'UAV' ? getUAVIcon(neonColor) :
                                getAircraftIcon(neonColor);
                entity.billboard.rotation = Cesium.Math.toRadians(heading);
                entity.label.fillColor = cesiumColor;
                entity.label.text = callsign;
                entity.label.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0.0, 800000.0);
            });

            for (const [icao, entity] of entitiesRef.current.flights.entries()) {
                if (!currentIcaos.has(icao)) {
                    v.entities.remove(entity);
                    entitiesRef.current.flights.delete(icao);
                }
            }
        } catch (e) { console.error("Flight fetch error:", e); }
    };

    const fetchAndRenderSatellites = async () => {
        const viewer = getViewer();
        if (!viewer) return;
        try {
            const response = await fetch(`${API_BASE}/api/satellites/`);
            const sats = await response.json();
            if (sats.length > 0 && onSignalReceived) onSignalReceived();
            const v = getViewer();
            if (!v) return;
            const now = Cesium.JulianDate.now();
            const currentSatIds = new Set();

            sats.forEach(s => {
                const satId = `SAT_${s.id}`;
                currentSatIds.add(satId);
                let entity = entitiesRef.current.satellites.get(satId);
                const neonColor = s.color || '#00f2ff';
                const cesiumColor = Cesium.Color.fromCssColorString(neonColor);

                if (!entity) {
                    const position = new Cesium.SampledPositionProperty();
                    position.backwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
                    position.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;

                    entity = v.entities.add({
                        id: satId,
                        name: `Satellite: ${s.name}`,
                        position: position,
                        billboard: {
                            image: getSatelliteIcon(neonColor),
                            width: 24,
                            height: 24,
                            color: Cesium.Color.WHITE,
                            disableDepthTestDistance: 0, // Icons will be hidden by the globe depth
                        },
                        label: {
                            text: `[${s.country}] ${s.name}`,
                            font: '9px monospace',
                            fillColor: cesiumColor,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -15),
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 3000000.0)
                        },
                        path: {
                            show: new Cesium.CallbackProperty(() => !!layersRef.current.satellites, false),
                            leadTime: 300, // 5 minutes ahead
                            trailTime: 600, // 10 minutes trailing
                            width: 2,
                            material: new Cesium.PolylineDashMaterialProperty({ color: cesiumColor.withAlpha(0.7), dashLength: 16 })
                        },
                        ellipse: {
                            semiMinorAxis: new Cesium.CallbackProperty(() => {
                                const p = entity.position.getValue(v.clock.currentTime);
                                if (!p) return 500000;
                                const carto = Cesium.Cartographic.fromCartesian(p);
                                return Math.max(100000, carto.height * 1.2); 
                            }, false),
                            semiMajorAxis: new Cesium.CallbackProperty(() => {
                                const p = entity.position.getValue(v.clock.currentTime);
                                if (!p) return 500000;
                                const carto = Cesium.Cartographic.fromCartesian(p);
                                return Math.max(100000, carto.height * 1.2);
                            }, false),
                            material: new Cesium.ColorMaterialProperty(cesiumColor.withAlpha(0.08)),
                            outline: true,
                            outlineColor: cesiumColor.withAlpha(0.4)
                        },
                        description: `
                            <b>NORAD ID:</b> ${s.id}<br/>
                            <b>Type:</b> <span style="color:${neonColor}">${s.type || 'UNKNOWN'}</span><br/>
                            <b>Country:</b> ${s.country}<br/>
                            <b>Altitude:</b> ${Math.round(s.alt)} km
                        `
                    });
                    entitiesRef.current.satellites.set(satId, entity);
                }

                entity.show = !!layersRef.current.satellites;

                // Process trajectory buffer
                if (s.trajectory && Array.isArray(s.trajectory)) {
                    s.trajectory.forEach(p => {
                        const satTimestamp = p.timestamp;
                        if (satTimestamp === undefined || satTimestamp === null) return;
                        const time = Cesium.JulianDate.fromDate(new Date(satTimestamp * 1000));
                        const lat = parseFloat(p.lat);
                        const lng = parseFloat(p.lng);
                        const alt = parseFloat(p.alt);
                        if (isNaN(lat) || isNaN(lng) || isNaN(alt)) return;

                        const pos = Cesium.Cartesian3.fromDegrees(lng, lat, alt * 1000);
                        if (pos) entity.position.addSample(time, pos);
                    });
                }

                // Update Spiderweb Lines
                if (layersRef.current.satellites && visuals.panoptic) {
                    let links = entitiesRef.current.satelliteLinks.get(satId) || [];
                    if (links.length === 0) {
                        // Create links to nearest 2 hotspots
                        const sortedHotspots = [...hotspots].sort((a, b) => {
                            const distA = Math.hypot(a.lat - s.lat, a.lng - s.lng);
                            const distB = Math.hypot(b.lat - s.lat, b.lng - s.lng);
                            return distA - distB;
                        }).slice(0, 2);

                        sortedHotspots.forEach((h, idx) => {
                            const link = v.entities.add({
                                polyline: {
                                    positions: new Cesium.CallbackProperty(() => {
                                        const start = entity.position.getValue(v.clock.currentTime);
                                        const end = Cesium.Cartesian3.fromDegrees(h.lng, h.lat, 0);
                                        return start ? [start, end] : [];
                                    }, false),
                                    width: 0.5,
                                    material: new Cesium.PolylineDashMaterialProperty({
                                        color: cesiumColor.withAlpha(0.2),
                                        dashLength: 16
                                    })
                                }
                            });
                            links.push(link);
                        });
                        entitiesRef.current.satelliteLinks.set(satId, links);
                    }
                    links.forEach(l => l.show = true);
                } else {
                    const links = entitiesRef.current.satelliteLinks.get(satId);
                    if (links) links.forEach(l => l.show = false);
                }
            });

            for (const [satId, entity] of entitiesRef.current.satellites.entries()) {
                if (!currentSatIds.has(satId)) {
                    v.entities.remove(entity);
                    entitiesRef.current.satellites.delete(satId);
                }
            }
        } catch (e) { console.error("Sat fetch error:", e); }
    };

    const fetchAndRenderJammingZones = async () => {
        const viewer = getViewer();
        if (!viewer) return;
        try {
            const response = await fetch(`${API_BASE}/api/ew/jamming-zones`);
            const data = await response.json();
            if (data.zones && data.zones.length > 0 && onSignalReceived) onSignalReceived();

            const ds = dataSourcesRef.current.ewJamming;
            if (!ds) return;

            const currentZoneIds = new Set();
            data.zones.forEach((z, idx) => {
                const lat = parseFloat(z.lat);
                const lon = parseFloat(z.lon);
                if (isNaN(lat) || isNaN(lon)) return;
                
                const zoneId = `jamming_${lat}_${lon}_${idx}`;
                currentZoneIds.add(zoneId);
                const cesiumColor = Cesium.Color.fromCssColorString(z.color);
                
                let entity = ds.entities.getById(zoneId);
                if (!entity) {
                    entity = ds.entities.add({
                        id: zoneId,
                        name: `Jamming Zone: ${z.severity_label}`,
                        position: Cesium.Cartesian3.fromDegrees(lon, lat),
                        cylinder: {
                            length: 40000,
                            topRadius: z.radius_km * 1000,
                            bottomRadius: z.radius_km * 1000,
                            material: new Cesium.ColorMaterialProperty(
                                new Cesium.CallbackProperty(() => {
                                    const alpha = 0.4 + 0.3 * Math.sin(Date.now() / 600);
                                    return cesiumColor.withAlpha(alpha);
                                }, false)
                            ),
                            outline: false,
                            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                        },
                        description: `<b>Severity:</b> ${z.severity_label}<br/><b>Radius:</b> ${z.radius_km} km`
                    });
                } else {
                    entity.position = Cesium.Cartesian3.fromDegrees(lon, lat);
                    entity.cylinder.topRadius = z.radius_km * 1000;
                    entity.cylinder.bottomRadius = z.radius_km * 1000;
                }
            });

            // Cleanup missing zones
            const entitiesToRemove = [];
            for (let i = 0; i < ds.entities.values.length; i++) {
                const e = ds.entities.values[i];
                if (!currentZoneIds.has(e.id)) entitiesToRemove.push(e);
            }
            entitiesToRemove.forEach(e => ds.entities.remove(e));
        } catch (e) { console.error("Jamming Zones fetch error:", e); }
    };

    const fetchAndRenderSIGINTNodes = async () => {
        const viewer = getViewer();
        if (!viewer) return;
        try {
            const response = await fetch(`${API_BASE}/api/ew/sigint-nodes`);
            const data = await response.json();
            if (data.nodes && data.nodes.length > 0 && onSignalReceived) onSignalReceived();

            const ds = dataSourcesRef.current.sigintNodes;
            if (!ds) return;

            const currentNodes = new Set();
            data.nodes.forEach(n => {
                const nodeId = `sigint_${n.name}`;
                currentNodes.add(nodeId);
                let entity = ds.entities.getById(nodeId);
                
                if (!entity) {
                    entity = ds.entities.add({
                        id: nodeId,
                        name: `SIGINT: ${n.name}`,
                        position: Cesium.Cartesian3.fromDegrees(n.lon, n.lat, 50),
                        billboard: {
                            image: getSigintNodeIcon(),
                            width: 24,
                            height: 24,
                            color: Cesium.Color.WHITE,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        },
                        label: {
                            text: n.name,
                            font: '10px monospace',
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -15),
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000000.0)
                        },
                        description: `<b>Type:</b> ${n.type}<br/><b>Country:</b> ${n.country}`
                    });
                }
            });
            const entitiesToRemove = [];
            for (let i = 0; i < ds.entities.values.length; i++) {
                const e = ds.entities.values[i];
                if (!currentNodes.has(e.id)) entitiesToRemove.push(e);
            }
            entitiesToRemove.forEach(e => ds.entities.remove(e));
        } catch (e) { console.error("SIGINT Node fetch error:", e); }
    };

    const fetchAndRenderSpoofingAlerts = async () => {
        const viewer = getViewer();
        if (!viewer) return;
        try {
            const response = await fetch(`${API_BASE}/api/ew/spoofing-detections`);
            const data = await response.json();
            if (data.anomalies && data.anomalies.length > 0 && onSignalReceived) onSignalReceived();

            const ds = dataSourcesRef.current.ewSpoofing;
            if (!ds) return;

            ds.entities.removeAll();

            data.anomalies.forEach(a => {
                const lat = parseFloat(a.lat);
                const lon = parseFloat(a.lon);
                if (isNaN(lat) || isNaN(lon)) return;

                // Expanding ring
                ds.entities.add({
                    name: `SPOOFING ALERT: ${a.icao}`,
                    position: Cesium.Cartesian3.fromDegrees(lon, lat, a.altitude_m || 10000),
                    ellipse: {
                        semiMinorAxis: new Cesium.CallbackProperty((time) => {
                            const ms = Cesium.JulianDate.toDate(time).getTime();
                            const t = (ms % 2000) / 2000;
                            return Math.max(1, t * 50000);
                        }, false),
                        semiMajorAxis: new Cesium.CallbackProperty((time) => {
                            const ms = Cesium.JulianDate.toDate(time).getTime();
                            const t = (ms % 2000) / 2000;
                            return Math.max(1, t * 50000) + 1; // Ensure major > minor
                        }, false),
                        material: new Cesium.ColorMaterialProperty(
                            new Cesium.CallbackProperty((time) => {
                                const ms = Cesium.JulianDate.toDate(time).getTime();
                                const t = (ms % 2000) / 2000;
                                return Cesium.Color.RED.withAlpha(Math.max(0, 0.8 - t));
                            }, false)
                        ),
                        outline: true,
                        outlineColor: Cesium.Color.RED,
                    },
                    point: {
                        pixelSize: 8,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 1
                    },
                    description: `<b>ANOMALY:</b> ${a.anomaly_type}<br/><b>CONFIDENCE:</b> ${a.confidence}<br/><b>ICAO:</b> ${a.icao}<br/><b>Callsign:</b> ${a.callsign}`
                });
            });
        } catch (e) { console.error("Spoofing Alert fetch error:", e); }
    };

    const fetchAndRenderInternetOutages = async () => {
        const viewer = getViewer();
        if (!viewer) return;
        try {
            const response = await fetch(`${API_BASE}/api/ew/internet-outages`);
            const data = await response.json();
            
            if (data.outages && data.outages.length > 0 && onSignalReceived) onSignalReceived();

            const ds = dataSourcesRef.current.internetOutages;
            if (!ds) return;

            const currentOutageIds = new Set();
            data.outages.forEach(o => {
                const outageId = `outage_${o.country}_${o.lat}_${o.lon}`;
                currentOutageIds.add(outageId);
                const color = Cesium.Color.fromCssColorString(o.color);
                let entity = ds.entities.getById(outageId);
                
                if (!entity) {
                    entity = ds.entities.add({
                        id: outageId,
                        name: `INTERNET BLACKOUT: ${o.country}`,
                        position: Cesium.Cartesian3.fromDegrees(o.lon, o.lat),
                        cylinder: {
                            length: 60000,
                            topRadius: 150000,
                            bottomRadius: 150000,
                            material: new Cesium.ColorMaterialProperty(
                                new Cesium.CallbackProperty(() => {
                                    const alpha = 0.5 + 0.3 * Math.cos(Date.now() / 800);
                                    return color.withAlpha(alpha);
                                }, false)
                            ),
                            outline: false,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        },
                        point: {
                            pixelSize: 8,
                            color: color,
                            outlineColor: Cesium.Color.WHITE,
                            outlineWidth: 2,
                            disableDepthTestDistance: 0
                        },
                        description: `<b>Location:</b> ${o.country}<br/><b>Status:</b> ${o.type}<br/><b>Cause:</b> ${o.cause}`
                    });
                }
            });
            const entitiesToRemove = [];
            for (let i = 0; i < ds.entities.values.length; i++) {
                const e = ds.entities.values[i];
                if (!currentOutageIds.has(e.id)) entitiesToRemove.push(e);
            }
            entitiesToRemove.forEach(e => ds.entities.remove(e));
        } catch (e) { console.error("Internet Outages fetch error:", e); }
    };

    const fetchAndRenderShips = async () => {
        const viewer = getViewer();
        if (!viewer) return;
        try {
            const response = await fetch(`${API_BASE}/api/ships/`);
            const ships = await response.json();
            if (ships.length > 0 && onSignalReceived) onSignalReceived();
            const v = getViewer();
            if (!v) return;
            const now = Cesium.JulianDate.now();
            const currentShipNames = new Set();
            ships.forEach(s => {
                const shipId = s.name;
                currentShipNames.add(shipId);
                const lat = Number(s.lat) || 0;
                const lon = Number(s.lng) || 0;
                const isMilitary = s.type === 'MILITARY';
                const neonColor = isMilitary ? '#ff004c' : (s.type === 'TANKER' ? '#ffaa00' : '#00f2ff');
                const cesiumColor = isMilitary ? Cesium.Color.RED : (s.type === 'TANKER' ? Cesium.Color.ORANGE : Cesium.Color.CYAN);
                let icon = getVesselIcon(neonColor);
                if (s.type === 'TANKER') icon = getTankerIcon(neonColor);
                if (s.type === 'CARGO') icon = getCargoIcon(neonColor);
                if (s.type === 'MILITARY') icon = getDestroyerIcon(neonColor);
                let entity = entitiesRef.current.ships.get(shipId);
                if (!entity) {
                    const position = new Cesium.SampledPositionProperty();
                    position.backwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
                    position.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
                    entity = v.entities.add({
                        id: shipId,
                        name: `Vessel: ${s.name}`,
                        position: position,
                        billboard: {
                            image: icon,
                            width: 24,
                            height: 24,
                            color: Cesium.Color.WHITE,
                            disableDepthTestDistance: 0
                        },
                        path: {
                            show: false,
                            leadTime: 0,
                            trailTime: 300,
                            width: 1,
                            material: new Cesium.ColorMaterialProperty(cesiumColor.withAlpha(0.3))
                        },
                        label: {
                            text: s.name,
                            font: '10px monospace',
                            fillColor: cesiumColor,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -20),
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500000.0)
                        },
                        description: `<b>Type:</b> ${s.type}<br/><b>Speed:</b> ${s.speed.toFixed(1)}kn`
                    });
                    entitiesRef.current.ships.set(shipId, entity);
                }
                entity.show = !!layersRef.current.ships;
                entity.billboard.image = icon;
                entity.billboard.rotation = Cesium.Math.toRadians(s.heading || 0);
                const posNow = Cesium.Cartesian3.fromDegrees(lon, lat, 100);
                entity.position.addSample(now, posNow);
                if (s.speed > 0) {
                    const secondsToPredict = 1;
                    const mps = s.speed * 0.514444;
                    const distance = mps * secondsToPredict;
                    const headingRad = Cesium.Math.toRadians(s.heading || 0);
                    const deltaX = distance * Math.sin(headingRad);
                    const deltaY = distance * Math.cos(headingRad);
                    const dLat = (deltaY / 111320);
                    const dLon = (deltaX / (111320 * Math.cos(Cesium.Math.toRadians(lat))));
                    const futureTime = Cesium.JulianDate.addSeconds(now, secondsToPredict, new Cesium.JulianDate());
                    const posFuture = Cesium.Cartesian3.fromDegrees(lon + dLon, lat + dLat, 100);
                    entity.position.addSample(futureTime, posFuture);
                }
            });
            for (const [name, entity] of entitiesRef.current.ships.entries()) {
                if (!currentShipNames.has(name)) {
                    v.entities.remove(entity);
                    entitiesRef.current.ships.delete(name);
                }
            }
        } catch (e) { console.error("Ship fetch error:", e); }
    };

    const fetchAndRenderEvents = async () => {
        const v = getViewer();
        if (!v) return;
        try {
            const response = await fetch(`${API_BASE}/api/events/`);
            const events = await response.json();
            if (events.length > 0 && onSignalReceived) onSignalReceived();

            const viewer = getViewer();
            if (!viewer) return;

            // Safely remove existing
            entitiesRef.current.events.forEach(e => {
                if (e && viewer.entities.contains(e)) {
                    viewer.entities.remove(e);
                }
            });
            entitiesRef.current.events = [];

            if (!Array.isArray(events)) return;

            events.forEach(ev => {
                const lat = parseFloat(ev.lat);
                const lng = parseFloat(ev.lng);

                if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return;

                const pos = Cesium.Cartesian3.fromDegrees(lng, lat);
                if (!pos) return;

                const entity = viewer.entities.add({
                    name: `Event: ${ev.title || "Observation"}`,
                    position: pos,
                    point: {
                        pixelSize: 10,
                        color: ev.severity === 'CRITICAL' ? Cesium.Color.RED : Cesium.Color.YELLOW,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 2,
                        disableDepthTestDistance: 0
                    },
                });
                entity.show = !!(layersRef.current.events || layersRef.current.news);
                entitiesRef.current.events.push(entity);
            });
        } catch (e) { console.error("Event fetch error:", e); }
    };

    const fetchAndRenderSurveillance = async () => {
        const viewer = getViewer();
        if (!viewer) return;

        const bounds = getMapBounds();
        const boundsQuery = bounds ? `?west=${bounds.west}&south=${bounds.south}&east=${bounds.east}&north=${bounds.north}` : '';

        try {
            const [hResp, wResp] = await Promise.all([
                fetch(`${API_BASE}/api/surveillance/hotspots`),
                fetch(`${API_BASE}/api/surveillance/webcams${boundsQuery}`)
            ]);

            const hotspots = await hResp.json();
            const webcams = await wResp.json();

            const v = getViewer();
            if (!v) return;

            const currentIds = new Set();
            if (!entitiesRef.current.surveillance) entitiesRef.current.surveillance = new Map();

            const vReady = getViewer();
            if (!vReady) return;

            // Render Hotspots
            hotspots.forEach(h => {
                const lat = parseFloat(h.lat);
                const lng = parseFloat(h.lng);
                if (isNaN(lat) || isNaN(lng)) return;

                const id = `HOTSPOT_${h.id}`;
                currentIds.add(id);
                let entity = entitiesRef.current.surveillance.get(id);
                if (!entity) {
                    const pos = Cesium.Cartesian3.fromDegrees(lng, lat);
                    if (!pos) return;

                    entity = vReady.entities.add({
                        id,
                        position: pos,
                        billboard: {
                            image: getHotspotIcon('#00f2ff'),
                            width: 32, height: 32,
                            color: new Cesium.CallbackProperty(() => {
                                const time = performance.now() * 0.005;
                                const alpha = 0.5 + Math.sin(time) * 0.5;
                                return new Cesium.Color(0, 0.949, 1, alpha);
                            }, false),
                            disableDepthTestDistance: 0
                        },
                        label: {
                            text: h.name, font: '10px monospace',
                            fillColor: Cesium.Color.CYAN, outlineColor: Cesium.Color.BLACK, outlineWidth: 2,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE, pixelOffset: new Cesium.Cartesian2(0, 25)
                        }
                    });
                    entity._isSurveillance = true;
                    entity._dataType = 'hotspot';
                    entity._data = h;
                    entitiesRef.current.surveillance.set(id, entity);
                }
                entity.show = layersRef.current.surveillance;
            });

            // Render Webcams
            webcams.forEach(w => {
                const lat = parseFloat(w.lat);
                const lng = parseFloat(w.lng);
                if (isNaN(lat) || isNaN(lng)) return;

                const id = `WEBCAM_${w.id}`;
                currentIds.add(id);
                let entity = entitiesRef.current.surveillance.get(id);
                if (!entity) {
                    const pos = Cesium.Cartesian3.fromDegrees(lng, lat);
                    if (!pos) return;

                    const color = w.category === 'MARITIME' ? '#00ffa2' : (w.category === 'LANDMARK' ? '#ffaa00' : '#00a2ff');
                    entity = vReady.entities.add({
                        id,
                        position: pos,
                        billboard: {
                            image: getWebcamIcon(color),
                            width: 24, height: 24,
                            disableDepthTestDistance: 0
                        },
                        label: {
                            text: `[${w.category}] ${w.name}`, font: '8px monospace',
                            fillColor: Cesium.Color.fromCssColorString(color), pixelOffset: new Cesium.Cartesian2(0, 20),
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000000)
                        }
                    });
                    entity._isSurveillance = true;
                    entity._dataType = 'webcam';
                    entity._data = w;
                    entitiesRef.current.surveillance.set(id, entity);
                }
                entity.show = layersRef.current.surveillance;
            });

            entitiesRef.current.surveillance.forEach((entity, id) => {
                if (!currentIds.has(id)) {
                    vReady.entities.remove(entity);
                    entitiesRef.current.surveillance.delete(id);
                }
            });
        } catch (error) { console.error("GOD'S EYE: Surveillance Fetch Failed", error); }
    };

    const fetchAndRenderUnderseaCables = async () => {
        const viewer = getViewer();
        if (!viewer) return;
        try {
            const response = await fetch(`${API_BASE}/api/infra/undersea-cables`);
            const geojson = await response.json();
            
            if (geojson.features && geojson.features.length > 0 && onSignalReceived) onSignalReceived();

            const ds = dataSourcesRef.current.infraCables;
            if (!ds) return;

            ds.entities.removeAll();

            const dataSource = await Cesium.GeoJsonDataSource.load(geojson, {
                stroke: Cesium.Color.fromCssColorString('#00ffff').withAlpha(0.6),
                strokeWidth: 2.0,
                clampToGround: false // Cables run on ocean floor
            });

            // Make the cables glow/pulse
            const entities = dataSource.entities.values;
            for (let i = 0; i < entities.length; i++) {
                const entity = entities[i];
                if (entity.polyline) {
                    entity.polyline.width = new Cesium.CallbackProperty(() => {
                        return 1.2 + 0.8 * Math.abs(Math.sin(Date.now() / 3000));
                    }, false);
                    entity.polyline.material = new Cesium.ColorMaterialProperty(
                        Cesium.Color.fromCssColorString('#00ffff').withAlpha(0.6)
                    );
                }
                
                // Keep the names for tooltips
                if (entity.properties && entity.properties.name) {
                    entity.description = `<b>Type:</b> Undersea Data Cable<br/><b>Name:</b> ${entity.properties.name.getValue()}`;
                }
            }

            // Transfer entities to our specific CustomDataSource to manage visibility properly
            for (let i = 0; i < entities.length; i++) {
                ds.entities.add(entities[i]);
            }
        } catch (e) { console.error("Undersea Cables fetch error:", e); }
    };

    const fetchAndRenderDataCenters = async () => {
        const viewer = getViewer();
        if (!viewer) return;
        try {
            const response = await fetch(`${API_BASE}/api/infra/datacenters`);
            const data = await response.json();
            
            const ds = dataSourcesRef.current.infraDatacenters;
            if (!ds) return;

            ds.entities.removeAll();

            if (!data.nodes) return;

            data.nodes.forEach(node => {
                const isIXP = node.tier === 0;
                const colorStr = isIXP ? '#00ff00' : '#00ffff'; 
                
                // We'll use custom SVG strings for the 3D markers instead of simple points
                const ixpSvg = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ff00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>')}`;
                const cloudSvg = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>')}`;

                ds.entities.add({
                    name: `Data Node: ${node.name}`,
                    position: Cesium.Cartesian3.fromDegrees(node.lon, node.lat),
                    billboard: {
                        image: isIXP ? ixpSvg : cloudSvg,
                        scale: isIXP ? 0.6 : 0.5,
                        color: Cesium.Color.WHITE,
                        disableDepthTestDistance: 0
                    },
                    label: {
                        text: node.name,
                        font: '10px monospace',
                        fillColor: Cesium.Color.fromCssColorString(colorStr),
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        outlineColor: Cesium.Color.BLACK,
                        pixelOffset: new Cesium.Cartesian2(0, 20),
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 8000000)
                    },
                    description: `<b>Provider:</b> ${node.provider}<br/><b>Name:</b> ${node.name}<br/><b>Tier:</b> ${node.tier}<br/><b>Type:</b> ${isIXP ? 'Internet Exchange Point' : 'Cloud Hyperscale'}<br/><b>Status:</b> CRITICAL INFRASTRUCTURE`
                });
            });
        } catch (e) { console.error("Data Centers fetch error:", e); }
    };

    const fetchAndRenderAirspace = async () => {
        const v = viewerRef.current || window.cesiumViewer;
        if (!v) return;
        const ds = dataSourcesRef.current.airspaceZones;
        if (!ds) return;

        try {
            // 1. Conflict Zones (Polygons)
            const czRes = await fetch(`${API_BASE}/api/airspace/conflict-zones`);
            const czData = await czRes.json();
            
            // 2. NOTAMs (Points/Areas)
            const notamRes = await fetch(`${API_BASE}/api/airspace/notams`);
            const notamData = await notamRes.json();

            ds.entities.removeAll();

            // Render Conflict Zones
            if (czData.zones) {
                czData.zones.forEach(zone => {
                    const coords = zone.geometry.coordinates[0]; // [ [lon, lat], ... ]
                    const flattened = coords.flat(); // [lon, lat, lon, lat, ...]
                    
                    let color = Cesium.Color.RED.withAlpha(0.3);
                    if (zone.severity === 'HIGH') color = Cesium.Color.ORANGE.withAlpha(0.25);
                    if (zone.severity === 'MEDIUM') color = Cesium.Color.YELLOW.withAlpha(0.15);

                    ds.entities.add({
                        name: zone.name,
                        polygon: {
                            hierarchy: Cesium.Cartesian3.fromDegreesArray(flattened),
                            extrudedHeight: 30000, // Force 30,000m height for visual impact (approx 100k ft)
                            height: zone.lower_alt_ft * 0.3048,
                            material: color.withAlpha(0.35), // Increased opacity
                            outline: true,
                            outlineColor: color.withAlpha(1.0),
                            outlineWidth: 3
                        },
                        description: `<b>STATUS:</b> CRITICAL AIRSPACE<br/><b>NAME:</b> ${zone.name}<br/><b>TYPE:</b> ${zone.type}<br/><b>SINCE:</b> ${zone.active_since}`
                    });
                });
            }

            // Render NOTAMs (Caution Markers)
            if (notamData.notams) {
                notamData.notams.forEach(notam => {
                    // Try to find a lat/lon from the location code (static/mock since we don't have a geocoder)
                    // If the notam has a location code we know (KDCA, EGLL), show it.
                    const locations = {
                        'KDCA': { lat: 38.8512, lon: -77.0402 },
                        'EGLL': { lat: 51.4700, lon: -0.4543 },
                        'UUEE': { lat: 55.9726, lon: 37.4146 },
                        'ZBAA': { lat: 40.0799, lon: 116.6031 }
                    };
                    
                    const loc = locations[notam.location];
                    if (loc) {
                        ds.entities.add({
                            name: `NOTAM: ${notam.id}`,
                            position: Cesium.Cartesian3.fromDegrees(loc.lon, loc.lat),
                            point: { pixelSize: 8, color: Cesium.Color.YELLOW, outlineColor: Cesium.Color.BLACK, outlineWidth: 2 },
                            label: {
                                text: `CAUTION: ${notam.id}`,
                                font: '10px Share Tech Mono, monospace',
                                fillColor: Cesium.Color.YELLOW,
                                outlineColor: Cesium.Color.BLACK,
                                outlineWidth: 2,
                                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                pixelOffset: new Cesium.Cartesian2(0, -15),
                                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000000)
                            },
                            description: `<b>ID:</b> ${notam.id}<br/><b>TYPE:</b> ${notam.type}<br/><b>SEVERITY:</b> ${notam.severity}<br/><b>TEXT:</b> ${notam.text}`
                        });
                    }
                });
            }

        } catch (e) { console.error("Airspace fetch error:", e); }
    };

    useEffect(() => {
        const v = getViewer();
        if (!v) return;
        entitiesRef.current.flights.forEach(e => e.show = !!layers.flights);
        entitiesRef.current.ships.forEach(e => e.show = !!layers.ships);
        entitiesRef.current.satellites.forEach(e => e.show = !!layers.satellites);
        entitiesRef.current.jamming.forEach(e => e.show = !!layers.jamming);
        entitiesRef.current.events.forEach(e => e.show = !!(layers.events || layers.news));
        entitiesRef.current.surveillance.forEach(e => e.show = !!layers.surveillance);
    }, [layers]);

    return (
        <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center">
            <div 
                ref={cesiumContainer} 
                className="w-full h-full"
                style={{ 
                    filter: cssFilter || 'none',
                    transition: 'filter 0.3s ease'
                }}
            />
            <div ref={creditRef} style={{ display: 'none' }} />
            {hudState.isOpen && (
                <SurveillanceHUD 
                    selectedHotspot={hudState.selectedHotspot}
                    selectedCam={hudState.selectedCam}
                    onClose={() => setHudState({ ...hudState, isOpen: false })}
                />
            )}
        </div>
    );
};

export default Globe;

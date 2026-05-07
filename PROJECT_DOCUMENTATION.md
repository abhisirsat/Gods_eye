# 🌍 Project: God's Eye — GEOINT Intelligence System

## 1. Project Overview
**God's Eye** is a state-of-the-art 4D Geospatial Intelligence (GEOINT) platform designed for real-time situational awareness. It aggregates global open-source intelligence (OSINT) to monitor flights, ships, satellites, and conflict zones through a high-performance 3D interface.

---

## 2. What We Have Done So Far
- **Full-Stack Architecture**: Built a robust system using **FastAPI** (Backend) and **React/CesiumJS** (Frontend).
- **Core Visualization**: Implemented a global 3D viewer capable of rendering thousands of tactical assets simultaneously.
- **Data Pipeline**: Developed concurrent fetch logic to bridge multiple global data providers into a unified API.
- **Tactical UI/UX**: Created a "Military-Grade" HUD (Heads-Up Display) with a Cyber-Cyan aesthetic, focusing on data density and operational clarity.
- **Network Accessibility**: Configured the system to be accessible across local networks, allowing the dashboard to be viewed on mobile devices via a local IP.
- **Surveillance Integration**: Integrated live ground-level reconnaissance via YouTube OSINT streams with tactical HUD overlays.

---

## 3. Features & Modules
### 🛰️ Global Asset Tracking
- **Aerial Surveillance**: Real-time tracking of 1,500+ aircraft globally.
- **Orbital Monitoring**: Live satellite positions including KH-11 reconnaissance and communication constellations.
- **Maritime Intel**: Tracking of vessels in critical corridors like the Red Sea and Strait of Malacca.

### 📡 Intelligence Layers
- **Conflict Monitoring**: Real-time conflict signals and intelligence spikes (e.g., GPS Jamming).
- **Global News Feed**: Automated collection of high-severity global events.
- **Tactical Timeline**: A specialized controller to toggle data layers (Weather, Fire, Jamming, etc.).

### 📹 Surveillance HUD
- **Ground Recon**: Live CCTV feeds from global strategic locations (Tokyo, NYC, Kyiv, Venice).
- **Visual Filters**: Integrated "Tactical Overlay" filters for surveillance feeds to enhance readability.
- **Hotspot Detection**: Automated highlighting of global "Severity: Critical" regions.

---

## 4. Operational Status (What is Working)
| Feature | Status | Source |
| :--- | :--- | :--- |
| **3D Globe Rendering** | ✅ OPERATIONAL | CesiumJS / WebGL |
| **Global Flight Data** | ✅ OPERATIONAL | OpenSky + ADSB.lol |
| **Satellite Tracking** | ✅ OPERATIONAL | N2YO API |
| **Live CCTV Streams** | ✅ OPERATIONAL | YouTube OSINT |
| **Conflict Markers** | ✅ OPERATIONAL | GDELT / Internal DB |
| **Local Network Access** | ✅ OPERATIONAL | Vite 0.0.0.0 Config |
| **Tactical HUDs** | ✅ OPERATIONAL | React Components |
| **Database Sync** | ✅ OPERATIONAL | SQLAlchemy / SQLite |

---

## 5. Data Services & Integrations
The system utilizes a distributed "Data Bridge" to ensure high uptime and accuracy:

- **OpenSky Network**: Primary source for global flight state vectors (ID, Velocity, Altitude).
- **ADSB.lol**: Used for high-fidelity regional flight data in major global hubs (NYC, London, Dubai).
- **N2YO.com**: Provides real-time TLE (Two-Line Element) data for active satellite tracking.
- **GDELT Project**: Scanned for real-time conflict and geopolitical instability markers.
- **GPSJam.org**: Sourced to display global electronic warfare (GPS Interference) zones.
- **YouTube Live API**: Leveraged for ground-level persistent surveillance of urban and maritime centers.

---

## 🛠️ Technical Execution
To run the project in its current optimized state:
1. **Backend**: `python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000`
2. **Frontend**: `npm run dev` (Accessible at `http://[YOUR_IP]:5173`)
3. **Intelligence Agents**: `python agents/agent_manager.py`

<div align="center">
  <img src="https://raw.githubusercontent.com/abhisirsat/Gods_eye/main/frontend/public/vite.svg" alt="God's Eye Logo" width="100"/>
  <h1>👁️ GOD'S EYE</h1>
  <h3>4D Geospatial Intelligence (GEOINT) Platform</h3>

  <p align="center">
    A state-of-the-art global monitoring dashboard for real-time situational awareness, aggregating open-source intelligence (OSINT) across aerial, orbital, maritime, and electronic warfare domains.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/CesiumJS-8FBC8F?style=for-the-badge&logo=cesium&logoColor=white" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  </p>
</div>

---

## 🚀 Features

God's Eye bridges multiple global data providers into a unified API, rendering thousands of tactical assets simultaneously on a high-performance 3D globe with a military-grade "Cyber-Cyan" HUD.

- 🛰️ **Global Asset Tracking**: Live monitoring of 1,500+ commercial and military aircraft, maritime vessels in critical corridors, and key satellites (including ISR and communications).
- ⚡ **Electronic Warfare (EW) & Signal Intelligence**: Global GPS jamming zones, spoofing detection, and static SIGINT node mapping.
- 📡 **Critical Infrastructure**: Visualization of the physical internet (undersea cables, data centers, IXPs) and real-time outage alerts.
- 🚫 **Operational Airspace**: 3D rendering of conflict zones, restricted airspace, and active NOTAMs.
- 💻 **Cyber Attack Monitoring**: Real-time visualization of DDoS and global cyber threat origin-destination vectors.
- 📹 **Surveillance HUD**: Ground-level reconnaissance via live CCTV streams (YouTube OSINT) integrated with tactical visual filters (NVIS, FLIR, CRT).
- 🧠 **AI Signal Analysis**: Integrated Google Gemini 1.5 Flash for automated intelligence briefings and threat assessment.

---

## 🛠️ Tech Stack

- **Frontend**: React, CesiumJS (WebGL 3D Globe), Tailwind CSS, Vite
- **Backend**: FastAPI (Python), SQLAlchemy, SQLite, HTTPX
- **AI Brain**: Google Gemini 1.5 Flash
- **Data Pipelines**: OpenSky Network (Flights), N2YO (Satellites), GDELT (Events), GPSJam (EW), OONI (Infra outages), FAA (NOTAMs)

---

## ⚙️ Quick Start

### 1. Prerequisites
- Node.js (LTS)
- Python 3.10+
- Cesium Ion Token (Free from Cesium)
- Gemini API Key (Free from Google AI Studio)

### 2. Environment Setup
Clone the repository and configure your environment:
```bash
git clone https://github.com/abhisirsat/Gods_eye.git
cd Gods_eye
cp .env.example .env
```
*Add your API keys to the `.env` file.*

### 3. Run the Backend (Data Engine)
```bash
pip install -r backend/requirements.txt
cd backend
python main.py
```
*API runs on `http://localhost:8000`*

### 4. Run the AI Intelligence Agents
```bash
# In a new terminal from the root folder
cd agents
python agent_manager.py
```

### 5. Run the Tactical Frontend
```bash
# In a new terminal from the root folder
cd frontend
npm install
npm run dev
```
*Dashboard accessible at `http://localhost:5173`*

---

## 🔒 Security & Data Note
All data is sourced from public OSINT feeds. Ensure your `.env` file containing API keys is never committed to version control. The system utilizes local network configuration for cross-device remote viewing during operations.

---

<div align="center">
  <i>"Omniscience through open source intelligence."</i>
</div>

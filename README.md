# 🌍 GOD'S EYE — GEOSPATIAL INTELLIGENCE PLATFORM

God's Eye is a 4D Geospatial Intelligence dashboard for real-time monitoring of global events, flights, ships, and satellites, driven by AI signal analysis.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (LTS)
- Python 3.10+
- Cesium Ion Token (Free)
- Gemini API Key (Free)

### 2. Setup
1. Clone the repository.
2. Create a `.env` file in the root using `.env.example`.
3. Fill in your API keys.

### 3. Run Backend (From root or backend folder)
```bash
# From F:\Project Gods Eye
pip install -r backend/requirements.txt
cd backend
python main.py
```

### 4. Run AI Agents (From root or agents folder)
```bash
# From F:\Project Gods Eye
cd agents
python agent_manager.py
```

### 5. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Tech Stack
- **Frontend**: React, CesiumJS, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI, SQLAlchemy, SQLite, HTTPX.
- **AI**: Google Gemini 1.5 Flash.
- **Data**: OpenSky (Flights), N2YO (Satellites), GDELT (Events), GPSJam (Jamming).

## 🔒 Security
All data is sourced from public OSINT feeds. Ensure your `.env` file is never committed to version control.

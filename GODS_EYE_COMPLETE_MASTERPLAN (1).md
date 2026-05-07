# 🌍 GOD'S EYE — COMPLETE BUILD MASTERPLAN
### Based on Bilawal Sidhu's Actual WorldView Project
### AI Codes Everything | You Just Setup & Direct | Total Cost: $0

---

## 📺 WHAT YOU'RE BUILDING (Exact Clone)

A **4D Geospatial Intelligence Platform** that shows:

| Feature | What It Looks Like |
|---|---|
| 🌐 3D Photorealistic Globe | Spinning Earth with real satellite imagery |
| ✈️ Live Flight Tracking | Planes moving in real-time on the globe |
| 🚢 Ship Movements | Naval/cargo ships across all oceans |
| 🛰️ Satellite Passes | When spy satellites pass over a location |
| 📡 GPS Jamming Zones | Glowing red zones of signal interference |
| 🚫 Restricted Airspace | No-fly zones rendered in 3D |
| ⏱️ Time Slider (4D) | Scrub back/forward through events in time |
| 🤖 AI Agents (SIGINT) | Auto-collect OSINT data before it disappears |
| 🔴 Live Event Alerts | Breaking signals trigger visual alerts on globe |

---

## 🔄 PAID → FREE REPLACEMENTS

| Bilawal Used (Paid) | Your Free Alternative | Quality |
|---|---|---|
| Claude 3.5 Sonnet API (paid) | **Google Gemini 1.5 Flash API** (free) | ✅ Same quality |
| Gemini 1.5 Pro API (paid tier) | **Gemini 1.5 Flash free tier** | ✅ Works perfectly |
| Cursor IDE ($20/mo) | **VS Code + Cline extension** (free) | ✅ Same AI coding |
| Windsurf IDE (paid) | **VS Code + Continue.dev** (free) | ✅ Works great |
| Google 3D Tiles API (paid) | **CesiumJS default terrain** (free) | ⚠️ Less photo-real |
| Spire Maritime (paid) | **MarineTraffic free tier + VesselFinder** | ✅ Good enough |
| Bolt.new (paid after limit) | **Vercel free hosting + GitHub** | ✅ Better actually |

---

## 🖥️ YOUR FINAL TECH STACK (ALL FREE)

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (What You See)            │
│   CesiumJS  ←  The 3D globe engine (free, open src) │
│   React.js  ←  UI panels, controls (free)           │
│   Tailwind  ←  Dark terminal styling (free)         │
└────────────────────┬────────────────────────────────┘
                     │ talks to
┌────────────────────▼────────────────────────────────┐
│                 BACKEND (The Brain)                  │
│   FastAPI (Python)  ←  Main server (free)           │
│   Python Agents     ←  OSINT scrapers (free)        │
│   SQLite Database   ←  Stores time-stamped data     │
└────────────────────┬────────────────────────────────┘
                     │ fetches from
┌────────────────────▼────────────────────────────────┐
│               DATA SOURCES (All Free)                │
│   OpenSky Network   ←  Live flights                 │
│   GDELT Project     ←  OSINT signals                │
│   USGS              ←  Disasters/events             │
│   VesselFinder API  ←  Ships                        │
│   N2YO API          ←  Satellites                   │
│   GPSJam.org        ←  GPS jamming data             │
└─────────────────────────────────────────────────────┘
                     │ AI brain
┌────────────────────▼────────────────────────────────┐
│              AI LAYER (Gemini Free)                  │
│   Gemini 1.5 Flash  ←  Analysis (1M tokens/day)    │
│   Ollama local      ←  Offline backup               │
└─────────────────────────────────────────────────────┘
```

---

# ══════════════════════════════════
# PHASE 0 — ONE-TIME SETUP
# (Do this before anything else)
# ══════════════════════════════════

## 🔧 STEP 1: Install These 4 Programs

Go to each website, download, and install. Nothing complex.

### A) Node.js
- Website: **nodejs.org**
- Click: "LTS" (the green button)
- Install normally (keep clicking Next)
- **Test it worked:** Open a terminal, type `node --version` → should show a number

### B) Python
- Website: **python.org/downloads**
- Download Python 3.11 or newer
- ⚠️ IMPORTANT: During install, CHECK THE BOX that says **"Add Python to PATH"**
- **Test it worked:** Open terminal, type `python --version`

### C) Git
- Website: **git-scm.com**
- Download for your OS, install with all defaults
- **Test it worked:** Open terminal, type `git --version`

### D) VS Code (Your AI Coding Assistant)
- Website: **code.visualstudio.com**
- Download and install

### E) Install Cline in VS Code (This is YOUR free Cursor replacement)
1. Open VS Code
2. Click the Extensions icon (left sidebar, looks like 4 squares)
3. Search: **"Cline"**
4. Click Install
5. After install, click Cline icon → it will ask for an AI API key

---

## 🔑 STEP 2: Get Your Free API Keys

Do each of these. Takes 5 minutes each.

### 1. Google Gemini API Key (THE MAIN AI BRAIN)
1. Go to: **aistudio.google.com**
2. Sign in with Google account
3. Click **"Get API Key"** → **"Create API Key"**
4. Copy it and save in a text file (looks like: `AIzaSyXXXXXXXXXX`)
5. **Limit:** 1 million tokens per day — more than enough

### 2. OpenSky Network (Live Flights)
1. Go to: **opensky-network.org**
2. Click Register → make free account
3. No key needed — your username/password IS the auth
4. Save your username and password

### 3. N2YO Satellite Tracking
1. Go to: **n2yo.com/api/**
2. Click "Register for API Key"
3. Free account → get API key
4. **Limit:** 1000 requests/day free

### 4. NewsAPI (Breaking News)
1. Go to: **newsapi.org**
2. Click "Get API Key"
3. Make free account
4. Copy key
5. **Limit:** 100 requests/day free

### 5. Cesium Ion (For Better 3D Terrain)
1. Go to: **ion.cesium.com**
2. Create free account
3. Go to: Access Tokens → Create Token
4. Copy the token
5. **Limit:** Free tier is very generous for personal projects

### 6. No Key Needed (Just Use Directly):
- GDELT Project API ✅
- USGS Earthquake API ✅
- GPSJam.org data ✅
- VesselFinder basic ✅

---

## 📁 STEP 3: Create Your Project Folder

Open your terminal and run these commands one by one:

```bash
mkdir gods-eye
cd gods-eye
mkdir frontend backend agents database
```

That's it. You now have your project structure.

---

## 🤖 STEP 4: Set Up Cline with Gemini (Free AI Coder)

1. Open VS Code
2. Open your `gods-eye` folder: File → Open Folder
3. Click the Cline icon in sidebar
4. Click Settings (gear icon)
5. API Provider: Select **"Google Gemini"**
6. Paste your Gemini API key
7. Model: Select **"gemini-1.5-flash"**
8. Click Save

**Cline is now your AI programmer. It reads your entire project and writes code for you.**

---

## 🐙 STEP 5: Create GitHub Repo (For Free Hosting Later)

1. Go to **github.com** → Sign up free
2. Click **"New Repository"**
3. Name: `gods-eye`
4. Make it **Private** (so your API keys are safe)
5. Click Create

In your terminal (inside gods-eye folder):
```bash
git init
git remote add origin https://github.com/YOURUSERNAME/gods-eye.git
```

---

# ══════════════════════════════════
# PHASE 1 — BUILD THE 3D GLOBE
# (Day 1-2)
# ══════════════════════════════════

## What Gets Built
A photorealistic 3D Earth that spins, zooms, and can display data layers.

## Your Job
1. Open VS Code with your `gods-eye` folder
2. Open Cline (the AI assistant panel)
3. Copy-paste the prompt below into Cline

## 📋 PROMPT FOR CLINE (Copy This Exactly):

```
I am building a "God's Eye" real-time intelligence dashboard similar to Bilawal Sidhu's WorldView project. I am a complete beginner. The AI will write all the code.

TASK: Build the React frontend with CesiumJS 3D globe.

Create these files:
- frontend/package.json (with cesium, react, tailwind dependencies)
- frontend/index.html
- frontend/src/App.jsx (main component)
- frontend/src/components/Globe.jsx (CesiumJS globe)
- frontend/src/components/Sidebar.jsx (right panel for events)
- frontend/src/components/Header.jsx (top bar with clock)
- frontend/vite.config.js

Requirements:
1. CesiumJS globe with Cesium World Terrain (free)
2. My Cesium Ion token is: [PASTE YOUR TOKEN HERE]
3. Dark terminal aesthetic: pure black, cyan glow, monospace font "Share Tech Mono"
4. Globe auto-rotates slowly when idle
5. Header shows: "GODS EYE INTELLIGENCE SYSTEM" + live UTC clock + "CLASSIFICATION: TOP SECRET" blinking red
6. Right sidebar panel (dark, glowing border) showing placeholder "INTEL FEED"
7. Bottom-left panel for "AI ANALYSIS" (placeholder for now)
8. Full screen layout, no scrollbars
9. Add a scanline overlay CSS effect for CRT monitor look
10. Boot sequence: on load, show green terminal text scrolling for 3 seconds, then reveal globe

Make it production quality. Add comments explaining every section.
Write ALL files completely — no placeholders or "add your code here".
```

## After Cline Writes the Code:

Open terminal in VS Code, run:
```bash
cd frontend
npm install
npm run dev
```

Open browser at `http://localhost:5173` — you should see the globe.

---

# ══════════════════════════════════
# PHASE 2 — PYTHON BACKEND (The Brain)
# (Day 2-3)
# ══════════════════════════════════

## What Gets Built
A FastAPI server that fetches real data and serves it to your globe.

## 📋 PROMPT FOR CLINE:

```
Now build the Python FastAPI backend for my God's Eye project.

Create these files in the /backend folder:
- backend/requirements.txt
- backend/main.py (FastAPI server)
- backend/routers/flights.py
- backend/routers/ships.py
- backend/routers/satellites.py
- backend/routers/news.py
- backend/database/db.py (SQLite setup)
- backend/.env.example (template for API keys)

Requirements:

1. FastAPI server running on port 8000
2. CORS enabled so frontend can connect
3. SQLite database to store time-stamped events

FLIGHTS ENDPOINT (/api/flights):
- Fetch from OpenSky Network: https://opensky-network.org/api/states/all
- Return: callsign, latitude, longitude, altitude, velocity, country, heading
- Cache for 15 seconds to avoid rate limits
- Username: [YOUR OPENSKY USERNAME]
- Password: [YOUR OPENSKY PASSWORD]

SHIPS ENDPOINT (/api/ships):
- Fetch from VesselFinder free API or simulate realistic global ship data
- Return: vessel name, type, lat, lng, speed, country flag

SATELLITES ENDPOINT (/api/satellites):
- Use N2YO API key: [YOUR N2YO KEY]
- Track these by NORAD IDs: ISS (25544), Starlink cluster, known spy satellites
- Return: name, lat, lng, altitude, country

NEWS/EVENTS ENDPOINT (/api/events):
- Fetch from GDELT: https://api.gdeltproject.org/api/v2/doc/doc?query=military+conflict+attack+strike&mode=artlist&maxrecords=50&format=json
- Parse and return: title, lat, lng, country, severity, timestamp

GPS JAMMING ENDPOINT (/api/jamming):
- Fetch from GPSJam: https://gpsjam.org/api/
- Or simulate realistic jamming zones near Ukraine, Middle East, China Sea
- Return: center_lat, center_lng, radius_km, intensity

Include error handling for all endpoints.
Write ALL code completely — no placeholders.
```

## After Cline Writes It:

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend is now running at `http://localhost:8000`

---

# ══════════════════════════════════
# PHASE 3 — CONNECT DATA TO GLOBE
# (Day 3-4)
# ══════════════════════════════════

## What Gets Built
Real data from your backend actually appears on the 3D globe.

## 📋 PROMPT FOR CLINE:

```
Connect the backend data to the CesiumJS globe in my God's Eye project.

Update frontend/src/components/Globe.jsx to:

1. FLIGHTS LAYER:
   - Fetch /api/flights every 15 seconds
   - Show each plane as a 3D airplane model (use CesiumJS CZML or Entity API)
   - Commercial flights = white, military callsigns = red
   - Plane rotates to match heading direction
   - On click: popup showing callsign, altitude, speed, origin country
   - Show "TRACKING [X] AIRCRAFT" badge in header

2. SHIPS LAYER:
   - Fetch /api/ships every 60 seconds
   - Show ships as boat icons
   - Military ships = red, cargo = blue, tanker = yellow
   - On click: vessel name, type, speed, destination

3. SATELLITES LAYER:
   - Fetch /api/satellites every 30 seconds
   - Show as glowing orbital dots with orbital path arc
   - ISS = special icon
   - On click: satellite name, altitude, country, next pass over user location

4. GPS JAMMING LAYER:
   - Fetch /api/jamming
   - Show as pulsing red semi-transparent circles on globe surface
   - Intensity determines opacity and size

5. EVENTS/NEWS LAYER:
   - Fetch /api/events every 2 minutes
   - Show as pulsing yellow rings at event location
   - On click: show event title and description
   - New events trigger a brief flash animation

6. LAYER TOGGLE CONTROLS:
   Add toggle buttons: [FLIGHTS] [SHIPS] [SATELLITES] [JAMMING] [EVENTS]
   Each button turns that layer on/off

Also update the Sidebar.jsx to show a scrolling live feed of events.

Write ALL code completely.
```

---

# ══════════════════════════════════
# PHASE 4 — THE AI AGENTS (SIGINT)
# (Day 4-5)
# ══════════════════════════════════

## What Gets Built
Automated Python agents that monitor OSINT sources and collect signals.
This is the "swarm" Bilawal talked about.

## 📋 PROMPT FOR CLINE:

```
Build the AI Agent system for my God's Eye project. These are Python scripts that run continuously and collect intelligence.

Create in /agents folder:

1. agents/agent_manager.py - Orchestrates all agents
2. agents/flight_anomaly_agent.py - Detects unusual flight behavior
3. agents/news_scanner_agent.py - Monitors multiple news sources
4. agents/osint_agent.py - Collects from Reddit, Telegram public channels, Twitter/X (free scrape)
5. agents/signal_processor.py - Processes signals and assigns severity

FLIGHT ANOMALY AGENT:
- Every 30 seconds, check all flights
- Detect: sudden altitude changes, military transponders active, unusual routes, squawk 7500/7600/7700 (emergency codes)
- When detected: store in database with timestamp and location

NEWS SCANNER AGENT:
- Every 2 minutes, scan these sources:
  * GDELT API
  * NewsAPI for: "missile", "strike", "conflict", "airspace", "warship"
  * Reuters RSS feed (free)
  * Al Jazeera RSS feed (free)
- Extract location using keyword matching (e.g. "Gaza" → lat/lng)
- Assign severity: CRITICAL/HIGH/MEDIUM/LOW
- Store in database

OSINT AGENT:
- Scan Reddit r/worldnews, r/geopolitics every 5 minutes (Reddit API free)
- Look for posts with keywords: explosion, strike, military, airspace, conflict
- Store with timestamp

SIGNAL PROCESSOR:
- Every 60 seconds, take all new signals
- Send to Gemini API for analysis:
  "You are a military intelligence analyst. Analyze these signals and identify any patterns, escalations, or notable events. Be brief and factual."
- Store AI analysis in database
- Set Gemini API key from environment variable: GEMINI_API_KEY

All agents should:
- Run as background asyncio tasks
- Log to console with timestamps
- Handle errors gracefully and retry

Gemini API key will be in .env file: GEMINI_API_KEY=[key]

Write ALL code completely.
```

## How to Run Agents:
```bash
cd agents
python agent_manager.py
```

---

# ══════════════════════════════════
# PHASE 5 — 4D TIME SLIDER
# (Day 5)
# ══════════════════════════════════

## What Gets Built
The timeline slider at the bottom — scrub through past events like Bilawal showed.

## 📋 PROMPT FOR CLINE:

```
Add the 4D temporal (time) playback system to my God's Eye project.

This is one of the key features — a timeline slider at the bottom of the screen that lets you scrub back through history to replay events.

1. Create frontend/src/components/TimelineSlider.jsx:
   - A cinematic timeline bar at the very bottom of the screen
   - Shows last 24 hours by default
   - Play/Pause button
   - Speed control: 1x, 5x, 30x, 60x
   - Current time display in large digital clock format
   - Scrub handle the user can drag

2. Add to backend/routers/history.py:
   - /api/history?start=[timestamp]&end=[timestamp]
   - Returns all events/flights/signals stored in the database for that time range

3. Update Globe.jsx:
   - When timeline is in "playback mode", show only data from that timestamp
   - Flights animate along their path as time plays
   - Events appear/disappear based on their timestamp
   - Visual indicator: "⏸ REPLAY MODE" badge shown when not live

4. The globe should smoothly transition between states

Make the slider look like a high-end video editor timeline — dark, precise, professional.
Write ALL code completely.
```

---

# ══════════════════════════════════
# PHASE 6 — AI ANALYSIS PANEL
# (Day 6)
# ══════════════════════════════════

## What Gets Built
The AI panel that explains what's happening, like Bilawal's briefing system.

## 📋 PROMPT FOR CLINE:

```
Build the AI Intelligence Briefing panel for my God's Eye project using Gemini 1.5 Flash (free API).

GEMINI API KEY: Read from environment variable GEMINI_API_KEY

1. Create frontend/src/components/AIBriefing.jsx:
   - Bottom-left panel titled "🤖 SIGNAL INTELLIGENCE BRIEF"
   - Shows latest AI analysis from the database
   - Typewriter animation when new text appears
   - Updates every 3 minutes automatically
   - "GENERATING ANALYSIS..." loading state with pulsing dots
   - "ANALYZE NOW" button for manual trigger

2. Add backend/routers/ai_analysis.py:
   - /api/analysis/latest - Returns latest AI briefing from DB
   - /api/analysis/trigger - Manually triggers new analysis
   - POST /api/analysis/ask - Ask the AI a specific question about current events
   
3. The AI prompt sent to Gemini:
   "You are ARES, an AI military intelligence system. Based on the following real-time signals, provide a 3-bullet tactical briefing. Be analytical, concise, and professional. Never speculate beyond the data.
   
   ACTIVE SIGNALS: [list of current events]
   FLIGHT ANOMALIES: [list]
   HIGH SEVERITY NEWS: [list]
   
   Provide: 1) Situation Overview 2) Key Developments 3) Areas to Monitor"

4. Add a text input box: "Ask ARES a question about current events"
   - User types question
   - Gemini responds with context of current live data
   - Response appears in terminal style

Style: Glowing green text on black, like a real terminal.
Write ALL code completely.
```

---

# ══════════════════════════════════
# PHASE 7 — RESTRICTED AIRSPACE & 
# MILITARY ZONES
# (Day 6-7)
# ══════════════════════════════════

## 📋 PROMPT FOR CLINE:

```
Add restricted airspace and military zone visualization to God's Eye.

1. Create agents/airspace_agent.py:
   - Fetch NOTAMs (Notice to Airmen) from: https://www.notams.faa.gov/common/nat.html (free)
   - Or use ADS-B Exchange airspace data
   - Detect sudden airspace closures (these are military signals)
   - Store with coordinates and timestamp

2. Add to Globe.jsx a new AIRSPACE layer:
   - Show active restricted zones as glowing red 3D polygons floating above terrain
   - Animate the border (pulsing glow effect)
   - Size reflects the actual radius of restriction
   - On click: "AIRSPACE RESTRICTED - [REASON] - [TIME ACTIVE]"
   - Recently closed airspaces are more intensely glowing

3. Add CONFLICT ZONES layer:
   - Pull from ACLED Data API (free academic key): https://acleddata.com
   - Or use hardcoded current conflict zones (Ukraine, Gaza, Sudan, etc.)
   - Show as orange heat-haze zones on the globe surface

4. Add a THREAT LEVEL indicator in the header:
   - GREEN: Normal
   - YELLOW: Elevated activity
   - ORANGE: Significant events
   - RED: Critical / Major escalation
   - Updates based on AI agent severity scores

Write ALL code completely.
```

---

# ══════════════════════════════════
# PHASE 8 — FINAL POLISH & DEPLOY
# (Day 7-8)
# ══════════════════════════════════

## 📋 PROMPT FOR CLINE:

```
Final polish and deployment setup for God's Eye.

1. Add these visual effects to the globe:
   - When a new critical event happens: camera auto-pans to location with smooth animation
   - Add a subtle "HUD" (heads-up display) overlay effect in corners
   - Add "SIGNAL RECEIVED" flash animation in top right when new data arrives
   - Night side of Earth shows city lights (use Cesium's natural Earth imagery)

2. Add sound system (Web Audio API - no files needed):
   - Low radar hum ambient loop
   - Alert ping for HIGH severity events
   - Different tones for different event types

3. Performance optimization:
   - Cluster flight markers when zoomed out (too many planes = lag)
   - Lazy load data layers
   - Add fps counter (hidden, only visible in debug mode)

4. Create deployment files:
   - Dockerfile for backend (FastAPI)
   - frontend/.env.production template
   - backend/.env.production template
   - README.md with complete setup instructions
   - docker-compose.yml to run everything with one command

5. Create a .env file system:
   - All API keys stored in .env files
   - Never hardcoded in source files
   - .gitignore includes .env files (so keys aren't on GitHub)

Write ALL deployment files completely.
```

## Deploy to Vercel (Frontend):
```bash
cd frontend
npm run build
# Install Vercel CLI
npm install -g vercel
vercel
# Follow prompts — it auto-deploys
```

## Deploy Backend to Railway.app (Free):
1. Go to **railway.app** → sign up free
2. New Project → Deploy from GitHub
3. Select your repo → select `/backend` folder
4. Add environment variables (your API keys)
5. Railway gives you a free URL for your backend

---

# ══════════════════════════════════
# FULL FOLDER STRUCTURE
# (What it looks like when done)
# ══════════════════════════════════

```
gods-eye/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Globe.jsx          ← 3D CesiumJS Globe
│   │   │   ├── Header.jsx         ← Top bar + clock
│   │   │   ├── Sidebar.jsx        ← Event feed panel
│   │   │   ├── AIBriefing.jsx     ← AI analysis panel
│   │   │   ├── TimelineSlider.jsx ← 4D time control
│   │   │   └── LayerControls.jsx  ← Toggle buttons
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routers/
│   │   ├── flights.py    ← /api/flights
│   │   ├── ships.py      ← /api/ships
│   │   ├── satellites.py ← /api/satellites
│   │   ├── news.py       ← /api/events
│   │   ├── jamming.py    ← /api/jamming
│   │   ├── history.py    ← /api/history
│   │   └── ai_analysis.py ← /api/analysis
│   ├── database/
│   │   └── db.py
│   ├── main.py           ← FastAPI server
│   └── requirements.txt
│
├── agents/
│   ├── agent_manager.py       ← Runs all agents
│   ├── flight_anomaly_agent.py
│   ├── news_scanner_agent.py
│   ├── osint_agent.py
│   ├── airspace_agent.py
│   └── signal_processor.py
│
├── .env                  ← YOUR API KEYS (never share this)
├── .gitignore            ← Hides .env from GitHub
├── docker-compose.yml    ← Run everything at once
└── README.md
```

---

# ══════════════════════════════════
# HOW TO USE CLINE EFFECTIVELY
# (Your AI Coding Workflow)
# ══════════════════════════════════

## The Exact Workflow:

### Step 1: Start every session by saying:
```
I am building a God's Eye intelligence dashboard. 
My project structure is: [paste folder structure]
My tech stack: CesiumJS + React + FastAPI + Python + Gemini AI
I am a beginner. Write complete, working code. Add comments.
```

### Step 2: Give one task at a time
❌ Bad: "Build the whole project"
✅ Good: "Build only the Globe.jsx component with CesiumJS"

### Step 3: When something breaks, paste the error:
```
This code is giving me an error. I am a beginner.
Error: [paste exact error message]
File: [which file]
Code: [paste the code]

Please fix it and explain what was wrong.
```

### Step 4: To improve visuals:
```
The [feature] looks basic. Make it look more like a real intelligence terminal.
Specifically: [describe what you want]
Keep the existing logic, only change the visual design.
```

### Step 5: Save your prompts
Keep a text file of all prompts that worked. 
When you restart, Cline forgets — re-paste context.

---

# ══════════════════════════════════
# TIMELINE
# ══════════════════════════════════

| Day | Phase | What You'll Have |
|-----|-------|-----------------|
| Day 1 | Setup | All tools installed, all API keys ready |
| Day 2 | Phase 1 | Working 3D globe in browser |
| Day 3 | Phase 2-3 | Real flights, ships, satellites on globe |
| Day 4 | Phase 4 | AI agents collecting OSINT data |
| Day 5 | Phase 5 | 4D time slider working |
| Day 6 | Phase 6-7 | AI briefing panel + restricted zones |
| Day 7 | Phase 8 | Sound, polish, ready to deploy |
| Day 8 | Deploy | Live on internet, shareable link |

**Total: ~20 hours of actual work (rest is waiting for AI to code)**

---

# ══════════════════════════════════
# ALL API KEYS CHECKLIST
# ══════════════════════════════════

Save this in your .env file:

```
# AI
GEMINI_API_KEY=your_key_here

# Data
OPENSKY_USERNAME=your_username
OPENSKY_PASSWORD=your_password
N2YO_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
CESIUM_ION_TOKEN=your_token_here

# Optional
REDDIT_CLIENT_ID=your_id
REDDIT_CLIENT_SECRET=your_secret

# Free / No Key Needed
# GDELT — no key
# USGS — no key
# GPSJam — no key
```

---

# ══════════════════════════════════
# IMPORTANT WARNINGS
# ══════════════════════════════════

⚠️ **Legal:** All data sources used are 100% publicly available OSINT.
This is for educational and learning purposes only.

⚠️ **API Keys:** Never post your .env file on GitHub. Your .gitignore handles this.

⚠️ **Free Limits:** 
- Gemini: 1M tokens/day → more than enough
- OpenSky: May throttle during high usage → just wait
- N2YO: 1000 req/day → enough for 1 update per 90 seconds

⚠️ **Real-Time ≠ Instant:** GDELT is 15 min delayed. OpenSky is 5-10 sec delayed. That's normal.

---

*Total Cost: $0.00*
*AI Used: Gemini 1.5 Flash (Free) via Cline in VS Code*
*Based on: Bilawal Sidhu's WorldView / God's Eye architecture*

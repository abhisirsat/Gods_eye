# GOD'S EYE — AI AGENT BUILD INSTRUCTIONS
## READ THIS ENTIRE FILE BEFORE WRITING A SINGLE LINE OF CODE

---

## WHO YOU ARE

You are the AI coding agent building **God's Eye**, a 4D Geospatial Intelligence (GEOINT)
platform. Your operator is the project owner. You write **complete, working code only**.
You never write placeholders. You never write "// add your logic here". You never truncate.
Every function you write must be fully implemented and immediately runnable.

---

## THE PRIME DIRECTIVE

> **Do not break what already works.**

Before adding any new feature, read the relevant existing file first.
Extend it. Do not replace it. Do not restructure it unless explicitly told to.
If a file already has imports, append to them. If a route already exists, add beside it.

---

## PROJECT IDENTITY

| Property | Value |
|----------|-------|
| **Project Name** | God's Eye — GEOINT Intelligence System |
| **Aesthetic** | Military-grade. Cyber-Cyan on Black. Monospace. HUD panels. |
| **Font** | `Share Tech Mono` (already loaded) |
| **Primary Color** | `#00ffff` (Cyber Cyan) |
| **Alert Color** | `#ff0000` (Red) |
| **Warning Color** | `#ff8800` (Orange) |
| **Background** | `#000000` (Pure Black) |
| **Panel Border** | `rgba(0, 255, 255, 0.3)` |
| **Tone** | Every label, button, and tooltip uses military/intel brevity. No casual language. |

---

## CURRENT TECH STACK — DO NOT CHANGE THESE

```
Frontend : React + CesiumJS + Tailwind CSS + Vite
Backend  : FastAPI (Python) + SQLAlchemy + SQLite + HTTPX
AI Brain : Google Gemini 1.5 Flash
Agents   : Python asyncio background tasks
Run CMD  : uvicorn backend.main:app --host 0.0.0.0 --port 8000
Dev CMD  : npm run dev  (port 5173)
Agents   : python agents/agent_manager.py
```

---

## EXISTING FOLDER STRUCTURE — WHAT ALREADY EXISTS

```
gods-eye/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Globe.jsx          ← CesiumJS 3D globe — DO NOT REWRITE
│   │   │   ├── Header.jsx         ← Top HUD bar — DO NOT REWRITE
│   │   │   ├── Sidebar.jsx        ← Intel feed panel — DO NOT REWRITE
│   │   │   ├── AIBriefing.jsx     ← AI analysis — DO NOT REWRITE
│   │   │   ├── TimelineSlider.jsx ← Timeline — DO NOT REWRITE
│   │   │   └── LayerControls.jsx  ← Layer toggles — DO NOT REWRITE
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routers/
│   │   ├── flights.py     ← /api/flights   — OPERATIONAL
│   │   ├── ships.py       ← /api/ships     — OPERATIONAL
│   │   ├── satellites.py  ← /api/satellites — OPERATIONAL
│   │   ├── news.py        ← /api/events    — OPERATIONAL
│   │   ├── jamming.py     ← /api/jamming   — OPERATIONAL
│   │   └── history.py     ← /api/history   — OPERATIONAL
│   ├── database/
│   │   └── db.py          ← SQLAlchemy + SQLite — OPERATIONAL
│   ├── main.py            ← FastAPI entry — DO NOT REWRITE
│   └── requirements.txt
│
├── agents/
│   ├── agent_manager.py
│   ├── flight_anomaly_agent.py
│   ├── news_scanner_agent.py
│   ├── osint_agent.py
│   └── signal_processor.py
│
├── .env                   ← API keys already set — DO NOT TOUCH THIS FILE
└── .env.example
```

---

## API KEYS ALREADY CONFIGURED IN .env

All keys below are already present in `.env`. Read them with `os.getenv()`.
**Never hardcode any key. Never print any key. Never modify .env.**

```python
# Use exactly these variable names:
os.getenv("GEMINI_API_KEY")          # Google Gemini 1.5 Flash
os.getenv("N2YO_API_KEY")            # Satellite tracking
os.getenv("NEWS_API_KEY")            # NewsAPI
os.getenv("OPENSKY_USERNAME")        # OpenSky Network
os.getenv("OPENSKY_PASSWORD")        # OpenSky Network
os.getenv("VITE_CESIUM_ION_TOKEN")   # CesiumJS (frontend — use import.meta.env)
os.getenv("VITE_WINDY_API_KEY")      # Windy.com weather layer
```

**New keys to add to .env when implementing features that need them:**
```
OPENAIP_API_KEY=          # For Feature 5 (Airspace) — free at app.core.openaip.net
TELEGRAM_BOT_TOKEN=       # For Feature 7 (Signal Fusion) — free from @BotFather
```

---

## EXISTING LIVE DATA SOURCES — ALREADY WORKING

| Endpoint | Source | Status |
|----------|--------|--------|
| `/api/flights` | OpenSky Network | ✅ LIVE |
| `/api/ships` | VesselFinder/AIS | ✅ LIVE |
| `/api/satellites` | N2YO API | ✅ LIVE |
| `/api/events` | GDELT Project | ✅ LIVE |
| `/api/jamming` | GPSJam.org | ✅ LIVE |
| `/api/history` | SQLite DB | ✅ LIVE |

---

## HOW TO ADD A NEW BACKEND ROUTER

**Pattern to follow every time:**

```python
# Step 1: Create backend/routers/new_feature.py
from fastapi import APIRouter
router = APIRouter()

@router.get("/api/new-feature/endpoint")
async def my_endpoint():
    return {"data": []}

# Step 2: In backend/main.py — ADD this line (do not change anything else):
from backend.routers.new_feature import router as new_feature_router
app.include_router(new_feature_router)
```

---

## HOW TO ADD A NEW FRONTEND COMPONENT

**Pattern to follow every time:**

```jsx
// Step 1: Create frontend/src/components/NewFeature.jsx
export default function NewFeature({ prop1, prop2 }) {
  // Full implementation — no placeholders
}

// Step 2: In App.jsx — ADD import and usage (do not change layout):
import NewFeature from './components/NewFeature';
// Add <NewFeature /> where appropriate in JSX
```

---

## CODE QUALITY RULES — NON-NEGOTIABLE

1. **Every function must be complete.** If it fetches data, it handles errors. If it renders,
   it handles loading and empty states.

2. **All API calls use try/except (Python) or try/catch (JS).** Never let a dead API
   crash the entire system. Return `{"error": "...", "data": []}` on failure.

3. **All Python async functions use `httpx.AsyncClient(timeout=15)`.**
   Never use `requests` library. Always use `httpx`.

4. **All CSS uses existing CSS variables.** Never hardcode `#00ffff` in a new component.
   Use `var(--cyber-cyan)` or the Tailwind class already in use.

5. **CesiumJS entities must use named DataSources.** Never call `viewer.entities.removeAll()`.
   It destroys everything. Instead:
   ```javascript
   // CORRECT pattern:
   const ds = new Cesium.CustomDataSource('layer-name');
   viewer.dataSources.add(ds);
   // To clear just this layer:
   ds.entities.removeAll();
   ```

6. **Never block the main thread.** All data fetching in Python agents uses `asyncio`.
   All React data fetching uses `useEffect` + `fetch` or `axios`.

7. **Console logs in agents use this format:**
   ```python
   print(f"[{self.name}] [{datetime.utcnow().strftime('%H:%M:%S')}] {message}")
   ```

8. **Labels on the globe use this font:**
   ```javascript
   font: '11px Share Tech Mono, monospace'
   ```

---
---

# ════════════════════════════════════════════
# TASK LIST — EXECUTE IN THIS EXACT ORDER
# ════════════════════════════════════════════

---

# ▶ TASK 1 — VISUAL FILTER MODES
## Estimated Time: 1–2 hours | Complexity: LOW | Zero new API keys

### What you are building
Six visual rendering modes that change how the entire platform looks.
A button panel lets the user switch instantly between them.

### Files to CREATE (new):
- `frontend/src/components/FilterModes.jsx`

### Files to EDIT (existing — append only):
- `frontend/src/index.css` — append new CSS classes at the bottom
- `frontend/src/App.jsx` — import and place `<FilterModes />` component
- `frontend/src/components/Globe.jsx` — add `applyFilterMode(mode)` function

### The 6 modes and their behavior:

| Mode Key | Button Label | CSS Filter on Globe Canvas | HUD Panel Color | CesiumJS Imagery |
|----------|-------------|---------------------------|-----------------|-----------------|
| `NORMAL` | `NORMAL` | `none` | `#00ffff` (default) | Bing Aerial (default) |
| `NIGHT_VISION` | `NVIS` | `brightness(0.7) contrast(1.4) sepia(1) hue-rotate(60deg) saturate(4)` | `#00ff41` | Cesium Night Lights (assetId: 3812) |
| `FLIR` | `FLIR` | `brightness(0.9) contrast(1.3) sepia(1) hue-rotate(0deg) saturate(3)` | `#ff6b00` | Cesium Night Lights (assetId: 3812) |
| `CRT` | `CRT` | `brightness(1.1) contrast(1.2)` | `#00ffff` | Default |
| `CEL` | `CEL` | `contrast(1.6) saturate(0.4)` | `#00ffff` | Default |
| `BLACKOUT` | `BLACKOUT` | `brightness(0.4) contrast(2) grayscale(1)` | `#ff0000` | Night Lights |

### FilterModes.jsx — full spec:
- A horizontal row of 6 buttons
- Active button has bright cyan border + glow `box-shadow: 0 0 8px #00ffff`
- Inactive buttons have `opacity: 0.5`
- On click: apply `cssFilter` to `document.getElementById('cesium-globe-canvas')`
- On click: call `onFilterChange(modeConfig)` prop callback
- On NIGHT_VISION / FLIR / BLACKOUT: swap CesiumJS imagery layer via `viewer.imageryLayers`
- Placed in the bottom toolbar row alongside existing layer buttons

### CRT Mode CSS — append to index.css:
```css
/* CRT scanline overlay — only active when .crt-active is on body */
body.crt-active::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.07) 0px,
    rgba(0,0,0,0.07) 1px,
    transparent 1px,
    transparent 4px
  );
  pointer-events: none;
  z-index: 9999;
  animation: crtScroll 10s linear infinite;
}
@keyframes crtScroll {
  from { background-position: 0 0; }
  to   { background-position: 0 100vh; }
}
```

### Acceptance criteria:
- [ ] All 6 buttons render in bottom toolbar
- [ ] Clicking NVIS turns entire globe green-tinted
- [ ] Clicking CRT adds scanline overlay across the entire screen
- [ ] Clicking FLIR shifts globe to orange thermal palette
- [ ] Clicking NORMAL returns to default state exactly
- [ ] Active mode persists across data refreshes (not reset by useEffect)

---

# ▶ TASK 2 — INTELLIGENCE ANALYST AESTHETIC UPGRADES
## Estimated Time: 2–3 hours | Complexity: LOW | Zero new API keys

### What you are building
Visual polish that makes every HUD panel look like a real military terminal.
No new data. No new APIs. Pure CSS and small React additions.

### Files to CREATE (new):
- `frontend/src/components/HUDOverlay.jsx`

### Files to EDIT (existing — append only):
- `frontend/src/index.css` — append the CSS blocks below
- `frontend/src/App.jsx` — import and render `<HUDOverlay />`

### Elements to add:

#### A) Animated corner brackets on all `.hud-panel` elements
Every panel already has class `hud-panel`. Add CSS pseudo-elements that draw
glowing corner brackets. The brackets on panels with new data pulse red briefly,
then return to cyan.

```css
/* Corner brackets */
.hud-panel { position: relative; }
.hud-panel::before, .hud-panel::after {
  content: ''; position: absolute;
  width: 10px; height: 10px; border-color: #00ffff; border-style: solid;
}
.hud-panel::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.hud-panel::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
```

#### B) Glitch animation for CRITICAL alert text
When any intel item has severity `CRITICAL`, add class `glitch-text` to it.

```css
@keyframes glitch {
  0%  { clip-path: inset(10% 0 80% 0); transform: translate(-3px); }
  33% { clip-path: inset(60% 0 20% 0); transform: translate(3px); }
  66% { clip-path: inset(30% 0 50% 0); transform: translate(-2px); }
  100%{ clip-path: inset(0); transform: translate(0); }
}
.glitch-text { animation: glitch 0.2s steps(1) 4; }
```

#### C) Radar sweep overlay (subtle, low opacity)
`HUDOverlay.jsx` renders this. A rotating line emanating from globe center.
Opacity: 0.05 (very subtle — it's an atmosphere effect, not distracting).

#### D) "SIGNAL RECEIVED" flash in top-right header
When any API call returns new data, the header flashes `◉ SIGNAL RECV` for 1.5 seconds.
Use a global event emitter or a simple React state prop passed from App.jsx.

#### E) Typing animation for AI briefing text
When `AIBriefing.jsx` displays new AI-generated text, each new briefing
types itself character-by-character at 35ms per character.
Implement with a `useEffect` that steps through the string using `setInterval`.

#### F) Grid reticle at screen center
A subtle crosshair with 40px arms. Very low opacity (0.15). Always centered.
Rendered inside `HUDOverlay.jsx`.

### Acceptance criteria:
- [ ] All panels show corner bracket decorations
- [ ] CRITICAL alerts flash/glitch visually
- [ ] Radar sweep rotates slowly behind globe (barely visible)
- [ ] New data in header triggers "SIGNAL RECV" flash
- [ ] AI briefing text types in, not just appears
- [ ] Crosshair visible at screen center at all times

---

# ▶ TASK 3 — ELECTRONIC WARFARE ENHANCED
## Estimated Time: 3–5 hours | Complexity: MEDIUM | No new API keys needed

### What you are building
Upgrades the existing `/api/jamming` into a full EW intelligence module with:
spoofing detection, SIGINT node map, severity-scaled cylinders, and jamming history trails.

### Files to CREATE (new):
- `backend/routers/ew_enhanced.py`

### Files to EDIT (existing — append only):
- `backend/main.py` — register new router
- `frontend/src/components/Globe.jsx` — add EW rendering functions

### New API Endpoints:

#### `GET /api/ew/jamming-zones`
**Source:** `https://gpsjam.org/json`
Fetch the GPSJam.org grid. Each cell has `{lat, lon, level}` where level 0=clear, 1–3=jamming.
Return only cells where `level > 0`.

**Response shape:**
```json
{
  "zones": [
    {
      "lat": 48.5,
      "lon": 33.2,
      "severity": 3,
      "severity_label": "HIGH",
      "color": "#ff0000",
      "radius_km": 200,
      "timestamp": "2026-03-19T13:00:00"
    }
  ],
  "total": 47
}
```
Color mapping: severity 1 → `#ffff00`, 2 → `#ff8800`, 3 → `#ff0000`
Radius mapping: severity 1 → 120km, 2 → 160km, 3 → 200km

#### `GET /api/ew/spoofing-detections`
**Source:** Cross-reference OpenSky data already fetched by `/api/flights`.
Call the existing flights endpoint internally (`httpx.get("http://localhost:8000/api/flights")`).
Flag any aircraft where `altitude_baro > 13716` (45,000ft in meters) as potential spoof.
Also flag aircraft with `velocity > 350` m/s (faster than any commercial aircraft).

**Response shape:**
```json
{
  "anomalies": [
    {
      "icao": "ABC123",
      "callsign": "RFF4411",
      "lat": 51.2,
      "lon": 30.1,
      "anomaly_type": "ALTITUDE_SPOOF",
      "confidence": "HIGH",
      "altitude_m": 15000
    }
  ],
  "total": 3
}
```

#### `GET /api/ew/sigint-nodes`
**Source:** Static hardcoded list. No external API needed.
Return this exact list — it is sourced from public military/OSINT databases:

```python
nodes = [
  {"name": "GCHQ Bude",        "lat": 50.90, "lon": -4.54,  "country": "UK",     "type": "SIGINT"},
  {"name": "NSA Fort Meade",   "lat": 39.11, "lon": -76.77, "country": "USA",    "type": "NSA-HQ"},
  {"name": "Pine Gap",         "lat": -23.80,"lon": 133.74, "country": "AUS",    "type": "SIGINT"},
  {"name": "Menwith Hill",     "lat": 54.00, "lon": -1.69,  "country": "UK/USA", "type": "ECHELON"},
  {"name": "Duga (Chernobyl)", "lat": 51.31, "lon": 30.07,  "country": "UKR",    "type": "OTH-RADAR"},
  {"name": "Diego Garcia",     "lat": -7.31, "lon": 72.41,  "country": "USA/UK", "type": "SIGINT"},
  {"name": "Troodos SIGINT",   "lat": 34.92, "lon": 32.87,  "country": "UK",     "type": "SIGINT"},
  {"name": "Lourdes Base",     "lat": 22.89, "lon": -82.16, "country": "RUS",    "type": "SIGINT"},
  {"name": "Yakutsk EW Node",  "lat": 62.03, "lon": 129.73, "country": "RUS",    "type": "EW-NODE"},
  {"name": "Misawa AB",        "lat": 40.70, "lon": 141.37, "country": "USA/JP", "type": "SIGINT"},
]
```

### CesiumJS Rendering in Globe.jsx — append these functions:

#### `renderJammingZones(zones)` — Pulsing cylinders
- One cylinder per zone
- Height: 20,000m (20km tall signal column)
- TopRadius + BottomRadius = `zone.radius_km * 1000`
- Material: `CallbackProperty` that pulses opacity `0.3 + 0.25 * Math.sin(Date.now()/600)`
- Outline: solid line at full opacity matching zone color
- Use a named DataSource: `new Cesium.CustomDataSource('ew-jamming')`

#### `renderSIGINTNodes(nodes)` — Fixed markers
- Diamond shape billboard: use a small SVG data URI
- Color: `#ff00ff` (magenta — visually distinct from flights/sats)
- Label: node name in small white text, shown only when zoomed to < 5000km altitude
- Use a named DataSource: `new Cesium.CustomDataSource('sigint-nodes')`

#### `renderSpoofingAlerts(anomalies)` — Pulsing rings
- Red pulsing circle at anomaly position
- Small animated ring that expands outward and fades
- On click: popup showing `ANOMALY: [type] | CONFIDENCE: [level] | ICAO: [id]`
- Use DataSource: `new Cesium.CustomDataSource('ew-spoofing')`

### Acceptance criteria:
- [ ] `/api/ew/jamming-zones` returns real GPSJam.org data
- [ ] `/api/ew/spoofing-detections` returns flagged aircraft
- [ ] `/api/ew/sigint-nodes` returns the 10 hardcoded nodes
- [ ] Jamming zones render as pulsing colored cylinders on globe
- [ ] SIGINT nodes render as magenta diamonds
- [ ] Spoofing anomalies render as red pulsing rings
- [ ] Clicking any EW entity shows an info popup
- [ ] Existing `/api/jamming` endpoint still works unchanged

---

# ▶ TASK 4 — INFRASTRUCTURE & TELEGEOGRAPHY LAYER
## Estimated Time: 4–6 hours | Complexity: MEDIUM | No new API keys

### What you are building
A new intelligence layer showing the physical infrastructure of the internet
and global power grid — undersea cables, internet exchange points, outage alerts,
and major data center nodes.

### Files to CREATE (new):
- `backend/routers/infrastructure.py`
- `frontend/src/components/InfraLayer.jsx`

### Files to EDIT (existing — append only):
- `backend/main.py` — register router
- `frontend/src/App.jsx` — import InfraLayer
- `frontend/src/components/Globe.jsx` — add cable rendering function

### New API Endpoints:

#### `GET /api/infra/undersea-cables`
**Primary source (no auth):**
```
https://raw.githubusercontent.com/telegeography/www.submarinecablemap.com/master/web/public/api/v3/cable/cable-geo.json
```
This is a GeoJSON FeatureCollection of `LineString` geometries, one per cable.
Fetch it, cache it for 24 hours (it rarely changes), return it directly as GeoJSON.
Each feature already has `properties.id` and `properties.name`.

**Fallback source (if above fails):**
```
https://www.submarinecablemap.com/api/v3/cable/cable-geo.json
```

**Caching:** Store in a module-level variable. Only re-fetch if older than 24 hours.
```python
_cable_cache = {"data": None, "fetched_at": None}
```

#### `GET /api/infra/internet-outages`
**Source:** OONI API (no auth needed)
```
https://api.ooni.io/api/v1/measurements/?limit=30&anomaly=true
```
Parse each measurement and return:
```json
{
  "outages": [
    {
      "country": "IR",
      "type": "CENSORSHIP",
      "severity": "HIGH",
      "source": "OONI",
      "timestamp": "2026-03-19T10:00:00"
    }
  ]
}
```
Map `anomaly=true` measurements to severity: if `probe_cc` is in
`["IR", "CN", "RU", "KP", "BY"]` → HIGH. Otherwise → MEDIUM.

#### `GET /api/infra/datacenters`
Static data. Return this hardcoded list of hyperscale nodes + IXPs.
No external API needed:

```python
nodes = [
  # AWS
  {"name":"AWS us-east-1",     "lat":39.04,"lon":-77.49,"provider":"AWS",  "tier":1},
  {"name":"AWS eu-west-1",     "lat":53.33,"lon":-6.25, "provider":"AWS",  "tier":1},
  {"name":"AWS ap-east-1",     "lat":22.28,"lon":114.16,"provider":"AWS",  "tier":1},
  {"name":"AWS ap-south-1",    "lat":19.08,"lon":72.88, "provider":"AWS",  "tier":1},
  # Google Cloud
  {"name":"GCP us-central1",   "lat":41.26,"lon":-95.86,"provider":"GCP",  "tier":1},
  {"name":"GCP europe-west4",  "lat":51.99,"lon":4.66,  "provider":"GCP",  "tier":1},
  {"name":"GCP asia-east1",    "lat":24.05,"lon":120.55,"provider":"GCP",  "tier":1},
  # Azure
  {"name":"Azure East US",     "lat":37.33,"lon":-79.47,"provider":"AZURE","tier":1},
  {"name":"Azure West Europe", "lat":52.36,"lon":4.90,  "provider":"AZURE","tier":1},
  # Internet Exchange Points (IXPs) - critical global chokepoints
  {"name":"DE-CIX Frankfurt",  "lat":50.11,"lon":8.68,  "provider":"IXP",  "tier":0},
  {"name":"AMS-IX Amsterdam",  "lat":52.37,"lon":4.90,  "provider":"IXP",  "tier":0},
  {"name":"LINX London",       "lat":51.51,"lon":-0.13, "provider":"IXP",  "tier":0},
  {"name":"JPNAP Tokyo",       "lat":35.69,"lon":139.69,"provider":"IXP",  "tier":0},
  {"name":"SGIX Singapore",    "lat":1.35, "lon":103.82,"provider":"IXP",  "tier":0},
  {"name":"Equinix Mumbai",    "lat":19.08,"lon":72.88, "provider":"IXP",  "tier":0},
]
```

### CesiumJS Rendering — append to Globe.jsx:

#### `renderUnderseaCables(geojson)`
- Load the GeoJSON using `Cesium.GeoJsonDataSource.load(geojson, { ... })`
- Stroke color: `Cesium.Color.fromCssColorString('#00ffff').withAlpha(0.6)`
- Stroke width: 2.0
- Each entity's `polyline.width` uses a `CallbackProperty` that pulses:
  `1.2 + 0.8 * Math.abs(Math.sin(Date.now() / 3000))`
- DataSource name: `'infra-cables'`
- Do NOT clamp to ground — cables run on the ocean floor (slight altitude above sea)

#### `renderDataCenters(nodes)`
- Tier 0 (IXP): bright green hexagon billboard, scale 0.6
- Tier 1 (Cloud): cyan square billboard, scale 0.5
- Label: node name, only shown at camera altitude < 8,000,000m
- On click: popup showing `[PROVIDER] [NAME] | TIER: [tier] | TYPE: Critical Infrastructure`
- DataSource name: `'infra-datacenters'`

### InfraLayer.jsx — side panel component:
A collapsible panel that shows:
- Total cable count (from `/api/infra/undersea-cables` feature count)
- Active outage alerts list (from `/api/infra/internet-outages`)
- Each outage shows: country flag emoji + country code + severity badge

### Acceptance criteria:
- [ ] Undersea cables render as glowing cyan lines across all oceans
- [ ] Cable lines pulse slowly (not distractingly)
- [ ] Data center nodes appear as markers with correct colors by type
- [ ] InfraLayer panel shows current outage count
- [ ] OONI outages list at least 5 entries when censorship events are active
- [ ] 24-hour cable cache works (second call returns instantly)
- [ ] All existing layers still work alongside cable layer

---

# ▶ TASK 5 — OPERATIONAL AIRSPACE AWARENESS
## Estimated Time: 5–8 hours | Complexity: MEDIUM | 1 new API key

### What you are building
Real-time restricted airspace visualization: NOTAMs, conflict zone airspace,
no-fly zones as 3D extruded polygons floating above terrain.

### New `.env` key needed:
```
OPENAIP_API_KEY=your_key_here
```
**How to get it free:** Register at `https://app.core.openaip.net` → API → Create Key.
Tell the user to do this and paste the key into `.env` before running this task.

### Files to CREATE (new):
- `backend/routers/airspace.py`

### Files to EDIT (existing — append only):
- `backend/main.py` — register router
- `frontend/src/components/Globe.jsx` — add airspace rendering

### New API Endpoints:

#### `GET /api/airspace/notams?lat={lat}&lon={lon}`
**Source:** FAA NOTAM API (no auth, US coverage):
```
https://notamapi.faa.gov/notamapi/v1/notams?pageSize=50&sortBy=effectiveStartDate&sortOrder=Desc
```
Parse items, classify each by severity:
- Contains `"R-"` or `"P-"` (Restricted/Prohibited) → `HIGH`
- Contains `"TFR"` or `"MILITARY"` → `HIGH`
- Contains `"DRONE"` or `"UAS"` → `MEDIUM`
- Everything else → `LOW`

Return:
```json
{
  "notams": [
    {
      "id": "0/0000",
      "type": "RESTRICTED",
      "location": "KDCA",
      "text": "R-4001 ACTIVE 0001-2359 UTC",
      "start": "2026-03-19T00:01:00",
      "end": "2026-03-19T23:59:00",
      "severity": "HIGH",
      "source": "FAA"
    }
  ],
  "total": 23
}
```

#### `GET /api/airspace/conflict-zones`
Static hardcoded list. Always return these active conflict airspaces.
Update this list manually when the geopolitical situation changes.

```python
conflict_zones = [
  {
    "name": "UKRAINE AIRSPACE CLOSED",
    "type": "CONFLICT",
    "country": "UA",
    "severity": "CRITICAL",
    "active_since": "2022-02-24",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[22,44],[40,44],[40,52],[22,52],[22,44]]]
    },
    "lower_alt_ft": 0,
    "upper_alt_ft": 60000,
  },
  {
    "name": "GAZA / ISRAEL RESTRICTED",
    "type": "CONFLICT",
    "country": "IL",
    "severity": "CRITICAL",
    "active_since": "2023-10-07",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[34.2,31.2],[34.6,31.2],[34.6,31.6],[34.2,31.6],[34.2,31.2]]]
    },
    "lower_alt_ft": 0,
    "upper_alt_ft": 60000,
  },
  {
    "name": "NORTH KOREA ADIZ",
    "type": "PROHIBITED",
    "country": "KP",
    "severity": "HIGH",
    "active_since": "1953-07-27",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[124,37],[132,37],[132,43],[124,43],[124,37]]]
    },
    "lower_alt_ft": 0,
    "upper_alt_ft": 60000,
  },
  {
    "name": "MYANMAR RESTRICTED",
    "type": "RESTRICTED",
    "country": "MM",
    "severity": "HIGH",
    "active_since": "2021-02-01",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[92,10],[102,10],[102,28],[92,28],[92,10]]]
    },
    "lower_alt_ft": 0,
    "upper_alt_ft": 60000,
  },
  {
    "name": "SUDAN CONFLICT ZONE",
    "type": "CONFLICT",
    "country": "SD",
    "severity": "HIGH",
    "active_since": "2023-04-15",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[24,10],[38,10],[38,22],[24,22],[24,10]]]
    },
    "lower_alt_ft": 0,
    "upper_alt_ft": 60000,
  },
]
```

### CesiumJS Rendering — append to Globe.jsx:

#### `renderAirspaceZones(zones)`
- Color map:
  - `CRITICAL` → `Cesium.Color.RED.withAlpha(0.3)`
  - `HIGH` → `Cesium.Color.ORANGE.withAlpha(0.25)`
  - `MEDIUM` → `Cesium.Color.YELLOW.withAlpha(0.15)`
- Extruded polygon: `extrudedHeight = upper_alt_ft * 0.3048` (convert ft → meters)
- `height = lower_alt_ft * 0.3048`
- Outline: same color at full alpha, width 2
- DataSource name: `'airspace-zones'`
- On click popup: `🚫 [NAME] | SINCE: [date] | STATUS: ACTIVE`

### Acceptance criteria:
- [ ] `/api/airspace/notams` returns real FAA NOTAM data
- [ ] `/api/airspace/conflict-zones` returns all 5 hardcoded zones
- [ ] Ukraine, Gaza, North Korea, Myanmar, Sudan render as 3D red volumes
- [ ] Zones are extruded to their actual altitude ceiling
- [ ] Clicking a zone shows the popup with correct data
- [ ] Layer can be toggled off via existing LayerControls

---

# ▶ TASK 6 — ADVANCED SATELLITE TRACKING
## Estimated Time: 6–10 hours | Complexity: MEDIUM | Uses existing N2YO key

### What you are building
Upgrade satellite tracking from "dot on globe" to full intelligence-grade orbital
system: pass predictions, sensor footprints, and ground track lines.

### Files to CREATE (new):
- `backend/routers/satellites_advanced.py`
- `frontend/src/components/SatellitePanel.jsx`

### Files to EDIT (existing — append only):
- `backend/main.py` — register router
- `frontend/src/components/Globe.jsx` — add footprint + ground track rendering

### Key satellite NORAD IDs to track:
```python
PRIORITY_SATS = {
    "WORLDVIEW-3":  40115,   # Maxar commercial ISR
    "WORLDVIEW-4":  41848,   # Maxar commercial ISR
    "CAPELLA-2":    46420,   # SAR (Synthetic Aperture Radar)
    "CAPELLA-3":    47971,   # SAR
    "KH-11 (USA-224)": 37348,  # NRO reconnaissance
    "KH-11 (USA-245)": 38624,  # NRO reconnaissance
    "YAOGAN-41":    57803,   # Chinese ISR
    "KOSMOS-2543":  44797,   # Russian inspector satellite
    "ISS":          25544,   # International Space Station
    "LACROSSE-5":   28646,   # NRO radar imaging
}
```

### New API Endpoints:

#### `GET /api/satellites/passes?lat={lat}&lon={lon}&days=1`
**Source:** N2YO API (key already in .env)
For each satellite in `PRIORITY_SATS`, call:
```
https://api.n2yo.com/rest/v1/satellite/visualpasses/{norad_id}/{lat}/{lon}/0/1/10/&apiKey={N2YO_KEY}
```
Collect all passes, sort by `startUTC` ascending, return the 20 soonest.

**Response shape:**
```json
{
  "passes": [
    {
      "satellite": "WORLDVIEW-3",
      "norad_id": 40115,
      "start_utc": "2026-03-19T14:23:00",
      "end_utc": "2026-03-19T14:29:00",
      "max_elevation_deg": 45.2,
      "duration_sec": 360,
      "minutes_away": 14.5,
      "above_horizon": true
    }
  ],
  "target": {"lat": 48.5, "lon": 2.3},
  "total": 20
}
```

**Important:** N2YO allows 1000 req/day. With 10 satellites, each call costs 10 requests.
Add a 15-minute cache keyed by `(lat_rounded, lon_rounded, day)` to protect the quota.

#### `GET /api/satellites/footprint/{norad_id}`
**Source:** N2YO positions endpoint
```
https://api.n2yo.com/rest/v1/satellite/positions/{norad_id}/0/0/0/1/&apiKey={N2YO_KEY}
```
From the returned position, compute sensor footprint:
- Earth radius = 6371 km
- Assume 55° half-angle FOV for optical ISR satellites
- `footprint_radius_km = altitude_km * tan(radians(55))`

Return:
```json
{
  "norad_id": 40115,
  "name": "WORLDVIEW-3",
  "lat": 51.2,
  "lon": 20.4,
  "altitude_km": 617,
  "footprint_radius_km": 881.4,
  "timestamp": "2026-03-19T13:28:41"
}
```

#### `GET /api/satellites/tle/{norad_id}`
**Source:** CelesTrak (no auth, free):
```
https://celestrak.org/satcat/tle.php?CATNR={norad_id}
```
Parse the 3-line TLE format and return structured JSON:
```json
{"name": "WORLDVIEW-3", "line1": "1 40115U ...", "line2": "2 40115 ..."}
```

### SatellitePanel.jsx — spec:
A compact side panel listing upcoming passes over a user-selected coordinate.
- User inputs lat/lon (or clicks globe to set coordinate — listen to CesiumJS `viewer.screenSpaceEventHandler`)
- Button "SCAN PASSES" triggers fetch of `/api/satellites/passes`
- Results listed as: `[SAT NAME] — T-[minutes]m — MAX EL: [deg]°`
- Items within 30 minutes highlighted in red (imminent pass)
- Items within 5 minutes shown with blinking red dot

### CesiumJS Rendering — append to Globe.jsx:

#### `renderSatelliteFootprint(footprintData)`
- A semi-transparent circle on the globe surface
- Color: `Cesium.Color.fromCssColorString('#ff00ff').withAlpha(0.15)` (magenta tint)
- Outline: `#ff00ff` at 0.8 alpha
- Use `Cesium.EllipseGraphics` centered at satellite's current lat/lon
- `semiMinorAxis = semiMajorAxis = footprint_radius_km * 1000`
- DataSource: `'sat-footprints'`

#### `renderGroundTrack(tle)`
- Use the TLE lines + `satellite.js` library (if already in package.json) or
  compute 20 future positions by calling N2YO positions endpoint with seconds=1200
- Render as a dashed polyline: `Cesium.PolylineDashMaterialProperty`
- Color: `#ffffff` at 0.4 alpha
- DataSource: `'sat-groundtrack'`

### Acceptance criteria:
- [ ] `/api/satellites/passes` returns sorted upcoming passes for any coordinate
- [ ] `/api/satellites/footprint/{id}` returns correct footprint radius
- [ ] SatellitePanel shows pass list with countdown timers
- [ ] Passes under 30 min highlighted red
- [ ] Satellite footprint circle renders on globe surface
- [ ] N2YO quota protection cache is working (verify with 2 rapid calls)

---

# ▶ TASK 7 — SPATIAL SIGNAL FUSION (TELEGRAM + REDDIT OSINT)
## Estimated Time: 8–14 hours | Complexity: HIGH | 1 new API key

### What you are building
Pin live geo-tagged intelligence from Telegram OSINT channels and Reddit
directly onto the 3D globe as interactive markers.

### New `.env` key needed:
```
TELEGRAM_BOT_TOKEN=your_token_here
```
**How to get it free:**
1. Open Telegram → search `@BotFather`
2. Send `/newbot` → follow prompts → get token
3. Add the bot to each OSINT channel as an admin
4. Paste token into `.env`

### Files to CREATE (new):
- `backend/routers/signal_fusion.py`
- `frontend/src/components/SignalFeed.jsx`

### Files to EDIT (existing — append only):
- `backend/main.py` — register router
- `frontend/src/components/Globe.jsx` — add signal pin rendering

### Telegram channels to monitor (bot must be added as member):
```python
OSINT_CHANNELS = {
    "@intelslava":           "Ukraine/Russia Conflict",
    "@GeoConfirmed":         "Geolocation Verification",
    "@MiddleEastSpectator":  "Middle East OSINT",
    "@UAWeapons":            "Weapons Tracking",
    "@wartranslated":        "Translated Conflict Reports",
}
```

### New API Endpoints:

#### `GET /api/signals/telegram`
**Source:** Telegram Bot API
```
https://api.telegram.org/bot{TOKEN}/getUpdates?limit=100&timeout=0
```
For each message:
1. If message has `.location` field → use directly (confidence: HIGH)
2. Else → extract location from text using Gemini AI (confidence: MEDIUM)
3. Geocode extracted location using Nominatim (free):
   ```
   https://nominatim.openstreetmap.org/search?q={location}&format=json&limit=1
   ```
   Header: `User-Agent: GodsEye-OSINT/1.0` (required by Nominatim ToS)

Return only messages that have a resolved lat/lon.

```json
{
  "signals": [
    {
      "source": "TELEGRAM",
      "channel": "@intelslava",
      "text": "Explosions reported in Kharkiv region...",
      "lat": 49.99,
      "lon": 36.23,
      "confidence": "MEDIUM",
      "extracted_location": "Kharkiv",
      "timestamp": "2026-03-19T13:15:00",
      "type": "AI_EXTRACTED"
    }
  ],
  "total": 12
}
```

**Gemini location extraction prompt** (use existing GEMINI_API_KEY):
```python
prompt = """Extract the most specific geographic location mentioned in this text.
Return ONLY the location name (a city, district, or region). 
If multiple locations, return the most specific one.
If no clear location, return exactly: NONE

Text: {text}

Location:"""
```
If Gemini returns `NONE` → skip the message. Do not geocode.

#### `GET /api/signals/reddit`
**Source:** Reddit JSON API (no auth, free)
```
https://www.reddit.com/r/{subreddit}/new.json?limit=15
```
Subreddits to scan: `worldnews`, `geopolitics`, `UkraineWarVideoReport`, `CredibleDefense`

Same pipeline as Telegram: Gemini extracts location → Nominatim geocodes it.
Only return posts where a location was successfully resolved.

```json
{
  "signals": [
    {
      "source": "REDDIT",
      "channel": "r/worldnews",
      "text": "Israeli forces advance into northern Gaza...",
      "url": "https://reddit.com/r/worldnews/comments/...",
      "lat": 31.4,
      "lon": 34.4,
      "confidence": "MEDIUM",
      "upvotes": 4821,
      "timestamp": "2026-03-19T12:00:00"
    }
  ],
  "total": 8
}
```

### Rate limiting — IMPORTANT:
- Nominatim: max 1 request per second. Use `asyncio.sleep(1.1)` between geocode calls.
- Reddit: add `headers={"User-Agent": "GodsEye-OSINT/1.0"}` to all requests.
- Gemini: each location extraction = ~50 tokens. At 10 messages × 2 sources = ~1000 tokens
  per cycle. Well within the 1M/day free limit.

### CesiumJS Rendering — append to Globe.jsx:

#### `renderSignalPins(signals)`
- Each signal = a pin marker on the globe
- TELEGRAM signals: blue pin icon
- REDDIT signals: orange pin icon
- HIGH confidence: full opacity; MEDIUM: 0.7 opacity
- Label: first 40 chars of text, only visible on click
- On click popup:
  ```
  ◉ [SOURCE] / [CHANNEL]
  [TEXT truncated to 120 chars]
  📍 [EXTRACTED_LOCATION] | CONF: [CONFIDENCE]
  ⏱ [TIMESTAMP UTC]
  ```
- Use DataSource: `'signal-pins'`
- Refresh every 90 seconds

### SignalFeed.jsx — side panel component:
A scrolling list of all resolved signals sorted by newest first.
- Source badge (TELEGRAM/REDDIT) color-coded
- First 80 chars of text
- Confidence indicator: `●●●` HIGH / `●●○` MEDIUM / `●○○` LOW
- Clicking a list item flies the CesiumJS camera to that signal's location

### Acceptance criteria:
- [ ] `/api/signals/telegram` returns signals with resolved lat/lon
- [ ] `/api/signals/reddit` returns signals with resolved lat/lon
- [ ] Nominatim rate limit respected (no 429 errors)
- [ ] Signal pins render on globe in correct locations
- [ ] SignalFeed panel shows scrolling list
- [ ] Clicking a feed item flies camera to location
- [ ] Gemini location extraction skips non-geographic messages correctly

---

# ▶ TASK 8 — AI AGENT SWARM UPGRADE
## Estimated Time: 10–18 hours | Complexity: HIGH | No new keys

### What you are building
Refactor the existing single-loop `agent_manager.py` into a true multi-agent
swarm architecture. Agents run in parallel, share a priority queue, and a
Commander agent generates AI briefings every 5 minutes.

### Files to CREATE (new):
- `agents/agent_manager_v2.py`
- `agents/snapshot_agent.py`
- `agents/commander_agent.py`

### Files to EDIT:
- `agents/agent_manager.py` — add `import subprocess` call to also launch v2
  (or replace it entirely — ask the user which they prefer before doing this)

### Agent architecture:

```
CommanderAgent (Gemini)
    ↑  reads from
PriorityQueue (asyncio.PriorityQueue)
    ↑  writes to
FlightAnomalyAgent  |  ConflictAgent  |  SIGINTAgent  |  EWAgent
    (30s)                (300s)             (60s)           (120s)
```

### BaseAgent class — all agents inherit this:
```python
class BaseAgent:
    name: str
    interval_sec: int
    priority: int      # 1=highest, 10=lowest
    is_healthy: bool   # set False on exception, True on success
    last_run: datetime
    events_collected: int

    async def collect(self) -> List[Dict]: ...  # Override in subclass
    async def run_forever(self, queue: asyncio.PriorityQueue): ...
```

### Agent specifications:

#### FlightAnomalyAgent (interval: 30s, priority: 1)
- Calls `http://localhost:8000/api/flights`
- Flags squawk 7700 (emergency), 7600 (comms failure), 7500 (hijack)
- Flags aircraft with velocity > 350 m/s
- Flags military callsigns (starts with: RFF, BAF, UAF, RRF, COA, SAM, USAF)

#### EWAgent (interval: 120s, priority: 2)
- Calls `http://localhost:8000/api/ew/spoofing-detections`
- Passes HIGH confidence spoofing events to queue

#### SIGINTAgent (interval: 60s, priority: 3)
- Calls `http://localhost:8000/api/signals/telegram`
- Calls `http://localhost:8000/api/signals/reddit`
- Combines into single event list

#### ConflictAgent (interval: 300s, priority: 4)
- Calls GDELT API:
  ```
  https://api.gdeltproject.org/api/v2/doc/doc?query=conflict+explosion+military+airstrike&mode=artlist&maxrecords=25&format=json&timespan=2h
  ```
- Extracts: title, domain, seendate, language
- Severity: articles with `conflict` + `explosion` in title → HIGH; others → MEDIUM

### CommanderAgent — briefing generator:
- Every 5 minutes, drain the queue into a buffer
- If buffer has ≥ 5 events, call Gemini:

```python
prompt = f"""You are ARES — an AI military intelligence system operating God's Eye platform.

ACTIVE SIGNALS (last 5 minutes):
{event_summary}

Generate a tactical intelligence briefing using this exact format:
ARES BRIEF [{utc_time}]:
▸ SITREP: [1 sentence situation overview]
▸ KEY DEV: [1 sentence most significant development]  
▸ MONITOR: [1 sentence areas/entities to watch]
▸ THREAT LEVEL: [NORMAL / ELEVATED / HIGH / CRITICAL]

Be factual, brief, military-professional. Do not speculate beyond the data."""
```

- Store the briefing in a new DB table `ai_briefings(id, timestamp, content, threat_level)`
- Expose via existing `/api/analysis/latest` endpoint

### Snapshot agent (`agents/snapshot_agent.py`):
Runs every 5 minutes. Calls all live endpoints and saves a `WorldSnapshot` to DB.
This powers the 4D playback in Task 9.

```python
ENDPOINTS_TO_SNAPSHOT = [
    "/api/flights",
    "/api/ships",
    "/api/satellites",
    "/api/events",
    "/api/ew/jamming-zones",
    "/api/airspace/conflict-zones",
]
```

### DB schema additions (append to `backend/database/db.py`):
```python
class AIBriefing(Base):
    __tablename__ = "ai_briefings"
    id           = Column(Integer, primary_key=True)
    timestamp    = Column(DateTime, index=True)
    content      = Column(Text)
    threat_level = Column(String(20))  # NORMAL/ELEVATED/HIGH/CRITICAL

class WorldSnapshot(Base):
    __tablename__ = "world_snapshots"
    id           = Column(Integer, primary_key=True)
    timestamp    = Column(DateTime, index=True)
    flights_json = Column(Text)
    ships_json   = Column(Text)
    sats_json    = Column(Text)
    events_json  = Column(Text)
    jamming_json = Column(Text)
    airspace_json= Column(Text)
```

### Acceptance criteria:
- [ ] All 4 agents run in parallel (verify with timestamps in logs)
- [ ] Commander generates Gemini briefing every 5 minutes
- [ ] Briefing stored in DB and retrievable via `/api/analysis/latest`
- [ ] Snapshot agent saves world state every 5 minutes
- [ ] Agent health shown in console: `[AGENT] [TIME] Collected X events | healthy: True`
- [ ] Dead agent does not crash others (exception caught, logged, agent continues)

---

# ▶ TASK 9 — 4D COMMAND CENTER + HISTORICAL PLAYBACK
## Estimated Time: 15–25 hours | Complexity: HIGH | No new keys

### What you are building
The platform's most powerful feature: the ability to rewind time and replay
any event minute-by-minute. User drags a slider, globe re-renders the world
as it was at that exact timestamp.

### Prerequisite:
Task 8 must be complete. Snapshot agent must have been running for at least
30 minutes to have data to replay. Inform the user of this.

### Files to CREATE (new):
None — extend existing files.

### Files to EDIT:
- `backend/routers/history.py` — add snapshot query endpoints
- `frontend/src/components/TimelineSlider.jsx` — full upgrade
- `frontend/src/components/Globe.jsx` — add `setPlaybackState(snapshot)` function
- `frontend/src/App.jsx` — wire playback mode state to Globe

### New Backend Endpoints (append to history.py):

#### `GET /api/history/snapshots?start={iso}&end={iso}`
Query `WorldSnapshot` table. Return list of `{id, timestamp}` sorted ascending.
Default range: last 24 hours if no params given.

#### `GET /api/history/snapshot/{id}`
Return full snapshot data parsed from JSON columns:
```json
{
  "timestamp": "2026-03-19T13:00:00",
  "flights":   [...],
  "ships":     [...],
  "satellites":[...],
  "events":    [...],
  "jamming":   [...],
  "airspace":  [...]
}
```

#### `POST /api/history/annotate`
Body: `{timestamp, lat, lon, title, body, severity}`
Save to `AnalystAnnotation` table:
```python
class AnalystAnnotation(Base):
    __tablename__ = "analyst_annotations"
    id         = Column(Integer, primary_key=True)
    timestamp  = Column(DateTime, index=True)
    lat        = Column(Float)
    lon        = Column(Float)
    title      = Column(String(200))
    body       = Column(Text)
    severity   = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)
```

### TimelineSlider.jsx — full spec:

The timeline is already in the project. Upgrade it:

1. **Mode toggle:** `[● LIVE]` and `[⏮ PLAYBACK]` buttons
2. **On PLAYBACK click:** fetch snapshot list for last 24h from `/api/history/snapshots`
3. **Scrubber:** HTML range input, min=0, max=snapshots.length-1
4. **Time display:** show `snapshot.timestamp` formatted as `DD MMM YYYY HH:MM UTC`
5. **Playback controls:** `⏮` (go to start) `◀` (step back) `▶/⏸` (play/pause) `▶` (step fwd)
6. **Speed control:** buttons `1x` `5x` `10x` `30x` — controls auto-advance interval
7. **On scrub:** call `onSeek(snapshotId)` prop with selected snapshot ID

When speed = 1x → advance 1 step per second
When speed = 5x → advance 1 step per 200ms
When speed = 10x → advance 1 step per 100ms
When speed = 30x → advance 1 step per 33ms

8. **Visual indicator:** When in PLAYBACK mode, show large red `⏸ REPLAY MODE` badge
   in the Header.jsx (pass `isReplaying` prop down from App.jsx)

9. **"GO LIVE" button:** Always visible in playback mode. Returns to live data.

### Globe.jsx — playback mode:

Add `setPlaybackSnapshot(snapshot)` function:
1. Clear all existing DataSource entities (except static layers like SIGINT nodes)
2. Re-render each layer using snapshot data:
   - `renderFlights(snapshot.flights)`
   - `renderShips(snapshot.ships)`
   - `renderSatellites(snapshot.satellites)`
   - `renderEvents(snapshot.events)`
   - `renderJammingZones(snapshot.jamming)`
3. All labels should show their historical timestamp, not "NOW"

Add `goLive()` function:
- Resume live polling via existing `useEffect` intervals
- Clear playback entities
- Show current live data again

### Acceptance criteria:
- [ ] Switching to PLAYBACK shows scrubber with snapshot timestamps
- [ ] Dragging scrubber re-renders globe with that snapshot's data
- [ ] Auto-play advances through time at selected speed
- [ ] REPLAY MODE badge visible in header during playback
- [ ] GO LIVE returns to real-time data instantly
- [ ] Annotation can be saved to a historical timestamp
- [ ] If no snapshots exist yet, show: `NO HISTORICAL DATA — SYSTEM COLLECTING...`

---
---

# ════════════════════════════════════════════
# GLOBAL RULES — ALWAYS APPLY
# ════════════════════════════════════════════

## Before starting any task:
1. Read the existing files you will edit. All of them. First.
2. Identify what already exists so you don't duplicate it.
3. If an import already exists in the file, do not add it again.

## CesiumJS rules:
- Always check if `viewerRef.current` is not null before using it
- Always use named `CustomDataSource` objects — never `viewer.entities` directly
- Always use `viewer.dataSources.getByName('name')[0]` to get an existing source
- Globe rotation must remain working after any change to Globe.jsx

## Python rules:
- Always use `python-dotenv` and `load_dotenv()` at top of every agent file
- Always handle `httpx.TimeoutException` and `httpx.ConnectError` separately
- Never use `time.sleep()` in async code — always `await asyncio.sleep()`
- All DB sessions must be closed in a `finally` block

## React rules:
- All `useEffect` hooks that call APIs must have cleanup to prevent memory leaks:
  ```javascript
  useEffect(() => {
    let cancelled = false;
    fetchData().then(data => { if (!cancelled) setData(data); });
    return () => { cancelled = true; };
  }, []);
  ```
- Never put API URLs with hardcoded ports in components.
  Always use relative paths `/api/...` (Vite proxy handles the port)

## After completing each task:
Report what was created/edited in this format:
```
✅ TASK [N] COMPLETE
Created:  [list of new files]
Edited:   [list of modified files]
Endpoints:[list of new /api routes]
Test:     [what to test to verify it works]
```

---

*God's Eye — Agent Build Instructions v2.0*
*Prepared for AI coding agent execution.*
*All data sources are 100% public OSINT. Educational and research use only.*

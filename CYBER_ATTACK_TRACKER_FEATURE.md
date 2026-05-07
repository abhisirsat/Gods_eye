# GODS EYE — FEATURE: CYBER ATTACK TRACKER
## STANDALONE FEATURE DOCUMENTATION FOR AI AGENT (ANTIGRAVITY)
## READ THIS ENTIRE FILE BEFORE WRITING A SINGLE LINE OF CODE

---

## FEATURE IDENTITY

| Property | Value |
|----------|-------|
| Feature Name | Cyber Attack Tracker |
| Globe DataSource name | cyber-attacks |
| Backend router file | backend/routers/cyber_attacks.py |
| Frontend component | frontend/src/components/CyberAttackLayer.jsx |
| DB table to append | cyber_attack_events |
| API refresh rate | Every 60 seconds |
| New .env keys needed | ABUSEIPDB_API_KEY, OTX_API_KEY |

---

## WHAT THIS FEATURE DOES — READ THIS FIRST

This feature renders live cyber attacks as animated arc lines on the 3D globe.
Each attack = one glowing red arc drawn from the attacker country centroid
to the target country centroid, elevated above the globe surface.

THE ANIMATION HAS EXACTLY 3 PHASES — LOOPING FOREVER:

  PHASE 1 — DRAW (1200ms):
    The arc head grows forward from the attacker country toward the target.
    The tail stays fixed at the origin. The arc is drawn in real time.
    startFraction = 0, endFraction grows from 0 → 1

  PHASE 2 — HOLD (200ms):
    The complete arc is fully visible for a brief moment.
    startFraction = 0, endFraction = 1

  PHASE 3 — ERASE (800ms):
    The arc disappears from the ORIGIN END (the attacker side, not the target).
    The tail chases the head. Energy drains backward from the source.
    startFraction grows from 0 → 1, endFraction = 1

  Then Phase 1 begins again. Infinite loop while attack is active.

Visual result: A "laser bolt" fires from attacker to target, hits, then the
beam evaporates back toward its source — like retracting a tracer round.

---

## DATA SOURCES — ALL FREE

SOURCE 1: AbuseIPDB Blacklist (PRIMARY)
  URL:      https://api.abuseipdb.com/api/v2/blacklist
  Auth:     Header "Key: {ABUSEIPDB_API_KEY}"
  Free:     1,000 lookups/day. Returns top 10,000 abusive IPs updated hourly.
  Signup:   https://www.abuseipdb.com/register
  Gives:    ipAddress, countryCode, abuseConfidenceScore, categories[], isp
  Use for:  Attacker IP + attacker country code

SOURCE 2: AlienVault OTX Pulses (SECONDARY — ENRICHMENT)
  URL:      https://otx.alienvault.com/api/v1/pulses/subscribed
  Auth:     Header "X-OTX-API-KEY: {OTX_API_KEY}"
  Free:     Completely free. 19M+ threat indicators daily.
  Signup:   https://otx.alienvault.com → register → profile → OTX KEY
  Gives:    targeted_countries[], adversary name, attack tags, indicators with IPs
  Use for:  Attacker country → target country mapping (best source for this)

SOURCE 3: ip-api.com (IP GEOLOCATION — NO KEY NEEDED)
  URL:      http://ip-api.com/json/{ip}    NOTE: HTTP not HTTPS on free tier
  Auth:     None required
  Free:     45 requests/minute
  Gives:    country, countryCode, lat, lon, city
  Use for:  Converting attacker IP to lat/lon coordinates

SOURCE 4: Demo fallback
  If both API keys are missing, generate synthetic attack data (hardcoded pairs).
  Never return an empty response. Always show something on the globe.

---

## NEW .env KEYS — TELL USER TO ADD THESE

  ABUSEIPDB_API_KEY=your_key_here
  OTX_API_KEY=your_key_here

Both are completely free, no credit card required.

---

## COUNTRY CENTROID LOOKUP TABLE

Store this dict in the backend. These are lat/lon coordinates for the geographic
center of each country — used as arc start/end points on the globe.

COUNTRY_CENTROIDS = {
    "US": {"lat": 37.09, "lon": -95.71, "name": "United States"},
    "CN": {"lat": 35.86, "lon": 104.19, "name": "China"},
    "RU": {"lat": 61.52, "lon": 105.31, "name": "Russia"},
    "DE": {"lat": 51.16, "lon": 10.45,  "name": "Germany"},
    "GB": {"lat": 55.37, "lon": -3.43,  "name": "United Kingdom"},
    "FR": {"lat": 46.22, "lon": 2.21,   "name": "France"},
    "NL": {"lat": 52.13, "lon": 5.29,   "name": "Netherlands"},
    "IN": {"lat": 20.59, "lon": 78.96,  "name": "India"},
    "BR": {"lat": -14.23,"lon": -51.92, "name": "Brazil"},
    "KR": {"lat": 35.90, "lon": 127.76, "name": "South Korea"},
    "JP": {"lat": 36.20, "lon": 138.25, "name": "Japan"},
    "UA": {"lat": 48.37, "lon": 31.16,  "name": "Ukraine"},
    "IL": {"lat": 31.04, "lon": 34.85,  "name": "Israel"},
    "IR": {"lat": 32.42, "lon": 53.68,  "name": "Iran"},
    "KP": {"lat": 40.33, "lon": 127.51, "name": "North Korea"},
    "AU": {"lat": -25.27,"lon": 133.77, "name": "Australia"},
    "CA": {"lat": 56.13, "lon": -106.34,"name": "Canada"},
    "SG": {"lat": 1.35,  "lon": 103.81, "name": "Singapore"},
    "HK": {"lat": 22.39, "lon": 114.10, "name": "Hong Kong"},
    "TR": {"lat": 38.96, "lon": 35.24,  "name": "Turkey"},
    "PL": {"lat": 51.91, "lon": 19.14,  "name": "Poland"},
    "RO": {"lat": 45.94, "lon": 24.96,  "name": "Romania"},
    "ID": {"lat": -0.78, "lon": 113.92, "name": "Indonesia"},
    "VN": {"lat": 14.05, "lon": 108.27, "name": "Vietnam"},
    "TW": {"lat": 23.69, "lon": 120.96, "name": "Taiwan"},
    "PK": {"lat": 30.37, "lon": 69.34,  "name": "Pakistan"},
    "EG": {"lat": 26.82, "lon": 30.80,  "name": "Egypt"},
    "ZA": {"lat": -30.55,"lon": 22.93,  "name": "South Africa"},
    "MX": {"lat": 23.63, "lon": -102.55,"name": "Mexico"},
    "IT": {"lat": 41.87, "lon": 12.56,  "name": "Italy"},
    "ES": {"lat": 40.46, "lon": -3.74,  "name": "Spain"},
    "SE": {"lat": 60.12, "lon": 18.64,  "name": "Sweden"},
    "BY": {"lat": 53.70, "lon": 27.95,  "name": "Belarus"},
    "AR": {"lat": -38.41,"lon": -63.61, "name": "Argentina"},
    "CH": {"lat": 46.81, "lon": 8.22,   "name": "Switzerland"},
}

---

## ATTACK TYPE INFERENCE FROM ABUSEIPDB CATEGORIES

AbuseIPDB gives a list of category numbers per IP. Map them to attack type strings:

CATEGORY_ATTACK_MAP = {
    4:  "DDoS",           6:  "DDoS",           20: "DDoS",
    5:  "BRUTE_FORCE",    18: "BRUTE_FORCE_SSH", 19: "BRUTE_FORCE_RDP",
    7:  "PHISHING",       11: "WEB_SPAM",        12: "EMAIL_SPAM",
    14: "PORT_SCAN",      15: "HACKING",         16: "SQL_INJECTION",
    17: "SPOOFING",       21: "BRUTE_FORCE_WEB", 22: "XSS",
    23: "CRYPTO_MINING",
}

---

## TARGET COUNTRY INFERENCE

AbuseIPDB only tells you the attacker. You must infer the target.
Use this two-step logic:

STEP A: If the IP appears in an OTX pulse with targeted_countries[], use those.
STEP B: If not, use this map to pick a realistic target:

ATTACK_TARGET_MAP = {
    "DDoS":             ["US", "KR", "DE", "GB", "JP", "CN"],
    "BRUTE_FORCE":      ["DE", "NL", "US", "GB", "AU", "FR"],
    "BRUTE_FORCE_SSH":  ["DE", "NL", "US", "GB", "AU"],
    "BRUTE_FORCE_RDP":  ["US", "DE", "NL", "RO", "GB"],
    "PHISHING":         ["US", "GB", "DE", "FR", "IN"],
    "PORT_SCAN":        ["US", "DE", "CN", "RU", "KR"],
    "HACKING":          ["US", "DE", "GB", "UA", "IL"],
    "SQL_INJECTION":    ["US", "GB", "IN", "DE", "FR"],
    "RANSOMWARE":       ["US", "DE", "GB", "FR", "AU"],
    "MALWARE":          ["US", "DE", "IN", "BR", "MX"],
    "CRYPTO_MINING":    ["US", "DE", "NL", "GB", "SG"],
    "XSS":              ["US", "GB", "IN", "DE", "BR"],
    "SPOOFING":         ["US", "DE", "GB", "JP", "AU"],
    "UNKNOWN":          ["US", "DE", "GB", "FR", "JP"],
}

Pick randomly from the list. Never pick the same country as the attacker.

---

## ATTACK TYPE COLOR MAPPING

ATTACK_COLORS = {
    "DDoS":             "#ff0000",
    "RANSOMWARE":       "#ff2200",
    "BRUTE_FORCE_SSH":  "#ff4400",
    "BRUTE_FORCE_RDP":  "#ff4400",
    "BRUTE_FORCE":      "#ff4400",
    "SQL_INJECTION":    "#ff6600",
    "PHISHING":         "#ff8800",
    "PORT_SCAN":        "#ffaa00",
    "HACKING":          "#ff1100",
    "MALWARE":          "#cc0000",
    "CRYPTO_MINING":    "#ff9900",
    "XSS":              "#ff6600",
    "SPOOFING":         "#ff0055",
    "UNKNOWN":          "#ff0000",
}

---

## BACKEND — backend/routers/cyber_attacks.py

Create this file completely. No placeholders. All functions fully implemented.

"""
cyber_attacks.py — God's Eye Cyber Attack Tracker
"""
import httpx, os, random, asyncio
from fastapi import APIRouter
from datetime import datetime, timedelta
from typing import List, Dict, Optional

router = APIRouter()

ABUSEIPDB_KEY = os.getenv("ABUSEIPDB_API_KEY", "")
OTX_KEY       = os.getenv("OTX_API_KEY", "")

ABUSEIPDB_URL = "https://api.abuseipdb.com/api/v2/blacklist"
OTX_PULSES_URL = "https://otx.alienvault.com/api/v1/pulses/subscribed"

# Paste the full COUNTRY_CENTROIDS dict from above here
# Paste the full CATEGORY_ATTACK_MAP dict from above here
# Paste the full ATTACK_TARGET_MAP dict from above here
# Paste the full ATTACK_COLORS dict from above here

_attack_cache: Dict = {"data": [], "fetched_at": None}
CACHE_TTL = 60

def _cache_fresh():
    if not _attack_cache["fetched_at"]: return False
    return (datetime.utcnow() - _attack_cache["fetched_at"]).total_seconds() < CACHE_TTL

def _infer_attack_type(categories: list) -> str:
    for c in categories:
        if c in CATEGORY_ATTACK_MAP:
            return CATEGORY_ATTACK_MAP[c]
    return "UNKNOWN"

def _pick_target(attack_type: str, attacker_cc: str):
    candidates = [t for t in ATTACK_TARGET_MAP.get(attack_type, ["US","DE","GB"])
                  if t != attacker_cc and t in COUNTRY_CENTROIDS]
    if not candidates:
        candidates = [k for k in COUNTRY_CENTROIDS if k != attacker_cc]
    cc = random.choice(candidates)
    return COUNTRY_CENTROIDS[cc], cc

def _guess_adversary_origin(adversary: str) -> Optional[str]:
    ACTOR_ORIGINS = {
        "apt28":"RU","fancy bear":"RU","sandworm":"RU","cozy bear":"RU","apt29":"RU",
        "turla":"RU","energetic bear":"RU","apt1":"CN","apt10":"CN","apt41":"CN",
        "mustang panda":"CN","lazarus":"KP","apt38":"KP","kimsuky":"KP",
        "apt33":"IR","apt34":"IR","charming kitten":"IR","oilrig":"IR",
        "darkside":"RU","revil":"RU","lockbit":"RU",
    }
    a = adversary.lower()
    for key, cc in ACTOR_ORIGINS.items():
        if key in a:
            return cc if cc in COUNTRY_CENTROIDS else None
    return None

def _demo_attacks() -> List[Dict]:
    pairs = [
        ("CN","US","PORT_SCAN"),("RU","UA","HACKING"),("CN","DE","SQL_INJECTION"),
        ("RU","US","BRUTE_FORCE_SSH"),("KP","KR","HACKING"),("IR","IL","HACKING"),
        ("US","RU","PORT_SCAN"),("IN","US","PORT_SCAN"),("BR","US","EMAIL_SPAM"),
        ("RO","DE","BRUTE_FORCE_RDP"),("CN","JP","DDoS"),("RU","GB","PHISHING"),
        ("KP","US","RANSOMWARE"),("CN","AU","HACKING"),("RU","PL","DDoS"),
        ("IR","US","PORT_SCAN"),("CN","TW","DDoS"),("RU","FR","PHISHING"),
        ("IN","DE","SQL_INJECTION"),("VN","US","MALWARE"),("BY","UA","HACKING"),
        ("TR","DE","BRUTE_FORCE_SSH"),("RO","FR","BRUTE_FORCE_RDP"),
    ]
    out = []
    for i,(src,dst,atype) in enumerate(pairs):
        if src not in COUNTRY_CENTROIDS or dst not in COUNTRY_CENTROIDS: continue
        sg,dg = COUNTRY_CENTROIDS[src], COUNTRY_CENTROIDS[dst]
        out.append({
            "id": f"demo_{i}", "attacker_ip": f"DEMO_{src}",
            "from_cc": src, "from_name": sg["name"], "from_lat": sg["lat"], "from_lon": sg["lon"],
            "to_cc": dst,   "to_name":   dg["name"], "to_lat":   dg["lat"], "to_lon":   dg["lon"],
            "attack_type": atype, "color": ATTACK_COLORS.get(atype,"#ff0000"),
            "severity": random.choice(["HIGH","MEDIUM","HIGH","HIGH"]),
            "confidence": random.randint(85,100), "isp": "DEMO DATA", "source": "DEMO",
            "timestamp": datetime.utcnow().isoformat(),
        })
    return out


@router.get("/api/cyber/attacks")
async def get_cyber_attacks():
    if _cache_fresh():
        return {"attacks": _attack_cache["data"], "total": len(_attack_cache["data"]), "cached": True}

    attacks = []

    # SOURCE 1: AbuseIPDB
    if ABUSEIPDB_KEY:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                r = await client.get(
                    ABUSEIPDB_URL,
                    headers={"Key": ABUSEIPDB_KEY, "Accept": "application/json"},
                    params={"confidenceMinimum": 90, "limit": 100}
                )
                data = r.json()
            for item in data.get("data", [])[:50]:
                acc = item.get("countryCode","")
                if not acc or acc not in COUNTRY_CENTROIDS: continue
                atype = _infer_attack_type(item.get("categories",[]))
                tgeo, tcc = _pick_target(atype, acc)
                ageo = COUNTRY_CENTROIDS[acc]
                attacks.append({
                    "id":          f"abuse_{item.get('ipAddress','').replace('.','_')}",
                    "attacker_ip": item.get("ipAddress",""),
                    "from_cc": acc,    "from_name": ageo["name"],
                    "from_lat": ageo["lat"], "from_lon": ageo["lon"],
                    "to_cc": tcc,      "to_name": tgeo["name"],
                    "to_lat": tgeo["lat"], "to_lon": tgeo["lon"],
                    "attack_type": atype,
                    "color": ATTACK_COLORS.get(atype,"#ff0000"),
                    "severity": "HIGH" if item.get("abuseConfidenceScore",0) >= 95 else "MEDIUM",
                    "confidence": item.get("abuseConfidenceScore",0),
                    "isp": item.get("isp","UNKNOWN"), "source": "AbuseIPDB",
                    "timestamp": item.get("lastReportedAt", datetime.utcnow().isoformat()),
                })
        except Exception as e:
            print(f"[CYBER] AbuseIPDB error: {e}")

    # SOURCE 2: AlienVault OTX
    if OTX_KEY:
        try:
            since = (datetime.utcnow()-timedelta(hours=4)).strftime('%Y-%m-%dT%H:%M:%S')
            async with httpx.AsyncClient(timeout=20) as client:
                r = await client.get(
                    OTX_PULSES_URL,
                    headers={"X-OTX-API-KEY": OTX_KEY},
                    params={"limit": 10, "modified_since": since}
                )
                otx = r.json()
            for pulse in otx.get("results",[]):
                targeted = pulse.get("targeted_countries",[])
                tags = [t.lower() for t in pulse.get("tags",[])]
                atype = "HACKING"
                if any(t in tags for t in ["ransomware"]): atype = "RANSOMWARE"
                elif any(t in tags for t in ["phishing"]): atype = "PHISHING"
                elif any(t in tags for t in ["ddos","dos"]): atype = "DDoS"
                elif any(t in tags for t in ["malware","rat"]): atype = "MALWARE"
                adversary = pulse.get("adversary","")
                attacker_cc = _guess_adversary_origin(adversary)
                if not attacker_cc: continue
                for i,tname in enumerate(targeted[:3]):
                    tcc = next((cc for cc,g in COUNTRY_CENTROIDS.items()
                                if g["name"].lower()==tname.lower()), None)
                    if not tcc or tcc==attacker_cc: continue
                    ag, tg = COUNTRY_CENTROIDS[attacker_cc], COUNTRY_CENTROIDS[tcc]
                    attacks.append({
                        "id": f"otx_{pulse.get('id','')}_{i}",
                        "attacker_ip": adversary or "UNKNOWN",
                        "from_cc": attacker_cc, "from_name": ag["name"],
                        "from_lat": ag["lat"],  "from_lon": ag["lon"],
                        "to_cc": tcc,           "to_name": tg["name"],
                        "to_lat": tg["lat"],    "to_lon": tg["lon"],
                        "attack_type": atype,
                        "color": ATTACK_COLORS.get(atype,"#ff0000"),
                        "severity": "HIGH", "confidence": 85,
                        "isp": pulse.get("author",{}).get("username","OTX"),
                        "source": "AlienVault OTX",
                        "pulse_name": pulse.get("name","")[:60],
                        "timestamp": pulse.get("modified", datetime.utcnow().isoformat()),
                    })
        except Exception as e:
            print(f"[CYBER] OTX error: {e}")

    if not attacks:
        attacks = _demo_attacks()

    _attack_cache["data"] = attacks
    _attack_cache["fetched_at"] = datetime.utcnow()
    return {"attacks": attacks, "total": len(attacks), "cached": False}


@router.get("/api/cyber/stats")
async def get_cyber_stats():
    if not _attack_cache["data"]:
        return {"total": 0, "by_type": {}, "top_sources": [], "top_targets": []}
    attacks = _attack_cache["data"]
    by_type, by_src, by_tgt = {}, {}, {}
    for a in attacks:
        by_type[a["attack_type"]] = by_type.get(a["attack_type"],0)+1
        by_src[a["from_name"]]    = by_src.get(a["from_name"],0)+1
        by_tgt[a["to_name"]]      = by_tgt.get(a["to_name"],0)+1
    return {
        "total": len(attacks),
        "by_type": dict(sorted(by_type.items(),key=lambda x:-x[1])[:8]),
        "top_sources": sorted(by_src.items(),key=lambda x:-x[1])[:5],
        "top_targets": sorted(by_tgt.items(),key=lambda x:-x[1])[:5],
        "last_updated": _attack_cache["fetched_at"].isoformat() if _attack_cache["fetched_at"] else None,
    }


After creating the file, add to backend/main.py:
  from backend.routers.cyber_attacks import router as cyber_router
  app.include_router(cyber_router)

---

## THE ANIMATION — COMPLETE LOGIC REFERENCE

### Arc Geometry Function

function computeArcPoints(fromLon, fromLat, toLon, toLat) {
  const N = 60;
  const dLon = (toLon - fromLon) * Math.PI / 180;
  const dLat = (toLat - fromLat) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(fromLat * Math.PI/180) *
    Math.cos(toLat   * Math.PI/180) *
    Math.sin(dLon/2)**2;
  const distDeg    = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 180/Math.PI;
  const peakHeight = Math.min(1500000, Math.max(300000, distDeg * 18000));

  return Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    return {
      lon:    fromLon + (toLon - fromLon) * t,
      lat:    fromLat + (toLat - fromLat) * t,
      height: Math.sin(Math.PI * t) * peakHeight,
    };
  });
}

Key: peakHeight scales with distance. Short range = 300km peak. Intercontinental = up to 1500km peak.

### Animation State Per Arc

Use a single Map stored in a useRef. Key = attack.id.
Initialize with random elapsed offset so arcs do not all fire simultaneously.

animStates.current.set(attack.id, {
  elapsed:  Math.random() * TOTAL_CYCLE,   // random start
  lastTime: performance.now(),
});

DRAW_DURATION  = 1200   // ms
HOLD_DURATION  = 200    // ms
ERASE_DURATION = 800    // ms
TOTAL_CYCLE    = 2200   // ms (sum of above)

### Animation Loop

Run ONE requestAnimationFrame loop that updates all arcs.

const loop = (timestamp) => {
  animStates.current.forEach((state, attackId) => {
    const dt = Math.min(timestamp - state.lastTime, 100);  // cap dt, prevents huge jumps
    state.lastTime = timestamp;
    state.elapsed  = (state.elapsed + dt) % TOTAL_CYCLE;

    let startFraction, endFraction;

    if (state.elapsed < DRAW_DURATION) {
      // DRAW PHASE: head moves forward, tail fixed at origin
      endFraction   = state.elapsed / DRAW_DURATION;   // 0 → 1
      startFraction = 0;
    } else if (state.elapsed < DRAW_DURATION + HOLD_DURATION) {
      // HOLD PHASE: full arc visible
      startFraction = 0;
      endFraction   = 1;
    } else {
      // ERASE PHASE: tail chases head (tail moves forward from 0 → 1)
      const eraseP  = (state.elapsed - DRAW_DURATION - HOLD_DURATION) / ERASE_DURATION;
      startFraction = eraseP;  // 0 → 1 (tail advances forward = line disappears from source)
      endFraction   = 1;
    }

    // Slice the arc points array and update entity
    updateArcEntity(attackId, startFraction, endFraction);
  });
  rafHandle.current = requestAnimationFrame(loop);
};

### Updating Entity Positions

CRITICAL: Do NOT use CallbackProperty — it causes performance issues with 30+ arcs.
Instead, replace the ConstantProperty each frame.

function updateArcEntity(attackId, startFraction, endFraction) {
  const ds = viewerRef.current?.dataSources.getByName('cyber-attacks')[0];
  if (!ds) return;
  const entity   = ds.entities.getById(attackId);
  if (!entity?.polyline) return;
  const allPoints = arcPointsCache.current.get(attackId);
  if (!allPoints) return;

  const N        = allPoints.length - 1;
  const startIdx = Math.floor(startFraction * N);
  const endIdx   = Math.max(startIdx + 1, Math.ceil(endFraction * N));

  if (startIdx >= allPoints.length - 1 || endIdx <= 0) {
    entity.polyline.positions = new Cesium.ConstantProperty([]);
    return;
  }

  const positions = allPoints.slice(startIdx, endIdx + 1).map(p =>
    Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.height)
  );
  entity.polyline.positions = new Cesium.ConstantProperty(positions);
}

### Creating Entities (Called Once on Data Load)

function createAttackEntities(attacks, viewer) {
  let ds = viewer.dataSources.getByName('cyber-attacks')[0];
  if (!ds) {
    ds = new Cesium.CustomDataSource('cyber-attacks');
    viewer.dataSources.add(ds);
  }
  ds.entities.removeAll();
  arcPointsCache.current.clear();

  attacks.forEach(attack => {
    const points = computeArcPoints(
      attack.from_lon, attack.from_lat,
      attack.to_lon,   attack.to_lat
    );
    arcPointsCache.current.set(attack.id, points);

    // Init animation state with random offset
    animStates.current.set(attack.id, {
      elapsed:  Math.random() * TOTAL_CYCLE,
      lastTime: performance.now(),
    });

    ds.entities.add({
      id: attack.id,
      polyline: {
        positions:     new Cesium.ConstantProperty([]),   // animation fills this
        width:         attack.severity === 'HIGH' ? 3.5 : 2,
        material:      new Cesium.PolylineGlowMaterialProperty({
          glowPower:   0.3,
          taperPower:  1.0,
          color:       Cesium.Color.fromCssColorString(attack.color),
        }),
        arcType:       Cesium.ArcType.NONE,   // CRITICAL: must be NONE for elevated arcs
        clampToGround: false,
        show:          true,
      },
      properties: { ...attack },   // store attack data for click popup
    });
  });
}

---

## FRONTEND — frontend/src/components/CyberAttackLayer.jsx

Create this file completely. All logic above implemented inside it.

The component structure:
  - useEffect: fetch /api/cyber/attacks and /api/cyber/stats every 60s
  - useEffect: when attacks state changes, call createAttackEntities()
  - useEffect: start requestAnimationFrame loop
  - useEffect cleanup: cancelAnimationFrame + destroy click handler + remove DataSource
  - useEffect: toggle ds.show = isLayerVisible
  - Render: Stats side panel (fixed position, top-right) + Click popup

Props:
  viewerRef       — ref to the CesiumJS viewer (passed from Globe.jsx or App.jsx)
  isLayerVisible  — boolean, controlled by LayerControls

### Click Handler

Setup a Cesium.ScreenSpaceEventHandler on viewer.canvas.
On LEFT_CLICK: pick entity, read entity.properties, show popup with attack details.
Click on empty globe: hide popup.

Store handler in a useRef. Destroy it in cleanup.

### Stats Panel — what to show

Fixed div, top-right corner.
  - Total active attacks (big red number)
  - Bar chart of attacks by type (proportional width bars, colored by type)
  - Top 3 source countries with count
  - Top 3 target countries with count
  - Blinking dot when loading

### Popup — what to show on arc click

Fixed div, centered bottom.
  - Title: attack type in large colored text
  - FROM: country name [CC]
  - TO:   country name [CC]
  - IP:   attacker IP
  - ISP:  attacker ISP
  - SEVERITY: colored HIGH/MEDIUM
  - SOURCE: AbuseIPDB / AlienVault OTX / DEMO
  - Close button (X) top right

---

## CSS — Append to frontend/src/index.css

/* ═══════════════════════════════════════
   CYBER ATTACK TRACKER
   ═══════════════════════════════════════ */

.cyber-stats-panel {
  position: fixed;
  top: 220px; right: 16px;
  width: 240px; padding: 12px;
  background: rgba(0,0,0,0.88);
  border: 1px solid rgba(255,0,0,0.4);
  z-index: 1000;
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px; color: #ff4444;
}

.cyber-stats-panel .panel-label {
  font-size: 10px; letter-spacing: 2px;
  color: #ff0000; margin-bottom: 10px;
  display: flex; align-items: center; gap: 8px;
}

.status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.status-dot.active  { background: #ff0000; animation: blink 1s infinite; }
.status-dot.loading { background: #ff8800; animation: blink 0.5s infinite; }

.cyber-total { text-align: center; margin: 8px 0 12px; }
.cyber-total .total-num   { font-size: 36px; color: #ff0000; display: block; font-weight: bold; }
.cyber-total .total-label { font-size: 9px; letter-spacing: 3px; color: rgba(255,0,0,0.6); }

.cyber-section-title {
  color: rgba(255,100,100,0.5); font-size: 9px;
  letter-spacing: 2px; margin: 8px 0 4px;
}

.cyber-stat-row {
  display: flex; align-items: center;
  gap: 6px; margin-bottom: 3px; font-size: 10px;
}

.type-bar { height: 2px; min-width: 4px; border-radius: 1px; flex-shrink: 0; }
.type-label   { color: #ff8888; flex: 1; overflow: hidden; text-overflow: ellipsis; }
.type-count   { color: #ff4444; min-width: 20px; text-align: right; }
.source-name  { color: #ff8888; flex: 1; }
.source-count { color: rgba(255,100,100,0.6); font-size: 9px; }
.target-name  { color: #ff6666; flex: 1; }
.target-count { color: rgba(255,100,100,0.6); font-size: 9px; }

.cyber-popup {
  position: fixed; bottom: 120px; left: 50%;
  transform: translateX(-50%); width: 320px;
  padding: 14px 16px; background: rgba(0,0,0,0.92);
  z-index: 2000; font-family: 'Share Tech Mono', monospace; font-size: 11px;
}

.popup-close {
  position: absolute; top: 8px; right: 10px;
  background: none; border: none; color: rgba(255,100,100,0.6);
  cursor: pointer; font-size: 14px;
}
.popup-close:hover { color: #ff4444; }
.popup-title { font-size: 14px; letter-spacing: 2px; font-weight: bold; margin-bottom: 10px; }
.popup-row { display: flex; gap: 10px; margin-bottom: 4px; }
.popup-label { color: rgba(255,100,100,0.5); min-width: 65px; font-size: 10px; letter-spacing: 1px; }
.popup-val { color: #ffcccc; font-size: 10px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

---

## WIRING INTO App.jsx AND LayerControls.jsx

In App.jsx:
  import CyberAttackLayer from './components/CyberAttackLayer';
  // In JSX:
  <CyberAttackLayer
    viewerRef={globeViewerRef}
    isLayerVisible={activeLayers.includes('CYBER_ATTACKS')}
  />

In LayerControls.jsx — add button to existing layer toggles:
  <button
    className={`layer-btn ${activeLayers.includes('CYBER_ATTACKS') ? 'active' : ''}`}
    onClick={() => toggleLayer('CYBER_ATTACKS')}
    style={{ borderColor: '#ff0000', color: activeLayers.includes('CYBER_ATTACKS') ? '#ff0000' : 'rgba(255,0,0,0.4)' }}
  >
    ⚡ CYBER ATTACKS
  </button>

---

## DATABASE — Append to backend/database/db.py

class CyberAttackEvent(Base):
    __tablename__ = "cyber_attack_events"
    id           = Column(Integer, primary_key=True)
    event_id     = Column(String(100), unique=True, index=True)
    attacker_ip  = Column(String(50))
    from_cc      = Column(String(5))
    from_name    = Column(String(100))
    to_cc        = Column(String(5))
    to_name      = Column(String(100))
    attack_type  = Column(String(50))
    severity     = Column(String(20))
    confidence   = Column(Integer)
    source       = Column(String(50))
    color        = Column(String(10))
    isp          = Column(String(200))
    first_seen   = Column(DateTime, default=datetime.utcnow)
    last_seen    = Column(DateTime, default=datetime.utcnow)
    active       = Column(Boolean, default=True)

---

## ACCEPTANCE CRITERIA — VERIFY ALL BEFORE REPORTING DONE

[ ] GET /api/cyber/attacks returns at least 10 attack objects
[ ] Each object has: id, from_lat, from_lon, to_lat, to_lon, color, attack_type, severity
[ ] GET /api/cyber/stats returns total, by_type, top_sources, top_targets
[ ] Arcs render as elevated parabolic curves above the globe (not flat surface lines)
[ ] ArcType.NONE is explicitly set on every polyline entity
[ ] PolylineGlowMaterialProperty is used (arcs have visible glow)
[ ] DRAW phase: arc head grows forward from attacker country toward target
[ ] ERASE phase: arc disappears from the ORIGIN (attacker) end — NOT the target end
[ ] Multiple arcs animate simultaneously with different phase offsets (random start)
[ ] requestAnimationFrame loop runs at full 60fps with 30+ arcs without lag
[ ] Clicking an arc shows popup with correct from/to/type/severity data
[ ] Stats panel shows total count, type breakdown bars, top source/target countries
[ ] Layer toggle button (CYBER ATTACKS) hides/shows arcs without crashing
[ ] After 60s, data auto-refreshes and new arcs appear without page reload
[ ] cancelAnimationFrame called on component unmount (no memory leaks)
[ ] Click handler destroyed on unmount (no duplicate event listeners)
[ ] Demo data appears when both API keys are missing (graceful degradation)
[ ] Arcs from opposite sides of globe (e.g. CN → US) have visibly higher peak than short hops

---

## REPORT FORMAT ON COMPLETION

  CYBER ATTACK TRACKER — COMPLETE

  Created:
    - backend/routers/cyber_attacks.py
    - frontend/src/components/CyberAttackLayer.jsx
    - DB model: CyberAttackEvent (appended to db.py)

  Edited:
    - backend/main.py           registered /api/cyber/* router
    - frontend/src/App.jsx      imported and rendered CyberAttackLayer
    - frontend/src/index.css    appended cyber attack styles
    - LayerControls.jsx         added CYBER ATTACKS toggle button

  Endpoints created:
    - GET /api/cyber/attacks
    - GET /api/cyber/stats

  New .env keys required:
    ABUSEIPDB_API_KEY  get free at: https://www.abuseipdb.com/register
    OTX_API_KEY        get free at: https://otx.alienvault.com/ (profile page)

  How to verify:
    1. Start backend and frontend
    2. Click CYBER ATTACKS layer button
    3. Red arcs appear within 3 seconds, animating across the globe
    4. Click any arc, popup appears with attack details
    5. Wait 60s, arcs refresh with new data automatically

---

God's Eye — Cyber Attack Tracker Feature v1.0
Standalone agent documentation. All data from public OSINT feeds.

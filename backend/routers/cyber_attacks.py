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
DSHIELD_URL = "https://isc.sans.edu/api/topips/50/json"

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

CATEGORY_ATTACK_MAP = {
    4:  "DDoS",           6:  "DDoS",           20: "DDoS",
    5:  "BRUTE_FORCE",    18: "BRUTE_FORCE_SSH", 19: "BRUTE_FORCE_RDP",
    7:  "PHISHING",       11: "WEB_SPAM",        12: "EMAIL_SPAM",
    14: "PORT_SCAN",      15: "HACKING",         16: "SQL_INJECTION",
    17: "SPOOFING",       21: "BRUTE_FORCE_WEB", 22: "XSS",
    23: "CRYPTO_MINING",
}

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


@router.get("/attacks")
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

    # SOURCE 3: DShield (No Key Required)
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(DSHIELD_URL)
            if r.status_code == 200:
                dshield_data = r.json()
                for item in dshield_data[:30]:
                    acc = item.get("country","")
                    if not acc or acc not in COUNTRY_CENTROIDS: continue
                    atype = "PORT_SCAN" # DShield mostly reports port scanning
                    tgeo, tcc = _pick_target(atype, acc)
                    ageo = COUNTRY_CENTROIDS[acc]
                    attacks.append({
                        "id":          f"dshield_{item.get('ip','').replace('.','_')}",
                        "attacker_ip": item.get("ip",""),
                        "from_cc": acc,    "from_name": ageo["name"],
                        "from_lat": ageo["lat"], "from_lon": ageo["lon"],
                        "to_cc": tcc,      "to_name": tgeo["name"],
                        "to_lat": tgeo["lat"], "to_lon": tgeo["lon"],
                        "attack_type": atype,
                        "color": ATTACK_COLORS.get(atype,"#ff0000"),
                        "severity": "HIGH" if int(item.get("count", 0)) > 500 else "MEDIUM",
                        "confidence": 99, # DShield is highly verified
                        "isp": "DShield / SANS ISC", "source": "DShield (LIVE REAL-TIME)",
                        "reports": item.get("count", 0),
                        "timestamp": datetime.utcnow().isoformat(),
                    })
    except Exception as e:
        print(f"[CYBER] DShield error: {e}")

    if not attacks:
        attacks = _demo_attacks()

    _attack_cache["data"] = attacks
    _attack_cache["fetched_at"] = datetime.utcnow()
    return {"attacks": attacks, "total": len(attacks), "cached": False}


@router.get("/stats")
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

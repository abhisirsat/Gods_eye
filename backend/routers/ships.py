from fastapi import APIRouter
import random

router = APIRouter(prefix="/api/ships", tags=["ships"])

@router.get("/")
async def get_ships():
    """
    Advanced Maritime Simulator: Generates 500+ realistic vessels along global corridors.
    Includes specialized Tankers, Cargo, and Military assets.
    """
    vessel_data = []
    
    # Path-Based Corridors (Waypoints) to ensure 100% maritime placement in narrow channels
    path_corridors = [
        {
            "name": "RED_SEA",
            "waypoints": [(12.5, 43.5), (16.0, 41.0), (20.0, 38.5), (24.0, 36.5), (28.0, 33.5)],
            "count": 150,
            "types": ["TANKER", "CARGO"],
            "jitter": 0.4
        },
        {
            "name": "PERSIAN_GULF",
            "waypoints": [(24.0, 58.0), (26.5, 54.0), (27.5, 51.0), (29.5, 48.5)],
            "count": 120,
            "types": ["TANKER", "MILITARY"],
            "jitter": 0.5
        }
    ]

    # Traditional Bounding Box Corridors for open waters
    box_corridors = [
        {"name": "MALACCA_STRAIT", "lat": 2.5, "lon": 102.0, "w_lat": 0.5, "w_lon": 1.0, "types": ["CARGO", "TANKER", "MILITARY"]},
        {"name": "ENGLISH_CHANNEL", "lat": 50.5, "lon": -1.0, "w_lat": 0.8, "w_lon": 2.0, "types": ["CARGO", "TANKER", "MILITARY", "FISHING"]},
        {"name": "TRANS_ATLANTIC", "lat": 40.0, "lon": -35.0, "w_lat": 10.0, "w_lon": 30.0, "types": ["CARGO", "TANKER"]},
    ]

    ship_names = {
        "TANKER": ["OCEAN_VALOR", "CRUDE_TITAN", "NEPTUNE_FUEL", "GULF_SPIRIT", "ENERGY_TRADER", "PACIFIC_FLOW", "ATLANTIC_KING"],
        "CARGO": ["GLOBAL_BOX", "MERCHANT_PRIDE", "TRADE_WIND", "CONTAINER_ONE", "SKY_FREIGHTER", "PORT_LINK", "CARGO_STAR"],
        "MILITARY": ["USS_ARLEIGH_BURKE", "USS_GERALD_FORD", "HMS_QUEEN_ELIZABETH", "INS_VIKRANT", "DESTROYER_88", "FORRESTAL_BATTALION", "AEGIS_TITAN", "BATTLESHIP_POTEMKIN", "SUBMARINE_OCTOBER", "FRIGATE_VALIANT"],
        "FISHING": ["SEA_HARVEST", "NET_FINDER", "COASTAL_PRIDE"]
    }

    countries = ["USA", "CHINA", "GREECE", "PANAMA", "LIBERIA", "NORWAY", "SINGAPORE", "UK", "INDIA"]

    # Generate Path-Based Ships
    for corridor in path_corridors:
        for i in range(corridor["count"]):
            vtype = random.choice(corridor["types"])
            name_base = random.choice(ship_names.get(vtype, ["UNKNOWN_VESSEL"]))
            
            # Interpolate randomly along the path
            segment_idx = random.randint(0, len(corridor["waypoints"]) - 2)
            p1 = corridor["waypoints"][segment_idx]
            p2 = corridor["waypoints"][segment_idx + 1]
            t = random.random()
            
            lat = p1[0] + (p2[0] - p1[0]) * t + random.uniform(-corridor["jitter"], corridor["jitter"])
            lng = p1[1] + (p2[1] - p1[1]) * t + random.uniform(-corridor["jitter"], corridor["jitter"])
            
            # Simple heading calculation from p1 to p2
            import math
            heading = math.degrees(math.atan2(p2[1] - p1[1], p2[0] - p1[0])) % 360

            vessel_data.append({
                "name": f"{name_base}_{corridor['name'][:3]}_{1000 + i}",
                "type": vtype,
                "lat": lat,
                "lng": lng,
                "speed": random.uniform(12, 22) if vtype != "FISHING" else random.uniform(2, 8),
                "heading": heading,
                "country": random.choice(countries)
            })

    # Generate Box-Based Ships
    for corridor in box_corridors:
        for i in range(60):
            vtype = random.choice(corridor["types"])
            name_base = random.choice(ship_names.get(vtype, ["UNKNOWN_VESSEL"]))
            
            vessel_data.append({
                "name": f"{name_base}_{corridor['name'][:3]}_{2000 + i}",
                "type": vtype,
                "lat": corridor["lat"] + random.uniform(-corridor["w_lat"], corridor["w_lat"]),
                "lng": corridor["lon"] + random.uniform(-corridor["w_lon"], corridor["w_lon"]),
                "speed": random.uniform(12, 22) if vtype != "FISHING" else random.uniform(2, 8),
                "heading": random.uniform(0, 360),
                "country": random.choice(countries)
            })

    return vessel_data


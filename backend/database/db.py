from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
import datetime
import os

# Database Path
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "database", "gods_eye.db")
DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

class IntelSignal(Base):
    __tablename__ = "intel_signals"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)  # FLIGHT, SHIP, SAT, NEWS, JAMMING
    source = Column(String)
    severity = Column(String) # LOW, MEDIUM, HIGH, CRITICAL
    location_lat = Column(Float)
    location_lng = Column(Float)
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    metadata_json = Column(String) # For extra data like callsign, etc.

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
    first_seen   = Column(DateTime, default=datetime.datetime.utcnow)
    last_seen    = Column(DateTime, default=datetime.datetime.utcnow)
    active       = Column(Boolean, default=True)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

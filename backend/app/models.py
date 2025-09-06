from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum

class AppStatus(str, enum.Enum):
    APPLIED = "APPLIED"
    INTERVIEWING = "INTERVIEWING"
    OFFER = "OFFER"
    REJECTED = "REJECTED"
    ON_HOLD = "ON_HOLD"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    company = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    status = Column(Enum(AppStatus), default=AppStatus.APPLIED, nullable=False)
    source = Column(String(255), nullable=True)  # e.g., LinkedIn, Company site
    location = Column(String(255), nullable=True)
    applied_date = Column(Date, nullable=True)
    next_action_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")

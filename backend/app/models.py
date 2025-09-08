from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum, Date, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum

class AppStatus(str, enum.Enum):
    APPLIED = "APPLIED"
    INTERVIEWING = "INTERVIEWING"
    OFFER = "OFFER"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    ON_HOLD = "ON_HOLD"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (
        CheckConstraint("length(trim(company)) >= 2", name="company_not_empty"),
        CheckConstraint("length(trim(role)) >= 2", name="role_not_empty"),
        CheckConstraint("length(trim(location)) >= 2", name="location_not_empty"),
        CheckConstraint("length(company) <= 255", name="company_max_length"),
        CheckConstraint("length(role) <= 255", name="role_max_length"),
        CheckConstraint("length(location) <= 255", name="location_max_length"),
        CheckConstraint("length(source) <= 255 OR source IS NULL", name="source_max_length"),
        CheckConstraint("length(notes) <= 5000 OR notes IS NULL", name="notes_max_length"),
    )
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    company = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    status = Column(Enum(AppStatus), default=AppStatus.APPLIED, nullable=False)
    source = Column(String(255), nullable=True)  # e.g., LinkedIn, Company site
    applied_date = Column(Date, nullable=True)
    next_action_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class AppStatus(str, Enum):
    APPLIED = "APPLIED"
    INTERVIEWING = "INTERVIEWING"
    OFFER = "OFFER"
    REJECTED = "REJECTED"
    ON_HOLD = "ON_HOLD"

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserRead(BaseModel):
    id: int
    email: EmailStr
    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    company: str
    role: str
    status: Optional[AppStatus] = AppStatus.APPLIED
    source: Optional[str] = None
    location: Optional[str] = None
    applied_date: Optional[date] = None
    next_action_date: Optional[date] = None
    notes: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[AppStatus] = None
    source: Optional[str] = None
    location: Optional[str] = None
    applied_date: Optional[date] = None
    next_action_date: Optional[date] = None
    notes: Optional[str] = None

class ApplicationRead(ApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

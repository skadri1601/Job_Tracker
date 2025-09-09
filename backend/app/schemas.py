from pydantic import BaseModel, EmailStr, field_validator, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

class AppStatus(str, Enum):
    APPLIED = "APPLIED"
    INTERVIEWING = "INTERVIEWING"
    OFFER = "OFFER"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    ON_HOLD = "ON_HOLD"

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128, description="Password must be at least 6 characters")
    first_name: str = Field(..., min_length=2, max_length=50, description="First name")
    last_name: str = Field(..., min_length=2, max_length=50, description="Last name")
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not v or not v.strip():
            raise ValueError('Password cannot be empty or only whitespace')
        if len(v.strip()) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v.strip()

    @field_validator('first_name', 'last_name')
    @classmethod
    def validate_names(cls, v):
        if not v or not v.strip():
            raise ValueError('Name cannot be empty or only whitespace')
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip()

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserRead(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=2, max_length=50)
    last_name: Optional[str] = Field(None, min_length=2, max_length=50)
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = Field(None, min_length=6, max_length=128)
    
    @field_validator('first_name', 'last_name')
    @classmethod
    def validate_names_update(cls, v):
        if v is not None:
            if not v or not v.strip():
                raise ValueError('Name cannot be empty or only whitespace')
            if len(v.strip()) < 2:
                raise ValueError('Name must be at least 2 characters long')
            return v.strip()
        return v
    
    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        if v is not None:
            if not v or not v.strip():
                raise ValueError('New password cannot be empty or only whitespace')
            if len(v.strip()) < 6:
                raise ValueError('New password must be at least 6 characters long')
            return v.strip()
        return v

class ApplicationBase(BaseModel):
    company: str = Field(..., min_length=2, max_length=255, description="Company name")
    role: str = Field(..., min_length=2, max_length=255, description="Job role/position")
    location: str = Field(..., min_length=2, max_length=255, description="Job location")
    status: Optional[AppStatus] = AppStatus.APPLIED
    source: Optional[str] = Field(None, max_length=255)
    applied_date: Optional[date] = None
    next_action_date: Optional[date] = None
    last_contact_date: Optional[date] = None
    follow_up_date: Optional[date] = None
    follow_up_sent: Optional[int] = 0
    reminder_enabled: Optional[bool] = True
    notes: Optional[str] = Field(None, max_length=5000)
    
    @field_validator('company', 'role', 'location')
    @classmethod
    def validate_required_fields(cls, v):
        if not v or not v.strip():
            raise ValueError('Field cannot be empty or only whitespace')
        return v.strip()
    
    @field_validator('source', 'notes')
    @classmethod
    def validate_optional_fields(cls, v):
        if v is not None and isinstance(v, str):
            stripped = v.strip()
            return stripped if stripped else None
        return v

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    company: Optional[str] = Field(None, min_length=2, max_length=255)
    role: Optional[str] = Field(None, min_length=2, max_length=255)
    location: Optional[str] = Field(None, min_length=2, max_length=255)
    status: Optional[AppStatus] = None
    source: Optional[str] = Field(None, max_length=255)
    applied_date: Optional[date] = None
    next_action_date: Optional[date] = None
    last_contact_date: Optional[date] = None
    follow_up_date: Optional[date] = None
    follow_up_sent: Optional[int] = None
    reminder_enabled: Optional[bool] = None
    notes: Optional[str] = Field(None, max_length=5000)
    
    @field_validator('company', 'role', 'location')
    @classmethod
    def validate_required_fields_update(cls, v):
        if v is not None:
            if not v or not v.strip():
                raise ValueError('Field cannot be empty or only whitespace')
            return v.strip()
        return v
    
    @field_validator('source', 'notes')
    @classmethod
    def validate_optional_fields_update(cls, v):
        if v is not None and isinstance(v, str):
            stripped = v.strip()
            return stripped if stripped else None
        return v

class ApplicationRead(BaseModel):
    id: int
    user_id: int
    company: str
    role: str
    location: str
    status: AppStatus = AppStatus.APPLIED
    source: Optional[str] = None
    applied_date: Optional[date] = None
    next_action_date: Optional[date] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

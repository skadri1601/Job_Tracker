from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..deps import get_db, get_current_user
from ..services.email_parser import parse_email
from .. import models, schemas

router = APIRouter(prefix="/emails", tags=["emails"])

class EmailIngestRequest(BaseModel):
    email_text: str

@router.post("/ingest", response_model=schemas.ApplicationRead)
def ingest_email(
    request: EmailIngestRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    from fastapi import HTTPException
    
    parsed = parse_email(request.email_text)
    company = parsed.get("company")
    role = parsed.get("role")
    location = parsed.get("location") or "Remote"  # Default location since it's required
    
    # Validation: Reject if company or role couldn't be extracted
    if not company or company.strip().lower() in ['unknown company', 'unknown', '']:
        raise HTTPException(
            status_code=400, 
            detail="Could not extract company name from email. Please ensure the email contains clear company information or add the application manually."
        )
    
    if not role or role.strip().lower() in ['unknown role', 'unknown', '']:
        raise HTTPException(
            status_code=400, 
            detail="Could not extract job role from email. Please ensure the email contains clear role information or add the application manually."
        )
    
    # Use detected status from email parsing, fallback to APPLIED
    detected_status = parsed.get("status", "APPLIED")
    try:
        status = models.AppStatus(detected_status)
    except ValueError:
        # If the detected status is invalid, default to APPLIED
        status = models.AppStatus.APPLIED
    
    app = models.Application(
        user_id=user.id,
        company=company.strip(),
        role=role.strip(),
        location=location,
        status=status
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app
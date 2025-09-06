from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..deps import get_db, get_current_user
from ..services.email_parser import parse_email
from .. import models, schemas

router = APIRouter(prefix="/emails", tags=["emails"])

@router.post("/ingest", response_model=schemas.ApplicationRead)
def ingest_email(sample_text: str, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    parsed = parse_email(sample_text)
    company = parsed.get("company") or "Unknown Company"
    role = parsed.get("role") or "Unknown Role"
    app = models.Application(user_id=user.id, company=company, role=role, status=models.AppStatus.APPLIED)
    db.add(app); db.commit(); db.refresh(app)
    return app

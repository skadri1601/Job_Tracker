from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..deps import get_db, get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])

@router.get("/", response_model=List[schemas.ApplicationRead])
def list_applications(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return db.query(models.Application).filter(models.Application.user_id == user.id).order_by(models.Application.updated_at.desc()).all()

@router.post("/", response_model=schemas.ApplicationRead)
def create_application(app: schemas.ApplicationCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    obj = models.Application(user_id=user.id, **app.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.patch("/{app_id}", response_model=schemas.ApplicationRead)
def update_application(app_id: int, patch: schemas.ApplicationUpdate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    obj = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == user.id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Application not found")
    for k, v in patch.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit(); db.refresh(obj)
    return obj

@router.delete("/{app_id}")
def delete_application(app_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    obj = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == user.id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(obj); db.commit()
    return {"ok": True}

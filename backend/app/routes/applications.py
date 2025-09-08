from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..deps import get_db, get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])

@router.get("/", response_model=List[schemas.ApplicationRead])
def list_applications(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    applications = db.query(models.Application).filter(models.Application.user_id == user.id).order_by(models.Application.updated_at.desc()).all()
    # Filter out invalid records that don't meet new validation requirements
    valid_applications = []
    for app in applications:
        if (app.company and len(app.company.strip()) >= 2 and 
            app.role and len(app.role.strip()) >= 2 and
            app.location and len(app.location.strip()) >= 2):
            valid_applications.append(app)
    return valid_applications

@router.post("/", response_model=schemas.ApplicationRead)
def create_application(app: schemas.ApplicationCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    try:
        app_data = app.model_dump() if hasattr(app, 'model_dump') else app.dict()
        obj = models.Application(user_id=user.id, **app_data)
        db.add(obj); db.commit(); db.refresh(obj)
        return obj
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating application: {str(e)}")

@router.patch("/{app_id}", response_model=schemas.ApplicationRead)
def update_application(app_id: int, patch: schemas.ApplicationUpdate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    obj = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == user.id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Application not found")
    try:
        patch_data = patch.model_dump(exclude_unset=True) if hasattr(patch, 'model_dump') else patch.dict(exclude_unset=True)
        for k, v in patch_data.items():
            setattr(obj, k, v)
        db.commit(); db.refresh(obj)
        return obj
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating application: {str(e)}")

@router.delete("/{app_id}")
def delete_application(app_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    obj = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == user.id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(obj); db.commit()
    return {"ok": True}

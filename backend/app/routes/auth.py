from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import Base, engine
from ..deps import get_db, get_current_user
from ..utils.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])
Base.metadata.create_all(bind=engine)

@router.post("/register", response_model=schemas.UserRead)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed = get_password_hash(user.password)
    u = models.User(
        email=user.email, 
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed
    )
    db.add(u); db.commit(); db.refresh(u)
    return u

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    u = db.query(models.User).filter(models.User.email == user.email).first()
    if not u or not verify_password(user.password, u.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(u.email)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserRead)
def get_current_user_profile(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=schemas.UserRead)
def update_current_user_profile(
    user_update: schemas.UserUpdate, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update name fields if provided
    if user_update.first_name is not None:
        current_user.first_name = user_update.first_name
    if user_update.last_name is not None:
        current_user.last_name = user_update.last_name
    if user_update.email is not None:
        # Check if email is already taken by another user
        existing_user = db.query(models.User).filter(
            models.User.email == user_update.email,
            models.User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Email already registered by another user"
            )
        current_user.email = user_update.email
    
    # Handle password change if requested
    if user_update.new_password is not None:
        if user_update.current_password is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is required to change password"
            )
        
        # Verify current password
        if not verify_password(user_update.current_password, current_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Update password
        current_user.hashed_password = get_password_hash(user_update.new_password)
    
    db.commit()
    db.refresh(current_user)
    return current_user

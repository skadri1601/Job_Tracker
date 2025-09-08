from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import Base, engine
from ..deps import get_db
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

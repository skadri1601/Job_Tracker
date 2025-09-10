#!/usr/bin/env python3

from app.models import User
from passlib.context import CryptContext
from sqlalchemy.orm import sessionmaker
from app.database import engine

# Create password hasher
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# Get database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == 'test@example.com').first()
    if existing_user:
        print('Test user already exists!')
        print('Email: test@example.com')
        print('Password: password123')
    else:
        # Create test user
        hashed_password = pwd_context.hash('password123')
        user = User(
            email='test@example.com',
            first_name='Demo',
            last_name='User',
            hashed_password=hashed_password
        )
        db.add(user)
        db.commit()
        print('Test user created successfully!')
        print('Email: test@example.com')
        print('Password: password123')
except Exception as e:
    print(f'Error creating user: {e}')
    db.rollback()
finally:
    db.close()
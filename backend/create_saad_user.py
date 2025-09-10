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
    existing_user = db.query(User).filter(User.email == 'saad.kadri@gmail.com').first()
    if existing_user:
        print('User saad.kadri@gmail.com already exists!')
    else:
        # Create Saad's user account
        hashed_password = pwd_context.hash('password123')
        user = User(
            email='saad.kadri@gmail.com',
            first_name='Saad',
            last_name='Kadri',
            hashed_password=hashed_password
        )
        db.add(user)
        db.commit()
        print('SUCCESS: User saad.kadri@gmail.com created!')
    
    print('LOGIN CREDENTIALS:')
    print('Email: saad.kadri@gmail.com')
    print('Password: password123')
    
except Exception as e:
    print(f'Error: {e}')
    db.rollback()
finally:
    db.close()
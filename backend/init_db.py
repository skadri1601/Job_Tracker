#!/usr/bin/env python3
"""
Database initialization script
Creates tables and adds sample data if needed
"""

from app.database import Base, engine, SessionLocal
from app.models import User, Application, AppStatus
from passlib.context import CryptContext
import datetime

def init_database():
    """Initialize database with tables and sample data"""
    print("Creating database tables...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    print("Database tables created successfully!")
    
    # Create a session
    db = SessionLocal()
    
    try:
        # Check if we already have a user
        existing_user = db.query(User).first()
        if existing_user:
            print("Database already has data, skipping sample data creation.")
            return
            
        # Create password context
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        # Create a sample user
        sample_user = User(
            email="user@example.com",
            first_name="John",
            last_name="Doe",
            hashed_password=pwd_context.hash("password123")
        )
        db.add(sample_user)
        db.commit()
        db.refresh(sample_user)
        
        print(f"Created sample user: {sample_user.email}")
        
        # Create some sample applications
        sample_applications = [
            Application(
                user_id=sample_user.id,
                company="Google",
                role="Senior Software Engineer",
                location="Mountain View, CA",
                status=AppStatus.APPLIED,
                source="LinkedIn",
                applied_date=datetime.date.today() - datetime.timedelta(days=7),
                notes="Applied through referral"
            ),
            Application(
                user_id=sample_user.id,
                company="Microsoft",
                role="Full Stack Developer",
                location="Remote",
                status=AppStatus.INTERVIEWING,
                source="Indeed",
                applied_date=datetime.date.today() - datetime.timedelta(days=14),
                last_contact_date=datetime.date.today() - datetime.timedelta(days=3),
                notes="Phone screen completed, technical interview scheduled"
            ),
            Application(
                user_id=sample_user.id,
                company="Stripe",
                role="Frontend Engineer",
                location="San Francisco, CA",
                status=AppStatus.APPLIED,
                source="Company Website",
                applied_date=datetime.date.today() - datetime.timedelta(days=2),
                notes="Direct application through careers page"
            )
        ]
        
        for app in sample_applications:
            db.add(app)
        
        db.commit()
        print(f"Created {len(sample_applications)} sample applications")
        print("Database initialization completed successfully!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
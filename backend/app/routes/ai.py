from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..deps import get_db, get_current_user
from .. import models
import os

router = APIRouter(prefix="/ai", tags=["ai"])

class CoverLetterReq(BaseModel):
    your_name: str
    resume_summary: str
    job_description: str
    company: str | None = None
    role: str | None = None

@router.get("/test")
def ai_test():
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        return {"ok": False, "error": "OPENAI_API_KEY missing"}
    try:
        from openai import OpenAI
        client = OpenAI(api_key=key)
        # Simple test call
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[{"role": "user", "content": "ping"}],
            max_tokens=10
        )
        return {"ok": True, "sample": response.choices[0].message.content[:80]}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@router.post("/cover-letter")
def generate_cover_letter(
    req: CoverLetterReq,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=key)
        
        prompt = f"""Write a professional cover letter for {req.your_name}.

Resume Summary: {req.resume_summary}
Company: {req.company or 'the company'}
Role: {req.role or 'the position'}

Job Description:
{req.job_description}

Make it personalized, professional, and highlight relevant skills from the resume summary that match the job description. Keep it concise and engaging."""

        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.7
        )
        
        cover_letter = response.choices[0].message.content
        return {"cover_letter": cover_letter}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate cover letter: {str(e)}")
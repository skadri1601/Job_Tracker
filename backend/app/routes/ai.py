from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..deps import get_db, get_current_user
from .. import models

router = APIRouter(prefix="/ai", tags=["ai"])

class CoverLetterReq(BaseModel):
    your_name: str
    resume_summary: str
    job_description: str
    company: str | None = None
    role: str | None = None

@router.post("/cover-letter")
def generate_cover_letter(req: CoverLetterReq, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    company = req.company or "the company"
    role = req.role or "the role"
    body = f"""Dear Hiring Manager,

I'm excited to apply for {role} at {company}. With a background in {req.resume_summary}, I can contribute immediately to your team's goals.

Highlights:
- Track record of shipping production features and improving performance.
- Strong collaboration and clear communication.
- Passion for building tools that improve efficiency and user experience.

From the job description, I noted key responsibilities that align with my experience.
I'd love to discuss how I can add value to {company}.

Best regards,
{req.your_name}
"""
    return {"cover_letter": body}

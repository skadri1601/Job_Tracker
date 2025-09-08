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

@router.get("/test")
def ai_test():
    import os
    from openai import OpenAI
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        return {"ok": False, "error": "OPENAI_API_KEY missing"}
    try:
        client = OpenAI(api_key="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")
        r = client.responses.create(model=os.getenv("OPENAI_MODEL","gpt-4o-mini"), input="ping")
        return {"ok": True, "sample": (getattr(r, "output_text", "") or "")[:80]}
    except Exception as e:
        return {"ok": False, "error": str(e)}

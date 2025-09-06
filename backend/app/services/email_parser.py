import re
from typing import Optional, Dict

COMPANY_PAT = re.compile(r"(?:at|with)\s+([A-Z][A-Za-z0-9&\- ]+)")
ROLE_PAT = re.compile(r"for the\s+([A-Za-z0-9 /\-]+)\s+(?:role|position)", re.IGNORECASE)

def parse_email(text: str) -> Dict[str, Optional[str]]:
    company = None
    role = None
    m1 = COMPANY_PAT.search(text)
    if m1: company = m1.group(1).strip()
    m2 = ROLE_PAT.search(text)
    if m2: role = m2.group(1).strip()
    return {"company": company, "role": role}

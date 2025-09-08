import re
from typing import Optional, Dict

# Enhanced patterns for better email parsing
COMPANY_PATTERNS = [
    re.compile(r"(?:at|with|from)\s+([A-Z][A-Za-z0-9&\-\.\s]+?)(?:\s|,|\.|\n|$)", re.IGNORECASE),
    re.compile(r"([A-Z][A-Za-z0-9&\-\.\s]+?)\s+(?:is hiring|has an opening|team)", re.IGNORECASE),
    re.compile(r"Dear\s+.+,?\s*\n.+\n.+?([A-Z][A-Za-z0-9&\-\.\s]+)", re.MULTILINE | re.IGNORECASE)
]

ROLE_PATTERNS = [
    re.compile(r"for\s+the\s+([A-Za-z0-9\s/\-]+?)\s+(?:role|position|job)", re.IGNORECASE),
    re.compile(r"(?:role|position|job):\s*([A-Za-z0-9\s/\-]+)", re.IGNORECASE),
    re.compile(r"as\s+an?\s+([A-Za-z0-9\s/\-]+?)(?:\s+at|\s+with|\.|,)", re.IGNORECASE),
    re.compile(r"Subject:.*?([A-Za-z0-9\s/\-]+?)(?:\s+-\s+|\s+at\s+)", re.IGNORECASE)
]

def parse_email(text: str) -> Dict[str, Optional[str]]:
    """
    Parse email text to extract company and role information.
    """
    company = None
    role = None
    
    # Clean the text
    text = text.strip()
    
    # Try to extract company
    for pattern in COMPANY_PATTERNS:
        match = pattern.search(text)
        if match:
            potential_company = match.group(1).strip()
            # Filter out common false positives
            if len(potential_company) > 2 and not any(word in potential_company.lower() 
                                                    for word in ['your', 'our', 'this', 'the', 'please', 'thank']):
                company = potential_company
                break
    
    # Try to extract role
    for pattern in ROLE_PATTERNS:
        match = pattern.search(text)
        if match:
            potential_role = match.group(1).strip()
            # Filter out common false positives
            if len(potential_role) > 2 and not any(word in potential_role.lower() 
                                                  for word in ['application', 'interview', 'position', 'thank']):
                role = potential_role
                break
    
    return {
        "company": company,
        "role": role
    }
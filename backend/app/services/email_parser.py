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

LOCATION_PATTERNS = [
    re.compile(r"(?:location|based|located):\s*([A-Za-z0-9\s,\-]+)", re.IGNORECASE),
    re.compile(r"(?:in|at)\s+([A-Za-z\s,]+(?:NY|CA|TX|FL|WA|IL|MA|CO|GA|NC|AZ|VA|MD|NV|OR|DC|Remote))", re.IGNORECASE),
    re.compile(r"remote", re.IGNORECASE),
    re.compile(r"work\s+from\s+home", re.IGNORECASE),
]

# Status detection patterns for smart categorization
STATUS_PATTERNS = {
    "OFFER": [
        re.compile(r"(?:pleased to|excited to|happy to|delighted to).*?(?:offer|extend).*?(?:position|role|job)", re.IGNORECASE),
        re.compile(r"congratulations.*?(?:selected|chosen|offered)", re.IGNORECASE),
        re.compile(r"offer.*?(?:position|role|job)", re.IGNORECASE),
        re.compile(r"(?:salary|compensation|package|benefits)", re.IGNORECASE),
        re.compile(r"starting date|start date|join.*?team", re.IGNORECASE),
        re.compile(r"terms of employment|employment offer", re.IGNORECASE)
    ],
    "INTERVIEWING": [
        re.compile(r"(?:schedule|arrange|set up|invite).*?(?:interview|meeting|call)", re.IGNORECASE),
        re.compile(r"(?:interview|meeting|call).*?(?:schedule|time|date)", re.IGNORECASE),
        re.compile(r"next step.*?(?:interview|meet|call|speak)", re.IGNORECASE),
        re.compile(r"(?:phone|video|in-person|onsite).*?interview", re.IGNORECASE),
        re.compile(r"would like to.*?(?:meet|speak|interview)", re.IGNORECASE),
        re.compile(r"interview.*?(?:process|round|panel)", re.IGNORECASE)
    ],
    "REJECTED": [
        re.compile(r"unfortunately.*?(?:not|unable to|cannot)", re.IGNORECASE),
        re.compile(r"(?:not|won't be).*?(?:moving forward|proceeding|selected|chosen)", re.IGNORECASE),
        re.compile(r"decided to.*?(?:pursue|go with).*?other.*?candidate", re.IGNORECASE),
        re.compile(r"(?:regret|sorry).*?(?:inform|tell).*?(?:not|unable)", re.IGNORECASE),
        re.compile(r"after careful consideration.*?(?:not|unable|decided)", re.IGNORECASE),
        re.compile(r"(?:other|different).*?(?:candidate|direction|fit)", re.IGNORECASE),
        re.compile(r"thank you.*?interest.*?(?:however|unfortunately|but)", re.IGNORECASE)
    ],
    "ON_HOLD": [
        re.compile(r"keep.*?(?:resume|application|profile).*?(?:file|consideration)", re.IGNORECASE),
        re.compile(r"future.*?(?:opportunities|openings|positions)", re.IGNORECASE),
        re.compile(r"(?:on hold|paused|delayed).*?(?:hiring|process|position)", re.IGNORECASE),
        re.compile(r"will.*?(?:contact|reach out).*?(?:future|later|when)", re.IGNORECASE),
        re.compile(r"talent.*?(?:pool|pipeline|database)", re.IGNORECASE)
    ],
    "APPLIED": [
        re.compile(r"(?:received|confirm).*?(?:application|submission)", re.IGNORECASE),
        re.compile(r"thank you.*?(?:applying|submitting|interest)", re.IGNORECASE),
        re.compile(r"application.*?(?:received|submitted|under review)", re.IGNORECASE),
        re.compile(r"(?:reviewing|review).*?(?:application|submission|resume)", re.IGNORECASE),
        re.compile(r"will be in touch|hear from us|contact you", re.IGNORECASE)
    ]
}

def detect_email_status(text: str) -> str:
    """
    Detect the status/category of the email based on content patterns.
    Returns the most likely status based on keyword matching.
    """
    text_lower = text.lower()
    status_scores = {}
    
    # Score each status based on pattern matches
    for status, patterns in STATUS_PATTERNS.items():
        score = 0
        for pattern in patterns:
            matches = pattern.findall(text)
            score += len(matches)
        status_scores[status] = score
    
    # Return the status with the highest score, default to APPLIED if no matches
    if max(status_scores.values()) == 0:
        return "APPLIED"
    
    return max(status_scores, key=status_scores.get)

def parse_email(text: str) -> Dict[str, Optional[str]]:
    """
    Parse email text to extract company, role, location, and status information.
    """
    company = None
    role = None
    location = None
    
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
    
    # Try to extract location
    for pattern in LOCATION_PATTERNS:
        match = pattern.search(text)
        if match:
            if pattern.pattern.lower() in ['remote', 'work\\s+from\\s+home']:
                location = "Remote"
                break
            else:
                potential_location = match.group(1).strip() if match.groups() else match.group(0).strip()
                if len(potential_location) > 1:
                    location = potential_location
                    break
    
    # Detect email status
    status = detect_email_status(text)
    
    return {
        "company": company,
        "role": role,
        "location": location,
        "status": status
    }
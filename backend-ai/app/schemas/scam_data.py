from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CrawlRequest(BaseModel):
    seeds: Optional[List[str]] = None
    max_pages: Optional[int] = 50

class ScanRequest(BaseModel):
    urls: List[str]

class ScanResponse(BaseModel):
    url: str
    status: Optional[int]
    has_login: bool
    score: int
    reasons: List[str]
    scanned_at: datetime

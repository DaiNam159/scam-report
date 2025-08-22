# app/api/v1/similarity.py
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.services.similarity_service import check_similarity
from app.db.session import get_db
from app.services.similarity_service import get_all_report_texts, get_combined_report_text,related_search
from app.models.reports import Report, ReportSMS, ReportEmailContent, ReportEmailAddress,ReportBankAccount, ReportEWallet, ReportPersonOrg, ReportWebsite, ReportSocial, ReportPhone

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/check-similarity")
async def check_text_similarity(request: TextRequest, db: Session = Depends(get_db)):
    return check_similarity(request.text, db)

@router.get("/test")
async def test_similarity(db: Session = Depends(get_db)):
    return "test"

@router.post("/related-reports")
async def get_related_reports(request: TextRequest, db: Session = Depends(get_db)):
    return related_search(request.text, db)
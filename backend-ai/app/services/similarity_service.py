# app/services/similarity_service.py
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models.reports import Report, ReportSMS, ReportEmailContent, ReportEmailAddress,ReportBankAccount, ReportEWallet, ReportPersonOrg, ReportWebsite, ReportSocial, ReportPhone
import re
from typing import List, Dict, Any
EMAIL_REGEX = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
PHONE_REGEX = r'\b\d{8,15}\b'

def get_all_report_texts(db: Session):
    sms_reports = db.query(ReportSMS).join(Report).filter(Report.report_type == "sms").all()
    email_content_reports = db.query(ReportEmailContent).join(Report).filter(Report.report_type == "email_content").all()
    email_address_reports = db.query(ReportEmailAddress).join(Report).filter(Report.report_type == "email_address").all()
    phone_reports = db.query(ReportPhone).join(Report).filter(Report.report_type == "phone").all()
    person_org_reports = db.query(ReportPersonOrg).join(Report).filter(Report.report_type == "person_org").all()
    website_reports = db.query(ReportWebsite).join(Report).filter(Report.report_type == "website").all()
    social_reports = db.query(ReportSocial).join(Report).filter(Report.report_type == "social").all()
    bank_account_reports = db.query(ReportBankAccount).join(Report).filter(Report.report_type == "bank_account").all()
    e_wallet_reports = db.query(ReportEWallet).join(Report).filter(Report.report_type == "e_wallet").all()
    combined = []

    for r in sms_reports:
        combined.append({
            "report_id": r.report_id,
            "type": "sms",
            "content": r.sms_content
        })

    for r in email_content_reports:
        combined.append({
            "report_id": r.report_id,
            "type": "email_content",
            "content": f"{r.email_subject or ''} {r.email_body or ''} {r.sender_address or ''}".strip()
        })
    for r in email_address_reports:
        combined.append({
            "report_id": r.report_id,
            "type": "email_address",
            "content": r.email_address or ''
        })
    for r in phone_reports:
        combined.append({
            "report_id": r.report_id,
            "type": "phone",
            "content": r.phone_number or ''
        })
    for r in person_org_reports:
        combined.append({
            "report_id": r.report_id,
            "type": "person_org",
            "content": f"{r.name or ''} {r.role or ''} {r.identification or ''} {r.address or ''} {r.phone_number or ''} {r.email_address or ''} {r.social_links or ''}"
        })
    for r in website_reports:
        combined.append({
            "report_id": r.report_id,
            "type": "website",
            "content": r.url or ''
        })
    for r in social_reports:
        combined.append({
            "report_id": r.report_id,
            "type": "social",
            "content": f"{r.platform or ''} {r.username or ''} {r.profile_url or ''}"
        })
    for r in bank_account_reports:
        combined.append({
            "report_id": r.report_id,
            "type": "bank_account",
            "content": f"{r.account_number or ''} {r.bank_name or ''} {r.account_holder_name or ''}"
        })
    for r in e_wallet_reports:
        combined.append({
            "report_id": r.report_id,
            "type": "e_wallet",
            "content": f"{r.wallet_id or ''} {r.wallet_type or ''} {r.account_holder_name or ''}"
        })

    return combined

def check_similarity(input_text: str, db: Session):
    all_reports = get_all_report_texts(db)
    if not all_reports:
        return []

    texts = [r["content"] for r in all_reports if r["type"] in ("email_content", "sms")]
    tfidf = TfidfVectorizer().fit_transform(texts + [input_text])
    cosine = cosine_similarity(tfidf[-1], tfidf[:-1]).flatten()

    similar_reports = []
    for i, score in enumerate(cosine):
        if score > 0.4:
            similar_reports.append({
                "match_percent": round(float(score), 4),
                "matched_report_id": all_reports[i]["report_id"]                
            })

    # Sắp xếp theo độ trùng lặp giảm dần
    similar_reports.sort(key=lambda x: x["match_percent"], reverse=True)
    
    return similar_reports

def get_combined_report_text(report: Report) -> str:
    parts = []

    # Email content
    if report.email_content_report:
        ec = report.email_report
        parts.extend([ec.email_subject or '', ec.email_body or '', ec.sender_address or ''])

    # Email address
    if hasattr(report, 'email_address_report') and report.email_address_report:
        parts.append(report.email_address_report.email_address or '')

    # SMS
    if report.sms_report:
        s = report.sms_report
        parts.extend([s.sms_content or '', s.phone_number or ''])

    # Phone
    if hasattr(report, 'phone_report') and report.phone_report:
        parts.append(report.phone_report.phone_number or '')

    # Website
    if hasattr(report, 'website_report') and report.website_report:
        parts.append(report.website_report.url or '')

    # Social
    if hasattr(report, 'social_report') and report.social_report:
        parts.extend([report.social_report.profile_url or '', report.social_report.username or ''])

    # Person or organization
    if hasattr(report, 'person_org_report') and report.person_org_report:
        po = report.person_org_report
        parts.extend([po.name or '',po.role or '', po.identification or '', po.address or '', po.phone_number or '', po.email_address or '', po.social_links or ''])

    # Bank account
    if hasattr(report, 'bank_account_report') and report.bank_account_report:
        ba = report.bank_account_report
        parts.extend([ba.account_number or '', ba.bank_name or '', ba.account_holder_name or ''])

    # E-wallet
    if hasattr(report, 'e_wallet_report') and report.e_wallet_report:
        ew = report.e_wallet_report
        parts.extend([ew.wallet_id or '', ew.wallet_type or '', ew.account_holder_name or ''])

    return ' '.join(p for p in parts if p).strip()


# def related_search(input_text: str, db:Session):
#     all_reports = get_all_report_texts(db)
#     if not all_reports:
#         return []

#     texts = [r["content"] for r in all_reports]
#     tfidf = TfidfVectorizer().fit_transform(texts + [input_text])
#     cosine = cosine_similarity(tfidf[-1], tfidf[:-1]).flatten()

#     related_reports = []
#     for i, score in enumerate(cosine):
#         if( all_reports[i]["type"] in ("email_address", "phone") and all_reports[i]["content"]==input_text):
#             related_reports.append({
#                 "match_percent": round(float(score), 4),
#                 "matched_report_id": all_reports[i]["report_id"]
#             })
#         if (score > 0.3 and all_reports[i]["type"] not in ("email_address", "phone")):
#             related_reports.append({
#                 "match_percent": round(float(score), 4),
#                 "matched_report_id": all_reports[i]["report_id"]
#             })

#     related_reports.sort(key=lambda x: x["match_percent"], reverse=True)
    
#     return related_reports


def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text) 
    text = re.sub(r"\s+", " ", text)    
    return text.strip()

def word_overlap_similarity(a: str, b: str) -> float:
    a_words = set(normalize_text(a).split())
    b_words = set(normalize_text(b).split())
    if not a_words or not b_words:
        return 0
    return len(a_words & b_words) / len(a_words)

def related_search(input_text: str, db: Session):
    all_reports = get_all_report_texts(db)
    if not all_reports:
        return []

    input_text = input_text.lower()
    related_reports = []

    for r in all_reports:
        content = r["content"].lower()

        score = word_overlap_similarity(input_text, content)

        if (r["type"] in ("email_address", "phone") and r["content"] == input_text) or score > (2/3):
            related_reports.append({
                "match_percent": round(score, 4),
                "matched_report_id": r["report_id"]
            })

    related_reports.sort(key=lambda x: x["match_percent"], reverse=True)
    return related_reports
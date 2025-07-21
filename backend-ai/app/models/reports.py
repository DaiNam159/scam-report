# app/models/reports.py
from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
import enum
# "email_content"
#   | "email_address"
#   | "sms"
#   | "phone"
#   | "person_org"
#   | "website"
#   | "social"
#   | "bank_account"
#   | "e_wallet";
class ReportTypeEnum(str, enum.Enum):
    email_content = "email_content"
    email_address = "email_address"
    sms = "sms"
    website = "website"
    phone = "phone"
    person_org = "person_org"
    social = "social"
    bank_account = "bank_account"
    e_wallet = "e_wallet"

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    report_type = Column(Enum(ReportTypeEnum), nullable=False)
    title = Column(String(255))
    description = Column(Text)
    status = Column(String(50))

    sms_report = relationship("ReportSMS", back_populates="report", uselist=False)
    email_content_report = relationship("ReportEmailContent", back_populates="report", uselist=False)
    email_address_report = relationship("ReportEmailAddress", back_populates="report", uselist=False)
    phone_report = relationship("ReportPhone", back_populates="report", uselist=False)
    person_org_report = relationship("ReportPersonOrg", back_populates="report", uselist=False)
    social_report = relationship("ReportSocial", back_populates="report", uselist=False)
    website_report = relationship("ReportWebsite", back_populates="report", uselist=False)
    bank_account_report = relationship("ReportBankAccount", back_populates="report", uselist=False)
    e_wallet_report = relationship("ReportEWallet", back_populates="report", uselist=False)


class ReportSMS(Base):
    __tablename__ = "report_sms"
    report_id = Column(Integer, ForeignKey("reports.id"), primary_key=True)
    phone_number = Column(String(20))
    sms_content = Column(Text)

    report = relationship("Report", back_populates="sms_report")


class ReportEmailContent(Base):
    __tablename__ = "report_email_content"
    report_id = Column(Integer, ForeignKey("reports.id"), primary_key=True)
    email_subject = Column(Text)
    email_body = Column(Text)
    sender_address = Column(String(255))

    report = relationship("Report", back_populates="email_content_report")

class ReportEmailAddress(Base):
    __tablename__ = "report_email_address"
    report_id = Column(Integer, ForeignKey("reports.id"), primary_key=True)
    email_address = Column(String(255))

    report = relationship("Report", back_populates="email_address_report")

class ReportPhone(Base):
    __tablename__ = "report_phone"
    report_id = Column(Integer, ForeignKey("reports.id"), primary_key=True)
    phone_number = Column(String(20))

    report = relationship("Report", back_populates="phone_report")

class ReportPersonOrg(Base):
    __tablename__ = "report_person_org"
    report_id = Column(Integer, ForeignKey("reports.id"), primary_key=True)
    name = Column(String(255))
    role = Column(String(50))
    identification = Column(String(50)) 
    address = Column(String(Text))
    phone_number = Column(String(20))
    email_address = Column(String(255))
    social_links = Column(Text)  
    report = relationship("Report", back_populates="person_org_report")

class ReportSocial(Base):
    __tablename__ = "report_social"
    report_id = Column(Integer, ForeignKey("reports.id"), primary_key=True)
    platform = Column(String(50))
    username = Column(String(255))
    profile_url = Column(String(255))

    report = relationship("Report", back_populates="social_report")

class ReportWebsite(Base):
    __tablename__ = "report_website"
    report_id = Column(Integer, ForeignKey("reports.id"), primary_key=True)
    url = Column(String(255))

    report = relationship("Report", back_populates="website_report")

class ReportBankAccount(Base):
    __tablename__ = "report_bank_account"
    report_id = Column(Integer, ForeignKey("reports.id"), primary_key=True)
    account_number = Column(String(20))
    bank_name = Column(String(255))
    account_holder_name = Column(String(255))

    report = relationship("Report", back_populates="bank_account_report")

class ReportEWallet(Base):
    __tablename__ = "report_e_wallet"
    report_id = Column(Integer, ForeignKey("reports.id"), primary_key=True)
    wallet_id = Column(String(50))
    wallet_type = Column(String(255))
    account_holder_name = Column(String(255))

    report = relationship("Report", back_populates="e_wallet_report")
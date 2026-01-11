from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import List, Optional
from enum import Enum
from sqlalchemy import func

from database import SessionLocal
from models import Complaint

router = APIRouter()

# ---------------- DB DEPENDENCY ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- STATUS ENUM ----------------
class StatusEnum(str, Enum):
    pending = "Pending"
    in_progress = "In Progress"
    resolved = "Resolved"
    rejected = "Rejected"

# ---------------- SCHEMAS ----------------
class ComplaintRequest(BaseModel):
    title: str
    description: str
    category: str
    location: str
    userEmail: EmailStr

class ComplaintResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    location: str
    userEmail: EmailStr
    status: StatusEnum

class ComplaintSubmissionResponse(BaseModel):
    message: str
    complaintId: int

class UpdateStatusRequest(BaseModel):
    status: StatusEnum

class UpdateStatusResponse(BaseModel):
    message: str
    complaint: ComplaintResponse

# ---------------- USER ROUTES ----------------

@router.post(
    "/complaints",
    response_model=ComplaintSubmissionResponse,
    status_code=201,
    summary="Submit a new complaint"
)
def submit_complaint(data: ComplaintRequest, db: Session = Depends(get_db)):
    complaint = Complaint(
        title=data.title,
        description=data.description,
        category=data.category,
        location=data.location,
        user_email=data.userEmail,
        status=StatusEnum.pending.value
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return {
        "message": "Complaint submitted successfully",
        "complaintId": complaint.id
    }

@router.get(
    "/complaints",
    response_model=List[ComplaintResponse],
    summary="Get complaints (user or all)"
)
def get_complaints(
    userEmail: Optional[EmailStr] = Query(None),
    db: Session = Depends(get_db)
):
    if userEmail:
        complaints = db.query(Complaint).filter(
            Complaint.user_email == userEmail
        ).all()
    else:
        complaints = db.query(Complaint).all()

    return [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "category": c.category,
            "location": c.location,
            "userEmail": c.user_email,
            "status": c.status
        }
        for c in complaints
    ]

# ---------------- ADMIN ROUTES ----------------

@router.get(
    "/admin/complaints",
    response_model=List[ComplaintResponse],
    summary="Admin: Get all complaints"
)
def get_all_complaints_admin(db: Session = Depends(get_db)):
    complaints = db.query(Complaint).all()

    return [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "category": c.category,
            "location": c.location,
            "userEmail": c.user_email,
            "status": c.status
        }
        for c in complaints
    ]

@router.patch(
    "/admin/complaints/{complaint_id}/status",
    response_model=UpdateStatusResponse,
    summary="Admin: Update complaint status"
)
def admin_update_complaint_status(
    complaint_id: int,
    data: UpdateStatusRequest,
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = data.status.value
    db.commit()
    db.refresh(complaint)

    return {
        "message": "Status updated successfully",
        "complaint": {
            "id": complaint.id,
            "title": complaint.title,
            "description": complaint.description,
            "category": complaint.category,
            "location": complaint.location,
            "userEmail": complaint.user_email,
            "status": complaint.status
        }
    }

# ---------------- DASHBOARD STATS ROUTE ----------------

@router.get(
    "/complaints/stats",
    summary="Get complaint stats for admin dashboard"
)
def get_complaint_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Complaint.id)).scalar() or 0
    pending = db.query(func.count(Complaint.id)).filter(Complaint.status == StatusEnum.pending.value).scalar() or 0
    in_progress = db.query(func.count(Complaint.id)).filter(Complaint.status == StatusEnum.in_progress.value).scalar() or 0
    resolved = db.query(func.count(Complaint.id)).filter(Complaint.status == StatusEnum.resolved.value).scalar() or 0
    rejected = db.query(func.count(Complaint.id)).filter(Complaint.status == StatusEnum.rejected.value).scalar() or 0

    return {
        "total": total,
        "pending": pending,
        "inProgress": in_progress,
        "resolved": resolved,
        "rejected": rejected,
    }

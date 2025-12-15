from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Report, User, ReportStatus
from schemas import ReportCreate, ReportResponse, ReportStatusUpdate
from auth_handler import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])

# 🔹 Citizen / NGO → Create report
@router.post("/", response_model=ReportResponse)
def create_report(
    data: ReportCreate,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    if current["role"] not in ["citizen", "ngo"]:
        raise HTTPException(status_code=403)

    user = db.query(User).filter(User.email == current["sub"]).first()

    report = Report(
        user_id=user.id,
        location=data.location,
        description=data.description,
        water_source=data.water_source,
        photo_url=data.photo_url,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


# 🔹 Citizen / NGO → View own reports
@router.get("/my", response_model=list[ReportResponse])
def my_reports(db: Session = Depends(get_db), current=Depends(get_current_user)):
    user = db.query(User).filter(User.email == current["sub"]).first()
    return db.query(Report).filter(Report.user_id == user.id).all()


# 🔹 Admin / Authority → View all reports
@router.get("/", response_model=list[ReportResponse])
def all_reports(db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current["role"] not in ["admin", "authority"]:
        raise HTTPException(status_code=403)
    return db.query(Report).all()


# 🔹 Admin / Authority → Change status only
@router.patch("/{report_id}")
def update_status(
    report_id: int,
    data: ReportStatusUpdate,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    if current["role"] not in ["admin", "authority"]:
        raise HTTPException(status_code=403)

    report = db.query(Report).get(report_id)
    if not report:
        raise HTTPException(status_code=404)

    report.status = data.status
    db.commit()
    return {"message": "Status updated"}

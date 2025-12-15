from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, text, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import enum

class UserRole(str, enum.Enum):
    citizen = "citizen"
    ngo = "ngo"
    authority = "authority"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.citizen, nullable=False)
    location = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('NOW()'))

class ReportStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    photo_url = Column(String, nullable=True)
    location = Column(String, nullable=False)
    description = Column(String, nullable=False)
    water_source = Column(String, nullable=True)

    status = Column(Enum(ReportStatus), default=ReportStatus.pending)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("NOW()"))

    user = relationship("User")

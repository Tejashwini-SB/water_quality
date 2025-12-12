from fastapi import APIRouter, Depends,HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import get_db
from schemas import UserCreate, UserResponse
from models import User
from utils import hash_password
from fastapi import HTTPException, status
from utils import verify_password
from auth_handler import create_access_token
from schemas import LoginRequest, TokenResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_pwd = hash_password(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_pwd,
        role=user.role,
        location=user.location
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )



@router.post("/login", response_model=TokenResponse)
def login_user(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )

    if not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )

    # Create JWT token
    access_token = create_access_token({"sub": user.email, "role": user.role})

    return {
        "access_token": access_token,
        "location": user.location,
        "role": user.role,
        "name": user.name
    }

@router.post("/logout")
def logout_user():
    return {"message": "Logged out successfully"}


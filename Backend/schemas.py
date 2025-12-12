from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
import re
from models import UserRole

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.citizen
    location: str

    @field_validator("password")
    def strong_password(cls, value):
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$"
        if not re.match(pattern, value):
            raise ValueError(
                "Password must be at least 8 chars, include upper, lower, number & special char."
            )
        return value


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    location: str

model_config = ConfigDict(from_attributes=True)



class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    location: str
    role: UserRole
    name: str







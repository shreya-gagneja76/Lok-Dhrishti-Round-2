from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import secrets
from passlib.context import CryptContext

from database import SessionLocal
from models import User

router = APIRouter()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# ---------------- DB DEPENDENCY ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- PASSWORD HELPERS ----------------
def hash_password(password: str) -> str:
    # bcrypt max = 72 BYTES
    password_bytes = password.encode("utf-8")
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]

    safe_password = password_bytes.decode("utf-8", errors="ignore")
    return pwd_context.hash(safe_password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# ---------------- SCHEMAS ----------------
class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str  # length handled in hash function

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    password: str

# ---------------- ROUTES ----------------
@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        username=data.username.strip(),
        email=data.email,
        password=hash_password(data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Signup successful"}

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = secrets.token_urlsafe(16)
    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)
    db.commit()

    reset_link = f"http://localhost:3000/reset-password/{token}"
    return {"message": "Reset link generated", "reset_link": reset_link}

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == data.token).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")

    if user.reset_token_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")

    user.password = hash_password(data.password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()

    return {"message": "Password reset successful"}

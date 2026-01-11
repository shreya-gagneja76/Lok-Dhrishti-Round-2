from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.complaints import router as complaint_router

from database import engine
from models import Base

app = FastAPI()

# Create all tables
Base.metadata.create_all(bind=engine)

# Setup CORS middleware to allow React frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with API prefix
app.include_router(auth_router, prefix="/api")
app.include_router(complaint_router, prefix="/api")

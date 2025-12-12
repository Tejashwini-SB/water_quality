from fastapi import FastAPI
from database import engine
import models
from database import Base, engine
from routers import auth
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Water Quality Monitor Backend")

app.include_router(auth.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
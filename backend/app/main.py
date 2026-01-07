from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.jewellery import router as jewellery_router
from app.api.upload import router as upload_router
from app.api.health import router as health_router
from app.db.session import engine, Base
from app.models import jewellery  # Import models to register them

# Create all tables - only for local development
# Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jewellery Closet API")

# 👇 CORS CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(jewellery_router)
app.include_router(upload_router)
 
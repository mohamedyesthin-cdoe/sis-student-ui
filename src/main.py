from fastapi import FastAPI, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from src.core.security.jwt import SECRET_KEY, ACCESS_KEY, verify_api_key
from src.core.config import settings
from src.db.session import engine,get_db,Base
from src.db import base  # This should import and register all models
from src.models import user
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from src.schemas.students import DebResponse
from src.services.integrations.student_api import get_deb_student_details, push_deb_student_details
#from src.middleware.request_id import RequestIDMiddleware
#from src.utils.rate_limiter import RateLimiter
from src.repositories.students import StudentRepository
from typing import List, Optional
from src.schemas.payment import StudentSchema, StandardResponse, DataResponse, PaginationResponse
import time
from src.utils.logger import setup_logger
from src.api.v1.endpoints.auth import router as auth_router
from src.api.v1.endpoints.users import router as users_router
from src.api.v1.endpoints.menu import router as menu_router
from src.api.v1.endpoints.staff import router as staff_router
from src.api.v1.endpoints.admin import router as admin_router
from src.api.v1.endpoints.address import router as address_router
from src.api.v1.endpoints.students import router as students_router
from src.api.v1.endpoints.api import router as api_router
from src.api.v1.endpoints.master import router as master_router
from src.api.v1.endpoints.document import router as s3_router
from src.utils.hash import decode_token, encode_token
from src.core.security.dependencies import require_superuser
from src.models.user import User

logger = setup_logger()

app = FastAPI(
    title=settings.APP_NAME,    
    version="0.1.0",
    docs_url=f"{settings.API_V1_STR}/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://13.234.63.113:80",
    "http://13.234.63.113",
    "https://uat.sriramachandradigilearn.edu.in"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,  
    allow_methods=["*"],     
    allow_headers=["*"],     
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    logger.info(f"{request.method} {request.url.path} started from {request.client.host if request.client else 'unknown'}")
    try:
        response = await call_next(request)
    except Exception:
        logger.exception(f"Error processing request {request.url.path}")
        raise
    process_time = round(time.time() - start_time, 3)
    logger.info(f"{request.method} {request.url.path} completed in {process_time}s → {response.status_code}")
    return response

logger.info("FastAPI application started successfully")

# Request ID middleware for tracing
#app.add_middleware(RequestIDMiddleware)
# Rate limiting (100 requests per minute per user)
#app.state.limiter = RateLimiter(rate_limit=100, per=60)

app.include_router(admin_router, prefix="/admin", tags=["Admin"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(users_router, prefix="/user", tags=["User"])
app.include_router(menu_router, prefix="", tags=["Menu"])
app.include_router(staff_router, prefix="/staff", tags=["Staff"])
app.include_router(address_router, prefix="", tags=["Address"])
app.include_router(students_router, prefix="/student", tags=["Student"])
app.include_router(api_router, prefix="/api", tags=["API"])
app.include_router(master_router, prefix="", tags=["master"])
app.include_router(s3_router, prefix="/s3", tags=["S3"])

# Create database tables on startup
@app.on_event("startup")
async def startup():
    #Base.metadata.drop_all(engine)
    Base.metadata.create_all(bind=engine)

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/api/v1/docs")

@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    return {"status": "ok", 
            "environment": settings.ENVIRONMENT, 
            "app name": settings.APP_NAME,
            "key": settings.SECRET_KEY}

@app.get("/debug-user")
def debug_user(db: Session = Depends(get_db)):
    users = db.query(user.User).all()
    return {"users": [u.email for u in users]}

@app.router.get("/deb/student/{deb_id}", response_model=DebResponse, tags=["Deb"])
async def get_deb_student(deb_id: str):
    """Retrieve student by DEB ID."""
    try:
        students = await get_deb_student_details(deb_id)
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve students: {str(e)}")

@app.router.post("/push/ugc/", response_model=DebResponse, tags=["Deb"])
async def push_student_deb(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    """Push student by DEB"""
    try:
        students = await push_deb_student_details(db)
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve students: {str(e)}")
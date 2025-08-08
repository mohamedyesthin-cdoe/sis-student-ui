from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from src.core.config import settings
from src.db.session import engine,get_db,Base
from src.db import base  # This should import and register all models
from src.models import user
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
#from src.middleware.request_id import RequestIDMiddleware
#from src.utils.rate_limiter import RateLimiter


from src.api.v1.endpoints.auth import router as auth_router
from src.api.v1.endpoints.users import router as users_router
from src.api.v1.endpoints.menu import router as menu_router
from src.api.v1.endpoints.faculty import router as faculty_router
from src.api.v1.endpoints.admin import router as admin_router
from src.api.v1.endpoints.address import router as address_router
from src.api.v1.endpoints.students import router as students_router

app = FastAPI(
    title=settings.APP_NAME,    
    version="0.1.0",
    docs_url=f"{settings.API_V1_STR}/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)
origins = [
    "http://localhost:5173",  # Example: React/Vue frontend
    "http://127.0.0.1:5173",
    "http://13.234.63.113:80",
    "http://13.234.63.113",
    #"https://your-frontend-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,  
    allow_methods=["*"],     
    allow_headers=["*"],     
)

# Request ID middleware for tracing
#app.add_middleware(RequestIDMiddleware)

# Rate limiting (100 requests per minute per user)
#app.state.limiter = RateLimiter(rate_limit=100, per=60)

app.include_router(admin_router, prefix="/admin", tags=["Admin"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(users_router, prefix="/user", tags=["User"])
app.include_router(menu_router, prefix="", tags=["Menu"])
app.include_router(faculty_router, prefix="/faculty", tags=["Faculty"])
app.include_router(address_router, prefix="", tags=["Address"])
app.include_router(students_router, prefix="/student", tags=["Student"])


# Create database tables on startup
@app.on_event("startup")
async def startup():
    #Base.metadata.drop_all(engine)
    Base.metadata.create_all(bind=engine)

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/api/v1/docs")

@app.get("/users/{user_id}")
async def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(user).filter(user.id == user_id).first()
    return {"user": user}

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

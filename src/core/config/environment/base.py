from pydantic_settings import BaseSettings
from pydantic import Field

class BaseConfig(BaseSettings):
    """Base environment configuration with shared settings."""
    
    ENVIRONMENT: str
    APP_NAME: str
    API_V1_STR: str
    DATABASE_URL: str
    DATABASE_ECHO: bool
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    STUDENT_API_URL: str
   
    class Config:
        case_sensitive = True


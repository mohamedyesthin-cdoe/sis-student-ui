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
    MERRITO_API_URL: str 
    MERRITO_SECRET_KEY: str 
    MERRITO_ACCESS_KEY: str
    UGC_DEB_API_URL: str
    CLIENT_ID_GET: str
    UGC_API_GET_KEY: str
    CLIENT_ID_POST: str
    UGC_API_POST_KEY: str

    class Config:
        env_file = ".env.dev"
        env_file_encoding = "utf-8"
   
    class Config:
        case_sensitive = True


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
    ACCESS_KEY: str
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
    MAIL_SERVER: str
    MAIL_PORT: int
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_FROM_NAME: str
    MAIL_STARTTLS: bool = Field(default=True)
    MAIL_SSL_TLS: bool = Field(default=False)
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    AWS_S3_BUCKET: str
    AWS_S3_FOLDER: str = "cdoedocument"
    DIGICAMPUS_API_URL: str
    DIGICAMPUS_USERNAME: str
    DIGICAMPUS_PASSWORD: str
    COLLEXO_PAYMENT_URL: str = "https://payment.collexo.com/user/login/"
    COLLEXO_WEBHOOK_SECRET: str = ""
    COLLEXO_INSTITUTION_ID: str = ""

    class Config:
        env_file = ".env.dev"
        env_file_encoding = "utf-8"
   
    class Config:
        case_sensitive = True


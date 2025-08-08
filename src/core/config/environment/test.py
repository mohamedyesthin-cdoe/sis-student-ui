from .base import BaseConfig

class TestConfig(BaseConfig):
    """Testing environment configuration."""
    
    ENVIRONMENT: str = "test"
    DATABASE_URL: str = "sqlite:///./dev.db"
    DATABASE_ECHO: bool = False
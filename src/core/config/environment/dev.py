from .base import BaseConfig

class DevelopmentConfig(BaseConfig):
    """Development environment configuration."""
    
    ENVIRONMENT: str = "development"
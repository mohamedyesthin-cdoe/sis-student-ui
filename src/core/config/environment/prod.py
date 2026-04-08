from .base import BaseConfig

class ProductionConfig(BaseConfig):
    """Production environment configuration."""
    
    ENVIRONMENT: str = "production"

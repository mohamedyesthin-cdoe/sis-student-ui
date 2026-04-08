import os
from dotenv import load_dotenv

from src.core.config.environment.dev import DevelopmentConfig
from src.core.config.environment.prod import ProductionConfig
from src.core.config.environment.test import TestConfig

# Load the appropriate .env file
env = os.getenv("ENVIRONMENT", "development").lower()
env_file_map = {
    "development": ".env.dev",
    "production": ".env.prod",
    "test": ".env.test"
}
load_dotenv(dotenv_path=env_file_map.get(env, ".env.dev"))

# Import configs

def get_settings():
    if env == "production":
        return ProductionConfig()
    elif env == "test":
        return TestConfig()
    return DevelopmentConfig()


settings = get_settings()

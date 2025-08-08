import os

def get_environment() -> str:
    """Determine the active environment from the ENVIRONMENT variable."""
    return os.getenv("ENVIRONMENT", "dev")
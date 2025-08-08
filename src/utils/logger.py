import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logging():
    logger = logging.getLogger("product-api")
    logger.setLevel(logging.INFO)
    handler = RotatingFileHandler("product-api.log", maxBytes=10*1024*1024, backupCount=5)
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(request_id)s - %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger
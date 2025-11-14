import logging
from logging.handlers import TimedRotatingFileHandler
from datetime import datetime
import os

BASE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LOG_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE = os.path.join(LOG_DIR, f"app_log_{datetime.now().strftime('%Y-%m-%d')}.log")

def setup_logger():
    logger = logging.getLogger("app_logger")
    logger.setLevel(logging.INFO)

    if not logger.hasHandlers():
        formatter = logging.Formatter(
            "%(asctime)s - %(levelname)s - %(name)s - %(message)s",
            datefmt = "%Y-%m-%d %H:%M:%S"
        )

        handler = TimedRotatingFileHandler(
            LOG_FILE,
            when="midnight",
            interval=1,
            backupCount=30,
            encoding="utf-8"
        )

        handler.suffix = "%Y-%m-%d"
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    logger.propagate = False
    return logger
    
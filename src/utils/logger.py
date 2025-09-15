import logging
import os
from logging.handlers import TimedRotatingFileHandler

def setup_logger() -> logging.Logger:
    # Create logs directory if it doesn't exist
    log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "logs")
    
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # Logger configuration
    logger = logging.getLogger("student_api_logger")
    logger.setLevel(logging.INFO)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_format)
    logger.addHandler(console_handler)

    # File handler with daily rotation
    file_handler = TimedRotatingFileHandler(
        filename=os.path.join(log_dir, "app.log"),
        interval=1,
        backupCount=30,
        encoding="utf-8"
    )
    file_handler.setLevel(logging.INFO)
    file_format = logging.Formatter('%(asctime)s - %(levelname)s - %(module)s - %(message)s')
    file_handler.setFormatter(file_format)
    file_handler.suffix = "%Y-%m-%d.log"
    logger.addHandler(file_handler)


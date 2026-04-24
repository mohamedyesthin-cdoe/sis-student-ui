from datetime import datetime
from typing import Optional
import logging
from fastapi import HTTPException
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_series_number(last_reg_no: str, program_code: str, year: str) -> str:
    """Generate a new series number starting from 001 each year."""
    if last_reg_no is None or not last_reg_no.startswith(f"{program_code}{year}"):
        # New year or no records → restart series
        return "001"
    else:
        # Take the last 3 digits after program_code+year
        next_number = int(last_reg_no[len(program_code) + len(year):]) + 1
        return f"{next_number:03d}"  # keep 3 digits

def generate_registration_number(program_code: str, last_reg_no: str, admission_year: str) -> str:
    """Generate registration number as program_code + year + series(3 digits)."""

    try:
        # Handle formats like "2026" or "2025-2026"
        if "-" in admission_year:
            year_part = admission_year.split("-")[-1]  # get after "-"
        else:
            year_part = admission_year

        year = year_part[-2:]  # last two digits

        series_number = generate_series_number(last_reg_no, program_code, year)

    except Exception as e:
        logging.error(f"Error syncing students: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to sync students: {str(e)}")

    registration_no = f"{program_code}{year}{series_number}"

    logging.info(f"Admission year received: {admission_year}")
    logging.info(f"Extracted year: {year}")
    logging.info(f"Generated registration number: {registration_no}")

    return registration_no
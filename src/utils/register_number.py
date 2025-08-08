from datetime import datetime
from typing import Optional
import logging

def generate_series_number(last_number: str) -> str:
    """Generate a new series number based on the last number."""
    if last_number is None:
        return "01"
    else:
        next_number = int(last_number[9:]) + 1
        return f"{next_number:02d}"
    
def generate_registration_number(program_code: str, last_reg_no: str) -> str:
    """Generate a registration number based on program code, year, batch, and series number."""
    year = str(datetime.now().year)[-2:]
    month = datetime.now().month
    batch = "01" if month <= 6 else "02"
    series_number = generate_series_number(last_reg_no)    
    registration_no = f"{program_code}{year}{batch}{series_number}"
    logging.info(f"Generated registration number: {registration_no}")
    return registration_no

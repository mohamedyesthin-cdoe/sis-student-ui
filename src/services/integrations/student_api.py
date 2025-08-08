from typing import List
import httpx
from src.core.config import settings
from fastapi import HTTPException

ERP_API_URL = 'http://127.0.0.1:8001/student/'
ERP_API_KEY = "cd651e7518fbb58bf6931a9e0d6decf1807cd8b607f99231b601ee691fc6b235"

async def fetch_students_from_erp() -> List[dict]:
    print("place 2")
    headers = {"Authorization": f"Bearer {ERP_API_KEY}"}
    #params = {"page": page, "limit": limit}
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(ERP_API_URL, headers=headers)
            data = response.json()
            return data
        except httpx.HTTPStatusError as e:
            print(f"HTTP error occurred: {str(e)}")
            raise HTTPException(status_code=e.response.status_code, detail="ERP API request failed")
        except Exception as e:
            print(f"Error fetching data from ERP API: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")
    
# import httpx
# import os
# import logging
# from typing import List, Dict, Any
# from src.core.config import settings

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# async def fetch_students() -> List[Dict[str, Any]]:
#     api_url = os.getenv(settings.STUDENT_API_URL, "http://127.0.0.1:8000/students/")
#     async with httpx.AsyncClient(timeout=10.0) as client:
#         logger.info(f"Fetching students from {api_url}...")
#         try:
#             response = await client.get(api_url)
#             response.raise_for_status()
#             data = response.json()
#             if not isinstance(data, list):
#                 logger.error("Expected a list of students, got: %s", type(data))
#                 raise ValueError("Invalid response format: Expected a list")
#             return data
#         except httpx.HTTPStatusError as e:
#             logger.error(f"HTTP error occurred: {str(e)}")
#             raise
#         except httpx.RequestError as e:
#             logger.error(f"Network error occurred: {str(e)}")
#             raise
#         except ValueError as e:
#             logger.error(f"JSON decode error: {str(e)}")
#             raise
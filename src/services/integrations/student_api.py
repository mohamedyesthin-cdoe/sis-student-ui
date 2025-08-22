import json
from typing import List
import httpx
from src.core.config import settings
from fastapi import HTTPException

# ERP_API_URL = 'http://127.0.0.1:8001/student/'
# ERP_API_KEY = "cd651e7518fbb58bf6931a9e0d6decf1807cd8b607f99231b601ee691fc6b235"

# async def fetch_students_from_erp() -> List[dict]:
#     headers = {"Authorization": f"Bearer {ERP_API_KEY}"}
#     #params = {"page": page, "limit": limit}
#     async with httpx.AsyncClient(timeout=10.0) as client:
#         try:
#             response = await client.get(ERP_API_URL, headers=headers)
#             data = response.json()
#             return data
#         except httpx.HTTPStatusError as e:
#             print(f"HTTP error occurred: {str(e)}")
#             raise HTTPException(status_code=e.response.status_code, detail="ERP API request failed")
#         except Exception as e:
#             print(f"Error fetching data from ERP API: {str(e)}")
#             raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")
    
async def fetch_students_list() -> dict:
    """Fetch students from the external API."""
    api_url = settings.MERRITO_API_URL
    headers = {
        "secret-key": settings.MERRITO_SECRET_KEY,
        "access-key": settings.MERRITO_ACCESS_KEY,
        "Content-Type": "application/json",
    }
    try:
        with open("payload.json", "r") as file:
            payload = json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Payload file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding payload JSON")
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.post(api_url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            # Validate response format
            # if not isinstance(data, list):
            #     raise HTTPException(status_code=500, detail="Invalid response format: Expected a list")
            return data
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="External API request failed")
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"JSON decode error: {str(e)}")
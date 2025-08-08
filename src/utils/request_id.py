from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import uuid
import logging

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        logging.getLogger("product-api").info(f"Request started: {request.url}", extra={"request_id": request_id})
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        logging.getLogger("product-api").info(f"Request completed: {request.url}", extra={"request_id": request_id})
        return response
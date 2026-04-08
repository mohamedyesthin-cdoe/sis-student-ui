from fastapi.responses import JSONResponse
from fastapi import Request, FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from src.utils.exceptions import ApiException


def register_exception_handlers(app: FastAPI):

    # Custom API Exception
    @app.exception_handler(ApiException)
    async def api_exception_handler(request: Request, exc: ApiException):
        return JSONResponse(
            status_code=exc.code,
            content={
                "code": exc.code,
                "status": False,
                "message": exc.message,
                "data": None
            }
        )

    # Validation Error
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):

        errors = []

        for err in exc.errors():
            errors.append({
                "field": ".".join(str(loc) for loc in err["loc"]),
                "message": err["msg"]
            })

        return JSONResponse(
            status_code=422,
            content={
                "code": 422,
                "status": False,
                "message": "Validation error",
                "data": errors
            }
        )

    # HTTP Exception
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "code": exc.status_code,
                "status": False,
                "message": exc.detail,
                "data": None
            }
        )

    # Internal Server Error
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):

        return JSONResponse(
            status_code=500,
            content={
                "code": 500,
                "status": False,
                "message": "Internal server error",
                "data": None
            }
        )
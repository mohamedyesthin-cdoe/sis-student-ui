from typing import Optional
from sqlalchemy.orm import Session
from src.schemas.payment import DataResponse, PaginationResponse, StandardResponse
from src.repositories.api import ApiRepository

class ApiService:
    def __init__(self, db: Session):
        self.repo = ApiRepository(db)
        
    def get_payment_all_students(self,limit: int,next_page: Optional[str],previous_page: Optional[str]) -> StandardResponse:
        """Retrieve paginated students with payments."""
        
        students, new_next_token, prev_token = self.repo.get_payment_all_students(
            limit=limit,
            next_page=next_page,
            previous_page=previous_page
        )

        pagination = PaginationResponse(
            previous_page=prev_token,
            next_page=new_next_token
        )

        return StandardResponse(
            code=200,
            status=True,
            message="Payments fetched successfully",
            data=DataResponse(list=students, pagination=pagination)
        )
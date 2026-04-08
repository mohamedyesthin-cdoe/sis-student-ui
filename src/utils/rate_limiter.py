from fastapi import HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

class RateLimiter:
    def __init__(self, rate_limit: int, per: int):
        self.rate_limit = rate_limit
        self.per = per

    def limit(self, key: str):
        return limiter.limit(f"{self.rate_limit}/{self.per}/second", key_func=lambda: key)
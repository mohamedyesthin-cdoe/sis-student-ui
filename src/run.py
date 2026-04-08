import uvicorn
from src.db import Base, engine
from src.main import app

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if app.state.environment == "development" else False
    )
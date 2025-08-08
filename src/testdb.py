from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL="postgresql://postgres:Test123@localhost:5432/postgres"
print(DATABASE_URL)
engine = create_engine(DATABASE_URL)
try:
    with engine.connect() as connection:
        print("Connection successful!")
except Exception as e:
    print(f"Connection failed: {e}")
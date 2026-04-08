from sqlalchemy import create_engine, text

# Adjust this URL to your actual DB
#DATABASE_URL = "postgresql://postgres:Test123@localhost:5432/postgres"
DATABASE_URL="postgresql://postgres:Admin123@localhost:5432/sishub"

engine = create_engine(DATABASE_URL, isolation_level="AUTOCOMMIT")

with engine.connect() as conn:
    conn.execute(text("DROP SCHEMA public CASCADE"))
    conn.execute(text("CREATE SCHEMA public"))

print("✅ Schema reset complete.")
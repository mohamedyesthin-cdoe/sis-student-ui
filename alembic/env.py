from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys
from dotenv import load_dotenv

sys.path.append(os.getcwd())
from src.db.session import Base  
from src import models

load_dotenv()

config = context.config
fileConfig(config.config_file_name)

# Set up database connection
connectable = engine_from_config(
    config.get_section(config.config_ini_section),
    prefix="sqlalchemy.",
    poolclass=pool.NullPool
)

with connectable.connect() as connection:
    context.configure(
        connection=connection,
        target_metadata=Base.metadata
    )

    with context.begin_transaction():
        context.run_migrations()
#!/bin/bash
cd /home/cdoe/django/SisHub
source ../venv/bin/activate
echo "🔄 Running Alembic migration..."
alembic upgrade head
echo "✅ Migration complete!"

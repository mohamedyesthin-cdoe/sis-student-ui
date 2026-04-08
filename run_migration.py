#!/usr/bin/env python3
"""
Run Alembic migrations programmatically
"""
import os
import sys

# Change to project directory
os.chdir('/home/cdoe/django/SisHub')
sys.path.insert(0, '/home/cdoe/django/SisHub')

# Setup environment
os.environ.setdefault('PYTHONPATH', '/home/cdoe/django/SisHub')

from alembic.config import Config
from alembic import command

def run_migration():
    """Run Alembic upgrade"""
    try:
        # Configure Alembic
        alembic_cfg = Config('/home/cdoe/django/SisHub/alembic.ini')
        
        # Get current revision
        print("📋 Current revisions:")
        try:
            command.current(alembic_cfg)
        except:
            print("   No previous revisions")
        
        # Run upgrade
        print("\n🔄 Running migrations to head...")
        command.upgrade(alembic_cfg, 'head')
        
        print("\n✅ Migration complete!")
        print("\n📋 New revisions:")
        command.current(alembic_cfg)
        
        return True
    except Exception as e:
        print(f"\n❌ Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = run_migration()
    sys.exit(0 if success else 1)

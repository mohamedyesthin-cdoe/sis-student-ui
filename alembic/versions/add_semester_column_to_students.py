"""Add semester column to students table

Revision ID: add_semester_column
Revises: 
Create Date: 2026-04-02 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_semester_column'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add semester column to students table
    op.add_column('students', sa.Column('semester', sa.String(20), nullable=True))
    # Add index for faster lookups with batch/admission_year/semester
    op.create_index('ix_students_batch_year_semester', 'students', 
                    ['batch', 'admission_year', 'semester'])


def downgrade() -> None:
    # Drop the index
    op.drop_index('ix_students_batch_year_semester', table_name='students')
    # Drop the column
    op.drop_column('students', 'semester')

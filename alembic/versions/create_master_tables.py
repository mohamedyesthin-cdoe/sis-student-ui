"""create master tables for academic years batches and semesters

Revision ID: create_master_tables
Revises: b39d42a91c84
Create Date: 2026-03-27 15:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'create_master_tables'
down_revision = 'b39d42a91c84'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create academic_years table
    op.create_table(
        'academic_years',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('year_code', sa.String(length=20), nullable=False),
        sa.Column('start_year', sa.Integer(), nullable=False),
        sa.Column('end_year', sa.Integer(), nullable=False),
        sa.Column('start_month', sa.Integer(), nullable=False),
        sa.Column('end_month', sa.Integer(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('year_code', name='uq_year_code')
    )
    op.create_index('ix_academic_years_year_code', 'academic_years', ['year_code'], unique=True)

    # Create batches table
    op.create_table(
        'batches',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('academic_year_id', sa.Integer(), nullable=False),
        sa.Column('batch_number', sa.Integer(), nullable=False),
        sa.Column('batch_name', sa.String(length=100), nullable=False),
        sa.Column('start_month', sa.Integer(), nullable=False),
        sa.Column('end_month', sa.Integer(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(['academic_year_id'], ['academic_years.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_batches_academic_year_id', 'batches', ['academic_year_id'])

    # Create semester_masters table
    op.create_table(
        'semester_masters',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('program_type', sa.String(length=50), nullable=False),
        sa.Column('semester_number', sa.Integer(), nullable=False),
        sa.Column('semester_name', sa.String(length=100), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('program_type', 'semester_number', name='uq_program_type_semester')
    )
    op.create_index('ix_semester_masters_program_type', 'semester_masters', ['program_type'])


def downgrade() -> None:
    op.drop_index('ix_semester_masters_program_type', table_name='semester_masters')
    op.drop_table('semester_masters')
    op.drop_index('ix_batches_academic_year_id', table_name='batches')
    op.drop_table('batches')
    op.drop_index('ix_academic_years_year_code', table_name='academic_years')
    op.drop_table('academic_years')

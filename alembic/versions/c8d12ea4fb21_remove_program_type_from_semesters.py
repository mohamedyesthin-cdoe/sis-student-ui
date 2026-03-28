"""remove program_type from semesters

Revision ID: c8d12ea4fb21
Revises: 3b7ac601e6fd
Create Date: 2026-03-27 20:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c8d12ea4fb21'
down_revision: Union[str, None] = '3b7ac601e6fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table('semesters'):
        return

    columns = {col['name'] for col in inspector.get_columns('semesters')}
    indexes = {idx['name'] for idx in inspector.get_indexes('semesters')}

    idx_name = op.f('ix_semesters_program_type')
    if idx_name in indexes:
        op.drop_index(idx_name, table_name='semesters')

    if 'program_type' in columns:
        op.drop_column('semesters', 'program_type')


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table('semesters'):
        return

    columns = {col['name'] for col in inspector.get_columns('semesters')}
    if 'program_type' not in columns:
        op.add_column('semesters', sa.Column('program_type', sa.String(length=10), nullable=True))
        op.execute(sa.text("UPDATE semesters SET program_type = 'UG' WHERE program_type IS NULL"))
        op.alter_column('semesters', 'program_type', nullable=False)

    indexes = {idx['name'] for idx in inspector.get_indexes('semesters')}
    idx_name = op.f('ix_semesters_program_type')
    if idx_name not in indexes:
        op.create_index(idx_name, 'semesters', ['program_type'], unique=False)

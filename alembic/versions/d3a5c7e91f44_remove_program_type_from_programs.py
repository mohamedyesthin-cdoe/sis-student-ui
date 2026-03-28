"""remove program_type from programs

Revision ID: d3a5c7e91f44
Revises: c8d12ea4fb21
Create Date: 2026-03-27 21:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd3a5c7e91f44'
down_revision: Union[str, None] = 'c8d12ea4fb21'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table('programs'):
        return

    columns = {col['name'] for col in inspector.get_columns('programs')}
    indexes = {idx['name'] for idx in inspector.get_indexes('programs')}

    idx_name = op.f('ix_programs_program_type')
    if idx_name in indexes:
        op.drop_index(idx_name, table_name='programs')

    if 'program_type' in columns:
        op.drop_column('programs', 'program_type')


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table('programs'):
        return

    columns = {col['name'] for col in inspector.get_columns('programs')}
    if 'program_type' not in columns:
        op.add_column('programs', sa.Column('program_type', sa.String(length=10), nullable=True))
        op.execute(sa.text("UPDATE programs SET program_type = 'UG' WHERE program_type IS NULL"))
        op.alter_column('programs', 'program_type', nullable=False)

    indexes = {idx['name'] for idx in inspector.get_indexes('programs')}
    idx_name = op.f('ix_programs_program_type')
    if idx_name not in indexes:
        op.create_index(idx_name, 'programs', ['program_type'], unique=False)

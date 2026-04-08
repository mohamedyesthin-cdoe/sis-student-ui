"""merge heads

Revision ID: 1e201a2ce66c
Revises: add_pending_workflow_flag_students, add_semester_column, d3a5c7e91f44
Create Date: 2026-04-06 13:47:57.362027

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1e201a2ce66c'
down_revision: Union[str, None] = ('add_pending_workflow_flag_students', 'add_semester_column', 'd3a5c7e91f44')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

"""merge heads

Revision ID: c89ab28217cf
Revises: 1e201a2ce66c, drop_pending_payment_semester
Create Date: 2026-04-06 14:04:40.234619

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c89ab28217cf'
down_revision: Union[str, None] = ('1e201a2ce66c', 'drop_pending_payment_semester')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

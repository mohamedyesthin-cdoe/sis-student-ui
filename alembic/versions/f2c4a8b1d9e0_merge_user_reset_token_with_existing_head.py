"""merge user reset token with existing head

Revision ID: f2c4a8b1d9e0
Revises: 62976343d5a4, c1f20c02e6ab
Create Date: 2026-03-26 13:35:00.000000

"""
from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = 'f2c4a8b1d9e0'
down_revision: Union[str, Sequence[str], None] = ('62976343d5a4', 'c1f20c02e6ab')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

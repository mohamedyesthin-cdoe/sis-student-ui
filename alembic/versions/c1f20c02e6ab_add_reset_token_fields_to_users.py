"""add reset token fields to users

Revision ID: c1f20c02e6ab
Revises: 4d69d24ad0e3
Create Date: 2026-03-26 13:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1f20c02e6ab'
down_revision: Union[str, None] = '4d69d24ad0e3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('reset_token', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('reset_token_expiry', sa.TIMESTAMP(), nullable=True))
    op.add_column(
        'users',
        sa.Column('reset_token_used', sa.Boolean(), nullable=False, server_default=sa.text('false')),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'reset_token_used')
    op.drop_column('users', 'reset_token_expiry')
    op.drop_column('users', 'reset_token')

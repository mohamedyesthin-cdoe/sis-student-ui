"""add pending payment workflow fields

Revision ID: a7b13de0c2f9
Revises: f2c4a8b1d9e0
Create Date: 2026-03-26 15:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a7b13de0c2f9'
down_revision: Union[str, None] = 'f2c4a8b1d9e0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'programs',
        sa.Column(
            'pending_payment_workflow_enabled',
            sa.Boolean(),
            nullable=False,
            server_default=sa.text('false')
        )
    )

    op.add_column(
        'students',
        sa.Column('pending_payment_due', sa.Boolean(), nullable=False, server_default=sa.text('false'))
    )
    op.add_column(
        'students',
        sa.Column('pending_payment_amount', sa.Float(), nullable=False, server_default=sa.text('0'))
    )
    op.add_column('students', sa.Column('pending_payment_link', sa.Text(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('students', 'pending_payment_link')
    op.drop_column('students', 'pending_payment_amount')
    op.drop_column('students', 'pending_payment_due')
    op.drop_column('programs', 'pending_payment_workflow_enabled')

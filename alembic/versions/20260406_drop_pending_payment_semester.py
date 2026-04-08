"""Drop pending_payment_semester column from students

Revision ID: drop_pending_payment_semester
Revises: merge_heads_20260406
Create Date: 2026-04-06 00:35:00.000000
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "drop_pending_payment_semester"
down_revision = "merge_heads_20260406"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if inspector.has_column("students", "pending_payment_semester"):
        op.drop_column("students", "pending_payment_semester")


def downgrade() -> None:
    op.add_column(
        "students",
        sa.Column("pending_payment_semester", sa.String(length=20), nullable=True),
    )

"""Add pending_payment_workflow_enabled to students

Revision ID: add_pending_workflow_flag_students
Revises: f9e5c3d2a1b4
Create Date: 2026-04-06 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "add_pending_workflow_flag_students"
down_revision = "f9e5c3d2a1b4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if not inspector.has_column("students", "pending_payment_workflow_enabled"):
        op.add_column(
            "students",
            sa.Column("pending_payment_workflow_enabled", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        )
        op.alter_column(
            "students",
            "pending_payment_workflow_enabled",
            server_default=None,
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if inspector.has_column("students", "pending_payment_workflow_enabled"):
        op.drop_column("students", "pending_payment_workflow_enabled")

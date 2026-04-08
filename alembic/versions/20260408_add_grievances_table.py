"""Add grievances table

Revision ID: add_grievances_table
Revises: drop_pending_payment_semester
Create Date: 2026-04-08 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "add_grievances_table"
down_revision = "drop_pending_payment_semester"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "grievances",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.id"), nullable=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=120), nullable=True),
        sa.Column("mobile_number", sa.String(length=20), nullable=True),
        sa.Column("category", sa.String(length=50), nullable=False, server_default="general"),
        sa.Column("subject", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="open"),
        sa.Column("attachment_url", sa.Text(), nullable=True),
        sa.Column("resolution_notes", sa.Text(), nullable=True),
    )

    # Remove defaults after creation to avoid locking default at DB level
    op.alter_column("grievances", "category", server_default=None)
    op.alter_column("grievances", "status", server_default=None)


def downgrade() -> None:
    op.drop_table("grievances")

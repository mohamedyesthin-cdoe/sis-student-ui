"""add assigned_to to grievances

Revision ID: 20260408_add_assigned_to_grievance
Revises: ca51e6cf55bd
Create Date: 2026-04-08
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20260408_add_assigned_to_grievance"
down_revision: Union[str, None] = "ca51e6cf55bd"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "grievances",
        sa.Column("assigned_to_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_grievances_assigned_to",
        "grievances",
        "staff",
        ["assigned_to_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_grievances_assigned_to", "grievances", type_="foreignkey")
    op.drop_column("grievances", "assigned_to_id")

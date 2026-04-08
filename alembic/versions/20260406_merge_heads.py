"""Merge multiple heads into single lineage

Revision ID: merge_heads_20260406
Revises: add_pending_workflow_flag_students, add_semester_column, d3a5c7e91f44
Create Date: 2026-04-06 00:30:00.000000
"""
from alembic import op


# revision identifiers, used by Alembic.
revision = "merge_heads_20260406"
down_revision = ("add_pending_workflow_flag_students", "add_semester_column", "d3a5c7e91f44")
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

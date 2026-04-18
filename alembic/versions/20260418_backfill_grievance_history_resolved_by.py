"""Backfill grievance history resolver ids

Revision ID: 20260418_backfill_grievance_history_resolved_by
Revises: 20260408_add_assigned_to_grievance
Create Date: 2026-04-18 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260418_backfill_grievance_history_resolved_by"
down_revision = "20260408_add_assigned_to_grievance"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Historical UAT rows for admin-closed grievances were written before the
    # resolver was persisted. For those rows, use the grievance's current
    # assignee as the best available resolver reference.
    op.execute(
        sa.text(
            """
            UPDATE grievance_history gh
            SET resolved_by_id = g.assigned_to_id
            FROM grievances g
            WHERE gh.grievance_id = g.id
              AND gh.action = 'closed'
              AND gh.status = 'closed_by_admin'
              AND gh.resolved_by_id IS NULL
              AND g.assigned_to_id IS NOT NULL
            """
        )
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            """
            UPDATE grievance_history gh
            SET resolved_by_id = NULL
            FROM grievances g
            WHERE gh.grievance_id = g.id
              AND gh.action = 'closed'
              AND gh.status = 'closed_by_admin'
              AND gh.resolved_by_id = g.assigned_to_id
            """
        )
    )

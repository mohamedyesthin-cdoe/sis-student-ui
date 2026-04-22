"""drop faculty from programs

Revision ID: 20260422_drop_program_faculty
Revises: 20260422_rename_program_admission_year_to_academic_year
Create Date: 2026-04-22 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260422_drop_program_faculty"
down_revision = "20260422_rename_program_admission_year_to_academic_year"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("programs"):
        return

    program_columns = {col["name"] for col in inspector.get_columns("programs")}
    if "faculty" in program_columns:
        op.drop_column("programs", "faculty")


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("programs"):
        return

    program_columns = {col["name"] for col in inspector.get_columns("programs")}
    if "faculty" not in program_columns:
        op.add_column("programs", sa.Column("faculty", sa.String(length=100), nullable=True))

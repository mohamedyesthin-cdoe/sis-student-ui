"""rename program admission year to academic year

Revision ID: 20260422_rename_program_admission_year_to_academic_year
Revises: 20260422_replace_program_department_id_with_code
Create Date: 2026-04-22 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260422_rename_program_admission_year_to_academic_year"
down_revision = "20260422_replace_program_department_id_with_code"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("programs"):
        return

    program_columns = {col["name"] for col in inspector.get_columns("programs")}

    if "admission_year" in program_columns and "academic_year" not in program_columns:
        op.alter_column(
            "programs",
            "admission_year",
            new_column_name="academic_year",
            existing_type=sa.String(length=10),
        )
    elif "admission_year" in program_columns and "academic_year" in program_columns:
        op.execute(
            sa.text(
                """
                UPDATE programs
                SET academic_year = COALESCE(academic_year, admission_year)
                """
            )
        )
        op.drop_column("programs", "admission_year")


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("programs"):
        return

    program_columns = {col["name"] for col in inspector.get_columns("programs")}

    if "academic_year" in program_columns and "admission_year" not in program_columns:
        op.alter_column(
            "programs",
            "academic_year",
            new_column_name="admission_year",
            existing_type=sa.String(length=10),
        )
    elif "academic_year" in program_columns and "admission_year" in program_columns:
        op.execute(
            sa.text(
                """
                UPDATE programs
                SET admission_year = COALESCE(admission_year, academic_year)
                """
            )
        )
        op.drop_column("programs", "academic_year")

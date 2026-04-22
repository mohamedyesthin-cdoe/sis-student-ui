"""add department code to departments

Revision ID: 20260422_add_department_code_to_departments
Revises: 20260422_add_department_id_to_programs
Create Date: 2026-04-22 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260422_add_department_code_to_departments"
down_revision = "20260422_add_department_id_to_programs"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("departments"):
        return

    department_columns = {col["name"] for col in inspector.get_columns("departments")}
    department_indexes = {idx["name"] for idx in inspector.get_indexes("departments")}

    if "department_code" not in department_columns:
        op.add_column("departments", sa.Column("department_code", sa.String(length=50), nullable=True))

    if "ix_departments_department_code" not in department_indexes:
        op.create_index(
            "ix_departments_department_code",
            "departments",
            ["department_code"],
            unique=True,
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("departments"):
        return

    department_indexes = {idx["name"] for idx in inspector.get_indexes("departments")}

    if "ix_departments_department_code" in department_indexes:
        op.drop_index("ix_departments_department_code", table_name="departments")

    department_columns = {col["name"] for col in inspector.get_columns("departments")}
    if "department_code" in department_columns:
        op.drop_column("departments", "department_code")

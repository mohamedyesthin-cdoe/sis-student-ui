"""link programs to departments

Revision ID: 20260422_add_department_id_to_programs
Revises: create_master_tables
Create Date: 2026-04-22 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260422_add_department_id_to_programs"
down_revision = "create_master_tables"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("programs"):
        return

    program_columns = {col["name"] for col in inspector.get_columns("programs")}
    program_indexes = {idx["name"] for idx in inspector.get_indexes("programs")}
    program_fks = {fk["name"] for fk in inspector.get_foreign_keys("programs") if fk.get("name")}

    if "department_id" not in program_columns:
        op.add_column("programs", sa.Column("department_id", sa.Integer(), nullable=True))

    if "ix_programs_department_id" not in program_indexes:
        op.create_index("ix_programs_department_id", "programs", ["department_id"])

    fk_name = "fk_programs_department_id_departments"
    if fk_name not in program_fks:
        op.create_foreign_key(
            fk_name,
            "programs",
            "departments",
            ["department_id"],
            ["id"],
            ondelete="SET NULL",
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("programs"):
        return

    program_indexes = {idx["name"] for idx in inspector.get_indexes("programs")}
    program_fks = {fk["name"] for fk in inspector.get_foreign_keys("programs") if fk.get("name")}

    fk_name = "fk_programs_department_id_departments"
    if fk_name in program_fks:
        op.drop_constraint(fk_name, "programs", type_="foreignkey")

    if "ix_programs_department_id" in program_indexes:
        op.drop_index("ix_programs_department_id", table_name="programs")

    program_columns = {col["name"] for col in inspector.get_columns("programs")}
    if "department_id" in program_columns:
        op.drop_column("programs", "department_id")

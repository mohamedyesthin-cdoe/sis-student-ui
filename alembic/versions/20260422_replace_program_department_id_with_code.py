"""replace program department id with department code

Revision ID: 20260422_replace_program_department_id_with_code
Revises: 20260422_add_department_code_to_departments
Create Date: 2026-04-22 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260422_replace_program_department_id_with_code"
down_revision = "20260422_add_department_code_to_departments"
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

    if "department_code" not in program_columns:
        op.add_column("programs", sa.Column("department_code", sa.String(length=50), nullable=True))

    if "department_id" in program_columns:
        op.execute(
            sa.text(
                """
                UPDATE programs p
                SET department_code = d.department_code
                FROM departments d
                WHERE p.department_id = d.id
                  AND p.department_code IS NULL
                  AND d.department_code IS NOT NULL
                """
            )
        )

    old_fk_name = "fk_programs_department_id_departments"
    if old_fk_name in program_fks:
        op.drop_constraint(old_fk_name, "programs", type_="foreignkey")

    old_index = "ix_programs_department_id"
    if old_index in program_indexes:
        op.drop_index(old_index, table_name="programs")

    if "ix_programs_department_code" not in program_indexes:
        op.create_index("ix_programs_department_code", "programs", ["department_code"])

    new_fk_name = "fk_programs_department_code_departments"
    if new_fk_name not in program_fks:
        op.create_foreign_key(
            new_fk_name,
            "programs",
            "departments",
            ["department_code"],
            ["department_code"],
            ondelete="SET NULL",
        )

    if "department_id" in program_columns:
        op.drop_column("programs", "department_id")


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("programs"):
        return

    program_columns = {col["name"] for col in inspector.get_columns("programs")}
    program_indexes = {idx["name"] for idx in inspector.get_indexes("programs")}
    program_fks = {fk["name"] for fk in inspector.get_foreign_keys("programs") if fk.get("name")}

    if "department_id" not in program_columns:
        op.add_column("programs", sa.Column("department_id", sa.Integer(), nullable=True))

    if "department_code" in program_columns:
        op.execute(
            sa.text(
                """
                UPDATE programs p
                SET department_id = d.id
                FROM departments d
                WHERE p.department_code = d.department_code
                  AND p.department_id IS NULL
                  AND d.department_code IS NOT NULL
                """
            )
        )

    new_fk_name = "fk_programs_department_code_departments"
    if new_fk_name in program_fks:
        op.drop_constraint(new_fk_name, "programs", type_="foreignkey")

    new_index = "ix_programs_department_code"
    if new_index in program_indexes:
        op.drop_index(new_index, table_name="programs")

    if "ix_programs_department_id" not in program_indexes:
        op.create_index("ix_programs_department_id", "programs", ["department_id"])

    old_fk_name = "fk_programs_department_id_departments"
    if old_fk_name not in program_fks:
        op.create_foreign_key(
            old_fk_name,
            "programs",
            "departments",
            ["department_id"],
            ["id"],
            ondelete="SET NULL",
        )

    if "department_code" in program_columns:
        op.drop_column("programs", "department_code")

"""add program.department_id and semester.program_code

Revision ID: 20260422_add_program_department_id_and_semester_program_code
Revises: 20260422_refactor_schemes_to_program_semesters
Create Date: 2026-04-22 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260422_add_program_department_id_and_semester_program_code"
down_revision = "20260422_refactor_schemes_to_program_semesters"
branch_labels = None
depends_on = None


def _drop_fk_on_column(table_name: str, column_name: str) -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if not inspector.has_table(table_name):
        return

    for fk in inspector.get_foreign_keys(table_name):
        if fk.get("constrained_columns") == [column_name] and fk.get("name"):
            op.drop_constraint(fk["name"], table_name, type_="foreignkey")


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("programs"):
        program_columns = {col["name"] for col in inspector.get_columns("programs")}
        program_indexes = {idx["name"] for idx in inspector.get_indexes("programs")}
        program_fks = {fk["name"] for fk in inspector.get_foreign_keys("programs") if fk.get("name")}

        if "department_id" not in program_columns:
            op.add_column("programs", sa.Column("department_id", sa.Integer(), nullable=True))

        if "department_code" in program_columns and inspector.has_table("departments"):
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

        old_fk_name = "fk_programs_department_code_departments"
        if old_fk_name in program_fks:
            op.drop_constraint(old_fk_name, "programs", type_="foreignkey")

        if "ix_programs_department_code" not in program_indexes:
            op.create_index("ix_programs_department_code", "programs", ["department_code"], unique=False)

        if "ix_programs_department_id" not in program_indexes:
            op.create_index("ix_programs_department_id", "programs", ["department_id"], unique=False)

        if inspector.has_table("departments") and "fk_programs_department_id_departments" not in program_fks:
            op.create_foreign_key(
                "fk_programs_department_id_departments",
                "programs",
                "departments",
                ["department_id"],
                ["id"],
                ondelete="SET NULL",
            )

        op.alter_column("programs", "department_id", nullable=False)

    if inspector.has_table("semesters"):
        semester_columns = {col["name"] for col in inspector.get_columns("semesters")}
        semester_indexes = {idx["name"] for idx in inspector.get_indexes("semesters")}

        if "program_code" not in semester_columns:
            op.add_column("semesters", sa.Column("program_code", sa.String(length=50), nullable=True))

        if "program_id" in semester_columns and inspector.has_table("programs"):
            op.execute(
                sa.text(
                    """
                    UPDATE semesters s
                    SET program_code = p.programe_code
                    FROM programs p
                    WHERE s.program_id = p.id
                      AND s.program_code IS NULL
                    """
                )
            )

        if "ix_semesters_program_code" not in semester_indexes:
            op.create_index("ix_semesters_program_code", "semesters", ["program_code"], unique=False)

        op.alter_column("semesters", "program_code", nullable=False)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("semesters"):
        semester_indexes = {idx["name"] for idx in inspector.get_indexes("semesters")}
        if "ix_semesters_program_code" in semester_indexes:
            op.drop_index("ix_semesters_program_code", table_name="semesters")

        semester_columns = {col["name"] for col in inspector.get_columns("semesters")}
        if "program_code" in semester_columns:
            op.drop_column("semesters", "program_code")

    if inspector.has_table("programs"):
        program_fks = {fk["name"] for fk in inspector.get_foreign_keys("programs") if fk.get("name")}
        program_indexes = {idx["name"] for idx in inspector.get_indexes("programs")}

        if "fk_programs_department_id_departments" in program_fks:
            op.drop_constraint("fk_programs_department_id_departments", "programs", type_="foreignkey")

        if "ix_programs_department_id" in program_indexes:
            op.drop_index("ix_programs_department_id", table_name="programs")

        if "department_id" in {col["name"] for col in inspector.get_columns("programs")}:
            op.drop_column("programs", "department_id")

        if "ix_programs_department_code" not in program_indexes:
            op.create_index("ix_programs_department_code", "programs", ["department_code"], unique=False)


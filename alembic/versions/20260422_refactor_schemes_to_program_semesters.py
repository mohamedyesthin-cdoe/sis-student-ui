"""refactor schemes to program semesters

Revision ID: 20260422_refactor_schemes_to_program_semesters
Revises: 20260422_replace_program_department_id_with_code
Create Date: 2026-04-22 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
import re


# revision identifiers, used by Alembic.
revision = "20260422_refactor_schemes_to_program_semesters"
down_revision = "20260422_replace_program_department_id_with_code"
branch_labels = None
depends_on = None


def _semester_count_from_duration(duration) -> int:
    if duration is None:
        return 2

    match = re.search(r"(\d+)", str(duration))
    if not match:
        return 2

    years = int(match.group(1))
    return max(years, 1) * 2


def _drop_fk_constraints(table_name: str, column_name: str) -> None:
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

    if inspector.has_table("semesters"):
        semester_columns = {col["name"] for col in inspector.get_columns("semesters")}
        semester_indexes = {idx["name"] for idx in inspector.get_indexes("semesters")}

        if "program_id" not in semester_columns:
            op.add_column("semesters", sa.Column("program_id", sa.Integer(), nullable=True))

        if inspector.has_table("schemes") and "scheme_id" in semester_columns:
            op.execute(
                sa.text(
                    """
                    UPDATE semesters s
                    SET program_id = sc.programe_id
                    FROM schemes sc
                    WHERE s.scheme_id = sc.id
                      AND s.program_id IS NULL
                    """
                )
            )

        if "ix_semesters_program_id" not in semester_indexes:
            op.create_index("ix_semesters_program_id", "semesters", ["program_id"], unique=False)

        op.alter_column("semesters", "program_id", nullable=False)

        _drop_fk_constraints("semesters", "scheme_id")
        if "scheme_id" in semester_columns:
            op.drop_column("semesters", "scheme_id")

    if inspector.has_table("programs") and inspector.has_table("semesters"):
        programs = bind.execute(
            sa.text("SELECT id, duration FROM programs ORDER BY id")
        ).mappings().all()
        for program in programs:
            semester_count = bind.execute(
                sa.text("SELECT COUNT(*) FROM semesters WHERE program_id = :program_id"),
                {"program_id": program["id"]},
            ).scalar_one()
            if semester_count:
                continue

            count = _semester_count_from_duration(program["duration"])
            for semester_no in range(1, count + 1):
                bind.execute(
                    sa.text(
                        """
                        INSERT INTO semesters (program_id, semester_no, semester_name, created_at, updated_at)
                        VALUES (:program_id, :semester_no, :semester_name, NOW(), NOW())
                        """
                    ),
                    {
                        "program_id": program["id"],
                        "semester_no": semester_no,
                        "semester_name": f"Semester {semester_no}",
                    },
                )

    if inspector.has_table("exams"):
        exam_columns = {col["name"] for col in inspector.get_columns("exams")}
        _drop_fk_constraints("exams", "scheme_id")
        if "scheme_id" in exam_columns:
            op.drop_column("exams", "scheme_id")

    if inspector.has_table("student_exam_registrations"):
        reg_columns = {col["name"] for col in inspector.get_columns("student_exam_registrations")}
        _drop_fk_constraints("student_exam_registrations", "scheme_id")
        if "scheme_id" in reg_columns:
            op.drop_column("student_exam_registrations", "scheme_id")

    if inspector.has_table("schemes"):
        op.execute(sa.text("DROP TABLE IF EXISTS schemes CASCADE"))


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("semesters"):
        semester_columns = {col["name"] for col in inspector.get_columns("semesters")}
        if "scheme_id" not in semester_columns:
            op.add_column("semesters", sa.Column("scheme_id", sa.Integer(), nullable=True))
        _drop_fk_constraints("semesters", "program_id")
        if "program_id" in semester_columns:
            op.drop_column("semesters", "program_id")

    if inspector.has_table("exams"):
        exam_columns = {col["name"] for col in inspector.get_columns("exams")}
        if "scheme_id" not in exam_columns:
            op.add_column("exams", sa.Column("scheme_id", sa.Integer(), nullable=True))

    if inspector.has_table("student_exam_registrations"):
        reg_columns = {col["name"] for col in inspector.get_columns("student_exam_registrations")}
        if "scheme_id" not in reg_columns:
            op.add_column("student_exam_registrations", sa.Column("scheme_id", sa.Integer(), nullable=True))

"""move_program_type_from_schemes_to_programs

Revision ID: 3b7ac601e6fd
Revises: create_master_tables
Create Date: 2026-03-27 18:48:17.247603

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '3b7ac601e6fd'
down_revision: Union[str, None] = 'create_master_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    programs_cols = {col["name"] for col in inspector.get_columns("programs")}
    schemes_cols = {col["name"] for col in inspector.get_columns("schemes")} if inspector.has_table("schemes") else set()

    if "program_type" not in programs_cols:
        op.add_column("programs", sa.Column("program_type", sa.String(length=10), nullable=True))

    if "program_type" in schemes_cols:
        # Backfill programs.program_type from schemes.program_type
        op.execute(
            sa.text(
                """
                UPDATE programs p
                SET program_type = src.program_type
                FROM (
                    SELECT programe_id, MAX(program_type) AS program_type
                    FROM schemes
                    WHERE program_type IS NOT NULL
                    GROUP BY programe_id
                ) AS src
                WHERE p.id = src.programe_id
                """
            )
        )

    # Fallback default for any program rows still null
    op.execute(sa.text("UPDATE programs SET program_type = 'UG' WHERE program_type IS NULL"))

    op.alter_column("programs", "program_type", nullable=False)

    program_indexes = {idx["name"] for idx in inspector.get_indexes("programs")}
    target_index = op.f("ix_programs_program_type")
    if target_index not in program_indexes:
        op.create_index(target_index, "programs", ["program_type"], unique=False)

    if "program_type" in schemes_cols:
        op.drop_column("schemes", "program_type")


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    schemes_cols = {col["name"] for col in inspector.get_columns("schemes")} if inspector.has_table("schemes") else set()
    programs_cols = {col["name"] for col in inspector.get_columns("programs")}

    if "program_type" not in schemes_cols:
        op.add_column("schemes", sa.Column("program_type", sa.String(length=10), nullable=True))

    if "program_type" in programs_cols:
        op.execute(
            sa.text(
                """
                UPDATE schemes s
                SET program_type = p.program_type
                FROM programs p
                WHERE s.programe_id = p.id
                """
            )
        )
        op.execute(sa.text("UPDATE schemes SET program_type = 'UG' WHERE program_type IS NULL"))
        op.alter_column("schemes", "program_type", nullable=False)

        program_indexes = {idx["name"] for idx in inspector.get_indexes("programs")}
        target_index = op.f("ix_programs_program_type")
        if target_index in program_indexes:
            op.drop_index(target_index, table_name="programs")
        op.drop_column("programs", "program_type")

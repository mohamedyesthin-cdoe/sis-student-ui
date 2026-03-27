"""add program payment workflow scopes

Revision ID: b39d42a91c84
Revises: a7b13de0c2f9
Create Date: 2026-03-26 16:05:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b39d42a91c84'
down_revision: Union[str, None] = 'a7b13de0c2f9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not inspector.has_table("program_payment_workflow_scopes"):
        op.create_table(
            'program_payment_workflow_scopes',
            sa.Column('program_id', sa.Integer(), nullable=False),
            sa.Column('batch', sa.String(length=20), nullable=False),
            sa.Column('admission_year', sa.String(length=20), nullable=False),
            sa.Column('semester', sa.String(length=20), nullable=False),
            sa.Column('enabled', sa.Boolean(), nullable=False, server_default=sa.text('false')),
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['program_id'], ['programs.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint(
                'program_id',
                'batch',
                'admission_year',
                'semester',
                name='uq_program_payment_workflow_scope'
            )
        )

    existing_indexes = {idx["name"] for idx in inspector.get_indexes("program_payment_workflow_scopes")}
    target_index = op.f('ix_program_payment_workflow_scopes_program_id')
    if target_index not in existing_indexes:
        op.create_index(
            target_index,
            'program_payment_workflow_scopes',
            ['program_id'],
            unique=False
        )


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if inspector.has_table("program_payment_workflow_scopes"):
        existing_indexes = {idx["name"] for idx in inspector.get_indexes("program_payment_workflow_scopes")}
        target_index = op.f('ix_program_payment_workflow_scopes_program_id')
        if target_index in existing_indexes:
            op.drop_index(target_index, table_name='program_payment_workflow_scopes')
        op.drop_table('program_payment_workflow_scopes')

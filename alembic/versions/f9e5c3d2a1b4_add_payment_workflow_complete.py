"""add payment workflow complete - payments, semester_fees, application_fees, payment_transactions, pending_semester

Revision ID: f9e5c3d2a1b4
Revises: b39d42a91c84
Create Date: 2026-04-01 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f9e5c3d2a1b4'
down_revision: Union[str, None] = 'b39d42a91c84'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # 1. Add pending_payment_semester column to students table
    if not inspector.get_column('students', 'pending_payment_semester'):
        op.add_column(
            'students',
            sa.Column('pending_payment_semester', sa.String(length=20), nullable=True)
        )

    # 2. Create payments table
    if not inspector.has_table('payments'):
        op.create_table(
            'payments',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('student_id', sa.Integer(), nullable=False),
            sa.Column('payment_type', sa.String(length=50), nullable=True),
            sa.Column('order_id', sa.String(length=50), nullable=True),
            sa.Column('transaction_id', sa.String(length=50), nullable=True),
            sa.Column('payment_date', sa.DateTime(), nullable=True),
            sa.Column('payment_amount', sa.Float(), nullable=False, server_default=sa.text('0')),
            sa.Column('is_offline', sa.Boolean(), nullable=False, server_default=sa.text('false')),
            sa.Column('offline_transaction_id', sa.String(length=50), nullable=True),
            sa.Column('offline_payment_method', sa.String(length=50), nullable=True),
            sa.Column('offline_receipt_enabled', sa.Boolean(), nullable=False, server_default=sa.text('false')),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['student_id'], ['students.id'], ),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_payments_student_id'), 'payments', ['student_id'], unique=False)

    # 3. Create semester_fees table
    if not inspector.has_table('semester_fees'):
        op.create_table(
            'semester_fees',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('payment_id', sa.Integer(), nullable=False),
            sa.Column('semester', sa.String(length=20), nullable=False, server_default=sa.text("'1st'")),
            sa.Column('admission_fee', sa.Float(), nullable=False, server_default=sa.text('0')),
            sa.Column('lab_fee', sa.Float(), nullable=False, server_default=sa.text('0')),
            sa.Column('lms_fee', sa.Float(), nullable=False, server_default=sa.text('0')),
            sa.Column('exam_fee', sa.Float(), nullable=False, server_default=sa.text('0')),
            sa.Column('tuition_fee', sa.Float(), nullable=False, server_default=sa.text('0')),
            sa.Column('total_fee', sa.Float(), nullable=False, server_default=sa.text('0')),
            sa.ForeignKeyConstraint(['payment_id'], ['payments.id'], ),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('payment_id', name='uq_semester_fees_payment_id')
        )

    # 4. Create application_fees table
    if not inspector.has_table('application_fees'):
        op.create_table(
            'application_fees',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('payment_id', sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(['payment_id'], ['payments.id'], ),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('payment_id', name='uq_application_fees_payment_id')
        )

    # 5. Create payment_transactions table (for webhook tracking)
    if not inspector.has_table('payment_transactions'):
        op.create_table(
            'payment_transactions',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('student_id', sa.Integer(), nullable=False),
            sa.Column('payment_id', sa.Integer(), nullable=True),
            sa.Column('gateway_transaction_id', sa.String(length=100), nullable=False),
            sa.Column('gateway_name', sa.String(length=50), nullable=False, server_default=sa.text("'collexo'")),
            sa.Column('amount', sa.Float(), nullable=False),
            sa.Column('semester', sa.String(length=20), nullable=True),
            sa.Column('status', sa.String(length=50), nullable=True),
            sa.Column('gateway_response', sa.Text(), nullable=True),
            sa.Column('webhook_received_at', sa.DateTime(), nullable=True),
            sa.Column('payment_confirmed_at', sa.DateTime(), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(['payment_id'], ['payments.id'], ),
            sa.ForeignKeyConstraint(['student_id'], ['students.id'], ),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('gateway_transaction_id', name='uq_gateway_transaction_id')
        )
        op.create_index(op.f('ix_payment_transactions_gateway_transaction_id'), 
                       'payment_transactions', ['gateway_transaction_id'], unique=True)
        op.create_index(op.f('ix_payment_transactions_student_id'), 
                       'payment_transactions', ['student_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # Drop payment_transactions table
    if inspector.has_table('payment_transactions'):
        op.drop_index(op.f('ix_payment_transactions_student_id'), table_name='payment_transactions')
        op.drop_index(op.f('ix_payment_transactions_gateway_transaction_id'), table_name='payment_transactions')
        op.drop_table('payment_transactions')

    # Drop application_fees table
    if inspector.has_table('application_fees'):
        op.drop_table('application_fees')

    # Drop semester_fees table
    if inspector.has_table('semester_fees'):
        op.drop_table('semester_fees')

    # Drop payments table
    if inspector.has_table('payments'):
        op.drop_index(op.f('ix_payments_student_id'), table_name='payments')
        op.drop_table('payments')

    # Drop pending_payment_semester column from students
    if inspector.get_column('students', 'pending_payment_semester'):
        op.drop_column('students', 'pending_payment_semester')

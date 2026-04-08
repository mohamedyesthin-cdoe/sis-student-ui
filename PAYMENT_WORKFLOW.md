# Payment Workflow Documentation

## Overview
This documentation describes the complete semester fee payment workflow with automatic pending payment population and Collexo payment gateway integration.

---

## Architecture

### Flow Diagram
```
1. STAFF ENABLES WORKFLOW
   ↓
   Staff: Enable workflow for batch/year/semester
   Config: ProgramPaymentWorkflowScope (enabled=true)
   
2. AUTO-POPULATE PENDING PAYMENTS
   ↓
   API: POST /students/payment-workflow/auto-populate
   Query: FeeDetails table → get total_fee for semester
   Action: Populate for ALL students in group:
           - pending_payment_amount = FeeDetails.total_fee
           - pending_payment_link = Collexo gateway URL
           - pending_payment_due = true
           - pending_payment_semester = semester

3. DISPLAY TO STUDENTS
   ↓
   API: GET /students/{id}/pending-payment
   Returns: {
     pending_payment_due: true,
     pending_payment_amount: 5000.00,
     pending_payment_link: "https://payment.collexo.com/...",
     pending_payment_semester: "semester_2"
   }

4. STUDENT PAYS VIA LINK
   ↓
   Student clicks link → Redirected to Collexo gateway
   Completes payment → Collexo confirms transaction

5. WEBHOOK CONFIRMATION
   ↓
   Collexo sends webhook: POST /students/payment-workflow/webhook/collexo
   Payload: {
     transaction_id: "TXN123456",
     student_id: 1,
     amount: 5000.00,
     status: "completed"
   }

6. PAYMENT RECORDED
   ↓
   System creates:
   - PaymentTransaction (tracks webhook)
   - Payment (semester_fee type)
   - SemesterFee (semester 2 fees)
   
   Then clears:
   - pending_payment_due = false
   - pending_payment_amount = 0.0
   - pending_payment_link = null
   - pending_payment_semester = null
```

---

## Database Changes

### Student Table (students)
```sql
-- NEW COLUMN ADDED:
ALTER TABLE students ADD COLUMN pending_payment_semester VARCHAR(20) NULL;

-- EXISTING COLUMNS:
- pending_payment_due (Boolean) → AUTO FLAG
- pending_payment_amount (Float) → AUTO POPULATED
- pending_payment_link (Text) → AUTO POPULATED
```

### New Table: PaymentTransaction (payment_transactions)
```sql
CREATE TABLE payment_transactions (
    id INT PRIMARY KEY,
    student_id INT NOT NULL FOREIGN KEY,
    payment_id INT FOREIGN KEY (links to Payment after confirmation),
    gateway_transaction_id VARCHAR(100) NOT NULL UNIQUE,
    gateway_name VARCHAR(50) DEFAULT 'collexo',
    amount FLOAT NOT NULL,
    semester VARCHAR(20),
    status VARCHAR(50), -- pending, completed, failed, webhook_received, payment_created
    gateway_response TEXT, -- Full Collexo webhook response
    webhook_received_at DATETIME,
    payment_confirmed_at DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);
```

### Updated: SemesterFee Table
```sql
-- EXISTING STRUCTURE (no changes needed):
- payment_id (FOREIGN KEY to Payment)
- semester (VARCHAR) -- Now used for any semester (1st, 2nd, etc.)
- total_fee (Float)
- Other fee components...

-- NOW SUPPORTS:
- Semester 1 fees (existing)
- Semester 2 fees (new via webhook)
- Any semester fees (new via webhook)
```

---

## API Endpoints

### 1. Auto-Populate Pending Payments
```http
POST /students/payment-workflow/auto-populate
Authorization: Bearer <staff_token>
Content-Type: application/json

{
  "program_id": 1,
  "batch": "july-2026",
  "admission_year": "2026",
  "semester": "semester_2"
}

Response (200 OK):
{
  "message": "Successfully updated 50 students with pending payments",
  "updated_count": 50,
  "students_updated": [
    {
      "id": 1,
      "registration_no": "REG001",
      "amount": 50000.00,
      "link": "https://payment.collexo.com/user/login/?dest=/sri-ramachandra-digilearn-27224/applicant/add/"
    },
    ...
  ]
}
```

### 2. Get Pending Payment Status (Student View)
```http
GET /students/{student_id}/pending-payment
Authorization: Bearer <staff_token>

Response (200 OK):
{
  "student_id": 1,
  "program_id": 1,
  "workflow_enabled": true,
  "pending_payment_due": true,
  "pending_payment_amount": 50000.00,
  "pending_payment_link": "https://payment.collexo.com/user/login/?dest=/sri-ramachandra-digilearn-27224/applicant/add/",
  "message": "Pending payment status fetched successfully"
}
```

### 3. Collexo Webhook Handler
```http
POST /students/payment-workflow/webhook/collexo
Content-Type: application/json
X-Webhook-Signature: <signature_from_collexo>

{
  "transaction_id": "COLLEXO-TXN-2026-001",
  "student_id": 1,
  "application_no": "SRI001",
  "amount": 50000.00,
  "status": "completed",
  "payment_method": "semester_2",
  "payment_date": "2026-04-01T10:30:00Z",
  "metadata": {
    "order_id": "ORDER123",
    "payment_gateway": "razorpay"
  }
}

Response (200 OK):
{
  "message": "Payment processed successfully",
  "student_id": 1,
  "payment_id": 15,
  "transaction_id": "COLLEXO-TXN-2026-001",
  "amount": 50000.00,
  "status": "completed"
}
```

**Note**: Store this webhook URL in Collexo dashboard for callbacks.

### 4. Manual Payment Verification (Staff Only)
```http
POST /students/payment-workflow/verify/{student_id}/{transaction_id}
Authorization: Bearer <staff_token>

Response (200 OK):
{
  "message": "Pending payment completed",
  "student_id": 1,
  "transaction_id": "COLLEXO-TXN-2026-001",
  "amount": 50000.00
}
```

---

## Configuration

### Environment Variables (.env file)
```bash
# Collexo Payment Gateway
COLLEXO_PAYMENT_URL=https://payment.collexo.com/user/login/
COLLEXO_WEBHOOK_SECRET=your_webhook_secret_key
COLLEXO_INSTITUTION_ID=sri-ramachandra-digilearn-27224
```

---

## Data Flow for Semester 2 Payment

### BEFORE Payment (Student has pending payment):
```
students TABLE:
- id: 1
- registration_no: REG001
- semester_id: 2
- pending_payment_due: TRUE
- pending_payment_amount: 50000.00
- pending_payment_link: https://payment.collexo.com/...
- pending_payment_semester: "semester_2"

payments TABLE: (only semester 1 exists)
- id: 1, payment_type: "semester_fee", semester_id from SemesterFee
- semester_fees.semester: "1st"

payment_transactions TABLE: (empty)
```

### AFTER Payment Webhook:
```
payments TABLE: (NEW RECORD ADDED - semester 2)
- id: 15
- student_id: 1
- payment_type: "semester_fee"
- transaction_id: "COLLEXO-TXN-2026-001"
- payment_amount: 50000.00
- payment_date: 2026-04-01

semester_fees TABLE: (NEW RECORD ADDED)
- id: 25
- payment_id: 15
- semester: "semester_2"
- total_fee: 50000.00
- [other fee components...]

payment_transactions TABLE: (WEBHOOK LOGGED)
- id: 1
- student_id: 1
- payment_id: 15 (links to payment)
- gateway_transaction_id: "COLLEXO-TXN-2026-001"
- status: "payment_created"
- gateway_response: {...full webhook payload...}
- webhook_received_at: 2026-04-01T10:30:00Z
- payment_confirmed_at: 2026-04-01T10:30:00Z

students TABLE: (FLAGS CLEARED)
- pending_payment_due: FALSE
- pending_payment_amount: 0.0
- pending_payment_link: NULL
- pending_payment_semester: NULL
```

---

## Key Features

### 1. Automatic Pending Payment Population
- One API call to auto-populate all students in a workflow scope
- Fetches fee from FeeDetails table
- Reduces manual data entry

### 2. Semester Support
- Tracks which semester the pending payment is for
- Supports semester 1, semester 2, etc.
- Can have multiple semesters with different fee schedules

### 3. Payment Gateway Integration
- Collexo URL template: `https://payment.collexo.com/user/login/?dest=/{INSTITUTION_ID}/applicant/add/`
- Supports webhook callbacks for automatic payment confirmation
- Transaction logging for audit trail

### 4. Linking Payments to Students
- PaymentTransaction bridges webhook data to Payment table
- Full gateway response stored for debugging
- Payment creation automatic after webhook

### 5. Clearing Pending Payment Flags
- Automatic on webhook receipt
- Manual verification via staff endpoint
- Prevents duplicate payments

---

## Workflow Scenarios

### Scenario 1: New Batch, New Semester
```
1. Create FeeDetails for semester 2 (total_fee: 50000)
2. Enable ProgramPaymentWorkflowScope:
   - program_id: 1
   - batch: "july-2026"
   - admission_year: "2026"
   - semester: "2"
   - enabled: true
3. Call auto-populate endpoint
4. All students get: pending_payment_due=true, pending_payment_amount=50000, link
5. Students pay via link
6. Webhook creates Payment/SemesterFee records for semester 2
```

### Scenario 2: Multiple Semesters
```
Student enrolled in program with 4 semesters:
- Semester 1: Already paid (payment_id 1 → SemesterFee.semester="1st")
- Semester 2: Pending (via webhook after payment)
- Semester 3: To be enabled later
- Semester 4: To be enabled later

GET /students/1/payments → Shows all semesters
GET /students/1/pending-payment → Shows current pending only
```

### Scenario 3: Failed Payment
```
1. Webhook received with status="failed"
2. PaymentTransaction.status = "webhook_received"
3. Payment record NOT created
4. Student remains with pending_payment flags
5. Can retry payment
```

---

## Implementation Notes

### Service Methods
- `auto_populate_pending_payments()` - Bulk update for workflow scope
- `handle_webhook_payment()` - Process Collexo callback
- `verify_and_complete_pending_payment()` - Manual verification

### Key Validations
1. FeeDetails must exist for semester
2. Total fee must be > 0
3. Transaction ID must be unique
4. Student must be in active batch/year/semester group

### Error Handling
- 404: Student/FeeDetails not found
- 400: Invalid fee amount or payment already processed
- 500: Database/gateway errors

---

## Testing

### Manual Testing Steps

1. **Setup Test Data**
   ```sql
   INSERT INTO fee_details (programe_id, semester, total_fee) 
   VALUES (1, 'semester_2', 50000.00);
   
   INSERT INTO program_payment_workflow_scopes 
   VALUES (1, 'july-2026', '2026', '2', true);
   ```

2. **Auto-Populate Payments**
   ```bash
   curl -X POST http://localhost:8000/students/payment-workflow/auto-populate \
     -H "Authorization: Bearer token" \
     -H "Content-Type: application/json" \
     -d '{
       "program_id": 1,
       "batch": "july-2026",
       "admission_year": "2026",
       "semester": "semester_2"
     }'
   ```

3. **Check Student Pending Payment**
   ```bash
   curl -X GET http://localhost:8000/students/1/pending-payment \
     -H "Authorization: Bearer token"
   ```

4. **Simulate Webhook**
   ```bash
   curl -X POST http://localhost:8000/students/payment-workflow/webhook/collexo \
     -H "Content-Type: application/json" \
     -d '{
       "transaction_id": "COLLEXO-TXN-2026-TEST-001",
       "student_id": 1,
       "amount": 50000.00,
       "status": "completed",
       "payment_method": "semester_2"
     }'
   ```

5. **Verify Payment Created**
   ```sql
   -- Check Payment record
   SELECT * FROM payments WHERE student_id = 1 
     AND transaction_id = 'COLLEXO-TXN-2026-TEST-001';
   
   -- Check SemesterFee record
   SELECT * FROM semester_fees WHERE payment_id = (SELECT id FROM payments...);
   
   -- Check PaymentTransaction record
   SELECT * FROM payment_transactions 
     WHERE gateway_transaction_id = 'COLLEXO-TXN-2026-TEST-001';
   
   -- Check Student flags cleared
   SELECT pending_payment_due, pending_payment_amount, pending_payment_link 
   FROM students WHERE id = 1;
   ```

---

## Migration

### Required Alembic Migration
```python
"""Add pending_payment_semester to students and create payment_transactions table"""

from alembic import op
import sqlalchemy as sa

def upgrade():
    # Add column to students
    op.add_column('students', 
        sa.Column('pending_payment_semester', sa.String(20), nullable=True))
    
    # Create payment_transactions table
    op.create_table(
        'payment_transactions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('student_id', sa.Integer(), nullable=False),
        sa.Column('payment_id', sa.Integer(), nullable=True),
        sa.Column('gateway_transaction_id', sa.String(100), nullable=False),
        sa.Column('gateway_name', sa.String(50), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('semester', sa.String(20), nullable=True),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('gateway_response', sa.Text(), nullable=True),
        sa.Column('webhook_received_at', sa.DateTime(), nullable=True),
        sa.Column('payment_confirmed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['student_id'], ['students.id']),
        sa.ForeignKeyConstraint(['payment_id'], ['payments.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('gateway_transaction_id')
    )

def downgrade():
    op.drop_table('payment_transactions')
    op.drop_column('students', 'pending_payment_semester')
```

---

## Support

For issues or clarifications:
1. Check database state with provided SQL queries
2. Review webhook payload in `payment_transactions.gateway_response`
3. Check logs for service method execution
4. Verify Collexo gateway configuration

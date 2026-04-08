# Quick Reference: Payment Workflow Implementation

## Summary of Changes

### 1. **Database Models Updated**
   - ✅ `Student` table: Added `pending_payment_semester` column
   - ✅ `Payment` model: No changes needed (uses existing structure)
   - ✅ `SemesterFee` model: Now supports any semester (not just 1st semester)
   - ✅ **NEW**: `PaymentTransaction` model - tracks webhook callbacks

### 2. **Configuration Added**
   - ✅ `COLLEXO_PAYMENT_URL` - Base gateway URL
   - ✅ `COLLEXO_WEBHOOK_SECRET` - For secure webhook verification
   - ✅ `COLLEXO_INSTITUTION_ID` - Your institution ID

### 3. **Service Methods Added**
   - ✅ `auto_populate_pending_payments()` - Bulk populate for workflow scope
   - ✅ `handle_webhook_payment()` - Process Collexo payment confirmation
   - ✅ `verify_and_complete_pending_payment()` - Manual verification

### 4. **API Endpoints Added**
   - ✅ `POST /students/payment-workflow/auto-populate` - Trigger population
   - ✅ `POST /students/payment-workflow/webhook/collexo` - Receive payments
   - ✅ `POST /students/payment-workflow/verify/{student_id}/{transaction_id}` - Manual verify

### 5. **Schemas Added**
   - ✅ `CollexoWebhookPayload` - Webhook request format
   - ✅ `PaymentTransactionResponse` - Transaction response
   - ✅ `AutoPopulatePendingPaymentRequest/Response` - Population request/response

---

## How It Works

### Step 1: Setup (One-time)
```bash
# Store these in .env file:
COLLEXO_PAYMENT_URL=https://payment.collexo.com/user/login/
COLLEXO_INSTITUTION_ID=sri-ramachandra-digilearn-27224
COLLEXO_WEBHOOK_SECRET=your_secret_key
```

### Step 2: Enable Workflow
```bash
# Go to admin panel and enable workflow for:
# - Program: B.Tech
# - Batch: july-2026
# - Year: 2026
# - Semester: 2

# This creates a ProgramPaymentWorkflowScope record
```

### Step 3: Auto-Populate Pending Payments
```bash
curl -X POST http://localhost:8000/students/payment-workflow/auto-populate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "program_id": 1,
    "batch": "july-2026",
    "admission_year": "2026",
    "semester": "semester_2"
  }'

# Response:
# {
#   "message": "Successfully updated 50 students with pending payments",
#   "updated_count": 50,
#   "students_updated": [
#     {
#       "id": 1,
#       "registration_no": "REG001",
#       "amount": 50000.00,
#       "link": "https://payment.collexo.com/user/login/?dest=/sri-ramachandra-digilearn-27224/applicant/add/"
#     }
#   ]
# }
```

### Step 4: Student Views Pending Payment
```bash
curl -X GET http://localhost:8000/students/1/pending-payment \
  -H "Authorization: Bearer STUDENT_TOKEN"

# Response:
# {
#   "student_id": 1,
#   "program_id": 1,
#   "workflow_enabled": true,
#   "pending_payment_due": true,
#   "pending_payment_amount": 50000.00,
#   "pending_payment_link": "https://payment.collexo.com/user/login/?dest=/sri-ramachandra-digilearn-27224/applicant/add/",
#   "pending_payment_semester": "semester_2"
# }
```

### Step 5: Student Clicks Link & Pays
- Student receives pending payment via email/dashboard
- Clicks `pending_payment_link`
- Completes payment on Collexo gateway
- Collexo confirms payment

### Step 6: Webhook Received (Automatic)
```
Collexo sends webhook to your system:
POST /students/payment-workflow/webhook/collexo

Payload:
{
  "transaction_id": "COLLEXO-TXN-2026-001",
  "student_id": 1,
  "amount": 50000.00,
  "status": "completed",
  "payment_method": "semester_2"
}

System automatically:
1. Creates PaymentTransaction record
2. Creates Payment record (type: semester_fee)
3. Creates SemesterFee record (semester: semester_2)
4. Clears pending payment flags
```

### Step 7: Verify Payment Was Recorded
```bash
# Check student payment status
curl -X GET http://localhost:8000/students/1/pending-payment \
  -H "Authorization: Bearer STAFF_TOKEN"

# Response: pending_payment_due=false, pending_payment_amount=0.0
```

---

## Database Queries (For Testing/Verification)

### Check Fee Details
```sql
SELECT * FROM fee_details 
WHERE programe_id = 1 AND semester = 'semester_2';
```

### Check Pending Payments (Before Payment)
```sql
SELECT id, registration_no, pending_payment_due, 
       pending_payment_amount, pending_payment_link, 
       pending_payment_semester
FROM students 
WHERE program_id = 1 AND batch = 'july-2026' 
  AND admission_year = '2026' AND semester_id = 2;
```

### Check Payment Records (After Payment)
```sql
-- Check Payment table (new semester 2 payment)
SELECT * FROM payments 
WHERE student_id = 1 AND transaction_id = 'COLLEXO-TXN-2026-001';

-- Check SemesterFee table (semester 2 details)
SELECT * FROM semester_fees 
WHERE payment_id = 15; -- Replace with actual payment.id

-- Check PaymentTransaction (webhook log)
SELECT * FROM payment_transactions 
WHERE gateway_transaction_id = 'COLLEXO-TXN-2026-001';

-- Check student flags cleared
SELECT pending_payment_due, pending_payment_amount, 
       pending_payment_link, pending_payment_semester
FROM students WHERE id = 1;
```

### Check All Student Payments (Including Semesters)
```sql
SELECT 
  s.id,
  s.registration_no,
  p.id as payment_id,
  p.transaction_id,
  sf.semester,
  sf.total_fee,
  p.payment_date
FROM students s
LEFT JOIN payments p ON s.id = p.student_id
LEFT JOIN semester_fees sf ON p.id = sf.payment_id
WHERE s.id = 1
ORDER BY p.payment_date DESC;
```

---

## Feature Highlights

### ✅ Auto-Population
- One API call populates all students in a batch/year/semester
- Fetches fee from FeeDetails table
- Sets payment link automatically

### ✅ Semester Support
- Tracks which semester payment is for
- Supports semester 1, 2, 3, 4, etc.
- Payments stored separately per semester

### ✅ Multiple Payment Records
- Student can have multiple Payment records (one per semester)
- Each has SemesterFee with semester-specific details
- All linked via Payment ID

### ✅ Webhook Integration
- Collexo calls your webhook endpoint
- System automatically creates payment records
- Flags cleared automatically
- Full gateway response logged

### ✅ Audit Trail
- PaymentTransaction logs every webhook
- Gateway response stored for debugging
- Timestamps for entire flow

### ✅ Fallback Option
- Staff can verify payments manually
- If webhook fails, use: `POST /students/payment-workflow/verify/{student_id}/{transaction_id}`

---

## Common Workflows

### Workflow A: New Semester
```
1. Add FeeDetails for semester 2
2. Enable ProgramPaymentWorkflowScope for semester 2
3. Call auto-populate endpoint
4. Students see pending payment with link
5. Students pay
6. Webhook creates payment records
7. Done! (No manual data entry needed)
```

### Workflow B: Offline Payment
```
1. Student pays offline (cash, check, etc.)
2. Staff manually calls verify endpoint:
   POST /verify/1/OFFLINE-TXN-2026-001
3. System creates payment records
4. Clears pending flags
```

### Workflow C: Payment Failure
```
1. Webhook received with status="failed"
2. PaymentTransaction.status = "webhook_received"
3. Student still has pending_payment flags
4. Can retry payment
```

---

## Files Modified

1. **src/core/config/environment/base.py**
   - Added Collexo payment configuration

2. **src/models/students.py**
   - Added `pending_payment_semester` column

3. **src/models/payment.py**
   - Added `PaymentTransaction` model

4. **src/schemas/payment.py**
   - Added payment workflow schemas

5. **src/schemas/students.py**
   - Added `pending_payment_semester` field

6. **src/services/student_service.py**
   - Added 3 new methods for payment workflow

7. **src/api/v1/endpoints/students.py**
   - Added 3 new endpoints for payment workflow

---

## Next Steps

1. **Create Migration**: Generate Alembic migration for new column and table
   ```bash
   alembic revision --autogenerate -m "add_payment_workflow"
   alembic upgrade head
   ```

2. **Configure .env**:
   ```
   COLLEXO_PAYMENT_URL=https://payment.collexo.com/user/login/
   COLLEXO_INSTITUTION_ID=sri-ramachandra-digilearn-27224
   COLLEXO_WEBHOOK_SECRET=your_secret_key
   ```

3. **Register Webhook in Collexo Dashboard**:
   - URL: `https://your-domain/students/payment-workflow/webhook/collexo`
   - Method: POST
   - Headers: Add any required authentication

4. **Test with Sample Data**:
   - See Testing section in PAYMENT_WORKFLOW.md

5. **Train Staff**:
   - How to enable workflow
   - How to check pending payments
   - How to handle failed payments

---

## Flow Summary (Simple)

```
FeeDetails (Get fee) 
    ↓
Auto-Populate (Set pending_payment_amount, link, semester)
    ↓
Student Payment (Via Collexo link)
    ↓
Webhook (Collexo sends confirmation)
    ↓
Payment Record Created (Stored for semester 2)
    ↓
Flags Cleared (No more pending)
```

Done! ✅

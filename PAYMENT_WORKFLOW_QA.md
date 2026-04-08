# Payment Workflow - Answers to Your Questions

## Your Question #1: Where does `pending_payment_due` come from?

### Answer:
`pending_payment_due` is **AUTO-POPULATED** from the **FeeDetails** table.

### How it works:

1. **FeeDetails Table** (Gets fee structure for each semester)
   ```sql
   -- Example data in fee_details:
   - programe_id: 1
   - semester: "semester_2"
   - total_fee: 50000.00
   ```

2. **Auto-Populate API Call**
   ```bash
   POST /students/payment-workflow/auto-populate
   {
     "program_id": 1,
     "batch": "july-2026",
     "admission_year": "2026",
     "semester": "semester_2"
   }
   ```

3. **System Does**:
   - Queries FeeDetails for semester_2 → Gets `total_fee: 50000`
   - Finds all students in this batch/year/semester group
   - For each student, sets:
     ```
     pending_payment_due = TRUE        ← Flag set to true
     pending_payment_amount = 50000    ← Gets from fee_details.total_fee
     pending_payment_link = "https://payment.collexo.com/..."
     pending_payment_semester = "semester_2"
     ```

4. **Result**: All 50 students in that group automatically get pending payment populated!

---

## Your Question #2: How to know if student paid or not?

### Answer:
There are **TWO ways** to know if student paid:

### Method 1: Webhook from Collexo (RECOMMENDED - Automatic)
```
1. Student clicks link → Goes to Collexo gateway
2. Completes payment on Collexo
3. Collexo sends WEBHOOK to your system:
   
   POST /students/payment-workflow/webhook/collexo
   {
     "transaction_id": "COLLEXO-TXN-2026-001",
     "student_id": 1,
     "amount": 50000.00,
     "status": "completed"    ← This tells you payment succeeded
   }

4. System automatically:
   - Creates Payment record
   - Creates SemesterFee record
   - Clears pending_payment flags
   - Student no longer shows as "pending"
```

### Method 2: Poll Payment Table (Manual Check)
```sql
-- After payment, check if Payment record exists:

SELECT * FROM payments 
WHERE student_id = 1 
  AND transaction_id = 'COLLEXO-TXN-2026-001';

-- If exists → Payment completed ✓
-- If not → Payment pending ✗
```

### Method 3: Query PaymentTransaction Log
```sql
-- Check transaction status:

SELECT status FROM payment_transactions 
WHERE gateway_transaction_id = 'COLLEXO-TXN-2026-001';

-- Status values:
-- "webhook_received" → Webhook came in from Collexo
-- "payment_created" → Payment record successfully created
-- "failed" → Payment failed on gateway
```

---

## Your Question #3: Challenge - Store data in Payment table for semester 2

### Answer:
This is **AUTOMATICALLY HANDLED** by the webhook flow!

### Current Status (Before Payment):
```
payments TABLE:
- id: 1
- student_id: 1
- payment_type: "semester_fee"
- transaction_id: "ORDER-001"

semester_fees TABLE:
- id: 1
- payment_id: 1
- semester: "1st"           ← SEMESTER 1
- total_fee: 50000
```

### After Student Pays Semester 2 (Via Webhook):
```
payments TABLE: (NEW RECORD ADDED)
- id: 2                     ← NEW ID
- student_id: 1
- payment_type: "semester_fee"
- transaction_id: "COLLEXO-TXN-2026-001"  ← Collexo transaction ID
- payment_amount: 50000

semester_fees TABLE: (NEW RECORD ADDED)
- id: 2                     ← NEW ID
- payment_id: 2             ← Links to NEW payment
- semester: "semester_2"    ← SEMESTER 2
- total_fee: 50000
```

### How This Happens:
```python
# In handle_webhook_payment() method:

1. Webhook received with transaction_id and amount
2. Create Payment record:
   payment = Payment(
       student_id=1,
       payment_type="semester_fee",
       transaction_id="COLLEXO-TXN-2026-001",
       payment_amount=50000
   )
   
3. Create SemesterFee record LINKED to payment:
   semester_fee = SemesterFee(
       payment_id=payment.id,        ← Links to NEW payment
       semester="semester_2",         ← NEW SEMESTER
       total_fee=50000
   )
   
4. Both records automatically saved!
```

### Query to See All Payments (All Semesters):
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

-- Result for student with two semester payments:
--
-- id | registration_no | payment_id | transaction_id          | semester  | total_fee | payment_date
-- 1  | REG001          | 2          | COLLEXO-TXN-2026-001   | semester_2| 50000    | 2026-04-01
-- 1  | REG001          | 1          | ORDER-001              | 1st       | 50000    | 2025-07-15
```

---

## Complete End-to-End Flow (Semester 2 Payment)

### 🟢 STEP 1: Setup Fee Details
```sql
INSERT INTO fee_details (programe_id, semester, total_fee)
VALUES (1, 'semester_2', 50000.00);
```

### 🟢 STEP 2: Enable Payment Workflow
```sql
INSERT INTO program_payment_workflow_scopes 
  (program_id, batch, admission_year, semester, enabled)
VALUES (1, 'july-2026', '2026', '2', true);
```

### 🟢 STEP 3: Auto-Populate Pending Payments
```bash
POST /students/payment-workflow/auto-populate

Request:
{
  "program_id": 1,
  "batch": "july-2026",
  "admission_year": "2026",
  "semester": "semester_2"
}

What happens:
- Finds 50 students in july-2026 batch
- For each: sets pending_payment_amount=50000, 
  pending_payment_link=collexo_url, pending_payment_due=true
```

### 🟢 STEP 4: Check Pending Payment (Student/Staff View)
```bash
GET /students/1/pending-payment

Response:
{
  "pending_payment_due": true,
  "pending_payment_amount": 50000.00,
  "pending_payment_link": "https://payment.collexo.com/user/login/?dest=/sri-ramachandra-digilearn-27224/applicant/add/",
  "pending_payment_semester": "semester_2"
}
```

### 🟢 STEP 5: Student Clicks Link & Pays
```
Student receives notification
↓
Clicks payment link
↓
Redirected to Collexo payment gateway
↓
Completes payment on Collexo
↓
Collexo processes payment
```

### 🟢 STEP 6: Collexo Sends Webhook (Automatic)
```bash
Collexo calls webhook:
POST /students/payment-workflow/webhook/collexo

Payload:
{
  "transaction_id": "COLLEXO-TXN-2026-001",
  "student_id": 1,
  "application_no": "REG001",
  "amount": 50000.00,
  "status": "completed",
  "payment_method": "semester_2",
  "payment_date": "2026-04-01T10:30:00Z"
}
```

### 🟢 STEP 7: System Processes Payment (Automatic)
```python
# Inside handle_webhook_payment():

1. Create PaymentTransaction (log webhook):
   - gateway_transaction_id = "COLLEXO-TXN-2026-001"
   - student_id = 1
   - status = "webhook_received"
   - gateway_response = {...full payload...}

2. Create Payment record (NEW - for semester 2):
   - student_id = 1
   - transaction_id = "COLLEXO-TXN-2026-001"
   - payment_amount = 50000.00

3. Create SemesterFee record (NEW - for semester 2):
   - payment_id = 2 (NEW payment ID)
   - semester = "semester_2"
   - total_fee = 50000.00

4. Clear pending flags on Student:
   - pending_payment_due = false
   - pending_payment_amount = 0.0
   - pending_payment_link = null
   - pending_payment_semester = null

5. Update PaymentTransaction status:
   - status = "payment_created"
   - payment_id = 2 (links to new payment)
```

### 🟢 STEP 8: Verify Payment (Check Student Status)
```bash
GET /students/1/pending-payment

Response:
{
  "pending_payment_due": false,    ← Changed from true!
  "pending_payment_amount": 0.0,   ← Cleared!
  "pending_payment_link": null,    ← Cleared!
  "pending_payment_semester": null ← Cleared!
}
```

### 🟢 STEP 9: Check Payment Records in Database
```sql
-- Semester 1 (already existed):
SELECT * FROM payments WHERE student_id = 1;
-- Returns: id=1, transaction_id="ORDER-001", semester="1st"

-- Semester 2 (NEWLY CREATED by webhook):
SELECT * FROM semester_fees 
WHERE payment_id = 2;
-- Returns: id=2, semester="semester_2", total_fee=50000

-- Webhook log:
SELECT * FROM payment_transactions 
WHERE gateway_transaction_id = "COLLEXO-TXN-2026-001";
-- Shows: status="payment_created", payment_id=2
```

---

## Data Flow Diagram

```
BEFORE PAYMENT:
└─ students[1]:
   ├─ pending_payment_due: TRUE ✓
   ├─ pending_payment_amount: 50000
   ├─ pending_payment_link: "https://payment.collexo.com/..."
   ├─ pending_payment_semester: "semester_2"

DURING PAYMENT:
└─ Collexo gateway processes payment

AFTER WEBHOOK:
├─ payments[2] (NEW):
│  ├─ student_id: 1
│  ├─ transaction_id: "COLLEXO-TXN-2026-001"
│  ├─ payment_amount: 50000
│  ├─ payment_date: 2026-04-01
│
├─ semester_fees[2] (NEW):
│  ├─ payment_id: 2
│  ├─ semester: "semester_2"
│  ├─ total_fee: 50000
│
├─ payment_transactions[1] (NEW - LOG):
│  ├─ gateway_transaction_id: "COLLEXO-TXN-2026-001"
│  ├─ payment_id: 2
│  ├─ status: "payment_created"
│  ├─ gateway_response: {...}
│
└─ students[1] (UPDATED):
   ├─ pending_payment_due: FALSE ✗
   ├─ pending_payment_amount: 0.0
   ├─ pending_payment_link: null
   ├─ pending_payment_semester: null
```

---

## Key Points Summary

### ✅ `pending_payment_due` source:
- **From**: FeeDetails table (total_fee column)
- **Populated by**: auto-populate API endpoint
- **Applies to**: All students in batch/year/semester group
- **When**: When workflow is enabled

### ✅ How to know if paid:
- **Method 1**: Webhook callback (automatic)
- **Method 2**: Check Payment table for transaction_id
- **Method 3**: Check PaymentTransaction.status

### ✅ Storing semester 2 payment:
- **Automatic**: Webhook creates Payment + SemesterFee records
- **Result**: Payment table has multiple records (one per semester)
- **Each semester**: Has its own SemesterFee record with semester-specific data

### ✅ Payment workflow:
- Setup → Enable → Auto-populate → Student pays → Webhook → Payment recorded → Verified

---

## Troubleshooting

### Problem: Payment link not showing in pending-payment API
**Solution**: Call auto-populate endpoint first to populate data

### Problem: Webhook not received from Collexo
**Solution**: 
1. Check Collexo configuration (webhook URL registered?)
2. Verify webhook format matches expected schema
3. Check payment_transactions table for errors

### Problem: Payment not showing in payments table
**Solution**: Check payment_transactions table for webhook status - may not have been processed yet

### Problem: Multiple payment records for same semester
**Solution**: Check PaymentTransaction for duplicate gateway_transaction_ids

---

End! Everything is now ready to use. ✅

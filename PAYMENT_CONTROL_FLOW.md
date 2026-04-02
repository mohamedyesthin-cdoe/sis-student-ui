# Payment Control Flow & API Reference

## 📊 Complete Payment Control Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PAYMENT WORKFLOW STAGES                            │
└─────────────────────────────────────────────────────────────────────────────┘

STAGE 1: WORKFLOW CONFIGURATION (Admin/Staff)
├─ 1. Enable workflow for specific batch/year/semester
│  └─→ PUT /programe/{programe_id}/pending-payment-workflow
│      Payload: { batch, admission_year, semester, enabled: true }
│      Creates: ProgramPaymentWorkflowScope record
│
├─ 2. Verify workflow is enabled
│  └─→ GET /programe/{programe_id}/pending-payment-workflow
│      Response: { workflow_enabled: true/false, scope details }
│
└─ 3. Check all active workflows
   └─→ GET /programe/pending-payment-workflow/list
       Response: [{ id, program_id, batch, admission_year, semester, enabled }]

STAGE 2: AUTO-POPULATE PENDING PAYMENTS (Bulk)
├─ 1. Trigger population for batch/year/semester
│  └─→ POST /students/payment-workflow/auto-populate
│      Payload: { program_id, batch, admission_year, semester }
│      Action:
│        - Query FeeDetails for matching students
│        - For each student:
│          * pending_payment_amount = total_fee
│          * pending_payment_link = Collexo gateway URL
│          * pending_payment_due = true
│          * pending_payment_semester = semester
│      Response: { updated_count, students_updated[] }
│
└─ 2. Individual fallback (if workflow not enabled)
   └─→ PUT /students/{id}/pending-payment
       Payload: { payment_link, amount }
       Creates: Manual pending payment entry

STAGE 3: STUDENTS VIEW PENDING PAYMENT
├─ Student Dashboard: GET /students/{id}/pending-payment
│  Response:
│  {
│    "student_id": 1,
│    "program_id": 1,
│    "workflow_enabled": true,
│    "pending_payment_due": true,
│    "pending_payment_amount": 50000.00,
│    "pending_payment_link": "https://payment.collexo.com/...",
│    "pending_payment_semester": "semester_2"
│  }
│
└─ Student receives email/notification with payment link

STAGE 4: STUDENT INITIATES PAYMENT
├─ Student clicks pending_payment_link
│  └─→ Redirected to Collexo payment gateway
│      Gateway URL format: https://payment.collexo.com/user/login/?dest=...
│      Student enters payment details
│      Payment processed by Collexo
│
└─ Payment Status: PENDING on Collexo gateway

STAGE 5: COLLEXO SENDS WEBHOOK (Payment Confirmation)
├─ Collexo calls webhook endpoint
│  └─→ POST /students/payment-workflow/webhook/collexo
│      Payload:
│      {
│        "transaction_id": "COLLEXO-TXN-2026-001",
│        "student_id": 1,
│        "application_no": "SRI001",
│        "amount": 50000.00,
│        "status": "completed",
│        "payment_method": "semester_2",
│        "payment_date": "2026-04-01T10:30:00Z",
│        "metadata": { "order_id": "ORDER123" }
│      }
│
│      Action:
│        1. Verify webhook signature (X-Webhook-Signature)
│        2. Create PaymentTransaction record (track webhook)
│        3. Create Payment record (type: semester_fee)
│        4. Create SemesterFee record (link to Payment)
│        5. Clear pending payment flags:
│           - pending_payment_due = false
│           - pending_payment_amount = 0.0
│           - pending_payment_link = null
│           - pending_payment_semester = null
│
│      Response: { message, payment_id, transaction_id, amount, status }
│
└─ Payment Status: COMPLETED in system

STAGE 6: MANUAL VERIFICATION (Staff - Optional)
├─ If webhook fails, staff can manually verify
│  └─→ POST /students/payment-workflow/verify/{student_id}/{transaction_id}
│      Action:
│        - Retrieve PaymentTransaction by ID
│        - Find Payment linked to transaction
│        - Mark pending payment as complete
│      Response: { message, student_id, transaction_id, amount }
│
└─ Payment Status: VERIFIED manually

STAGE 7: FINAL STATE
├─ Student has paid
│  └─ Payment record exists (type: semester_fee)
│     SemesterFee record created
│     PaymentTransaction tracks webhook response
│
└─ Pending payment flags cleared
   └─ pending_payment_due = false
      pending_payment_amount = 0.0
      pending_payment_link = null
      pending_payment_semester = null
```

---

## 📋 All Payment-Related APIs

### **GROUP 1: WORKFLOW CONFIGURATION** (Program-Level)
*Purpose: Enable/disable/check payment workflow for batch/year/semester combinations*

| # | Method | Endpoint | Purpose | Auth |
|---|--------|----------|---------|------|
| 1 | PUT | `/programe/{programe_id}/pending-payment-workflow` | Enable/configure workflow | Staff |
| 2 | GET | `/programe/{programe_id}/pending-payment-workflow` | Check workflow status | Staff |
| 3 | GET | `/programe/pending-payment-workflow/list` | List all workflows | Staff |
| 4 | POST | `/programe/{programe_id}/pending-payment-workflow/webhook` | (Internal webhook handler) | System |

---

### **GROUP 2: AUTO-POPULATE PAYMENTS** (Bulk Operations)
*Purpose: Automatically assign pending payments to students in a batch/year/semester*

| # | Method | Endpoint | Purpose | Auth |
|---|--------|----------|---------|------|
| 5 | POST | `/students/payment-workflow/auto-populate` | Bulk assign pending payments | Staff |

---

### **GROUP 3: STUDENT PENDING PAYMENT** (Individual)
*Purpose: Get/set/complete pending payments for individual students*

| # | Method | Endpoint | Purpose | Auth |
|---|--------|----------|---------|------|
| 6 | GET | `/students/{id}/pending-payment` | View pending payment status | Students/Staff |
| 7 | PUT | `/students/{id}/pending-payment` | Manually assign pending payment | Staff |
| 8 | POST | `/students/{id}/pending-payment/complete` | Mark pending payment as complete | Staff |

---

### **GROUP 4: PAYMENT WEBHOOK** (External Gateway Integration)
*Purpose: Receive payment confirmations from Collexo gateway*

| # | Method | Endpoint | Purpose | Auth |
|---|--------|----------|---------|------|
| 9 | POST | `/students/payment-workflow/webhook/collexo` | Collexo webhook handler | Collexo System |
| 10 | POST | `/students/payment-workflow/verify/{student_id}/{transaction_id}` | Manual payment verification | Staff |

---

### **GROUP 5: FINANCE MASTER DATA** (API for other systems)
*Purpose: Retrieve master data for integration with other systems*

| # | Method | Endpoint | Purpose | Auth |
|---|--------|----------|---------|------|
| 11 | GET | `/api/v1/fees` | Get all fees master data | API Key |
| 12 | GET | `/api/v1/students` | Get all students (paginated) | API Key |
| 13 | GET | `/api/v1/students/fees` | Get all students with fees | API Key |
| 14 | GET | `/api/v1/courses` | Get all programs/courses | API Key |
| 15 | GET | `/api/v1/accounts` | Get accounts master data | API Key |

---

### **GROUP 6: STUDENT FEES** (Individual Student View)
*Purpose: Get fees information for specific student*

| # | Method | Endpoint | Purpose | Auth |
|---|--------|----------|---------|------|
| 16 | GET | `/students/{id}` | Get student details | Staff |
| 17 | GET | `/students/{id}/fees` | Get student fees/payments | Staff |

---

## 🔄 API Request/Response Examples

### API #1: Enable Payment Workflow
```http
PUT /programe/1/pending-payment-workflow

{
  "batch": "A",
  "admission_year": "2024",
  "semester": "2nd",
  "enabled": true
}

RESPONSE (200):
{
  "message": "Workflow configured",
  "program_id": 1,
  "batch": "A",
  "admission_year": "2024",
  "semester": "2nd",
  "enabled": true
}
```

### API #2: Check Workflow Status
```http
GET /programe/1/pending-payment-workflow?batch=A&admission_year=2024&semester=2nd

RESPONSE (200):
{
  "message": "Workflow retrieved",
  "workflow_enabled": true,
  "program_id": 1,
  "batch": "A",
  "admission_year": "2024",
  "semester": "2nd",
  "enabled": true
}
```

### API #3: List All Workflows
```http
GET /programe/pending-payment-workflow/list

RESPONSE (200):
{
  "message": "Payment workflow scopes retrieved",
  "data": [
    {
      "id": 1,
      "program_id": 1,
      "batch": "A",
      "admission_year": "2024",
      "semester": "2nd",
      "enabled": true
    },
    {
      "id": 2,
      "program_id": 2,
      "batch": "B",
      "admission_year": "2024",
      "semester": "1st",
      "enabled": false
    }
  ]
}
```

### API #5: Auto-Populate Pending Payments
```http
POST /students/payment-workflow/auto-populate
Authorization: Bearer <staff_token>

{
  "program_id": 1,
  "batch": "A",
  "admission_year": "2024",
  "semester": "semester_2"
}

RESPONSE (200):
{
  "message": "Successfully updated 50 students with pending payments",
  "updated_count": 50,
  "students_updated": [
    {
      "id": 1,
      "registration_no": "REG001",
      "amount": 50000.00,
      "link": "https://payment.collexo.com/user/login/?dest=..."
    },
    {
      "id": 2,
      "registration_no": "REG002",
      "amount": 50000.00,
      "link": "https://payment.collexo.com/user/login/?dest=..."
    }
  ]
}
```

### API #6: Get Pending Payment Status
```http
GET /students/1/pending-payment
Authorization: Bearer <student_or_staff_token>

RESPONSE (200):
{
  "student_id": 1,
  "program_id": 1,
  "workflow_enabled": true,
  "pending_payment_due": true,
  "pending_payment_amount": 50000.00,
  "pending_payment_link": "https://payment.collexo.com/...",
  "pending_payment_semester": "semester_2",
  "message": "Pending payment status fetched successfully"
}
```

### API #7: Manually Assign Pending Payment
```http
PUT /students/45/pending-payment
Authorization: Bearer <staff_token>

{
  "payment_link": "https://collexo.com/pay/link",
  "amount": 50000
}

RESPONSE (200):
{
  "student_id": 45,
  "program_id": 1,
  "workflow_enabled": false,
  "pending_payment_due": true,
  "pending_payment_amount": 50000.0,
  "pending_payment_link": "https://collexo.com/pay/link",
  "message": "Pending payment assigned"
}
```

### API #8: Complete Pending Payment (Manual)
```http
POST /students/45/pending-payment/complete
Authorization: Bearer <staff_token>

RESPONSE (200):
{
  "student_id": 45,
  "pending_payment_due": false,
  "pending_payment_amount": 0.0,
  "message": "Pending payment marked as complete"
}
```

### API #9: Collexo Webhook (Incoming from Gateway)
```http
POST /students/payment-workflow/webhook/collexo
X-Webhook-Signature: <signature_from_collexo>
Content-Type: application/json

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

RESPONSE (200):
{
  "message": "Payment processed successfully",
  "student_id": 1,
  "payment_id": 15,
  "transaction_id": "COLLEXO-TXN-2026-001",
  "amount": 50000.00,
  "status": "completed"
}
```

### API #10: Manual Payment Verification
```http
POST /students/payment-workflow/verify/1/COLLEXO-TXN-2026-001
Authorization: Bearer <staff_token>

RESPONSE (200):
{
  "message": "Pending payment completed",
  "student_id": 1,
  "transaction_id": "COLLEXO-TXN-2026-001",
  "amount": 50000.00
}
```

---

## 🗄️ Database Changes

### New Fields in `students` table
```sql
ALTER TABLE students ADD COLUMN pending_payment_semester VARCHAR(20) NULL;
-- Existing fields also used:
-- pending_payment_due (Boolean)
-- pending_payment_amount (Float)
-- pending_payment_link (Text)
```

### New Table: `payment_transactions`
```sql
CREATE TABLE payment_transactions (
    id INT PRIMARY KEY,
    student_id INT NOT NULL FOREIGN KEY,
    payment_id INT FOREIGN KEY,
    gateway_transaction_id VARCHAR(100) NOT NULL UNIQUE,
    gateway_name VARCHAR(50) DEFAULT 'collexo',
    amount FLOAT NOT NULL,
    semester VARCHAR(20),
    status VARCHAR(50), -- pending, completed, failed, webhook_received, payment_created
    gateway_response TEXT,
    webhook_received_at DATETIME,
    payment_confirmed_at DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);
```

### New Table: `program_payment_workflow_scope`
```sql
CREATE TABLE program_payment_workflow_scope (
    id INT PRIMARY KEY,
    program_id INT NOT NULL FOREIGN KEY,
    batch VARCHAR(50),
    admission_year VARCHAR(4),
    semester VARCHAR(20),
    enabled BOOLEAN DEFAULT false,
    created_at DATETIME,
    updated_at DATETIME
);
```

---

## 🔑 Authentication Levels

| Auth Type | Used By | Required For |
|-----------|---------|-------------|
| `API Key` | External systems | `/api/v1/*` endpoints |
| `Staff Token` | Staff/Admin | Workflow config, auto-populate, manual entries |
| `Student Token` | Students | View own pending payment |
| `SuperUser Token` | Admin only | Delete/modify workflows |
| `Webhook Auth` | Collexo Gateway | Signature verification on webhook endpoint |

---

## ⚡ Quick Reference: Common Workflows

### Workflow A: Enable & Auto-Populate (Staff)
```
1. Enable workflow:
   PUT /programe/1/pending-payment-workflow
   { batch, admission_year, semester, enabled: true }

2. Auto-populate students:
   POST /students/payment-workflow/auto-populate
   { program_id, batch, admission_year, semester }

3. Student views payment:
   GET /students/{id}/pending-payment
```

### Workflow B: Manual Payment Entry (Single Student)
```
1. Assign payment:
   PUT /students/45/pending-payment
   { payment_link, amount }

2. Student pays

3. Mark as complete:
   POST /students/45/pending-payment/complete
```

### Workflow C: Handle Webhook (Automatic)
```
1. Collexo sends webhook:
   POST /students/payment-workflow/webhook/collexo
   [with transaction details]

2. System automatically:
   - Creates PaymentTransaction record
   - Creates Payment record
   - Creates SemesterFee record
   - Clears pending payment flags
```

---

## 📁 Related Source Files

- [API Router](src/api/v1/endpoints/students.py) - Student payment endpoints
- [Service Layer](src/services/student_service.py) - Payment logic
- [Payment Models](src/models/payment.py) - Payment & Transaction models
- [Master API](src/api/v1/endpoints/master.py) - Workflow configuration
- [Finance API](src/api/v1/endpoints/api.py) - Master data endpoints

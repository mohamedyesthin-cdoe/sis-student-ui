# Batch & Year - Pending Payment Query Analysis

## 🎯 Your Concern
> "I analyze the student table there is not batch and year has assigned but how can we get particular batch ,year having studnets pending payment amount"

## ✅ GOOD NEWS: Batch & Year ARE in Student Table!

The Student table **DOES have** batch and year information:

```python
# From src/models/students.py (Line 66-67)
batch = Column(String(10), nullable=True)
admission_year = Column(String(10), nullable=True)
```

---

## 📊 Complete Table Mapping for Batch/Year/Payment Data

### 1. **Primary Storage Tables**

| Table | Columns | Purpose |
|-------|---------|---------|
| **students** | `id`, `batch`, `admission_year`, `program_id`, `pending_payment_due`, `pending_payment_amount`, `pending_payment_semester`, `pending_payment_link` | Core student + pending payment fields |
| **programs** | `id`, `programe`, `batch`, `admission_year` | Program definition (may have batch/year metadata) |
| **program_payment_workflow_scopes** | `program_id`, `batch`, `admission_year`, `semester`, `enabled` | Enables workflow for specific batch/year/semester combo |
| **fee_details** | `id`, `programe_id`, `semester`, `total_fee`, `application_fee`, `admission_fee`, `tuition_fee`, `exam_fee`, `lms_fee`, `lab_fee` | Fee structure by semester |
| **payments** | `id`, `student_id`, `payment_type`, `payment_amount` | Individual payment records |
| **semester_fees** | `id`, `payment_id`, `semester`, `total_fee`, `tuition_fee`, `admission_fee`, `exam_fee`, `lms_fee`, `lab_fee` | Breakdown of semester fee in payment |
| **academic_years** | `id`, `year_code`, `start_year`, `end_year`, `is_active` | Global academic year management (e.g., "2025-26") |
| **batches** | `id`, `academic_year_id`, `batch_number`, `batch_name`, `start_month`, `end_month` | Batch management within academic years |

---

## 🔍 Data Flow: How Batch → Year → Amount Gets Assigned

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ENABLE PAYMENT WORKFLOW (Admin Action)                  │
├─────────────────────────────────────────────────────────────┤
│ PUT /programe/{program_id}/pending-payment-workflow         │
│ {                                                            │
│   "batch": "A",              ← Batch value                  │
│   "admission_year": "2024",  ← Year value                   │
│   "semester": "1",           ← Semester                     │
│   "enabled": true                                            │
│ }                                                            │
│                                                              │
│ ↓ Creates record in program_payment_workflow_scopes         │
│   (program_id, batch, admission_year, semester, enabled)    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. AUTO-POPULATE PENDING PAYMENTS                          │
├─────────────────────────────────────────────────────────────┤
│ Query: Students WHERE                                       │
│   - students.batch = workflow_scope.batch                   │
│   - students.admission_year = workflow_scope.admission_year │
│   - students.program_id = workflow_scope.program_id         │
│                                                              │
│ For each matching student:                                  │
│   - Get FeeDetails WHERE                                    │
│     * fee_details.programe_id = student.program_id          │
│     * fee_details.semester = workflow_scope.semester        │
│                                                              │
│   - Set in students table:                                  │
│     * pending_payment_due = true                            │
│     * pending_payment_amount = fee_details.total_fee        │
│     * pending_payment_semester = workflow_scope.semester    │
│     * pending_payment_link = <collexo_gateway_link>         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. RESULT: Students have pending payment by batch/year     │
├─────────────────────────────────────────────────────────────┤
│ SELECT * FROM students WHERE                               │
│   batch = 'A'                                               │
│   AND admission_year = '2024'                               │
│   AND pending_payment_due = true                            │
│                                                              │
│ Returns: All pending payment records for batch A / 2024    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 SQL Queries to Get Batch/Year → Pending Amounts

### Query 1: Get All Students by Batch/Year with Pending Payment Amount

```sql
SELECT 
    s.id,
    s.registration_no,
    s.first_name,
    s.last_name,
    s.batch,
    s.admission_year,
    s.pending_payment_amount,
    s.pending_payment_due,
    s.pending_payment_semester,
    s.pending_payment_link,
    fd.total_fee,
    fd.semester
FROM students s
INNER JOIN fee_details fd 
    ON s.program_id = fd.programe_id 
    AND s.pending_payment_semester = fd.semester
WHERE 
    s.batch = 'A'                          -- Specific batch
    AND s.admission_year = '2024'          -- Specific year
    AND s.pending_payment_due = true       -- Only pending payments
ORDER BY s.id;
```

### Query 2: Get Pending Payments by Batch/Year with Program Info

```sql
SELECT 
    s.id,
    s.registration_no,
    s.first_name,
    s.batch,
    s.admission_year,
    p.programe,
    s.pending_payment_amount,
    s.pending_payment_semester,
    COUNT(*) OVER (PARTITION BY s.batch, s.admission_year) as total_students_in_batch
FROM students s
INNER JOIN programs p ON s.program_id = p.id
WHERE 
    s.batch = 'A'
    AND s.admission_year = '2024'
    AND s.pending_payment_due = true;
```

### Query 3: Summary: Total Pending Amount by Batch/Year

```sql
SELECT 
    s.batch,
    s.admission_year,
    p.programe,
    s.pending_payment_semester as semester,
    COUNT(s.id) as num_students,
    SUM(s.pending_payment_amount) as total_pending_amount,
    AVG(s.pending_payment_amount) as avg_pending_amount
FROM students s
INNER JOIN programs p ON s.program_id = p.id
WHERE s.pending_payment_due = true
GROUP BY s.batch, s.admission_year, p.programe, s.pending_payment_semester
ORDER BY s.batch, s.admission_year;
```

### Query 4: Get Students by Workflow Enabled Scope

```sql
-- This shows exactly which batch/year/semester combinations have workflow enabled
SELECT 
    s.id,
    s.registration_no,
    s.first_name,
    s.batch,
    s.admission_year,
    ppws.semester as workflow_semester,
    ppws.enabled,
    s.pending_payment_due,
    s.pending_payment_amount
FROM students s
INNER JOIN program_payment_workflow_scopes ppws 
    ON s.program_id = ppws.program_id
    AND s.batch = ppws.batch
    AND s.admission_year = ppws.admission_year
WHERE ppws.enabled = true
ORDER BY s.batch, s.admission_year, ppws.semester;
```

### Query 5: Get Paid vs Pending Amounts by Batch/Year

```sql
SELECT 
    s.batch,
    s.admission_year,
    COUNT(CASE WHEN s.pending_payment_due = true THEN 1 END) as pending_count,
    SUM(CASE WHEN s.pending_payment_due = true THEN s.pending_payment_amount ELSE 0 END) as pending_total,
    COUNT(CASE WHEN s.pending_payment_due = false THEN 1 END) as paid_count,
    COUNT(*) as total_students
FROM students s
WHERE s.batch IS NOT NULL AND s.admission_year IS NOT NULL
GROUP BY s.batch, s.admission_year
ORDER BY s.batch, s.admission_year;
```

---

## 🔗 Table Relationships Diagram

```
                    ┌──────────────────┐
                    │    programs      │
                    │  (id, programe,  │
                    │   batch, year)   │
                    └────────┬─────────┘
                             │ 1
                             │
                ┌────────────┼────────────┬────────────────────────┐
                │            │            │                        │
                │         has│            │has                     │
                │            ▼            ▼                        ▼
         ┌──────┴──────┐  ┌─────────────────────┐    ┌────────────────┐
         │ students    │  │ fee_details         │    │ program_payment│
         │             │  │ (progid, semester,  │    │ _workflow_scope│
         │ id          │  │  total_fee...)      │    │ (progid, batch,│
         │ batch       │  └─────────────────────┘    │  year, sem)    │
         │ admission_  │                             └────────────────┘
         │  year       │                                      │
         │ program_id  │                                      │
         │ pending_    │──────────────────────────────────────┴──→ Enables workflow
         │  payment_   │                                            for specific
         │  due        │                                            batch/year/sem
         │ pending_    │                                            combo
         │  payment_   │
         │  amount     │
         │ pending_    │
         │  payment_   │
         │  semester   │
         └─────────────┘
                ▲
                │
                │ When payment made
                │
         ┌──────┴──────────┐
         │    payments     │
         │ (id, student_id,│
         │  payment_type,  │
         │  amount)        │
         └─────────────────┘
```

---

## 💡 Step-by-Step to Get Batch/Year Pending Payments

### Step 1: Identify Your Batch/Year Combination
```sql
SELECT DISTINCT batch, admission_year FROM students;
-- Example result: batch='A', admission_year='2024'
```

### Step 2: Check if Workflow is Enabled for That Batch/Year
```sql
SELECT * FROM program_payment_workflow_scopes 
WHERE batch = 'A' AND admission_year = '2024' AND enabled = true;
```

### Step 3: Get All Students in That Batch/Year with Pending Amounts
```sql
SELECT 
    registration_no,
    first_name,
    pending_payment_amount,
    pending_payment_semester
FROM students 
WHERE batch = 'A' AND admission_year = '2024' AND pending_payment_due = true;
```

### Step 4: Calculate Totals
```sql
SELECT 
    COUNT(*) as total_pending_students,
    SUM(pending_payment_amount) as total_pending_amount,
    AVG(pending_payment_amount) as avg_payment_per_student
FROM students 
WHERE batch = 'A' AND admission_year = '2024' AND pending_payment_due = true;
```

---

## 📋 API Endpoints to Fetch Batch/Year Payment Data

### Endpoint 1: Get All Payment Workflow Scopes (Shows Enabled Batch/Year/Semester)
```
GET /programe/pending-payment-workflow/list
```

### Endpoint 2: Get Specific Program Payment Workflow Status
```
GET /programe/{program_id}/pending-payment-workflow
```

### Endpoint 3: Get Individual Student Pending Payment
```
GET /students/{student_id}/pending-payment
```

### Endpoint 4: Check Payment Status by Program & Workflow Scope
```
PUT /programe/{program_id}/pending-payment-workflow
{
  "batch": "A",
  "admission_year": "2024",
  "semester": "1",
  "enabled": true  // Enable to trigger auto-populate
}
```

---

## ❓ Common Questions Answered

### Q: Where is batch assigned to students?
**A:** Via `students.batch` column (nullable String(10)) - set during enrollment

### Q: Where is admission year assigned to students?
**A:** Via `students.admission_year` column (nullable String(10)) - set during enrollment

### Q: How does pending amount get assigned by batch/year?
**A:** 
1. Admin enables workflow via `PUT /programe/{id}/pending-payment-workflow` with batch/year/semester
2. System auto-populates all students matching that batch+year+program_id
3. Gets amount from `FeeDetails` table by semester
4. Stores in `students.pending_payment_amount`

### Q: Why are there multiple tables for batch/year (programs, students, academic_years, batches)?
**A:** Different purposes:
- **students.batch/admission_year** = Student's personal assignment
- **programs.batch/admission_year** = Program-level metadata (optional)
- **academic_years table** = Global academic year configuration
- **batches table** = Batch management within academic years
- **program_payment_workflow_scopes** = Links all above to enable workflows

### Q: What if batch/admission_year is NULL in students table?
**A:** Student wasn't assigned to a batch during enrollment - check the enrollment process or update manually

### Q: Can one student have multiple pending payments for different semesters?
**A:** YES! Each semester has separate `Payment` records, and `pending_payment_semester` tracks which semester is pending. However, at student level, only ONE `pending_payment_amount` is stored (the most recent/active one).

---

## 🔍 Production Query to Verify All Batch/Year Combinations

```sql
SELECT 
    COALESCE(s.batch, 'UNASSIGNED') as batch,
    COALESCE(s.admission_year, 'UNASSIGNED') as admission_year,
    COUNT(s.id) as total_students,
    SUM(CASE WHEN s.pending_payment_due = true THEN 1 ELSE 0 END) as pending_students,
    SUM(CASE WHEN s.pending_payment_due = true THEN s.pending_payment_amount ELSE 0 END) as total_pending_amount,
    MAX(s.updated_at) as last_updated
FROM students s
GROUP BY s.batch, s.admission_year
ORDER BY s.batch, s.admission_year;
```

---

## ✅ Summary: Your Data Path

```
BATCH/YEAR ← Stored in → STUDENTS table
                ↓
        Auto-populated when:
            ProgramPaymentWorkflowScope.batch = students.batch
            ProgramPaymentWorkflowScope.admission_year = students.admission_year
                ↓
        Gets AMOUNT from → FEE_DETAILS by semester
                ↓
        Stores in → students.pending_payment_amount
```

The batch and year information IS in the students table - it's never been missing! 🎉

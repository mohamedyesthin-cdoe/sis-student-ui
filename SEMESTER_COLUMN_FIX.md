# 🔧 Payment Workflow - Semester Column Fix

## Issue Fixed

The payment control flow requires **batch**, **admission_year**, and **semester** to determine if students are eligible for pending payment workflow, but the `students` table was missing the `semester` column.

---

## ❌ Previous Problem

### Student Model Issue:
```python
# OLD (Incorrect)
semester_id = Column(Integer, nullable=True)  # FK to Semester table (value: 1, 2, 3...)
```

### Service Method Issue:
```python
# OLD Query (WRONG!)
ProgramPaymentWorkflowScope.semester == str(student.semester_id)
# Converted: 1 → "1", 2 → "2"
# But workflow scope expects: "semester_1", "semester_2"
# MISMATCH! ❌
```

### Impact:
- Workflow validation always failed
- `_is_workflow_enabled_for_student()` returned `False` even when workflow was enabled
- Students couldn't access their pending payment status
- Auto-populate couldn't correctly identify eligible students

---

## ✅ Solution Implemented

### 1. **Student Model** - Added `semester` Column  
📁 [src/models/students.py](src/models/students.py)

```python
# NEW (Correct)
semester_id = Column(Integer, nullable=True)        # FK (backward compatible)
semester = Column(String(20), nullable=True)         # ✅ NEW: Stores "semester_1", "semester_2", etc.
```

### 2. **Service Method** - Updated Query  
📁 [src/services/student_service.py](src/services/student_service.py)

```python
# Old code (Line 73):
if not student.batch or not student.admission_year or student.semester_id is None:
    return False
scope = ...filter(
    ProgramPaymentWorkflowScope.semester == str(student.semester_id)  # ❌
)

# New code:
if not student.batch or not student.admission_year or not student.semester:
    return False
scope = ...filter(
    ProgramPaymentWorkflowScope.semester == student.semester  # ✅ Direct match
)
```

### 3. **Schemas** - Added `semester` Field  
📁 [src/schemas/students.py](src/schemas/students.py)

```python
# StudentBase
batch: Optional[str] = None
admission_year: Optional[str] = None
semester: Optional[str] = None                 # ✅ NEW

# StudentUpdate
semester: Optional[str] = None                 # ✅ NEW

# StudentResponse
batch: Optional[str] = None
admission_year: Optional[str] = None
semester: Optional[str] = None                 # ✅ NEW
```

### 4. **Database Migration** - Added Schema Change  
📁 [alembic/versions/add_semester_column_to_students.py](alembic/versions/add_semester_column_to_students.py)

```sql
-- Migration adds:
ALTER TABLE students ADD COLUMN semester VARCHAR(20) NULL;
CREATE INDEX ix_students_batch_year_semester ON students(batch, admission_year, semester);
```

---

## 📊 Updated Data Model

### GET `/students/{id}/pending-payment` - Now Checks:

```
┌─────────────────────────────────────────────────────────┐
│           Student Record Requirements                   │
├─────────────────────────────────────────────────────────┤
│ ✅ batch (e.g., "A", "B", "july-2026")                  │
│ ✅ admission_year (e.g., "2024", "2026")                │
│ ✅ semester (e.g., "semester_1", "semester_2")  [★NEW] │
├─────────────────────────────────────────────────────────┤
│           Matches Against Workflow Scope               │
├─────────────────────────────────────────────────────────┤
│ ✅ ProgramPaymentWorkflowScope.batch                    │
│ ✅ ProgramPaymentWorkflowScope.admission_year           │
│ ✅ ProgramPaymentWorkflowScope.semester   [★FIXED]     │
│ ✅ ProgramPaymentWorkflowScope.enabled = true           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Updated Payment Control Flow

```
STAGE 2: AUTO-POPULATE PENDING PAYMENTS
├─ POST /students/payment-workflow/auto-populate
│  Payload: { program_id, batch, admission_year, semester }
│
│  Query: Find students WHERE
│    program_id = requested program
│    AND batch = "july-2026"
│    AND admission_year = "2026"
│    AND semester = "semester_2"    ✅ [NOW WORKS!]
│
│  For each student:
│    - pending_payment_amount = total_fee from FeeDetails
│    - pending_payment_link = Collexo URL
│    - pending_payment_due = true
│    - pending_payment_semester = "semester_2"
│
└─ Response: { updated_count, students_updated[] }
```

---

## 🚀 How to Apply This Fix

### Step 1: Apply Database Migration
```bash
# Run Alembic migration to add semester column
alembic upgrade head

# Verify the column was added
# SELECT semester FROM students LIMIT 1;
```

### Step 2: Populate Semester Data (One-time)
```bash
# If you have existing students, map semester_id to semester value
# Run in your database or via Python script:

UPDATE students 
SET semester = CONCAT('semester_', semester_id) 
WHERE semester IS NULL AND semester_id IS NOT NULL;
```

### Step 3: Restart Application
```bash
# Restart Django/FastAPI server to load new model
systemctl restart sishub
# or manual:
python src/main.py
```

### Step 4: Test the Fix
```bash
# 1. Enable workflow for a batch/year/semester
curl -X PUT http://localhost:8000/programe/1/pending-payment-workflow \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "batch": "A",
    "admission_year": "2024", 
    "semester": "semester_2",
    "enabled": true
  }'

# 2. Verify workflow is enabled
curl -X GET "http://localhost:8000/programe/1/pending-payment-workflow?batch=A&admission_year=2024&semester=semester_2" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Check pending payment status
curl -X GET http://localhost:8000/students/1/pending-payment \
  -H "Authorization: Bearer YOUR_TOKEN"
# Response should show: workflow_enabled: true ✅
```

---

## 📝 Summary of Changes

| File | Changes | Purpose |
|------|---------|---------|
| [src/models/students.py](src/models/students.py) | Added `semester` column | Store "semester_1", "semester_2" etc. |
| [src/services/student_service.py](src/services/student_service.py) | Updated `_is_workflow_enabled_for_student()` | Use `student.semester` instead of `str(semester_id)` |
| [src/schemas/students.py](src/schemas/students.py) | Added `semester` field to 3 schemas | StudentBase, StudentUpdate, StudentResponse |
| [alembic/versions/](alembic/versions/) | New migration file | Adds column to database |

---

## ✨ Result

### Before Fix ❌
```json
{
  "workflow_enabled": false,  ← ALWAYS FALSE
  "pending_payment_due": true,
  "pending_payment_amount": 50000.0,
  "pending_payment_link": "https://payment.collexo.com/..."
}
```

### After Fix ✅
```json
{
  "workflow_enabled": true,   ← NOW CORRECTLY DETECTS
  "pending_payment_due": true,
  "pending_payment_amount": 50000.0,
  "pending_payment_link": "https://payment.collexo.com/...",
  "pending_payment_semester": "semester_2"
}
```

---

## 📚 Related Documentation

- [PAYMENT_CONTROL_FLOW.md](PAYMENT_CONTROL_FLOW.md) - Complete payment workflow overview
- [PAYMENT_WORKFLOW.md](PAYMENT_WORKFLOW.md) - Detailed API documentation
- [COMPLETE_API_ENDPOINTS_REFERENCE.md](COMPLETE_API_ENDPOINTS_REFERENCE.md) - All endpoints

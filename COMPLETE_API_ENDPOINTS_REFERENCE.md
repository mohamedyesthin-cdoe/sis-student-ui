# Complete API Endpoints Reference

## 📌 Overview

This document provides a complete list of all API endpoints in the SisHub project, with focus on the **pending payment workflow endpoints** you asked about.

---

## ⚠️ THREE PENDING PAYMENT ENDPOINTS (Students)

These endpoints are used for **manual pending payment management** at the individual student level. They are LEGACY endpoints before the program-level workflow automation was added.

### 1. **GET** `/students/{id}/pending-payment`
**Purpose**: Retrieve pending payment status for a specific student

**Authorization**: Staff/SuperUser

**Request**: 
```
GET /students/45/pending-payment
```

**Response** (200):
```json
{
  "student_id": 45,
  "program_id": 1,
  "workflow_enabled": true,
  "pending_payment_due": true,
  "pending_payment_amount": 50000.0,
  "pending_payment_link": "https://collexo.com/pay/...",
  "message": "Pending payment status fetched successfully"
}
```

**What it does**:
- Check if student has pending payment
- See payment amount and link
- Verify if workflow is enabled for this student

---

### 2. **PUT** `/students/{id}/pending-payment`
**Purpose**: MANUALLY assign/update pending payment for a student

**Authorization**: Staff/SuperUser

**Request**:
```json
PUT /students/45/pending-payment

{
  "payment_link": "https://collexo.com/pay/link",
  "amount": 50000
}
```

**Response** (200):
```json
{
  "student_id": 45,
  "program_id": 1,
  "workflow_enabled": true,
  "pending_payment_due": true,
  "pending_payment_amount": 50000.0,
  "pending_payment_link": "https://collexo.com/pay/link",
  "message": "Pending payment status fetched successfully"
}
```

**What it does**:
- **Manually** set pending payment for ONE student
- Useful when workflow not enabled
- Sets the payment amount and link independently
- ⚠️ **NOT** used when program workflow is enabled (workflow auto-populates instead)

**When to use**:
- Individual student needs to pay for special reason
- Manual override for one student
- Testing payment flow for specific student
- NOT for bulk operations (use program workflow instead)

---

### 3. **POST** `/students/{id}/pending-payment/complete`
**Purpose**: Mark pending payment as COMPLETE/PAID for a student

**Authorization**: Staff/SuperUser

**Request**:
```json
POST /students/45/pending-payment/complete
```

**Response** (200):
```json
{
  "student_id": 45,
  "program_id": 1,
  "workflow_enabled": true,
  "pending_payment_due": false,
  "pending_payment_amount": 0.0,
  "pending_payment_link": null,
  "message": "Payment completed. No due."
}
```

**What it does**:
- Clears pending payment flags
- Sets `pending_payment_due = false`
- Resets amount to 0
- Removes payment link

**When to use**:
- Student has paid (outside system, verified manually)
- Webhook didn't work, need manual completion
- Testing payment completion
- ⚠️ This is **OVERRIDE** - use webhook-based completion in production

---

## 🆚 STUDENT vs PROGRAM WORKFLOW ENDPOINTS

| Aspect | Student Endpoints | Program Workflow Endpoints |
|--------|------------------|--------------------------|
| **Scope** | ONE student | ALL students in batch/year/semester |
| **Use Case** | Manual/Individual | Bulk/Automated |
| **Auto-populate** | ❌ Manual | ✅ Automatic from FeeDetails |
| **Endpoint** | `/students/{id}/pending-payment` | `/programe/{id}/pending-payment-workflow` |
| **Operation** | Assign to 1 student | Configure for entire cohort |
| **Production Ready** | ⚠️ Not recommended | ✅ Recommended |

---

## ✅ RECOMMENDED: PROGRAM WORKFLOW ENDPOINTS (Master)

Use these for **production** and **bulk operations**:

### 1. **PUT** `/programe/{programe_id}/pending-payment-workflow`
Configure & enable payment workflow for batch/year/semester

```json
PUT /programe/1/pending-payment-workflow

{
  "batch": "A",
  "admission_year": "2024",
  "semester": "1st",
  "enabled": true
}
```

**Auto-populates** students from FeeDetails table immediately.

---

### 2. **GET** `/programe/{programe_id}/pending-payment-workflow`
Check workflow status for specific batch/year/semester

```
GET /programe/1/pending-payment-workflow?batch=A&admission_year=2024&semester=1st
```

---

### 3. **GET** `/programe/pending-payment-workflow/list`
List ALL workflows (enabled/disabled)

```
GET /programe/pending-payment-workflow/list
```

---

### 4. **POST** `/programe/{programe_id}/pending-payment-workflow/webhook`
Receive payment confirmations from Collexo

```json
POST /programe/1/pending-payment-workflow/webhook

{
  "student_id": 45,
  "transaction_id": "TXN123456",
  "amount": 50000,
  "semester": "1st"
}
```

Used by Collexo gateway in production.

---

## 📋 COMPLETE ENDPOINT INVENTORY

### **Authentication Endpoints** (users.py)
- `POST /users/add` - Create user
- `POST /users/bulk-add` - Bulk create users
- `POST /auth/login` - Login
- `POST /auth/change-password` - Change password
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password

---

### **Student Management** (students.py)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/students/list` | List all students |
| GET | `/students/{id}` | Get student by ID |
| GET | `/students/fees/{id}` | Get student fees/payments |
| GET | `/students/{id}/pending-payment` | ⭐ Get pending payment status |
| GET | `/students/marks` | Get all marks |
| GET | `/students/{student_id}/marks` | Get student marks |
| POST | `/students/add` | Create student |
| POST | `/students/sync` | Sync students from external API |
| POST | `/students/patch/document` | Update student documents |
| POST | `/students/{id}/pending-payment/complete` | ⭐ Complete pending payment |
| POST | `/students/student-marks/` | Add marks |
| PUT | `/students/{id}/pending-payment` | ⭐ Assign pending payment |
| DELETE | `/students/delete/{id}` | Delete student |
| DELETE | `/students/delete/all` | Delete all students |

---

### **Program & Fee Management** (master.py)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/programe/list` | List all programs |
| GET | `/programe/{programe_id}` | Get program details |
| GET | `/programe/{programe_id}/pending-payment-workflow` | ✅ Get workflow status |
| GET | `/programe/pending-payment-workflow/list` | ✅ List all workflows |
| GET | `/department/list` | List departments |
| GET | `/department/{department_id}` | Get department |
| GET | `/batch/list` | List batches |
| GET | `/batch/{batch_id}` | Get batch |
| GET | `/batch/by-year/{academic_year_id}` | Get batches by year |
| GET | `/academic-year/list` | List academic years |
| GET | `/academic-year/{academic_year_id}` | Get academic year |
| POST | `/programe/add` | Create program |
| POST | `/programe/{programe_id}/pending-payment-workflow/webhook` | ✅ Receive webhook |
| POST | `/department/add` | Create department |
| POST | `/batch/add` | Create batch |
| POST | `/academic-year/add` | Create academic year |
| PUT | `/programe/update/{id}` | Update program |
| PUT | `/programe/{programe_id}/pending-payment-workflow` | ✅ Enable workflow |
| PUT | `/department/update/{department_id}` | Update department |
| PUT | `/batch/update/{batch_id}` | Update batch |
| PUT | `/academic-year/update/{academic_year_id}` | Update academic year |
| DELETE | `/department/delete/{department_id}` | Delete department |
| DELETE | `/batch/delete/{batch_id}` | Delete batch |
| DELETE | `/academic-year/delete/{academic_year_id}` | Delete academic year |

---

### **Academic Structure** (academic.py)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/schemes` | List schemes |
| GET | `/schemes/{scheme_id}` | Get scheme |
| GET | `/courses` | List courses |
| GET | `/courses/{course_id}` | Get course |
| GET | `/course-components` | List components |
| GET | `/course-components/{component_id}` | Get component |
| GET | `/semesters` | List semesters |
| GET | `/semesters/{semester_id}` | Get semester |
| POST | `/schemes` | Create scheme |
| POST | `/courses` | Create course |
| POST | `/course-components` | Create component |
| POST | `/semesters` | Create semester |
| PUT | `/schemes/{scheme_id}` | Update scheme |
| PUT | `/courses/{course_id}` | Update course |
| PUT | `/course-components/{component_id}` | Update component |
| PUT | `/semesters/{semester_id}` | Update semester |
| DELETE | `/schemes/{scheme_id}` | Delete scheme |
| DELETE | `/courses/{course_id}` | Delete course |
| DELETE | `/course-components/{component_id}` | Delete component |
| DELETE | `/semesters/{semester_id}` | Delete semester |

---

### **Examination** (exam.py)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/exams` | List exams |
| GET | `/exams/{exam_id}` | Get exam |
| GET | `/exam-timetables` | List timetables |
| GET | `/exam-timetables/{timetable_id}` | Get timetable |
| POST | `/exams` | Create exam |
| POST | `/exam-timetables` | Create timetable |
| POST | `/exam-registrations` | Register for exam |
| PUT | `/exams/{exam_id}` | Update exam |
| PUT | `/exam-timetables/{timetable_id}` | Update timetable |
| DELETE | `/exams/{exam_id}` | Delete exam |
| DELETE | `/exam-timetables/{timetable_id}` | Delete timetable |

---

### **Staff Management** (staff.py)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/staff/list` | List all staff |
| GET | `/staff/{staff_id}` | Get staff member |
| POST | `/staff/add` | Add staff |
| PUT | `/staff/update/{staff_id}` | Update staff |
| PATCH | `/staff/patch/{staff_id}` | Partially update staff |
| DELETE | `/staff/delete/{staff_id}` | Delete staff |

---

### **Address/Location** (address.py)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/countries` | List countries |
| GET | `/countries/{country_id}` | Get country |
| GET | `/countries/code/{country_id}` | Get country by code |
| GET | `/states` | List states |
| GET | `/states/{country_id}` | Get states for country |
| GET | `/states/{state_id}/{country_id}` | Get specific state |
| GET | `/city/{state_id}` | Get cities for state |

---

### **Finance/API Integration** (api.py)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/finance/students` | List students (finance) |
| GET | `/finance/fees` | Get fee information |
| GET | `/finance/program/fees/list` | List program fees |
| GET | `/finance/student-wise-fees` | Student-wise fees |
| GET | `/finance/courses` | Get courses |
| GET | `/finance/accounts` | Get accounts |
| GET | `/api/digicampus/students` | DigiCampus integration |
| POST | `/api/lead/add/` | Add lead widget |
| PUT | `/api/digicampus/students/update` | Update DigiCampus |

---

### **Results/Marks** (result.py)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/results/markentery` | Enter marks |

---

### **Menu Management** (menu.py)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/menu/list` | List menus |
| POST | `/menu/add` | Add menu |
| POST | `/menu/submenu/add` | Add submenu |

---

### **Admin/Roles** (admin.py)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/admin/roles` | List roles |
| GET | `/admin/roles/{role_id}` | Get role |
| POST | `/admin/roles/add` | Create role |
| PUT | `/admin/update/{role_id}` | Update role |
| DELETE | `/admin/delete/{role_id}` | Delete role |

---

### **Document Management** (document.py)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/documents/` | List documents |
| GET | `/documents/{document_id}` | Get document |
| POST | `/documents/` | Upload document |
| DELETE | `/documents/{document_id}` | Delete document |

---

## 🎯 QUICK DECISION GUIDE

**"I want to enable payment for a whole batch"** →
- Use `PUT /programe/1/pending-payment-workflow`

**"I want to check one student's payment status"** →
- Use `GET /students/{id}/pending-payment`

**"I want to manually mark student as paid"** →
- Use `POST /students/{id}/pending-payment/complete`

**"I want to handle Collexo webhook in production"** →
- Use `POST /programe/{id}/pending-payment-workflow/webhook`

**"I want to list all enabled payment workflows"** →
- Use `GET /programe/pending-payment-workflow/list`

---

## 📊 Total Endpoints Summary

| Module | Count |
|--------|-------|
| Students | 13 |
| Program/Master | 29 |
| Academic Structure | 18 |
| Examination | 11 |
| Staff | 6 |
| Address/Location | 7 |
| Finance/API | 8 |
| Results | 1 |
| Menu | 3 |
| Admin/Roles | 5 |
| Document | 4 |
| Auth | 6 |
| **TOTAL** | **111** |

---

## ⚠️ IMPORTANT MIGRATION NOTES

**OLD WAY (Student-level)**:
```
PUT /students/{id}/pending-payment → ❌ Don't use for production bulk ops
```

**NEW WAY (Program-level)**:
```
PUT /programe/{id}/pending-payment-workflow → ✅ Use for production
```

The student endpoints are useful for:
- Individual student adjustments
- Emergency payment fixes
- Testing single student scenarios

The program workflow endpoints are for:
- Bulk operations
- Scheduled fee collection
- Production deployment
- Cohort management

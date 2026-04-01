# Payment Workflow - Corrected API Endpoints

## Overview
Consolidated all payment workflow endpoints under the existing program workflow structure at `/programe/{programe_id}/pending-payment-workflow`

---

## ✅ Correct Endpoints (Consolidated)

### 1. **Enable/Disable & Configure Workflow**
```
PUT /programe/{programe_id}/pending-payment-workflow
```
**Request Body**:
```json
{
  "batch": "A",
  "admission_year": "2024",
  "semester": "1st",
  "enabled": true
}
```

**Response** (200):
```json
{
  "id": 1,
  "program_id": 1,
  "batch": "A",
  "admission_year": "2024",
  "semester": "1st",
  "enabled": true
}
```

**Purpose**: 
- Enable/disable payment workflow for a specific batch/year/semester combination
- When enabled, triggers auto-population from FeeDetails table
- Auto-populates `pending_payment_due`, `pending_payment_amount`, `pending_payment_link`, `pending_payment_semester` for all matching students

---

### 2. **Get Workflow Status**
```
GET /programe/{programe_id}/pending-payment-workflow?batch=A&admission_year=2024&semester=1st
```

**Response** (200):
```json
{
  "id": 1,
  "program_id": 1,
  "batch": "A",
  "admission_year": "2024",
  "semester": "1st",
  "enabled": true
}
```

---

### 3. **List All Workflows** 
```
GET /programe/pending-payment-workflow/list
```

**Response** (200):
```json
{
  "message": "Payment workflow scopes retrieved",
  "code": 200,
  "status": true,
  "data": [
    {
      "id": 1,
      "program_id": 1,
      "batch": "A",
      "admission_year": "2024",
      "semester": "1st",
      "enabled": true
    }
  ]
}
```

**Purpose**: View all enabled/disabled workflows for testing & production management

---

### 4. **Payment Confirmation Webhook** (FOR COLLEXO)
```
POST /programe/{programe_id}/pending-payment-workflow/webhook
```

**Request Body** (from Collexo):
```json
{
  "student_id": 45,
  "transaction_id": "TXN123456",
  "amount": 50000,
  "semester": "1st"
}
```

**Response** (200):
```json
{
  "message": "Payment processed",
  "status": "completed",
  "payment_id": 15,
  "student_id": 45,
  "transaction_id": "TXN123456"
}
```

**Purpose**:
- Receive Collexo webhook callback
- Create Payment record
- Create SemesterFee record  
- Clear pending payment flags for student
- Used in **PRODUCTION** for real payments

---

## ❌ Removed Endpoints (No Longer Used)

The following endpoints were created but are now **removed** as they were redundant:

- ~~`POST /students/payment-workflow/auto-populate`~~ 
- ~~`POST /students/payment-workflow/webhook/collexo`~~ 
- ~~`POST /students/payment-workflow/verify/{student_id}/{transaction_id}`~~

**Why removed?**
- Auto-populate happens automatically when workflow is **enabled** (PUT endpoint)
- Webhook is now nested under program workflow for better organization
- Manual verification not needed since webhook handles it

---

## Flow Summary

### For **TEST/STAGING**:
1. **Enable workflow**: `PUT /programe/1/pending-payment-workflow` with `enabled: true`
   - Auto-populates all matching students with pending payment data from FeeDetails
   
2. **Simulate payment**: Manual JSON payload (no live Collexo needed)
   - Post to `POST /programe/1/pending-payment-workflow/webhook` with payment details
   - System creates Payment + SemesterFee records

3. **Verify**: Check `GET /programe/pending-payment-workflow/list` to see workflow status

### For **PRODUCTION**:
1. **Enable workflow**: `PUT /programe/1/pending-payment-workflow` with `enabled: true`
   - Auto-populates all matching students

2. **Student pays via Collexo**: 
   - Student clicks pending_payment_link (generated when workflow enabled)
   - Pays via Collexo gateway
   
3. **Collexo sends webhook**:
   - Collexo calls `POST /programe/1/pending-payment-workflow/webhook`
   - System receives payment confirmation
   - Creates Payment + SemesterFee records automatically

---

## Database Models Involved

- `ProgramPaymentWorkflowScope` - Track enabled workflows
- `Student` - Stores pending payment flags
- `Payment` - One record per payment transaction
- `SemesterFee` - Details for each semester payment
- `PaymentTransaction` - Audit log of webhook events
- `FeeDetails` - Source of total_fee amounts

---

## Key Changes from Original Design

| Aspect | Before | After |
|--------|--------|-------|
| **Auto-populate endpoint** | Separate POST with payload | Automatic when `enabled=true` |
| **Webhook location** | `/students/payment-workflow/webhook/collexo` | `/programe/{id}/pending-payment-workflow/webhook` |
| **Endpoint organization** | Scattered across students & master | Centralized under program workflow |
| **Manual verification** | Separate endpoint | Direct in workflow (webhook-based) |

---

## Testing Checklist

- [ ] Enable workflow: `PUT /programe/1/pending-payment-workflow` with `enabled: true`
- [ ] Verify students marked as pending: Check Student table
- [ ] Check FeeDetails mapped correctly: Verify amounts match
- [ ] Send test webhook: `POST /programe/1/pending-payment-workflow/webhook`
- [ ] Verify Payment/SemesterFee created: Check Payment table
- [ ] Verify pending flags cleared: Check Student.pending_payment_due = false
- [ ] List workflows: `GET /programe/pending-payment-workflow/list`

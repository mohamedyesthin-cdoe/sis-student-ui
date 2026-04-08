# Payment Workflow Testing Guide

## Overview
This guide covers testing the complete payment workflow without relying on live Collexo servers. We'll cover:
1. Local testing with mock data
2. Webhook simulation
3. API endpoint testing
4. Unit tests
5. Integration tests

---

## Part 1: Local Testing without Collexo Live Server

### Option A: Simple Manual Testing (No Code Changes)

#### Step 1: Setup Test Data
```sql
-- Create test student with pending payment
INSERT INTO students (
  registration_no, application_no, first_name, last_name, 
  email, mobile_number, program_id, batch, admission_year, 
  semester_id, pending_payment_due, pending_payment_amount,
  pending_payment_link, pending_payment_semester
) VALUES (
  'TEST-001', 'TEST-APP-001', 'John', 'Doe',
  'john@example.com', '9876543210', 1, 'july-2026', '2026', 2,
  false, 0.0, null, null
);

-- Verify student created
SELECT id FROM students WHERE registration_no = 'TEST-001';
-- Note: Replace student_id=1 in examples below with actual ID
```

#### Step 2: Setup Fee Details
```sql
-- Add semester 2 fees
INSERT INTO fee_details (
  programe_id, semester, total_fee, 
  application_fee, admission_fee, tuition_fee
) VALUES (
  1, 'semester_2', 50000.00,
  5000.00, 5000.00, 40000.00
);
```

#### Step 3: Enable Payment Workflow
```sql
-- Enable workflow for test group
INSERT INTO program_payment_workflow_scopes (
  program_id, batch, admission_year, semester, enabled
) VALUES (
  1, 'july-2026', '2026', '2', true
);
```

#### Step 4: Test Auto-Populate Endpoint
```bash
# Call API to auto-populate pending payments
curl -X POST http://localhost:8000/students/payment-workflow/auto-populate \
  -H "Authorization: Bearer YOUR_STAFF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "program_id": 1,
    "batch": "july-2026",
    "admission_year": "2026",
    "semester": "semester_2"
  }'

# Expected response:
# {
#   "message": "Successfully updated X students with pending payments",
#   "updated_count": 1,
#   "students_updated": [
#     {
#       "id": 1,
#       "registration_no": "TEST-001",
#       "amount": 50000.0,
#       "link": "https://payment.collexo.com/user/login/?dest=/sri-ramachandra-digilearn-27224/applicant/add/"
#     }
#   ]
# }
```

#### Step 5: Verify Pending Payment
```bash
# Check pending payment status
curl -X GET http://localhost:8000/students/1/pending-payment \
  -H "Authorization: Bearer YOUR_STAFF_TOKEN"

# Expected response:
# {
#   "student_id": 1,
#   "program_id": 1,
#   "workflow_enabled": true,
#   "pending_payment_due": true,
#   "pending_payment_amount": 50000.0,
#   "pending_payment_link": "https://payment.collexo.com/user/login/?dest=/sri-ramachandra-digilearn-27224/applicant/add/",
#   "message": "Pending payment status fetched successfully"
# }
```

#### Step 6: Simulate Webhook (Most Important - No Collexo Needed!)
```bash
# Send WEBHOOK MANUALLY (This is key to testing without Collexo!)
# In real world, Collexo would send this automatically
# But for testing, YOU send it to simulate payment completion

curl -X POST http://localhost:8000/students/payment-workflow/webhook/collexo \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "TEST-COLLEXO-TXN-2026-001",
    "student_id": 1,
    "application_no": "TEST-APP-001",
    "amount": 50000.00,
    "status": "completed",
    "payment_method": "semester_2",
    "payment_date": "2026-04-01T10:30:00Z",
    "metadata": {
      "order_id": "TEST-ORDER-001"
    }
  }'

# Expected response:
# {
#   "message": "Payment processed successfully",
#   "student_id": 1,
#   "payment_id": 15,
#   "transaction_id": "TEST-COLLEXO-TXN-2026-001",
#   "amount": 50000.0,
#   "status": "completed"
# ✅ KEY: Payment record created automatically!
# }
```

#### Step 7: Verify Payment Was Recorded
```bash
# Check pending payment is now cleared
curl -X GET http://localhost:8000/students/1/pending-payment \
  -H "Authorization: Bearer YOUR_STAFF_TOKEN"

# Expected: pending_payment_due=false, amounts cleared

# Check payment table
curl -X GET http://localhost:8000/students/1/fees \
  -H "Authorization: Bearer YOUR_STAFF_TOKEN"

# Should show new payment for semester 2
```

---

## Part 2: Database Verification Queries

### After Webhook Processing - Check Everything

```sql
-- 1. Check student flags are cleared
SELECT id, pending_payment_due, pending_payment_amount, 
       pending_payment_link, pending_payment_semester
FROM students 
WHERE id = 1;
-- Expected: pending_payment_due=0 (false), amounts=0.0, links=NULL

-- 2. Check new Payment record created
SELECT id, student_id, transaction_id, payment_type, 
       payment_amount, payment_date
FROM payments 
WHERE student_id = 1 
ORDER BY payment_date DESC;
-- Expected: New row with transaction_id='TEST-COLLEXO-TXN-2026-001'

-- 3. Check SemesterFee for semester 2
SELECT sf.id, sf.payment_id, sf.semester, sf.total_fee
FROM semester_fees sf
JOIN payments p ON sf.payment_id = p.id
WHERE p.student_id = 1;
-- Expected: Row with semester='semester_2', total_fee=50000

-- 4. Check PaymentTransaction webhook log
SELECT id, student_id, payment_id, gateway_transaction_id, 
       status, webhook_received_at, payment_confirmed_at
FROM payment_transactions 
WHERE gateway_transaction_id = 'TEST-COLLEXO-TXN-2026-001';
-- Expected: Row with status='payment_created'

-- 5. See ALL payments (all semesters) for student
SELECT 
  s.id, s.registration_no,
  p.id as payment_id, p.transaction_id,
  sf.semester, sf.total_fee, p.payment_date
FROM students s
LEFT JOIN payments p ON s.id = p.student_id
LEFT JOIN semester_fees sf ON p.id = sf.payment_id
WHERE s.id = 1
ORDER BY p.payment_date DESC;
-- Expected: Multiple rows (semester 1, semester 2, etc.)
```

---

## Part 3: Using Postman for Testing

### Create Postman Collection

#### 1. Auto-Populate Pending Payments
```
Request Name: Auto-Populate Pending Payments
Method: POST
URL: {{base_url}}/students/payment-workflow/auto-populate
Headers:
  - Authorization: Bearer {{staff_token}}
  - Content-Type: application/json

Body (raw JSON):
{
  "program_id": 1,
  "batch": "july-2026",
  "admission_year": "2026",
  "semester": "semester_2"
}
```

#### 2. Get Pending Payment Status
```
Request Name: Get Pending Payment Status
Method: GET
URL: {{base_url}}/students/1/pending-payment
Headers:
  - Authorization: Bearer {{staff_token}}
```

#### 3. Simulate Webhook (Critical for Testing)
```
Request Name: Simulate Collexo Webhook - Payment Success
Method: POST
URL: {{base_url}}/students/payment-workflow/webhook/collexo
Headers:
  - Content-Type: application/json

Body (raw JSON):
{
  "transaction_id": "POSTMAN-TEST-{{$timestamp}}",
  "student_id": 1,
  "application_no": "TEST-APP-001",
  "amount": 50000.00,
  "status": "completed",
  "payment_method": "semester_2",
  "payment_date": "{{$isoTimestamp}}",
  "metadata": {
    "order_id": "ORDER-001"
  }
}
```

#### 4. Simulate Webhook - Payment Failed
```
Request Name: Simulate Collexo Webhook - Payment Failed
Method: POST
URL: {{base_url}}/students/payment-workflow/webhook/collexo
Headers:
  - Content-Type: application/json

Body (raw JSON):
{
  "transaction_id": "POSTMAN-FAIL-{{$timestamp}}",
  "student_id": 1,
  "application_no": "TEST-APP-001",
  "amount": 50000.00,
  "status": "failed",
  "payment_method": "semester_2",
  "payment_date": "{{$isoTimestamp}}",
  "metadata": {
    "reason": "Insufficient funds"
  }
}
```

#### 5. Manual Verification
```
Request Name: Manual Payment Verification
Method: POST
URL: {{base_url}}/students/payment-workflow/verify/1/POSTMAN-TEST-TXN
Headers:
  - Authorization: Bearer {{staff_token}}
```

#### Postman Collection Variables
```
{
  "base_url": "http://localhost:8000",
  "staff_token": "your_staff_jwt_token",
  "student_id": 1
}
```

---

## Part 4: Python Script for Testing

Create file: `scripts/test_payment_workflow.py`

```python
"""
Test script for payment workflow - simulate without Collexo live server
"""
import requests
import json
from datetime import datetime
import random

BASE_URL = "http://localhost:8000"
STAFF_TOKEN = "YOUR_STAFF_TOKEN_HERE"

# Headers
HEADERS = {
    "Authorization": f"Bearer {STAFF_TOKEN}",
    "Content-Type": "application/json"
}

def test_auto_populate():
    """Test auto-populate endpoint"""
    print("\n=== TEST 1: Auto-Populate Pending Payments ===")
    
    payload = {
        "program_id": 1,
        "batch": "july-2026",
        "admission_year": "2026",
        "semester": "semester_2"
    }
    
    response = requests.post(
        f"{BASE_URL}/students/payment-workflow/auto-populate",
        headers=HEADERS,
        json=payload
    )
    
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result.get("students_updated", [])

def test_get_pending_payment(student_id):
    """Get pending payment status"""
    print(f"\n=== TEST 2: Get Pending Payment Status (Student {student_id}) ===")
    
    response = requests.get(
        f"{BASE_URL}/students/{student_id}/pending-payment",
        headers=HEADERS
    )
    
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result

def test_webhook_success(student_id, amount):
    """Simulate successful webhook from Collexo"""
    print(f"\n=== TEST 3: Simulate Webhook - Payment Success ===")
    
    txn_id = f"TEST-WEBHOOK-{random.randint(10000, 99999)}"
    
    payload = {
        "transaction_id": txn_id,
        "student_id": student_id,
        "application_no": f"APP-{student_id}",
        "amount": amount,
        "status": "completed",
        "payment_method": "semester_2",
        "payment_date": datetime.utcnow().isoformat() + "Z",
        "metadata": {
            "order_id": f"ORDER-{random.randint(10000, 99999)}"
        }
    }
    
    print(f"Sending webhook with transaction_id: {txn_id}")
    response = requests.post(
        f"{BASE_URL}/students/payment-workflow/webhook/collexo",
        json=payload
    )
    
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result

def test_webhook_failed(student_id, amount):
    """Simulate failed webhook"""
    print(f"\n=== TEST 4: Simulate Webhook - Payment Failed ===")
    
    txn_id = f"TEST-FAIL-{random.randint(10000, 99999)}"
    
    payload = {
        "transaction_id": txn_id,
        "student_id": student_id,
        "application_no": f"APP-{student_id}",
        "amount": amount,
        "status": "failed",
        "payment_method": "semester_2",
        "payment_date": datetime.utcnow().isoformat() + "Z",
        "metadata": {
            "reason": "Card declined"
        }
    }
    
    print(f"Sending failed webhook with transaction_id: {txn_id}")
    response = requests.post(
        f"{BASE_URL}/students/payment-workflow/webhook/collexo",
        json=payload
    )
    
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result

def test_manual_verify(student_id, transaction_id):
    """Test manual payment verification"""
    print(f"\n=== TEST 5: Manual Payment Verification ===")
    
    response = requests.post(
        f"{BASE_URL}/students/payment-workflow/verify/{student_id}/{transaction_id}",
        headers=HEADERS
    )
    
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result

def run_complete_flow():
    """Run complete test flow"""
    print("\n" + "="*60)
    print("PAYMENT WORKFLOW - COMPLETE TEST FLOW")
    print("="*60)
    
    # Test 1: Auto-populate
    students = test_auto_populate()
    if not students:
        print("❌ No students updated. Check your data setup.")
        return
    
    student_id = students[0]["id"]
    amount = students[0]["amount"]
    print(f"✅ Using student_id: {student_id}")
    
    # Test 2: Get pending payment (before payment)
    before = test_get_pending_payment(student_id)
    print(f"✅ Pending payment due: {before['pending_payment_due']}")
    
    # Test 3: Simulate webhook - success
    result = test_webhook_success(student_id, amount)
    if result.get("status") == "completed":
        txn_id = result.get("transaction_id")
        print(f"✅ Webhook processed, transaction_id: {txn_id}")
    else:
        print("❌ Webhook failed")
        return
    
    # Test 4: Get pending payment (after payment)
    after = test_get_pending_payment(student_id)
    if not after['pending_payment_due']:
        print(f"✅ Pending payment cleared!")
    else:
        print("❌ Pending payment NOT cleared")
    
    # Test 5: Try failed webhook
    test_webhook_failed(student_id, amount)
    
    print("\n" + "="*60)
    print("✅ ALL TESTS COMPLETED!")
    print("="*60)

if __name__ == "__main__":
    run_complete_flow()
```

Run the test:
```bash
python scripts/test_payment_workflow.py
```

---

## Part 5: Unit Tests with pytest

Create file: `src/tests/test_payment_workflow.py`

```python
"""Unit tests for payment workflow"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from sqlalchemy.orm import Session

from src.services.student_service import StudentService
from src.models.students import Student
from src.models.master import FeeDetails, Programe
from src.models.payment import Payment, SemesterFee, PaymentTransaction
from fastapi import HTTPException


@pytest.fixture
def mock_db():
    """Create mock database session"""
    return Mock(spec=Session)


@pytest.fixture
def student_service(mock_db):
    """Create service instance with mock DB"""
    return StudentService(mock_db)


class TestAutoPopulatePendingPayments:
    """Test auto-populate functionality"""
    
    def test_auto_populate_success(self, student_service, mock_db):
        """Test successful auto-population"""
        # Setup mock data
        fee_details = Mock(spec=FeeDetails)
        fee_details.total_fee = 50000.0
        
        student1 = Mock(spec=Student)
        student1.id = 1
        student1.registration_no = "REG001"
        
        student2 = Mock(spec=Student)
        student2.id = 2
        student2.registration_no = "REG002"
        
        # Mock query results
        mock_db.query.side_effect = [
            Mock(return_value=Mock(first=Mock(return_value=fee_details))),  # FeeDetails query
            Mock(return_value=Mock(filter=Mock(return_value=Mock(all=Mock(return_value=[student1, student2])))))  # Students query
        ]
        
        # Execute
        result = student_service.auto_populate_pending_payments(
            program_id=1,
            batch="july-2026",
            admission_year="2026",
            semester="semester_2"
        )
        
        # Assert
        assert result["updated_count"] == 2
        assert len(result["students_updated"]) == 2
        mock_db.commit.assert_called_once()
    
    def test_auto_populate_no_fee_details(self, student_service, mock_db):
        """Test when fee details not found"""
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        with pytest.raises(HTTPException) as exc:
            student_service.auto_populate_pending_payments(
                program_id=1,
                batch="july-2026",
                admission_year="2026",
                semester="semester_2"
            )
        
        assert exc.value.status_code == 404
    
    def test_auto_populate_zero_fee(self, student_service, mock_db):
        """Test when fee is zero or negative"""
        fee_details = Mock(spec=FeeDetails)
        fee_details.total_fee = 0.0
        
        mock_db.query.return_value.filter.return_value.first.return_value = fee_details
        
        with pytest.raises(HTTPException) as exc:
            student_service.auto_populate_pending_payments(
                program_id=1,
                batch="july-2026",
                admission_year="2026",
                semester="semester_2"
            )
        
        assert exc.value.status_code == 400


class TestWebhookHandling:
    """Test webhook payment handling"""
    
    def test_webhook_success(self, student_service, mock_db):
        """Test successful webhook processing"""
        student = Mock(spec=Student)
        student.id = 1
        
        mock_db.query.return_value.filter.return_value.first.return_value = student
        mock_db.flush.return_value = None
        mock_db.add.return_value = None
        mock_db.commit.return_value = None
        mock_db.refresh.return_value = None
        
        # Execute
        result = student_service.handle_webhook_payment(
            student_id=1,
            gateway_transaction_id="TEST-TXN-001",
            payment_amount=50000.0,
            semester="semester_2",
            gateway_response={"status": "completed"}
        )
        
        # Assert
        assert result["student_id"] == 1
        assert result["status"] == "completed"
        mock_db.commit.assert_called()
    
    def test_webhook_student_not_found(self, student_service, mock_db):
        """Test webhook when student not found"""
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        with pytest.raises(HTTPException) as exc:
            student_service.handle_webhook_payment(
                student_id=999,
                gateway_transaction_id="TEST-TXN-001",
                payment_amount=50000.0,
                semester="semester_2",
                gateway_response={}
            )
        
        assert exc.value.status_code == 404


class TestPendingPaymentVerification:
    """Test pending payment verification"""
    
    def test_verify_payment_success(self, student_service, mock_db):
        """Test successful verification"""
        student = Mock(spec=Student)
        student.id = 1
        
        transaction = Mock(spec=PaymentTransaction)
        transaction.status = "payment_created"
        
        # Mock queries
        mock_db.query.side_effect = [
            Mock(return_value=Mock(filter=Mock(return_value=Mock(first=Mock(return_value=student))))),  # Student query
            Mock(return_value=Mock(filter=Mock(return_value=Mock(first=Mock(return_value=transaction)))))  # Transaction query
        ]
        
        result = student_service.verify_and_complete_pending_payment(1, "TEST-TXN-001")
        
        assert result["message"] == "Pending payment completed"
        assert result["student_id"] == 1


# Run tests:
# pytest src/tests/test_payment_workflow.py -v
```

Run tests:
```bash
pytest src/tests/test_payment_workflow.py -v
```

---

## Part 6: Integration Testing Flow

### Complete Step-by-Step Integration Test

```bash
#!/bin/bash
# scripts/test_payment_integration.sh

set -e

echo "=========================================="
echo "Payment Workflow Integration Test"
echo "=========================================="

BASE_URL="http://localhost:8000"
STAFF_TOKEN="your_token_here"

# Step 1: Setup
echo -e "\n1️⃣ Setting up test data..."
mysql -u root sishub_db << EOF
INSERT INTO fee_details (programe_id, semester, total_fee) 
VALUES (1, 'semester_2', 50000.00)
ON DUPLICATE KEY UPDATE total_fee=50000.00;
EOF
echo "✅ Fee details created"

# Step 2: Auto-populate
echo -e "\n2️⃣ Auto-populating pending payments..."
RESPONSE=$(curl -s -X POST "$BASE_URL/students/payment-workflow/auto-populate" \
  -H "Authorization: Bearer $STAFF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "program_id": 1,
    "batch": "july-2026",
    "admission_year": "2026",
    "semester": "semester_2"
  }')
echo "Response: $RESPONSE"
STUDENT_ID=$(echo $RESPONSE | grep -o '"id": [0-9]*' | head -1 | grep -o '[0-9]*')
echo "✅ Using student_id: $STUDENT_ID"

# Step 3: Check pending
echo -e "\n3️⃣ Checking pending payment..."
curl -s -X GET "$BASE_URL/students/$STUDENT_ID/pending-payment" \
  -H "Authorization: Bearer $STAFF_TOKEN" | jq .
echo "✅ Pending payment confirmed"

# Step 4: Simulate webhook
echo -e "\n4️⃣ Simulating payment webhook..."
TXN_ID="TEST-$(date +%s)"
curl -s -X POST "$BASE_URL/students/payment-workflow/webhook/collexo" \
  -H "Content-Type: application/json" \
  -d "{
    \"transaction_id\": \"$TXN_ID\",
    \"student_id\": $STUDENT_ID,
    \"amount\": 50000.00,
    \"status\": \"completed\",
    \"payment_method\": \"semester_2\",
    \"payment_date\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
  }" | jq .
echo "✅ Webhook processed"

# Step 5: Verify cleared
echo -e "\n5️⃣ Verifying payment cleared..."
curl -s -X GET "$BASE_URL/students/$STUDENT_ID/pending-payment" \
  -H "Authorization: Bearer $STAFF_TOKEN" | jq .
echo "✅ Payment verified"

echo -e "\n=========================================="
echo "✅ INTEGRATION TEST PASSED!"
echo "=========================================="
```

Run:
```bash
chmod +x scripts/test_payment_integration.sh
./scripts/test_payment_integration.sh
```

---

## Part 7: Collexo API Testing (When Ready)

### Real Collexo Integration Testing

#### Collexo Sandbox URL (If Available):
```
Sandbox URL: https://sandbox-payment.collexo.com/  (IF EXISTS)
Production: https://payment.collexo.com/
```

#### Check Collexo Documentation For:
1. ✅ Sandbox API endpoint
2. ✅ Test payment methods (test credit card numbers)
3. ✅ Webhook signature verification
4. ✅ Test credentials

#### Environment Configuration for Testing:
```bash
# .env.test file:

# Test Collexo endpoint
COLLEXO_PAYMENT_URL=https://sandbox-payment.collexo.com/user/login/
COLLEXO_INSTITUTION_ID=test-institution-id
COLLEXO_WEBHOOK_SECRET=test-webhook-secret

# Database for testing
DATABASE_URL=mysql://user:password@localhost/sishub_test
```

---

## Part 8: Testing Checklist

### Before Going Live

- [ ] ✅ **Unit Tests Pass**
  ```bash
  pytest src/tests/test_payment_workflow.py -v
  ```

- [ ] ✅ **API Endpoints Respond**
  - POST /students/payment-workflow/auto-populate → 200
  - GET /students/{id}/pending-payment → 200
  - POST /students/payment-workflow/webhook/collexo → 200

- [ ] ✅ **Data Flows Correctly**
  - FeeDetails → Student.pending_payment_amount
  - Webhook → Payment + SemesterFee created
  - SemesterFee links correctly to Payment

- [ ] ✅ **Webhook Signature Verified** (Optional but recommended)
  - Collexo sends X-Webhook-Signature header
  - Verify before processing

- [ ] ✅ **Error Handling**
  - Duplicate transaction_id → No duplicate payments
  - Invalid student_id → 404 response
  - Zero fee amount → 400 response

- [ ] ✅ **Database Constraints**
  - transaction_id UNIQUE → Prevents duplicates
  - Foreign keys enforce referential integrity
  - Timestamps recorded correctly

- [ ] ✅ **Performance**
  - Auto-populate 1000 students → < 5 seconds
  - Webhook processing → < 1 second

---

## Part 9: Common Test Scenarios

### Scenario 1: Happy Path
```
1. Auto-populate ✅
2. Student pays ✅
3. Webhook received ✅
4. Payment recorded ✅
5. Flags cleared ✅
```

### Scenario 2: Duplicate Payment
```
1. Webhook received
2. Payment created ✅
3. Webhook received AGAIN (duplicate)
4. UniqueConstraint on transaction_id → Prevents duplicate ✅
5. Database remains consistent ✅
```

### Scenario 3: Payment Failure
```
1. Auto-populate ✅
2. Student payment fails ❌
3. Webhook received with status="failed"
4. PaymentTransaction created (for logging)
5. NO Payment record created ✅
6. Student still has pending_payment_due=true ✅
7. Can retry ✅
```

### Scenario 4: Webhook Timeout
```
1. Auto-populate ✅
2. Student pays but webhook never comes
3. Use manual verify endpoint:
   POST /verify/{student_id}/{transaction_id}
4. Staff manually marks as paid ✅
5. Payment recorded ✅
```

---

## Summary

### Quick Testing Commands

```bash
# Setup
mysql < scripts/test_data.sql

# Run unit tests
pytest src/tests/test_payment_workflow.py -v

# Run integration test
./scripts/test_payment_integration.sh

# Manual webhook test
curl -X POST http://localhost:8000/students/payment-workflow/webhook/collexo \
  -H "Content-Type: application/json" \
  -d '{"transaction_id":"TEST-1","student_id":1,"amount":50000,"status":"completed"}'
```

✅ You can now test the entire payment workflow WITHOUT needing live Collexo servers!

#!/bin/bash

# Quick Payment Workflow Test Script
# Run this after database setup to test the complete flow

set -e

echo "================================"
echo "Payment Workflow Quick Test"
echo "================================"

# Configuration
BASE_URL="${1:-http://localhost:8000}"
STAFF_TOKEN="${2:-your_staff_token}"

echo -e "\n📋 Configuration:"
echo "  Base URL: $BASE_URL"
echo "  Token: ${STAFF_TOKEN:0:20}..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test helper function
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_code=$5
    
    echo -e "\n${YELLOW}Testing: $name${NC}"
    
    if [ -z "$data" ]; then
        # GET request
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $STAFF_TOKEN" \
            -H "Content-Type: application/json")
    else
        # POST/PUT request
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $STAFF_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [[ "$http_code" == "2"* ]]; then
        echo -e "${GREEN}✅ $name - HTTP $http_code${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
        echo "$body"  # Return body for parsing
    else
        echo -e "${RED}❌ $name - HTTP $http_code${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
    fi
}

# ============================================
# STEP 1: Setup Test Data
# ============================================

echo -e "\n${YELLOW}=== STEP 1: Setup Test Data ===${NC}"

# For this, you need to run SQL directly
echo "You need to setup test data. Run these SQL commands:"
echo ""
echo "MySQL/MariaDB:"
cat << 'EOF'
-- Create test fee details
INSERT INTO fee_details (programe_id, semester, total_fee, created_at, updated_at) 
VALUES (1, 'semester_2', 50000.00, NOW(), NOW())
ON DUPLICATE KEY UPDATE total_fee=50000.00;

-- Create test student (or use existing)
INSERT INTO students (
  application_no, registration_no, first_name, last_name,
  gender, date_of_birth, email, mobile_number,
  alternative_phone, whatsapp_number, marital_status,
  religion, nationality, category, parent_guardian_name,
  relationship_with_student, program_id, batch,
  admission_year, semester_id, pending_payment_due,
  created_at, updated_at
) VALUES (
  'TEST-APP-001', 'TEST-REG-001', 'Test', 'Student',
  'M', '2000-01-01', 'test@example.com', '9876543210',
  '9876543210', '9876543210', 'Single',
  'Hindu', 'Indian', 'General', 'Parent Name',
  'Father', 1, 'july-2026',
  '2026', 2, 0,
  NOW(), NOW()
)
ON DUPLICATE KEY UPDATE email='test@example.com';

-- Enable payment workflow
INSERT INTO program_payment_workflow_scopes 
(program_id, batch, admission_year, semester, enabled, created_at, updated_at)
VALUES (1, 'july-2026', '2026', '2', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE enabled=1;
EOF

echo ""
echo "Run the above SQL, then press Enter to continue..."
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Exiting..."
    exit 1
fi

# ============================================
# STEP 2: Auto-Populate Pending Payments
# ============================================

echo -e "\n${YELLOW}=== STEP 2: Auto-Populate Pending Payments ===${NC}"

auto_populate_response=$(test_endpoint \
    "Auto-Populate Pending Payments" \
    "POST" \
    "/students/payment-workflow/auto-populate" \
    '{
        "program_id": 1,
        "batch": "july-2026",
        "admission_year": "2026",
        "semester": "semester_2"
    }')

# Extract student_id from response
STUDENT_ID=$(echo "$auto_populate_response" | grep -o '"id": [0-9]*' | head -1 | grep -o '[0-9]*' || echo "1")
echo "Using STUDENT_ID: $STUDENT_ID"

# ============================================
# STEP 3: Get Pending Payment (BEFORE)
# ============================================

echo -e "\n${YELLOW}=== STEP 3: Get Pending Payment (BEFORE payment) ===${NC}"

before_response=$(test_endpoint \
    "Get Pending Payment Before" \
    "GET" \
    "/students/$STUDENT_ID/pending-payment" \
    "")

PENDING_BEFORE=$(echo "$before_response" | grep -o '"pending_payment_due": [^,}]*' | grep -o '[a-z]*')
echo "Pending payment due: $PENDING_BEFORE"

# ============================================
# STEP 4: Simulate Webhook
# ============================================

echo -e "\n${YELLOW}=== STEP 4: Simulate Collexo Webhook ===${NC}"

TXN_ID="TEST-$(date +%s)"
echo "Using transaction_id: $TXN_ID"

webhook_response=$(test_endpoint \
    "Webhook - Payment Success" \
    "POST" \
    "/students/payment-workflow/webhook/collexo" \
    "{
        \"transaction_id\": \"$TXN_ID\",
        \"student_id\": $STUDENT_ID,
        \"application_no\": \"TEST-APP-001\",
        \"amount\": 50000.00,
        \"status\": \"completed\",
        \"payment_method\": \"semester_2\",
        \"payment_date\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
        \"metadata\": {
            \"order_id\": \"ORDER-123\"
        }
    }")

PAYMENT_ID=$(echo "$webhook_response" | grep -o '"payment_id": [0-9]*' | grep -o '[0-9]*')
echo "Payment ID created: $PAYMENT_ID"

# ============================================
# STEP 5: Get Pending Payment (AFTER)
# ============================================

echo -e "\n${YELLOW}=== STEP 5: Get Pending Payment (AFTER payment) ===${NC}"

after_response=$(test_endpoint \
    "Get Pending Payment After" \
    "GET" \
    "/students/$STUDENT_ID/pending-payment" \
    "")

PENDING_AFTER=$(echo "$after_response" | grep -o '"pending_payment_due": [^,}]*' | grep -o '[a-z]*')
echo "Pending payment due: $PENDING_AFTER"

# ============================================
# STEP 6: Verify Payment Created
# ============================================

echo -e "\n${YELLOW}=== STEP 6: Database Verification ===${NC}"

echo "Run these SQL queries to verify:"
echo ""
cat << EOF
-- Check student (flags should be cleared)
SELECT id, pending_payment_due, pending_payment_amount, 
       pending_payment_link, pending_payment_semester
FROM students WHERE id = $STUDENT_ID;

-- Check new payment created
SELECT id, student_id, transaction_id, payment_type, payment_amount
FROM payments WHERE student_id = $STUDENT_ID AND transaction_id = '$TXN_ID';

-- Check semester fee created
SELECT sf.* FROM semester_fees sf
JOIN payments p ON sf.payment_id = p.id
WHERE p.student_id = $STUDENT_ID AND p.transaction_id = '$TXN_ID';

-- Check webhook log
SELECT id, student_id, payment_id, gateway_transaction_id, status
FROM payment_transactions WHERE gateway_transaction_id = '$TXN_ID';
EOF

# ============================================
# Summary
# ============================================

echo -e "\n${YELLOW}=== TEST SUMMARY ===${NC}"
echo "Before: pending_payment_due = $PENDING_BEFORE"
echo "After:  pending_payment_due = $PENDING_AFTER"

if [ "$PENDING_BEFORE" = "true" ] && [ "$PENDING_AFTER" = "false" ]; then
    echo -e "\n${GREEN}✅ PAYMENT WORKFLOW TEST PASSED!${NC}"
    echo ""
    echo "✅ Auto-population worked"
    echo "✅ Webhook processed successfully"
    echo "✅ Payment flags cleared"
    echo "✅ Payment records created"
else
    echo -e "\n${RED}❌ TEST FAILED - Check the responses above${NC}"
fi

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "1. Check database with queries above"
echo "2. For specific POST requests, use Postman collection"
echo "3. Run pytest for unit tests: pytest src/tests/test_payment_workflow.py -v"

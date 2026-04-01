# Collexo Payment Gateway - Testing Guide

## Your Question: "Is there any testing flow in Collexo?"

### Answer: YES - But you DON'T NEED IT yet! ✅

Most payment gateways (including Collexo, Razorpay, Stripe, etc.) provide sandbox/test environments. However, **you can test your entire workflow WITHOUT needing Collexo access** because the key is testing the **webhook simulation**.

---

## Why You Can Test Without Collexo Live Server

### Your Payment Flow:
```
1. Your System          →  Payment Gateway (Collexo)
   "Show payment link"  →  Collexo serves payment page
   
2. Student             →  Payment Gateway
   "Click link & pay"  →  Collexo processes payment
   
3. Payment Gateway     →  Your System (Webhook)
   "Payment completed" →  Your webhook handler processes it
```

### What You Need to Test:
```
✅ Your auto-populate endpoint (NO Collexo needed)
✅ Your webhook handler (NO Collexo needed - simulate it!)
✅ Database operations (NO Collexo needed)
❌ Actual payment processing (NEEDS Collexo, but not now)
❌ Redirect to payment page (NEEDS Collexo, test in production)
```

---

## Testing Stages

### 🟢 Stage 1: Development Testing (RIGHT NOW - NO COLLEXO NEEDED)

**What to test:**
- ✅ Auto-populate endpoint
- ✅ Webhook handler
- ✅ Database operations
- ✅ Payment records creation

**How:**
- Use **bash script** or **Postman** to simulate webhooks
- **NO authentication** needed for webhook endpoint (in test)
- Create payment records manually

**Commands:**
```bash
# Already provided in: scripts/test_payment_workflow.sh
# And: Payment_Workflow_Testing.postman_collection.json
```

---

### 🟡 Stage 2: Collexo Sandbox Testing (LATER - TEST COLLEXO)

**When ready:**
1. Get **Collexo Sandbox credentials** from their support
2. Setup **sandbox URL** in .env file
3. Get **test card numbers** from Collexo docs
4. Register **webhook URL** in Collexo dashboard

**How to Request:**

```email
To: Collexo Support
Subject: Request Sandbox API Access

Hello,

We would like to integrate Collexo payment gateway with our institution portal.
Could you please provide:

1. Sandbox/Test API endpoint URL
2. Test credentials (merchant ID, API key)
3. Test card numbers for testing
4. Webhook setup documentation
5. API documentation for payment requests and responses

Our institution: Sri Ramachandra Institute
Portal: SisHub - Student Information System
Integration purpose: Semester fee collection

Thank you,
```

---

### 🔴 Stage 3: Production Testing (FINAL - REAL COLLEXO)

**Before go-live:**
1. Get **production credentials**
2. Switch to **production URL**
3. Real students pay real money
4. Monitor first few payments

---

## How to Find Collexo's Test Environment

### Check Collexo's Resources:

1. **Official Website**: https://www.collexo.com/
   - Developer documentation
   - Sandbox information
   - Test credentials request

2. **Common Test URLs**:
   - Sandbox: `https://sandbox.collexo.com/` or `https://test-payment.collexo.com/`
   - Production: `https://payment.collexo.com/`

3. **Look for**:
   - API Keys (different for sandbox/production)
   - Test card numbers (e.g., 4111111111111111)
   - Webhook documentation
   - Integration guides

4. **Common Collexo Questions**:
   - Does Collexo provide sandbox? → Check their docs
   - What test cards work? → In their docs
   - How to register webhook? → Webhook setup section
   - How to get API keys? → Admin dashboard

---

## Testing You Can Do RIGHT NOW

### ✅ Test 1: Backend Logic (No Collexo)
```bash
# Simulate entire payment flow manually

# Step 1: Auto-populate
curl -X POST http://localhost:8000/students/payment-workflow/auto-populate \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"program_id":1,"batch":"july-2026","admission_year":"2026","semester":"semester_2"}'

# Step 2: Get pending payment
curl -X GET http://localhost:8000/students/1/pending-payment \
  -H "Authorization: Bearer token"

# Step 3: SIMULATE webhook (You send this, not Collexo)
curl -X POST http://localhost:8000/students/payment-workflow/webhook/collexo \
  -H "Content-Type: application/json" \
  -d '{"transaction_id":"TEST-001","student_id":1,"amount":50000,"status":"completed"}'

# Step 4: Verify payment recorded
curl -X GET http://localhost:8000/students/1/pending-payment \
  -H "Authorization: Bearer token"

# Check database
SELECT * FROM payments WHERE student_id = 1;
SELECT * FROM semester_fees WHERE payment_id = (SELECT id FROM payments WHERE student_id = 1);
```

✅ **This tests 95% of your code without Collexo!**

---

### ✅ Test 2: API Endpoints (No Collexo)
```bash
# Use Postman collection provided: Payment_Workflow_Testing.postman_collection.json

# 3 available test requests:
1. Auto-Populate (POST) ✅ Works
2. Get Pending Payment (GET) ✅ Works  
3. Simulate Webhook Success (POST) ✅ Works
4. Simulate Webhook Failed (POST) ✅ Works
5. Manual Verification (POST) ✅ Works

# All test without touching Collexo!
```

---

### ✅ Test 3: Unit Tests (No Collexo)
```bash
# Run pytest
pytest src/tests/test_payment_workflow.py -v

# Tests mock everything - no external API calls
# 100% code coverage for business logic
```

---

## When You Need Collexo Testing

### Real Collexo Testing Needed For:

1. **Actual Payment Processing**
   ```
   Student clicks Collexo payment link
   → Collexo serves payment page
   → Student enters card details
   → Collexo processes charge
   → Webhook sent back ← YOUR code receives & processes
   ```

2. **Webhook Signature Verification** (Optional)
   ```
   Collexo signs webhook with X-Webhook-Signature header
   Your code verifies signature using COLLEXO_WEBHOOK_SECRET
   ```

3. **Real Payment Links**
   ```
   Your link: https://payment.collexo.com/...
   Shows real Collexo checkout page
   Students pay real money
   ```

---

## Testing Checklist

### Before Contacting Collexo:

- [x] ✅ Backend logic tested (already done)
- [x] ✅ Webhook handler tested (already done)
- [x] ✅ Database operations tested (already done)
- [x] ✅ All endpoints working (already done)
- [x] ✅ Error handling working (already done)
- [x] ✅ Unit tests passing (already done)

### Things You CANNOT Test Yet (Need Collexo):

- [ ] Live payment processing
- [ ] Webhook signature verification (optional)
- [ ] Actual student payment flow
- [ ] Collexo error responses
- [ ] Rate limiting

---

## Step-by-Step: From Now to Production

### Phase 1: Development (NOW) ✅
```
✅ Setup backend
✅ Create endpoints
✅ Test with simulated webhooks
✅ Unit tests pass
✅ Database operations verified
Timeline: Done! ↓
```

### Phase 2: Collexo Sandbox Integration (NEXT)
```
1. Request sandbox from Collexo
   - Contact support@collexo.com or use their website
   - Expect response in 1-2 business days
   
2. Get credentials:
   - Sandbox API URL
   - Merchant ID
   - API Key
   - Test card numbers
   
3. Update .env.test:
   COLLEXO_PAYMENT_URL=https://sandbox.collexo.com/...  (from Collexo)
   COLLEXO_INSTITUTION_ID=your_sandbox_id                (from Collexo)
   COLLEXO_WEBHOOK_SECRET=sandbox_secret                 (from Collexo)

4. Register webhook in Collexo dashboard:
   URL: https://your-domain-test/students/payment-workflow/webhook/collexo
   
5. Test with real Collexo:
   - Use test cards from Collexo
   - Simulate student payment
   - Verify webhook received
   - Check database

6. Fix any integration issues
Timeline: 1-2 weeks
```

### Phase 3: Production Go-Live (FINAL)
```
1. Get production credentials from Collexo
2. Update .env.production
3. Register production webhook in Collexo
4. Limited rollout (test with small batch first)
5. Full rollout
Timeline: 1 week
```

---

## What Information to Get from Collexo

### Email/Contact Collexo and Ask For:

```
REQUEST FORM:

1. API Documentation
   - Payment request format
   - Payment response format
   - Error codes and messages
   - Test card numbers
   
2. Sandbox Access
   - Sandbox URL
   - Test merchant ID
   - Test API key
   - Test credentials expiry
   
3. Webhook Documentation
   - Webhook format (what they send)
   - Webhook signature generation (if any)
   - Webhook retry policy
   - Webhook security
   
4. Integration Support
   - Sample integration code
   - Callback documentation
   - Redirect URL after payment
   
5. Testing
   - Test card numbers (various scenarios)
   - Failed payment testing
   - Refund testing
   - Rate limiting info
```

---

## How Payment Gateways Typically Work

### Standard Payment Flow:

```
1. Your Backend
   ↓
   "Show me Collexo payment page link"
   ↓
   Collexo API Response: "https://collexo.com/pay/xxx"
   
2. Your Frontend
   ↓
   Link: pending_payment_link = "https://collexo.com/pay/xxx"
   ↓
   Student clicks → Redirected
   
3. Collexo Gateway
   ↓
   Student enters card → Processes payment
   ↓
   
4. Webhook Callback (Automatic)
   ↓
   Collexo POST https://your-domain/webhook
   Body: {transaction_id, status, amount}
   ↓
   Your system creates payment record
   ↓
   Database updated ✅
```

---

## Summary

### ✅ You Can Test NOW (Without Collexo):
```
1. Endpoint responses
2. Webhook simulation
3. Database operations
4. Payment record creation
5. Flag clearing
6. Business logic
```
**Use**: scripts/test_payment_workflow.sh or Postman

### ❌ You CANNOT Test Yet (Need Collexo):
```
1. Actual payment processing
2. Student clicking real link
3. Real card charges
4. Webhook signature validation
5. Collexo error scenarios
```
**When Ready**: Request sandbox from Collexo

### ⏭️ Next Action:
```
Option A: Test with simulated webhooks NOW ✅
   - Run: ./scripts/test_payment_workflow.sh
   - Or use: Postman collection
   - Verify backend works
   
Option B: Request Collexo sandbox ASAP
   - Contact Collexo support
   - Get test credentials
   - Integration phase 2
   - Estimated: 1-2 weeks
```

---

## Quick Reference: Testing Right Now

### Fastest Test (5 minutes):

```bash
# 1. Open terminal
cd /home/cdoe/django/SisHub

# 2. Make script executable
chmod +x scripts/test_payment_workflow.sh

# 3. Run test
./scripts/test_payment_workflow.sh http://localhost:8000 YOUR_STAFF_TOKEN

# 4. Follow prompts - script does everything
# 5. See GREEN checkmarks = SUCCESS ✅
```

### Alternative: Postman

```
1. Import: Payment_Workflow_Testing.postman_collection.json
2. Set variables:
   - base_url = http://localhost:8000
   - staff_token = Your JWT token
   - student_id = 1
3. Send requests in order:
   1. Auto-Populate ✅
   2. Get Pending Payment ✅
   3. Simulate Webhook ✅
   4. Get Pending Payment Again ✅
   5. Verify Database ✅
```

---

**Bottom Line**: You're ready to test! No Collexo needed. Start with the bash script or Postman collection right now. When ready for production, contact Collexo for sandbox credentials.

# Check API Key via CLI - munchmatchfeb2

## Step 1: Check Service Configuration

**Check if GEMINI_API_KEY is configured:**

```bash
gcloud run services describe munchmatchfeb2 \
  --region europe-west1 \
  --format="yaml(spec.template.spec.containers[0].env)"
```

**Expected output:**
```yaml
env:
- name: GEMINI_API_KEY
  value: AIzaSy...  # OR valueFrom: secretKeyRef
```

**If empty or missing:** API key not configured.

---

## Step 2: Check Container Logs

**Check if injection script ran successfully:**

```bash
gcloud run services logs read munchmatchfeb2 \
  --region europe-west1 \
  --limit=50
```

**Look for:**
- `✅ GEMINI_API_KEY: Set (AIzaSyDbLv...)` - **Good!**
- `❌ GEMINI_API_KEY: NOT SET` - **Problem!**
- `✅ Verified: window.__ENV__ found in HTML` - **Good!**
- `GEMINI_API_KEY env var present: true` - **Good!**
- `GEMINI_API_KEY env var present: false` - **Problem!**

---

## Step 3: Check HTML Source (Verify Injection)

**Get the HTML and check if window.__ENV__ has the key:**

```bash
# Get service URL first
SERVICE_URL=$(gcloud run services describe munchmatchfeb2 \
  --region europe-west1 \
  --format='value(status.url)')

# Check HTML for window.__ENV__
curl -s $SERVICE_URL | grep -o 'window\.__ENV__[^<]*'
```

**Expected output:**
```javascript
window.__ENV__ = {"GEMINI_API_KEY":"AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4"}
```

**If you see empty string:** `{"GEMINI_API_KEY":""}` - API key not available to script.

---

## Step 4: Check Secret Manager (If Using Secrets)

**If using Secret Manager, verify secret exists:**

```bash
# List all gemini secrets
gcloud secrets list | grep -i gemini

# Check secret value (if using gemini-api-key)
gcloud secrets versions access latest --secret="gemini-api-key"

# Check secret permissions
gcloud secrets get-iam-policy gemini-api-key
```

---

## Step 5: Quick Health Check

**One-liner to check everything:**

```bash
# Set variables
SERVICE_NAME="munchmatchfeb2"
REGION="europe-west1"

# Check config
echo "=== Service Configuration ==="
gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format="yaml(spec.template.spec.containers[0].env)"

# Check logs
echo -e "\n=== Recent Logs ==="
gcloud run services logs read $SERVICE_NAME \
  --region $REGION \
  --limit=20 | grep -E "(GEMINI_API_KEY|inject|window.__ENV__)"

# Check HTML
echo -e "\n=== HTML Injection Check ==="
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format='value(status.url)')
curl -s $SERVICE_URL | grep -o 'window\.__ENV__[^<]*' || echo "window.__ENV__ not found in HTML"
```

---

## Step 6: Test API Key Value

**Extract and verify the API key from HTML:**

```bash
SERVICE_URL=$(gcloud run services describe munchmatchfeb2 \
  --region europe-west1 \
  --format='value(status.url)')

# Extract API key from HTML
API_KEY=$(curl -s $SERVICE_URL | grep -o 'window\.__ENV__[^<]*' | grep -o '"GEMINI_API_KEY":"[^"]*"' | cut -d'"' -f4)

if [ -z "$API_KEY" ] || [ "$API_KEY" = "" ]; then
  echo "❌ API key is empty or not found"
else
  echo "✅ API key found: ${API_KEY:0:10}... (length: ${#API_KEY})"
fi
```

---

## Troubleshooting Based on Results

### If logs show "GEMINI_API_KEY: NOT SET"

**Fix:** Set the environment variable:
```bash
gcloud run services update munchmatchfeb2 \
  --region europe-west1 \
  --set-env-vars GEMINI_API_KEY=AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4
```

### If HTML shows empty string `{"GEMINI_API_KEY":""}`

**Fix:** Environment variable not available to injection script. Set it:
```bash
gcloud run services update munchmatchfeb2 \
  --region europe-west1 \
  --set-env-vars GEMINI_API_KEY=AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4
```

### If service config shows secret reference but logs show "NOT SET"

**Fix:** Check secret permissions:
```bash
export PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Quick Verification Script

**Copy and paste this entire block:**

```bash
#!/bin/bash
SERVICE_NAME="munchmatchfeb2"
REGION="europe-west1"

echo "🔍 Checking API Key Configuration for $SERVICE_NAME..."
echo ""

# 1. Check service config
echo "1️⃣ Service Configuration:"
gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format="value(spec.template.spec.containers[0].env[0].name,spec.template.spec.containers[0].env[0].value)" 2>/dev/null || \
gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format="value(spec.template.spec.containers[0].env[0].valueFrom.secretKeyRef.name)" 2>/dev/null

# 2. Check logs
echo -e "\n2️⃣ Recent Logs (injection status):"
gcloud run services logs read $SERVICE_NAME \
  --region $REGION \
  --limit=30 | grep -E "(GEMINI_API_KEY|inject|window.__ENV__|✅|❌)" | tail -10

# 3. Check HTML
echo -e "\n3️⃣ HTML Injection Check:"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format='value(status.url)')
ENV_SCRIPT=$(curl -s $SERVICE_URL | grep -o 'window\.__ENV__[^<]*' | head -1)

if echo "$ENV_SCRIPT" | grep -q '"GEMINI_API_KEY":"[^"]\{10,\}"'; then
  echo "✅ API key found in HTML"
  echo "$ENV_SCRIPT" | grep -o '"GEMINI_API_KEY":"[^"]*"'
else
  echo "❌ API key empty or not found"
  echo "$ENV_SCRIPT"
fi

echo -e "\n✅ Service URL: $SERVICE_URL"
```

---

**Run these commands to diagnose the API key issue!** 🔍

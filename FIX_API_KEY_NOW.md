# 🚨 URGENT: Fix API Key Issue - Step by Step

## Problem
Cloud Run says "API key is not valid" - this means either:
1. Secret doesn't exist
2. Secret has wrong value  
3. Permissions not set

---

## ✅ Quick Fix (Run These Commands)

### Step 1: Get Your Gemini API Key
1. Go to: https://aistudio.google.com/apikey
2. Copy your API key (starts with `AIzaSy...`)

### Step 2: Set Up Secret

```bash
# Replace YOUR_PROJECT_ID and YOUR_API_KEY
export PROJECT_ID="your-project-id"
export GEMINI_API_KEY="AIzaSyYOUR_ACTUAL_KEY_HERE"

# Create or update secret
echo -n "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=- 2>/dev/null || \
echo -n "$GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-
```

### Step 3: Grant Permissions

```bash
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Step 4: Update Cloud Run Service

```bash
gcloud run services update munchmatch \
  --region us-central1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

### Step 5: Verify

```bash
# Check secret value
gcloud secrets versions access latest --secret="gemini-api-key"

# Check Cloud Run config
gcloud run services describe munchmatch --region us-central1 \
  --format="value(spec.template.spec.containers[0].env[0].name,spec.template.spec.containers[0].env[0].valueFrom.secretKeyRef.name)"
```

### Step 6: Check Logs

```bash
# View logs to see if injection worked
gcloud run services logs read munchmatch --region us-central1 --limit=30
```

---

## 🔍 If Still Not Working

### Check Secret Value Format

Gemini API keys should:
- Start with `AIzaSy`
- Be about 39 characters long
- No spaces or quotes

```bash
# Verify format
gcloud secrets versions access latest --secret="gemini-api-key" | wc -c
# Should be around 39-40 characters
```

### Check Container Logs for Errors

```bash
# Look for injection script output
gcloud run services logs read munchmatch \
  --region us-central1 \
  --limit=50 | grep -E "inject|env|GEMINI|error|Error"
```

### Test Secret Access Manually

```bash
# This should output your API key
gcloud secrets versions access latest --secret="gemini-api-key"
```

---

## 🎯 Most Common Issue

**The secret value is wrong or doesn't exist.**

**Solution**: 
1. Get fresh API key from https://aistudio.google.com/apikey
2. Update secret (Step 2 above)
3. Redeploy (push to GitHub or manually update Cloud Run)

---

## 📞 Need More Help?

Run this diagnostic script:

```bash
echo "=== Secret Check ==="
gcloud secrets describe gemini-api-key 2>&1 || echo "❌ Secret doesn't exist"

echo -e "\n=== Secret Value (first 20 chars) ==="
gcloud secrets versions access latest --secret="gemini-api-key" 2>&1 | head -c 20

echo -e "\n=== Cloud Run Config ==="
gcloud run services describe munchmatch --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)" 2>&1

echo -e "\n=== Recent Logs ==="
gcloud run services logs read munchmatch --region us-central1 --limit=10 2>&1 | tail -5
```

---

**Run Steps 1-4 above to fix the issue immediately!**

# 🚨 IMMEDIATE FIX: API Key Not Valid

## The Problem
Cloud Run says "API key is not valid" - this means the secret either:
- ❌ Doesn't exist
- ❌ Has wrong value
- ❌ Cloud Run can't access it

---

## ✅ QUICK FIX (Copy & Paste These Commands)

### Option 1: Use the Fix Script (Easiest)

```bash
# Make script executable
chmod +x fix-api-key.sh

# Run it (will prompt for Project ID and API Key)
./fix-api-key.sh
```

### Option 2: Manual Fix (Step by Step)

```bash
# 1. Set your values
export PROJECT_ID="your-project-id"
export GEMINI_API_KEY="AIzaSyYOUR_ACTUAL_KEY_FROM_https://aistudio.google.com/apikey"

# 2. Create or update secret
echo -n "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=- 2>/dev/null || \
echo -n "$GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-

# 3. Get project number and grant permissions
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 4. Update Cloud Run service
gcloud run services update munchmatch \
  --region us-central1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest

# 5. Verify
echo "Secret value (first 20 chars):"
gcloud secrets versions access latest --secret="gemini-api-key" | head -c 20
echo ""
```

---

## 🔍 Verify It's Fixed

### Check 1: Secret Exists and Has Value
```bash
gcloud secrets versions access latest --secret="gemini-api-key"
# Should output your API key (starts with AIzaSy...)
```

### Check 2: Cloud Run Has Secret Configured
```bash
gcloud run services describe munchmatch --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
# Should show GEMINI_API_KEY configured
```

### Check 3: Container Logs Show Injection
```bash
gcloud run services logs read munchmatch --region us-central1 --limit=30 | grep -i "inject\|env\|gemini"
# Should see "Environment variables injected successfully"
# Should see "GEMINI_API_KEY: Set (AIzaSy...)"
```

### Check 4: Test the App
```bash
SERVICE_URL=$(gcloud run services describe munchmatch --region us-central1 --format='value(status.url)')
echo "Open: $SERVICE_URL"
# Should NOT show "API key not set" error
```

---

## 🎯 Most Common Issues

### Issue 1: Secret Doesn't Exist
**Symptom**: `ERROR: (gcloud.secrets.versions.access) Resource 'gemini-api-key' was not found`

**Fix**: Run Step 2 from Option 2 above

### Issue 2: Wrong API Key Value
**Symptom**: Secret exists but app still says "invalid"

**Fix**: 
1. Get fresh key from https://aistudio.google.com/apikey
2. Update secret: `echo -n "NEW_KEY" | gcloud secrets versions add gemini-api-key --data-file=-`
3. Redeploy or wait for next build

### Issue 3: No Permissions
**Symptom**: Secret exists but Cloud Run can't access it

**Fix**: Run Step 3 from Option 2 above

### Issue 4: Secret Not Injected
**Symptom**: Logs show "GEMINI_API_KEY: NOT SET"

**Fix**: 
1. Verify secret exists and has value
2. Check Cloud Run service has `--update-secrets` configured
3. Check container logs for injection script errors

---

## 📋 Quick Diagnostic

Run this to see what's wrong:

```bash
echo "=== 1. Secret Check ==="
gcloud secrets describe gemini-api-key 2>&1 | head -3 || echo "❌ Secret doesn't exist - CREATE IT!"

echo -e "\n=== 2. Secret Value (first 20 chars) ==="
gcloud secrets versions access latest --secret="gemini-api-key" 2>&1 | head -c 20 || echo "❌ Can't access secret"

echo -e "\n=== 3. Cloud Run Config ==="
gcloud run services describe munchmatch --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)" 2>&1 | grep GEMINI || echo "❌ Secret not configured in Cloud Run"

echo -e "\n=== 4. Recent Logs ==="
gcloud run services logs read munchmatch --region us-central1 --limit=10 2>&1 | tail -5
```

---

## 🚀 After Fixing

1. **Wait 1-2 minutes** for Cloud Run to update
2. **Check logs** to verify injection worked
3. **Test the app** - should work now!

---

## 💡 Important Notes

- **API Key Format**: Should start with `AIzaSy` and be ~39 characters
- **No Quotes**: Don't wrap API key in quotes when creating secret
- **Secret Name**: Must be exactly `gemini-api-key` (matches cloudbuild.yaml)
- **Region**: Make sure you're using the correct region (`us-central1`)

---

**Run Option 1 or Option 2 above to fix immediately!** 🎯

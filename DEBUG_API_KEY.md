# Debugging API Key Issue on Cloud Run

## 🔍 Quick Debugging Steps

### Step 1: Check if Secret Exists

```bash
# List all secrets
gcloud secrets list

# Check if gemini-api-key exists
gcloud secrets describe gemini-api-key
```

### Step 2: Verify Secret Value

```bash
# View secret value (replace with your actual secret name)
gcloud secrets versions access latest --secret="gemini-api-key"

# Should output: AIzaSy... (your Gemini API key)
```

### Step 3: Check Cloud Run Service Configuration

```bash
# Check if Cloud Run service has the secret configured
gcloud run services describe munchmatch \
  --region us-central1 \
  --format="yaml(spec.template.spec.containers[0].env)"

# Should show GEMINI_API_KEY configured
```

### Step 4: Check Service Account Permissions

```bash
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Check if Cloud Run service account has access
gcloud secrets get-iam-policy gemini-api-key \
  --format="table(bindings.members,bindings.role)" | grep compute
```

### Step 5: Check Container Logs

```bash
# View recent logs to see if injection script ran
gcloud run services logs read munchmatch \
  --region us-central1 \
  --limit=50 | grep -i "inject\|env\|gemini"
```

---

## 🔧 Common Issues & Fixes

### Issue 1: Secret Doesn't Exist

**Fix**: Create the secret
```bash
# Get your Gemini API key from: https://aistudio.google.com/apikey
echo -n "AIzaSyYOUR_ACTUAL_API_KEY_HERE" | gcloud secrets create gemini-api-key --data-file=-
```

### Issue 2: Secret Has Wrong Value

**Fix**: Update the secret
```bash
# Update secret with correct value
echo -n "AIzaSyYOUR_CORRECT_API_KEY_HERE" | gcloud secrets versions add gemini-api-key --data-file=-

# Then redeploy
gcloud run services update munchmatch --region us-central1
```

### Issue 3: Cloud Run Service Account Doesn't Have Access

**Fix**: Grant permissions
```bash
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Grant Cloud Run service account access
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Issue 4: Secret Name Mismatch

**Check**: Verify secret name matches cloudbuild.yaml
```bash
# In cloudbuild.yaml, it should be:
# --update-secrets GEMINI_API_KEY=gemini-api-key:latest

# Verify secret name
gcloud secrets list | grep gemini
```

### Issue 5: Secret Not Injected Properly

**Check**: View container logs
```bash
# Check if inject script ran successfully
gcloud run services logs read munchmatch \
  --region us-central1 \
  --limit=100 | grep -A 5 -B 5 "inject"
```

---

## 🚀 Quick Fix Script

Run this to set everything up correctly:

```bash
#!/bin/bash

# Set your project ID
export PROJECT_ID="your-project-id"
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Set your Gemini API key
export GEMINI_API_KEY="AIzaSyYOUR_ACTUAL_API_KEY_HERE"

# 1. Create or update secret
if gcloud secrets describe gemini-api-key &>/dev/null; then
  echo "Updating existing secret..."
  echo -n "$GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-
else
  echo "Creating new secret..."
  echo -n "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
fi

# 2. Grant Cloud Run service account access
echo "Granting Cloud Run access..."
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --quiet

# 3. Update Cloud Run service to use secret
echo "Updating Cloud Run service..."
gcloud run services update munchmatch \
  --region us-central1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --quiet

# 4. Verify
echo "Verifying secret access..."
gcloud secrets versions access latest --secret="gemini-api-key" | head -c 20
echo "... (truncated)"

echo "✅ Done! Check Cloud Run logs to verify injection."
```

---

## 🔍 Verify Injection Worked

### Method 1: Check Logs

```bash
# Should see "Environment variables injected successfully"
gcloud run services logs read munchmatch \
  --region us-central1 \
  --limit=20 | grep -i "inject\|env"
```

### Method 2: Check HTML Source

```bash
SERVICE_URL=$(gcloud run services describe munchmatch --region us-central1 --format='value(status.url)')

# Should see window.__ENV__ with GEMINI_API_KEY
curl -s $SERVICE_URL | grep -o 'window\.__ENV__.*GEMINI_API_KEY'
```

### Method 3: Test API Call

Open the app in browser and check browser console:
- Should NOT see "GEMINI_API_KEY is not set" error
- Should see API calls working

---

## 🎯 Most Likely Issue

**The secret probably doesn't exist or has wrong value.**

**Quick Fix**:
1. Get your Gemini API key from https://aistudio.google.com/apikey
2. Create/update secret:
   ```bash
   echo -n "YOUR_ACTUAL_API_KEY" | gcloud secrets create gemini-api-key --data-file=-
   # OR if exists:
   echo -n "YOUR_ACTUAL_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-
   ```
3. Grant permissions (see Issue 3 above)
4. Redeploy or wait for next build

---

## 📋 Checklist

- [ ] Secret `gemini-api-key` exists in Secret Manager
- [ ] Secret has correct Gemini API key value (starts with `AIzaSy`)
- [ ] Cloud Run service account has `secretAccessor` role
- [ ] Cloud Run service configured with `--update-secrets`
- [ ] Container logs show "Environment variables injected successfully"
- [ ] HTML contains `window.__ENV__` with `GEMINI_API_KEY`

---

**Run the debugging steps above to identify the exact issue!**

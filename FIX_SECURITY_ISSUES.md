# 🔒 Fix GCP Security Issues

## 🚨 Problems Identified

1. **Permission Denied**: Cloud Run service account can't access Secret Manager
2. **Unsafe Practice**: API key is hardcoded in YAML (should use Secret Manager)

---

## ✅ Step-by-Step Fix

### Step 1: Grant Secret Manager Permission

**Run this in terminal** (replace `872747958244` with your project number if different):

```bash
# Set your project
export PROJECT_ID=$(gcloud config get-value project)
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Grant Cloud Run service account access to secret
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=$PROJECT_ID
```

**Expected output**:
```
Updated IAM policy for secret [gemini-api-key].
bindings:
- members:
  - serviceAccount:872747958244-compute@developer.gserviceaccount.com
  role: roles/secretmanager.secretAccessor
```

---

### Step 2: Remove Hardcoded API Key from Cloud Run

**Option A: Via Console** (Recommended)

1. Go to Cloud Run → `munchmatch-v1` → **"Edit and deploy new revision"**
2. Scroll to **"Variables & Secrets"** section
3. **Find** `API_KEY` variable (with hardcoded value)
4. **Click the trash icon** to remove it
5. **Add new secret reference**:
   - Click **"Reference a secret"**
   - **Name**: `GEMINI_API_KEY`
   - **Secret**: `gemini-api-key`
   - **Version**: `latest`
6. **Click "Deploy"**

**Option B: Via Terminal** (Faster)

```bash
# Remove hardcoded API_KEY and add secret reference
gcloud run services update munchmatch-v1 \
  --region us-west1 \
  --remove-env-vars API_KEY \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

---

### Step 3: Verify Secret Exists

```bash
# Check if secret exists
gcloud secrets list | grep gemini-api-key

# If it doesn't exist, create it
echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets create gemini-api-key --data-file=-

# Or update existing secret
echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets versions add gemini-api-key --data-file=-
```

---

### Step 4: Verify Configuration

**Check Cloud Run config**:

```bash
gcloud run services describe munchmatch-v1 \
  --region us-west1 \
  --format="yaml(spec.template.spec.containers[0].env)"
```

**Should see**:
```yaml
env:
- name: GEMINI_API_KEY
  valueFrom:
    secretKeyRef:
      name: gemini-api-key
      key: latest
```

**Should NOT see**:
```yaml
env:
- name: API_KEY
  value: AIzaSy...  # ❌ This is the problem!
```

---

### Step 5: Test Deployment

After deploying:

1. **Check logs**:
   ```bash
   gcloud run services logs read munchmatch-v1 --region us-west1 --limit=20
   ```

2. **Look for**:
   ```
   ✅ GEMINI_API_KEY: Set (AIzaSyDbLv...)
   ✅ Verified: window.__ENV__ found in HTML
   ```

3. **Test app**: Open browser console and check:
   ```javascript
   window.__ENV__
   // Should show: {GEMINI_API_KEY: "AIzaSy..."}
   ```

---

## 🔍 Troubleshooting

### If Permission Error Persists

**Check service account**:
```bash
# Verify service account exists
gcloud iam service-accounts describe \
  872747958244-compute@developer.gserviceaccount.com

# Check current permissions
gcloud secrets get-iam-policy gemini-api-key
```

**Re-grant permission**:
```bash
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:872747958244-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### If Secret Doesn't Exist

**Create it**:
```bash
# Create secret
echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets create gemini-api-key --data-file=-

# Grant permission
export PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## ✅ Security Checklist

After fixing:

- [ ] ✅ API key stored in Secret Manager (not hardcoded)
- [ ] ✅ Cloud Run references secret (not direct value)
- [ ] ✅ Service account has `secretmanager.secretAccessor` role
- [ ] ✅ No `API_KEY` env var with hardcoded value
- [ ] ✅ `GEMINI_API_KEY` env var references secret
- [ ] ✅ App works without exposing API key

---

## 🚀 Quick One-Liner Fix

**Run this to fix everything at once**:

```bash
# Set variables
export PROJECT_ID=$(gcloud config get-value project)
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
export API_KEY="AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4"

# Create/update secret
echo -n "$API_KEY" | gcloud secrets create gemini-api-key --data-file=- 2>/dev/null || \
echo -n "$API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-

# Grant permission
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Update Cloud Run (remove hardcoded, add secret)
gcloud run services update munchmatch-v1 \
  --region us-west1 \
  --remove-env-vars API_KEY \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

**Then wait 1-2 minutes and test!** 🎉

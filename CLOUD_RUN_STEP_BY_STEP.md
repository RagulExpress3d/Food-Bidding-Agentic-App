# Step-by-Step Guide: Fix API Key on Cloud Run

## 🎯 You're On: Cloud Run Service Details Page

**Service**: `munchmatch-v1`  
**Region**: `us-west1`  
**URL**: `https://munchmatch-v1-872747958244.us-west1.run.app`

---

## Step 1: Check if Secret Exists (Terminal)

Open a terminal in Cursor and run:

```bash
# Check if secret exists
gcloud secrets list | grep gemini-api-key
```

**If you see `gemini-api-key`**: ✅ Secret exists, go to Step 2  
**If you see nothing**: ❌ Secret doesn't exist, create it first:

```bash
# Create secret with your API key
echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets create gemini-api-key --data-file=-
```

---

## Step 2: Grant Cloud Run Permission (Terminal)

```bash
# Get your project number (replace PROJECT_ID with your actual project ID)
export PROJECT_ID="your-project-id"  # Find this in GCP console top bar
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Grant permission
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Step 3: Configure Secret in Cloud Run (Console)

### Option A: Via Console UI

1. **On the current screen**, click **"Edit and deploy new revision"** button (top right)

2. **Scroll down** to find **"Variables & Secrets"** section

3. **Click "Add Variable"** or **"Reference a Secret"**

4. **Select**:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Select **"Reference a secret"**
   - **Secret**: `gemini-api-key`
   - **Version**: `latest`

5. **Click "Deploy"** (bottom of page)

### Option B: Via Terminal (Faster)

```bash
# Update Cloud Run service to use secret
gcloud run services update munchmatch-v1 \
  --region us-west1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

---

## Step 4: Verify Configuration

### Check via Console:
1. **Click "YAML" tab** (top of page)
2. **Look for** `env:` section
3. **Should see**:
   ```yaml
   env:
   - name: GEMINI_API_KEY
     valueFrom:
       secretKeyRef:
         key: latest
         name: gemini-api-key
   ```

### Check via Terminal:
```bash
gcloud run services describe munchmatch-v1 \
  --region us-west1 \
  --format="yaml(spec.template.spec.containers[0].env)"
```

---

## Step 5: Check Logs (Verify Injection)

### Via Console:
1. **Click "Observability" tab**
2. **Click "Logs"**
3. **Look for** logs from latest revision
4. **Search for**: `inject` or `GEMINI_API_KEY`
5. **Should see**: `✅ Environment variables injected successfully`

### Via Terminal:
```bash
gcloud run services logs read munchmatch-v1 --region us-west1 --limit=30 | grep -i "inject\|env\|gemini"
```

---

## Step 6: Test the App

1. **Click the service URL** at the top: `https://munchmatch-v1-872747958244.us-west1.run.app`
2. **Open browser console** (F12 → Console tab)
3. **Check for errors**:
   - ✅ Should NOT see "GEMINI_API_KEY is not set"
   - ✅ Should see `window.__ENV__` object
   - ✅ App should load and work

---

## 🔍 Troubleshooting

### Issue: "Edit and deploy new revision" doesn't show Variables section

**Fix**: Scroll down on the edit page - it's below container settings

### Issue: Secret not in dropdown

**Fix**: 
1. Make sure secret exists (Step 1)
2. Refresh the page
3. Or use terminal method (Option B in Step 3)

### Issue: Still says "API key not valid"

**Check**:
1. Secret has correct value: `gcloud secrets versions access latest --secret="gemini-api-key"`
2. Cloud Run has permission (Step 2)
3. New revision deployed (check "Revisions" tab - should see new revision)
4. Logs show injection worked (Step 5)

---

## 📋 Quick Checklist

- [ ] Secret `gemini-api-key` exists
- [ ] Secret has correct API key value
- [ ] Cloud Run service account has permission
- [ ] Cloud Run service configured with `--update-secrets`
- [ ] New revision deployed (check Revisions tab)
- [ ] Logs show "Environment variables injected successfully"
- [ ] App works without "API key not set" error

---

## 🚀 Quick One-Line Fix (If You Know Project ID)

```bash
export PROJECT_ID="YOUR_PROJECT_ID" && \
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)') && \
echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | gcloud secrets create gemini-api-key --data-file=- 2>/dev/null || echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | gcloud secrets versions add gemini-api-key --data-file=- && \
gcloud secrets add-iam-policy-binding gemini-api-key --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --quiet && \
gcloud run services update munchmatch-v1 --region us-west1 --update-secrets GEMINI_API_KEY=gemini-api-key:latest --quiet && \
echo "✅ Done! Wait 1-2 minutes, then check logs and test the app."
```

---

**Follow Steps 1-6 above, or run the one-line fix!** 🎯

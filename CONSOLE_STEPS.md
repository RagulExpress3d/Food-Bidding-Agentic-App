# Step-by-Step: Fix API Key via Cloud Run Console

## 🎯 Current Screen: Service Details Page

You're viewing: **munchmatch-v1** service in **us-west1** region

---

## Step 1: Create Secret (Terminal - Do This First)

Open terminal in Cursor and run:

```bash
# Create secret with your API key
echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets create gemini-api-key --data-file=- 2>/dev/null || \
  echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets versions add gemini-api-key --data-file=-

# Grant Cloud Run permission
export PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Step 2: Configure Secret in Cloud Run Console

### On Your Current Screen:

1. **Click "Edit and deploy new revision"** button (top right, blue button)

2. **Scroll down** to find **"Variables & Secrets"** section
   - It's below "Container" settings
   - Look for "Environment variables" or "Secrets"

3. **Click "Add Variable"** or **"Reference a Secret"**

4. **Configure**:
   - **Variable name**: `GEMINI_API_KEY`
   - **Value source**: Select **"Reference a secret"**
   - **Secret**: `gemini-api-key` (should appear in dropdown)
   - **Version**: `latest`

5. **Scroll to bottom** and click **"Deploy"**

6. **Wait 1-2 minutes** for new revision to deploy

---

## Step 3: Verify It Worked

### Check New Revision:
1. **Go back to "Revisions" tab**
2. **You should see** a new revision (e.g., `munchmatch-v1-00006-xxx`)
3. **It should show** "100% (to latest)" traffic

### Check Logs:
1. **Click "Observability" tab**
2. **Click "Logs"**
3. **Look for** latest revision logs
4. **Search for**: `inject` or `GEMINI_API_KEY`
5. **Should see**: 
   ```
   🔧 Injecting environment variables...
   ✅ GEMINI_API_KEY: Set (AIzaSyDbLv...)
   ✅ Environment variables injected successfully
   ```

### Test the App:
1. **Click the URL** at top: `https://munchmatch-v1-872747958244.us-west1.run.app`
2. **Open browser console** (F12)
3. **Type**: `window.__ENV__`
4. **Should see**: `{GEMINI_API_KEY: "AIzaSy..."}`
5. **App should work** without "API key not set" error

---

## 🔄 Alternative: Use Terminal (Faster)

If the console UI is confusing, use terminal:

```bash
# Update Cloud Run service
gcloud run services update munchmatch-v1 \
  --region us-west1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest

# Check logs
gcloud run services logs read munchmatch-v1 --region us-west1 --limit=20 | grep -i "inject\|env"
```

---

## ✅ Success Indicators

- ✅ New revision appears in "Revisions" tab
- ✅ Logs show "Environment variables injected successfully"
- ✅ Logs show "GEMINI_API_KEY: Set"
- ✅ App loads without "API key not set" error
- ✅ `window.__ENV__` exists in browser console

---

## 🚨 If Still Not Working

### Check Secret Value:
```bash
gcloud secrets versions access latest --secret="gemini-api-key"
# Should output: AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4
```

### Check Service Config:
1. **Click "YAML" tab**
2. **Look for** `env:` section
3. **Should see** `GEMINI_API_KEY` configured

### Check Logs for Errors:
```bash
gcloud run services logs read munchmatch-v1 --region us-west1 --limit=50
```

---

**Start with Step 1 (terminal), then Step 2 (console)!** 🚀

# Visual Step-by-Step Guide: Fix API Key

## 🎯 You're Currently On: Cloud Run Service Details Page

**Service**: `munchmatch-v1`  
**Region**: `us-west1`  
**URL**: `https://munchmatch-v1-872747958244.us-west1.run.app`

---

## 📋 Step-by-Step Instructions

### STEP 1: Open Terminal in Cursor (Do This First!)

1. **In Cursor**, open terminal (View → Terminal or `` Ctrl+` ``)

2. **Run these commands**:

```bash
# Create/update secret
echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets create gemini-api-key --data-file=- 2>/dev/null || \
  echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets versions add gemini-api-key --data-file=-

# Grant permissions
export PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

**Expected output**: `✅ Secret created` or `✅ Secret updated` + `✅ Policy binding added`

---

### STEP 2: On Cloud Run Console (Your Current Screen)

#### Option A: Via Console UI

1. **Look at top right** → Click **"Edit and deploy new revision"** button (blue button)

2. **Scroll down** the edit page until you see:
   - **"Variables & Secrets"** section
   - OR **"Environment variables"** section
   - OR **"Secrets"** tab

3. **Click "Add Variable"** or **"Reference a Secret"**

4. **Fill in**:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Click dropdown → Select **"Reference a secret"**
   - **Secret**: `gemini-api-key` (should appear in dropdown)
   - **Version**: `latest`

5. **Scroll to bottom** → Click **"Deploy"** button

6. **Wait 1-2 minutes** for deployment

#### Option B: Via Terminal (Easier!)

**In Cursor terminal**, run:

```bash
gcloud run services update munchmatch-v1 \
  --region us-west1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

**Expected output**: `Service [munchmatch-v1] revision [munchmatch-v1-00006-xxx] has been deployed`

---

### STEP 3: Verify It Worked

#### Check 1: New Revision Created

1. **On Cloud Run console**, go to **"Revisions" tab** (you're already there)
2. **Look for** a new revision (e.g., `munchmatch-v1-00006-xxx`)
3. **Should show**: "100% (to latest)" traffic
4. **Should have**: Green checkmark ✅

#### Check 2: View Logs

**Via Console**:
1. **Click "Observability" tab** (top of page)
2. **Click "Logs"** sub-tab
3. **Look for** latest revision logs
4. **Search for**: `inject` or `GEMINI_API_KEY`
5. **Should see**: 
   ```
   🔧 Injecting environment variables...
   ✅ GEMINI_API_KEY: Set (AIzaSyDbLv...)
   ✅ Environment variables injected successfully
   ```

**Via Terminal**:
```bash
gcloud run services logs read munchmatch-v1 --region us-west1 --limit=30 | grep -i "inject\|env\|gemini"
```

#### Check 3: Test the App

1. **Click the URL** at top: `https://munchmatch-v1-872747958244.us-west1.run.app`
2. **Open browser** (or click "Test" button on console)
3. **Open browser console** (F12 → Console tab)
4. **Type**: `window.__ENV__`
5. **Should see**: `{GEMINI_API_KEY: "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4"}`
6. **App should work** without errors!

---

## ✅ Success Checklist

- [ ] Secret created (Step 1 terminal output shows success)
- [ ] Permissions granted (Step 1 terminal output shows success)
- [ ] Cloud Run service updated (Step 2 - new revision appears)
- [ ] Logs show "Environment variables injected successfully"
- [ ] Logs show "GEMINI_API_KEY: Set"
- [ ] App loads without "API key not set" error
- [ ] `window.__ENV__` exists in browser console

---

## 🚨 If Something Goes Wrong

### Problem: "Secret doesn't exist" error

**Fix**: Run Step 1 again, make sure you see "Secret created" message

### Problem: "Permission denied" error

**Fix**: Run the permission command from Step 1 again

### Problem: New revision not appearing

**Fix**: 
1. Refresh the Cloud Run console page
2. Check "Revisions" tab again
3. Or check terminal for deployment errors

### Problem: Logs show "GEMINI_API_KEY: NOT SET"

**Fix**:
1. Verify secret exists: `gcloud secrets list | grep gemini`
2. Verify secret has value: `gcloud secrets versions access latest --secret="gemini-api-key"`
3. Check Cloud Run config: Click "YAML" tab, look for `env:` section
4. Redeploy: Run Step 2 again

---

## 🎯 Quick Summary

1. **Terminal**: Create secret + grant permissions (Step 1)
2. **Terminal**: Update Cloud Run service (Step 2 Option B - easiest!)
3. **Console**: Check new revision appears (Step 3 Check 1)
4. **Console**: Check logs show injection worked (Step 3 Check 2)
5. **Browser**: Test app works (Step 3 Check 3)

---

**Start with Step 1 (terminal), then Step 2 Option B (terminal) - it's the fastest!** 🚀

# Diagnose: window.__ENV__ is undefined

## 🔍 Step-by-Step Diagnosis

### Step 1: Check Cloud Run Logs

**In Cloud Console**:
1. Go to Cloud Run → munchmatch-v1
2. Click **"Observability"** tab
3. Click **"Logs"**
4. **Look for** these messages:

**✅ Good Signs**:
```
🚀 Starting container...
📝 Running env injection script...
🔧 Injecting environment variables...
✅ Found index.html, size: XXXX bytes
✅ Injected before </head>
✅ Environment variables injected successfully
✅ Verified: window.__ENV__ found in HTML
✅ GEMINI_API_KEY: Set (AIzaSyDbLv...)
```

**❌ Bad Signs**:
```
❌ index.html not found
❌ GEMINI_API_KEY: NOT SET
❌ ERROR: window.__ENV__ NOT found in HTML after injection!
```

### Step 2: Check if Secret is Configured

**In Cloud Console**:
1. On current screen, click **"YAML" tab**
2. **Search for**: `env:` or `GEMINI_API_KEY`
3. **Should see**:
   ```yaml
   env:
   - name: GEMINI_API_KEY
     valueFrom:
       secretKeyRef:
         key: latest
         name: gemini-api-key
   ```

**If NOT there**: Secret isn't configured → Run terminal commands below

### Step 3: Check HTML Source

1. **Open app**: `https://munchmatch-v1-872747958244.us-west1.run.app`
2. **Right-click** → **"View Page Source"** (or Ctrl+U)
3. **Search for**: `window.__ENV__`
4. **Should see**: `<script>window.__ENV__ = {"GEMINI_API_KEY":"AIzaSy..."};</script>`

**If NOT there**: Injection script didn't run or failed

---

## 🚀 Quick Fix Commands

### Fix 1: Ensure Secret is Configured

```bash
# Update Cloud Run service to use secret
gcloud run services update munchmatch-v1 \
  --region us-west1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

### Fix 2: Verify Secret Exists

```bash
# Check secret exists
gcloud secrets list | grep gemini-api-key

# Check secret value
gcloud secrets versions access latest --secret="gemini-api-key"

# Should output: AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4
```

### Fix 3: Redeploy with Updated Code

The injection script has been improved. Commit and push:

```bash
git add scripts/inject-env.js Dockerfile
git commit -m "Fix window.__ENV__ injection with better error handling"
git push origin v2
```

Wait 2-3 minutes for build and deployment.

---

## 🔍 What to Look For in Logs

### Scenario 1: Script Not Running
**Logs show**: Nothing about "Starting container" or "inject"
**Fix**: Dockerfile entrypoint issue - verify Dockerfile was updated

### Scenario 2: Env Var Not Available
**Logs show**: `GEMINI_API_KEY present: false` or `GEMINI_API_KEY: NOT SET`
**Fix**: 
1. Secret not configured in Cloud Run → Run Fix 1
2. Secret doesn't exist → Create it
3. No permissions → Grant access

### Scenario 3: HTML Not Found
**Logs show**: `❌ index.html not found`
**Fix**: Build issue - check Dockerfile copies dist/ correctly

### Scenario 4: Injection Failed
**Logs show**: `❌ ERROR: window.__ENV__ NOT found in HTML after injection!`
**Fix**: HTML structure issue - improved script should handle this

---

## 🎯 Most Likely Issue

**The secret isn't configured in Cloud Run**, so `process.env.GEMINI_API_KEY` is empty.

**Quick Fix**:
```bash
gcloud run services update munchmatch-v1 \
  --region us-west1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

Then wait 1-2 minutes and check logs again.

---

## ✅ Verification Steps

After running fixes:

1. **Check logs** - Should see injection success messages
2. **Check HTML source** - Should see `window.__ENV__` script tag
3. **Check browser console** - `window.__ENV__` should be defined
4. **Test app** - Should work without "API key not set" error

---

**Start by checking the logs in Cloud Console to see what's happening!** 🔍

# Fix: window.__ENV__ is undefined

## 🔍 Problem
`window.__ENV__` is undefined - the injection script isn't working properly.

## ✅ Solution: Improved Injection Script

I've updated the injection script to be more robust. The issue is likely:
1. Script isn't running
2. HTML path is wrong
3. Script runs but injection fails silently

---

## 🚀 Quick Fix

### Step 1: Commit Updated Files

The injection script has been improved. Commit and push:

```bash
git add scripts/inject-env.js Dockerfile
git commit -m "Fix window.__ENV__ injection - improved error handling"
git push origin v2
```

### Step 2: Wait for Build & Deploy

Cloud Build will automatically:
1. Build new Docker image
2. Deploy to Cloud Run
3. Run improved injection script

### Step 3: Check Logs

After deployment (wait 2-3 minutes), check logs:

**Via Cloud Console**:
1. Go to Cloud Run → munchmatch-v1
2. Click "Observability" → "Logs"
3. Look for:
   - `🚀 Starting container...`
   - `📝 Running env injection script...`
   - `✅ Found index.html`
   - `✅ Environment variables injected successfully`
   - `✅ Verified: window.__ENV__ found in HTML`

**Via Terminal** (if gcloud is installed):
```bash
gcloud run services logs read munchmatch-v1 --region us-west1 --limit=50
```

### Step 4: Test Again

1. Open app: `https://munchmatch-v1-872747958244.us-west1.run.app`
2. Open browser console (F12)
3. Type: `window.__ENV__`
4. Should see: `{GEMINI_API_KEY: "AIzaSy..."}`

---

## 🔍 Debugging: Check What's Happening

### Check 1: Is Script Running?

Look in logs for:
- `🚀 Starting container...` ✅ Script started
- `📝 Running env injection script...` ✅ Script executing
- `✅ Found index.html` ✅ HTML file found
- `❌ index.html not found` ❌ Problem!

### Check 2: Is Env Var Available?

Look in logs for:
- `GEMINI_API_KEY present: true` ✅ Env var available
- `GEMINI_API_KEY present: false` ❌ Env var NOT available

### Check 3: Is Injection Working?

Look in logs for:
- `✅ Verified: window.__ENV__ found in HTML` ✅ Injection worked
- `❌ ERROR: window.__ENV__ NOT found` ❌ Injection failed

---

## 🚨 If Still Not Working

### Issue: Script Not Running

**Check**: Look for `🚀 Starting container...` in logs
- **If missing**: Dockerfile entrypoint issue
- **Fix**: Verify Dockerfile was updated and rebuilt

### Issue: Env Var Not Available

**Check**: Look for `GEMINI_API_KEY present: false` in logs
- **Fix**: 
  1. Verify secret exists: `gcloud secrets list | grep gemini`
  2. Update Cloud Run: `gcloud run services update munchmatch-v1 --region us-west1 --update-secrets GEMINI_API_KEY=gemini-api-key:latest`

### Issue: HTML Not Found

**Check**: Look for `❌ index.html not found` in logs
- **Fix**: Build issue - check Dockerfile copies dist/ correctly

### Issue: Injection Fails

**Check**: Look for `❌ ERROR: window.__ENV__ NOT found`
- **Fix**: HTML structure issue - script will try multiple insertion points

---

## 🎯 Alternative: Direct HTML Check

After deployment, check the HTML source:

1. Open app URL
2. Right-click → "View Page Source"
3. Search for: `window.__ENV__`
4. Should see: `<script>window.__ENV__ = {"GEMINI_API_KEY":"AIzaSy..."};</script>`

If you see it in source but not in console:
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check browser console for JavaScript errors

---

## 📋 What Changed

1. **Better error handling** - Script won't fail silently
2. **Multiple insertion points** - Tries </head>, </body>, or <body>
3. **Verification** - Checks if injection actually worked
4. **Better logging** - Shows exactly what's happening
5. **Exit on error** - Container won't start if injection fails

---

**Commit and push the updated files, then check logs to see what's happening!** 🚀

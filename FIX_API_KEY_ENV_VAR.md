# ✅ Fix: API_KEY vs GEMINI_API_KEY Mismatch

## 🔍 Problem Found

Your Cloud Run YAML shows:
```yaml
env:
- name: API_KEY
  value: AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4
```

But the injection script was only looking for `GEMINI_API_KEY`.

## ✅ Solution Applied

I've updated `scripts/inject-env.js` to:
1. **Check for both** `GEMINI_API_KEY` and `API_KEY`
2. **Prefer** `GEMINI_API_KEY` if available
3. **Fallback** to `API_KEY` if `GEMINI_API_KEY` is missing
4. **Inject** as `GEMINI_API_KEY` in `window.__ENV__` (so your code works)

---

## 🚀 Next Steps

### Step 1: Commit & Push

```bash
git add scripts/inject-env.js
git commit -m "Fix: Support both API_KEY and GEMINI_API_KEY env vars"
git push origin v2
```

### Step 2: Wait for Deployment

Cloud Build will automatically rebuild and deploy (2-3 minutes).

### Step 3: Verify

After deployment:

1. **Check logs** - Should see:
   ```
   Using API key from: API_KEY
   ✅ GEMINI_API_KEY: Set (AIzaSyDbLv...)
   ✅ Verified: window.__ENV__ found in HTML
   ```

2. **Test app** - Open browser console:
   ```javascript
   window.__ENV__
   // Should show: {GEMINI_API_KEY: "AIzaSy..."}
   ```

3. **Test functionality** - App should work without "API key not set" errors.

---

## 🎯 Alternative: Update Cloud Run to Use GEMINI_API_KEY

If you prefer to use `GEMINI_API_KEY` instead of `API_KEY`:

**Option A: Via Console**
1. Cloud Run → munchmatch-v1 → Edit & Deploy New Revision
2. Variables & Secrets → Edit
3. Change `API_KEY` to `GEMINI_API_KEY`
4. Deploy

**Option B: Via Terminal**
```bash
gcloud run services update munchmatch-v1 \
  --region us-west1 \
  --set-env-vars GEMINI_API_KEY=AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4 \
  --remove-env-vars API_KEY
```

**But the fix I applied works with your current setup**, so you don't need to change Cloud Run! 🎉

---

## 📋 What Changed

**Before**:
```javascript
const envVars = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};
```

**After**:
```javascript
// Check for GEMINI_API_KEY first, then fallback to API_KEY
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const envVars = {
  GEMINI_API_KEY: apiKey,
};
```

This ensures `window.__ENV__.GEMINI_API_KEY` is always set, regardless of which env var Cloud Run provides.

---

**Commit and push - this should fix the issue!** 🚀

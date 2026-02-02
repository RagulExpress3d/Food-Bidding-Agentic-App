# Cloud Run Deployment - Environment Variables Method

**Status**: ✅ **Simplified Approach** - Direct environment variables in Cloud Run UI

---

## 🎯 Overview

This guide uses **direct environment variables** in Cloud Run UI (simpler than Secret Manager). The code already supports this method.

---

## ✅ What You Need to Do

### In Cloud Run "Create Service" UI:

1. **Go to "Variables & Secrets" tab**
2. **Add ONE environment variable:**
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key (e.g., `AIzaSyAPrRW2u3gs2Wn-sdZEJVn9-4Tcu2utEMA`)

**That's it!** No Secret Manager setup needed.

---

## ⚠️ Important Notes

### Remove Duplicates

In your screenshot, you have **3 variables**:
- ❌ `VITE_GEMINI_API_KEY` - Not needed (Vite prefix only for local dev)
- ✅ `GEMINI_API_KEY` - **Use this one**
- ❌ `gemini_api_key` - Wrong case, remove it

**Keep only**: `GEMINI_API_KEY`

### Why Only One?

- `VITE_GEMINI_API_KEY`: Only needed for local Vite dev server (`npm run dev`)
- `GEMINI_API_KEY`: Standard name, works everywhere
- `gemini_api_key`: Wrong case, won't work

---

## 🔧 How It Works

```
Cloud Run Container Starts
  ↓
inject-env.js runs (reads process.env.GEMINI_API_KEY)
  ↓
Injects into HTML: window.__ENV__ = { GEMINI_API_KEY: "..." }
  ↓
React app loads → utils/apiKey.ts reads window.__ENV__
  ↓
App works! ✅
```

---

## 📋 Step-by-Step in Cloud Run UI

1. **Service Name**: `munchmatch` (or your choice)
2. **Container Port**: `8080`
3. **Variables & Secrets Tab**:
   - Click "+ Add variable"
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your API key
   - **Remove** any other `VITE_*` or duplicate variables
4. **Click "Create"**

---

## 🔒 Security Considerations

### Environment Variables vs Secret Manager

**Environment Variables (Current Method)**:
- ✅ Simpler setup
- ✅ Works immediately
- ⚠️ Visible in Cloud Run console (but only to project admins)
- ⚠️ Not encrypted at rest (but Cloud Run encrypts in transit)

**Secret Manager (More Secure)**:
- ✅ Encrypted at rest
- ✅ Access-controlled via IAM
- ✅ Audit logging
- ⚠️ Requires additional setup

**Recommendation**: 
- **For MVP/Development**: Environment variables are fine
- **For Production**: Consider Secret Manager for better security

---

## ✅ Verification

After deployment:

1. **Check Cloud Run logs**:
   ```bash
   gcloud run services logs read munchmatch --region us-central1 --limit 50
   ```

2. **Look for**:
   ```
   ✅ GEMINI_API_KEY: Set
   ✅ Environment variables injected successfully
   ```

3. **Test the app**: Generate a bid to verify API calls work

---

## 🐛 Troubleshooting

### Issue: API key not found

**Check**:
1. Variable name is exactly `GEMINI_API_KEY` (case-sensitive)
2. No extra spaces in name or value
3. Value is your actual API key (not placeholder)

**Debug**:
```bash
# Check logs
gcloud run services logs read munchmatch --region us-central1

# Look for: "❌ GEMINI_API_KEY: NOT SET"
```

### Issue: Multiple variables causing confusion

**Solution**: Remove all except `GEMINI_API_KEY`

---

## 📝 Summary

**What to set in Cloud Run UI:**
- ✅ **One variable**: `GEMINI_API_KEY` = your API key

**What NOT to set:**
- ❌ `VITE_GEMINI_API_KEY` (only for local dev)
- ❌ `gemini_api_key` (wrong case)
- ❌ Any duplicates

**Code**: Already supports this - no changes needed! ✅

---

## 🚀 Quick Deploy Command (Alternative)

If you prefer CLI instead of UI:

```bash
gcloud run deploy munchmatch \
  --image gcr.io/PROJECT_ID/munchmatch \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your-api-key-here" \
  --port 8080
```

**Note**: Replace `your-api-key-here` with your actual key.

---

**Status**: ✅ **READY** - Your code already supports this method!

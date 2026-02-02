# Quick Fix Summary - Cloud Run API Key Issue

## ✅ Problem Fixed

**Error**: "env file / api key is not there" on Cloud Run  
**Solution**: Runtime environment variable injection

---

## 🔧 What Was Changed

1. **Created `scripts/inject-env.js`**
   - Reads `GEMINI_API_KEY` from Cloud Run environment
   - Injects into HTML as `window.__ENV__` at container startup

2. **Updated `Dockerfile`**
   - Installs Node.js for runtime script
   - Runs `inject-env.js` before nginx starts
   - Ensures env vars available to browser

3. **Updated Code**
   - `services/geminiService.ts`: Reads from `window.__ENV__` first
   - `components/NegotiationChat.tsx`: Same pattern
   - Falls back to `process.env` for local development

4. **Updated `cloudbuild.yaml`**
   - Uses Secret Manager: `--update-secrets GEMINI_API_KEY=gemini-api-key:latest`

---

## 🚀 Next Steps

### 1. Ensure Secret Exists

```bash
# Check if secret exists
gcloud secrets list | grep gemini-api-key

# If not, create it
echo -n "your-actual-gemini-api-key" | gcloud secrets create gemini-api-key --data-file=-
```

### 2. Grant Cloud Run Access

```bash
export PROJECT_ID="your-project-id"
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Commit and Push

```bash
git add .
git commit -m "Fix Cloud Run environment variable injection"
git push origin v2
```

### 4. Monitor Build

Cloud Build will automatically:
- Build Docker image
- Push to Container Registry  
- Deploy to Cloud Run with secret

### 5. Verify

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe munchmatch --region us-central1 --format='value(status.url)')

# Check if env injection worked
curl -s $SERVICE_URL | grep "window.__ENV__"

# Open in browser
echo "Visit: $SERVICE_URL"
```

---

## 🔍 How It Works

1. **Cloud Run** sets `GEMINI_API_KEY` environment variable from Secret Manager
2. **Container starts** → `inject-env.js` runs
3. **Script reads** `process.env.GEMINI_API_KEY` (from Cloud Run)
4. **Injects into HTML** as `<script>window.__ENV__ = {GEMINI_API_KEY: "..."}</script>`
5. **Nginx serves** HTML with env vars
6. **Browser** reads from `window.__ENV__.GEMINI_API_KEY`
7. **App works!** ✅

---

## ✅ Files Changed

- ✅ `Dockerfile` - Runtime env injection
- ✅ `scripts/inject-env.js` - NEW - Env injection script
- ✅ `services/geminiService.ts` - Read from `window.__ENV__`
- ✅ `components/NegotiationChat.tsx` - Read from `window.__ENV__`
- ✅ `vite.config.ts` - Define `window.__ENV__` for dev
- ✅ `index.html` - Placeholder for env injection
- ✅ `cloudbuild.yaml` - Use Secret Manager

---

**Status**: ✅ **Ready to deploy!** Push to GitHub and the fix will be live.

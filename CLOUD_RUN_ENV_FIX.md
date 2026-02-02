# Cloud Run Environment Variable Fix

## ✅ Problem Fixed

**Issue**: App showing "env file / api key is not there" error on Cloud Run  
**Root Cause**: `process.env` is not available in browser runtime - only at build time  
**Solution**: Runtime environment variable injection via `window.__ENV__`

---

## 🔧 Changes Made

### 1. Runtime Env Injection Script (`scripts/inject-env.js`)
- Reads `GEMINI_API_KEY` from Cloud Run environment
- Injects into HTML as `window.__ENV__` before nginx serves files
- Runs on container startup

### 2. Updated Dockerfile
- Installs Node.js for runtime script execution
- Runs `inject-env.js` before starting nginx
- Ensures env vars are available to browser

### 3. Updated Code to Read from `window.__ENV__`
- `services/geminiService.ts`: Reads from `window.__ENV__` first, falls back to `process.env`
- `components/NegotiationChat.tsx`: Same pattern
- `vite.config.ts`: Defines `window.__ENV__` for development

### 4. Updated cloudbuild.yaml
- Uses Secret Manager for `GEMINI_API_KEY`
- Passes secret as environment variable to Cloud Run

---

## 🚀 Deployment Steps

### Step 1: Ensure Secret Exists

```bash
# Check if secret exists
gcloud secrets list | grep gemini-api-key

# If not, create it
echo -n "your-gemini-api-key" | gcloud secrets create gemini-api-key --data-file=-
```

### Step 2: Grant Cloud Run Access

```bash
export PROJECT_ID="your-project-id"
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Grant Cloud Run service account access
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Step 3: Commit and Push

```bash
git add Dockerfile scripts/inject-env.js cloudbuild.yaml \
  services/geminiService.ts components/NegotiationChat.tsx vite.config.ts index.html

git commit -m "Fix Cloud Run environment variable injection"
git push origin v2
```

### Step 4: Monitor Build

```bash
# Watch build logs
gcloud builds list --limit=1 --format="table(id,status,createTime)"

# View latest build logs
gcloud builds log $(gcloud builds list --limit=1 --format="value(id)")
```

### Step 5: Verify Deployment

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe munchmatch --region us-central1 --format='value(status.url)')

# Check if env injection worked (should see window.__ENV__ in HTML)
curl $SERVICE_URL | grep -o "window.__ENV__"

# Test the app
echo "Visit: $SERVICE_URL"
```

---

## 🔍 Troubleshooting

### Issue: "GEMINI_API_KEY is not set" error

**Check 1**: Verify secret exists and is accessible
```bash
gcloud secrets versions access latest --secret="gemini-api-key"
```

**Check 2**: Verify Cloud Run service has secret
```bash
gcloud run services describe munchmatch --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

**Check 3**: Check container logs for injection script
```bash
gcloud run services logs read munchmatch --region us-central1 --limit=50 | grep -i "inject\|env"
```

**Check 4**: Verify HTML has `window.__ENV__`
```bash
SERVICE_URL=$(gcloud run services describe munchmatch --region us-central1 --format='value(status.url)')
curl $SERVICE_URL | grep "window.__ENV__"
```

### Issue: Build fails

**Check**: Ensure all files are committed
```bash
git status
git add -A
git commit -m "Fix env vars"
git push
```

### Issue: Secret not accessible

**Fix**: Grant proper permissions
```bash
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Cloud Run service account
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Cloud Build service account (if needed)
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 📊 How It Works

1. **Build Time** (Vite):
   - Vite reads `.env` file
   - Injects into code as `process.env.GEMINI_API_KEY`
   - Also defines `window.__ENV__` for dev

2. **Runtime** (Cloud Run):
   - Container starts
   - `inject-env.js` reads `GEMINI_API_KEY` from environment
   - Injects into HTML as `<script>window.__ENV__ = {...}</script>`
   - Nginx serves HTML with env vars

3. **Browser**:
   - App reads from `window.__ENV__.GEMINI_API_KEY`
   - Falls back to `process.env.GEMINI_API_KEY` (dev only)
   - Uses API key for Gemini calls

---

## ✅ Verification Checklist

- [ ] Secret `gemini-api-key` exists in Secret Manager
- [ ] Cloud Run service account has secret access
- [ ] `cloudbuild.yaml` uses `--update-secrets`
- [ ] `Dockerfile` runs `inject-env.js` on startup
- [ ] Code reads from `window.__ENV__`
- [ ] HTML contains `window.__ENV__` script tag
- [ ] App works without "API key not set" error

---

## 🎯 Quick Test

After deployment, test the app:

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe munchmatch --region us-central1 --format='value(status.url)')

# Open in browser
echo "Open: $SERVICE_URL"

# Or test API key injection
curl -s $SERVICE_URL | grep -o 'GEMINI_API_KEY":"[^"]*' | head -1
```

---

**Status**: ✅ **Fixed!** Push to GitHub and Cloud Build will deploy with proper env var injection.

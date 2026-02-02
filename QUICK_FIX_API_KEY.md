# 🚨 QUICK FIX: API Key Not Valid

## Your API Key (from .env)
```
AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4
```

---

## ✅ IMMEDIATE FIX (Run These Commands)

### Step 1: Set Your Project ID
```bash
# Replace with your actual GCP project ID
export PROJECT_ID="your-gcp-project-id"
```

### Step 2: Create/Update Secret with Your API Key
```bash
# Create or update the secret
echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets create gemini-api-key --data-file=- 2>/dev/null || \
  echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets versions add gemini-api-key --data-file=-
```

### Step 3: Grant Cloud Run Access
```bash
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Step 4: Update Cloud Run Service
```bash
gcloud run services update munchmatch \
  --region us-central1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

### Step 5: Verify
```bash
# Check secret value
gcloud secrets versions access latest --secret="gemini-api-key"

# Check Cloud Run logs (wait 30 seconds after Step 4)
gcloud run services logs read munchmatch --region us-central1 --limit=20 | grep -i "inject\|env"
```

---

## 🔍 If Still Not Working

### Check What's Wrong

```bash
# 1. Verify secret exists
gcloud secrets describe gemini-api-key

# 2. Verify secret value
gcloud secrets versions access latest --secret="gemini-api-key"

# 3. Check Cloud Run config
gcloud run services describe munchmatch --region us-central1 \
  --format="yaml(spec.template.spec.containers[0].env)"

# 4. Check logs for errors
gcloud run services logs read munchmatch --region us-central1 --limit=50
```

### Common Issues

1. **Secret doesn't exist** → Run Step 2
2. **Wrong API key** → Update secret with correct key (Step 2)
3. **No permissions** → Run Step 3
4. **Cloud Run not updated** → Run Step 4, then wait 1-2 minutes

---

## 🎯 One-Line Fix (If You Know Your Project ID)

```bash
export PROJECT_ID="YOUR_PROJECT_ID" && \
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)') && \
echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | gcloud secrets create gemini-api-key --data-file=- 2>/dev/null || echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | gcloud secrets versions add gemini-api-key --data-file=- && \
gcloud secrets add-iam-policy-binding gemini-api-key --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --quiet && \
gcloud run services update munchmatch --region us-central1 --update-secrets GEMINI_API_KEY=gemini-api-key:latest --quiet && \
echo "✅ Done! Check logs: gcloud run services logs read munchmatch --region us-central1 --limit=20"
```

---

**Run Steps 1-4 above to fix immediately!** 🚀

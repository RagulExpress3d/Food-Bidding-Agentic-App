# Managing GCP from Cursor IDE

## 🎯 Quick Commands (Run in Cursor Terminal)

### View Build Status
```bash
# Latest builds
gcloud builds list --limit=5

# Specific build logs
gcloud builds log BUILD_ID
```

### Deploy Manually
```bash
# Deploy from current directory
gcloud builds submit --config cloudbuild.yaml

# Or direct deploy
gcloud run deploy munchmatch \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### View Cloud Run Service
```bash
# List services
gcloud run services list

# Get service URL
gcloud run services describe munchmatch --region us-central1 --format='value(status.url)'

# View logs
gcloud run services logs tail munchmatch --region us-central1
```

### Update Secrets
```bash
# Update Gemini API key
echo -n "new-api-key" | gcloud secrets versions add gemini-api-key --data-file=-

# Update Cloud Run to use new secret version
gcloud run services update munchmatch \
  --region us-central1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

---

## 🔌 Cursor Extensions

### Recommended Extensions

1. **Google Cloud Code** (Official)
   - View GCP resources
   - Deploy from IDE
   - View logs
   - Install: Extensions → Search "Google Cloud Code"

2. **gcloud CLI** (Terminal)
   - Already installed if you have gcloud CLI
   - Use terminal commands above

---

## 📋 Common Workflows

### Workflow 1: Deploy After Code Changes
```bash
# 1. Make changes
# 2. Commit and push
git add .
git commit -m "Your changes"
git push origin main

# 3. Cloud Build automatically triggers
# 4. Monitor build
gcloud builds list --limit=1 --format="table(id,status,createTime)"
```

### Workflow 2: Manual Deploy
```bash
# Build and deploy manually
gcloud builds submit --config cloudbuild.yaml
```

### Workflow 3: View Logs
```bash
# Stream Cloud Run logs
gcloud run services logs tail munchmatch --region us-central1 --follow
```

### Workflow 4: Rollback
```bash
# List revisions
gcloud run revisions list --service munchmatch --region us-central1

# Rollback to previous revision
gcloud run services update-traffic munchmatch \
  --region us-central1 \
  --to-revisions REVISION_NAME=100
```

---

## 🔍 Debugging

### Build Fails
```bash
# View build logs
gcloud builds log BUILD_ID

# Check build configuration
cat cloudbuild.yaml

# Test Docker build locally
docker build -t test .
```

### Service Not Responding
```bash
# Check service status
gcloud run services describe munchmatch --region us-central1

# Check logs for errors
gcloud run services logs read munchmatch --region us-central1 --limit=50

# Test health endpoint
curl $(gcloud run services describe munchmatch --region us-central1 --format='value(status.url)')/health
```

### API Key Issues
```bash
# Verify secret exists
gcloud secrets list | grep gemini

# Check secret permissions
gcloud secrets get-iam-policy gemini-api-key

# Test secret access
gcloud secrets versions access latest --secret="gemini-api-key"
```

---

## 📊 Monitoring Dashboard

### View in Browser
1. **Cloud Build**: https://console.cloud.google.com/cloud-build/builds
2. **Cloud Run**: https://console.cloud.google.com/run
3. **Logs**: https://console.cloud.google.com/logs

### Quick Links (Replace PROJECT_ID)
- Builds: `https://console.cloud.google.com/cloud-build/builds?project=PROJECT_ID`
- Services: `https://console.cloud.google.com/run?project=PROJECT_ID`
- Logs: `https://console.cloud.google.com/logs/query?project=PROJECT_ID`

---

## ✅ Checklist Before Deploy

- [ ] Dockerfile exists in repo root
- [ ] cloudbuild.yaml exists in repo root
- [ ] nginx.conf exists in repo root
- [ ] .dockerignore configured
- [ ] GEMINI_API_KEY stored in Secret Manager
- [ ] Cloud Build trigger configured
- [ ] Cloud Run service has secret access
- [ ] Tested build locally (`docker build -t test .`)

---

## 🚀 Quick Start

```bash
# 1. Set project
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# 2. Enable APIs (one-time)
gcloud services enable cloudbuild.googleapis.com run.googleapis.com

# 3. Create secret (one-time)
echo -n "your-api-key" | gcloud secrets create gemini-api-key --data-file=-

# 4. Deploy
gcloud builds submit --config cloudbuild.yaml

# 5. Get URL
gcloud run services describe munchmatch --region us-central1 --format='value(status.url)'
```

---

**All set!** You can now manage GCP deployments directly from Cursor. 🎉

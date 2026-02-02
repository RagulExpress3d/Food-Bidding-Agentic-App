# GCP Cloud Run Setup Guide

## 🚀 Quick Setup

### Prerequisites
- GCP account with billing enabled
- `gcloud` CLI installed and authenticated
- GitHub repository connected to GCP

---

## Step 1: Set Up GCP Project

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

---

## Step 2: Store Gemini API Key in Secret Manager

```bash
# Create secret
echo -n "your-gemini-api-key" | gcloud secrets create gemini-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Grant Cloud Build access to secret
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Step 3: Update cloudbuild.yaml with Secret

Edit `cloudbuild.yaml` and update the substitution:

```yaml
substitutions:
  _GEMINI_API_KEY: 'projects/$PROJECT_ID/secrets/gemini-api-key/versions/latest'
```

Then update the deploy step to use Secret Manager:

```yaml
- name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
  entrypoint: gcloud
  args:
    - 'run'
    - 'deploy'
    - 'munchmatch'
    - '--image'
    - 'gcr.io/$PROJECT_ID/munchmatch:$SHORT_SHA'
    - '--region'
    - 'us-central1'
    - '--platform'
    - 'managed'
    - '--allow-unauthenticated'
    - '--port'
    - '8080'
    - '--update-secrets'
    - 'GEMINI_API_KEY=gemini-api-key:latest'
```

---

## Step 4: Connect GitHub to Cloud Build

### Option A: Via GCP Console

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click "Create Trigger"
3. Connect your GitHub repository
4. Configure trigger:
   - **Name**: `deploy-on-push`
   - **Event**: Push to a branch
   - **Branch**: `^main$` (or your main branch)
   - **Configuration**: Cloud Build configuration file
   - **Location**: Repository root
   - **Cloud Build configuration file**: `cloudbuild.yaml`

### Option B: Via gcloud CLI

```bash
gcloud builds triggers create github \
  --name="deploy-on-push" \
  --repo-name="Food-Bidding-Agentic-App" \
  --repo-owner="RagulExpress3d" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml"
```

---

## Step 5: Test Build Locally

```bash
# Build Docker image locally
docker build -t munchmatch:local .

# Test locally
docker run -p 8080:8080 -e GEMINI_API_KEY="your-key" munchmatch:local

# Visit http://localhost:8080
```

---

## Step 6: Manual Build & Deploy

```bash
# Submit build
gcloud builds submit --config cloudbuild.yaml

# Or deploy directly
gcloud run deploy munchmatch \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

---

## 🔧 Managing from Cursor IDE

### Option 1: gcloud CLI Extension

Install the **Google Cloud Code** extension in Cursor:
- Provides GCP integration
- View Cloud Run services
- View build logs
- Deploy from IDE

### Option 2: Terminal Commands

```bash
# View build history
gcloud builds list --limit=10

# View build logs
gcloud builds log BUILD_ID

# View Cloud Run services
gcloud run services list

# View service logs
gcloud run services logs read munchmatch --region us-central1

# Update service
gcloud run services update munchmatch \
  --region us-central1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

### Option 3: GitHub Actions (Alternative)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - id: 'auth'
        uses: 'google-github-actions/auth@v1'
        with:
          credentials_json: '${{ secrets.GCP_SA_KEY }}'
      
      - name: 'Set up Cloud SDK'
        uses: 'google-github-actions/setup-gcloud@v1'
      
      - name: 'Submit to Cloud Build'
        run: |
          gcloud builds submit --config cloudbuild.yaml
```

---

## 📊 Monitoring & Debugging

### View Build Logs
```bash
# Latest build
gcloud builds list --limit=1

# Specific build logs
gcloud builds log BUILD_ID
```

### View Cloud Run Logs
```bash
# Stream logs
gcloud run services logs tail munchmatch --region us-central1

# View recent logs
gcloud run services logs read munchmatch --region us-central1 --limit=50
```

### Check Service Status
```bash
# Get service URL
gcloud run services describe munchmatch --region us-central1 --format='value(status.url)'

# Test health endpoint
curl https://your-service-url/health
```

---

## 🔐 Environment Variables

### Using Secret Manager (Recommended)

```bash
# Create secret
gcloud secrets create gemini-api-key --data-file=- <<< "your-api-key"

# Grant access
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:SERVICE_ACCOUNT@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Using Environment Variables (Not Recommended for Secrets)

```bash
gcloud run services update munchmatch \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=your-key-here
```

---

## 🎯 Troubleshooting

### Build Fails: Dockerfile Not Found
- ✅ **Fixed**: Dockerfile now exists in repo root
- Ensure `cloudbuild.yaml` is in repo root
- Check `.dockerignore` doesn't exclude Dockerfile

### Build Fails: npm install errors
- Check Node.js version in Dockerfile (currently 20-alpine)
- Verify `package.json` is correct
- Check for dependency conflicts

### Deployment Fails: Port Issues
- Cloud Run uses port 8080 (configured in nginx.conf)
- Ensure Dockerfile exposes 8080
- Check Cloud Run service port configuration

### App Doesn't Load: SPA Routing
- ✅ **Fixed**: nginx.conf includes `try_files` for SPA routing
- Verify nginx.conf is copied to container

### API Key Not Working
- Check Secret Manager permissions
- Verify secret name matches cloudbuild.yaml
- Check Cloud Run service has secret access

---

## 📝 Files Created

1. **Dockerfile** - Multi-stage build for Vite React app
2. **nginx.conf** - Nginx configuration for SPA
3. **cloudbuild.yaml** - GCP Cloud Build configuration
4. **.dockerignore** - Exclude unnecessary files from Docker build

---

## ✅ Next Steps

1. **Commit files to GitHub**:
   ```bash
   git add Dockerfile nginx.conf cloudbuild.yaml .dockerignore
   git commit -m "Add GCP Cloud Run deployment configuration"
   git push origin main
   ```

2. **Set up Cloud Build trigger** (if not done via console)

3. **Test deployment**:
   - Push to main branch
   - Monitor build in Cloud Build console
   - Check Cloud Run service URL

4. **Update Secret Manager** with your actual Gemini API key

---

## 🔗 Useful Links

- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Cloud Code Extension](https://cloud.google.com/code/docs/vscode/install)

---

**Status**: ✅ Ready to deploy! Push to GitHub and Cloud Build will automatically build and deploy.

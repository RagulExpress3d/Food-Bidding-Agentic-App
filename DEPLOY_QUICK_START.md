# Quick Start: Cloud Run Deployment

## What You Need to Do Where

### ✅ GCP Terminal (gcloud CLI) - Required Steps

These steps **must** be done in GCP terminal:

#### 1. Enable APIs
```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com
```

#### 2. Create Secret for API Key
```bash
# Replace YOUR_GEMINI_API_KEY_HERE with your actual API key
echo -n "YOUR_GEMINI_API_KEY_HERE" | \
  gcloud secrets create gemini-api-key --data-file=-

# Grant Cloud Run service account access
export PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### 3. Verify Setup (Optional)
```bash
# Check if secret exists
gcloud secrets list | grep gemini-api-key

# Check your project ID
gcloud config get-value project
```

---

### 🌐 Cloud Console UI - One-Time Setup

These steps are done in **Google Cloud Console** (web interface):

#### 1. Connect GitHub Repository
1. Go to: https://console.cloud.google.com/cloud-build/triggers
2. Click **"Connect Repository"**
3. Select **"GitHub (Cloud Build GitHub App)"**
4. Authenticate with GitHub
5. Select repository: `RagulExpress3d/Food-Bidding-Agentic-App`
6. Click **"Connect"**

#### 2. Create Build Trigger
1. Still in Cloud Build → Triggers
2. Click **"Create Trigger"**
3. Fill in:
   - **Name**: `munchmatch-deploy`
   - **Event**: `Push to a branch`
   - **Branch**: `^main$` (or your branch name)
   - **Configuration**: `Cloud Build configuration file`
   - **Location**: `Repository root`
   - **Cloud Build configuration file**: `cloudbuild.yaml`
4. Click **"Create"**

---

### 📝 GitHub - Commit & Push

After setup, just push to GitHub:

```bash
# In your local terminal (not GCP terminal)
git add .
git commit -m "Setup Cloud Run deployment"
git push origin main
```

Cloud Build will **automatically**:
- Detect the push
- Build the Docker image
- Deploy to Cloud Run

---

## Complete Step-by-Step Flow

### Step 1: GCP Terminal - One-Time Setup (5 minutes)

```bash
# 1. Set your project (if not already set)
gcloud config set project YOUR_PROJECT_ID

# 2. Enable APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com

# 3. Create secret (replace with your actual API key)
echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets create gemini-api-key --data-file=-

# 4. Grant permissions
export PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Step 2: Cloud Console UI - Connect GitHub (2 minutes)

1. Open: https://console.cloud.google.com/cloud-build/triggers
2. Click **"Connect Repository"**
3. Choose **"GitHub (Cloud Build GitHub App)"**
4. Authenticate → Select `Food-Bidding-Agentic-App` → **Connect**

### Step 3: Cloud Console UI - Create Trigger (2 minutes)

1. Click **"Create Trigger"**
2. Configure:
   - Name: `munchmatch-deploy`
   - Event: `Push to a branch`
   - Branch: `^main$`
   - Config file: `cloudbuild.yaml`
3. Click **"Create"**

### Step 4: GitHub - Push Code (1 minute)

```bash
# In your local terminal
git add cloudbuild.yaml DEPLOY.md
git commit -m "Add Cloud Run deployment config"
git push origin main
```

### Step 5: Monitor Deployment

- **Cloud Console**: Go to Cloud Build → History
- **Watch**: Build progress and deployment
- **Get URL**: Cloud Run → Services → munchmatch → Copy URL

---

## Summary: What Goes Where?

| Step | Where | When |
|------|-------|------|
| Enable APIs | **GCP Terminal** | One-time |
| Create Secret | **GCP Terminal** | One-time |
| Connect GitHub | **Cloud Console UI** | One-time |
| Create Trigger | **Cloud Console UI** | One-time |
| Push Code | **Local Terminal** | Every deployment |
| Monitor Build | **Cloud Console UI** | Every deployment |

---

## Troubleshooting

### "Permission denied" error
- Run the secret permission command again in GCP terminal

### "Repository not found"
- Make sure you connected the repository in Cloud Console
- Check repository name matches exactly

### Build fails
- Check Cloud Build logs in Cloud Console
- Verify `cloudbuild.yaml` exists in repository root
- Verify `Dockerfile` exists in repository root

---

**After one-time setup, just push to GitHub and Cloud Run deploys automatically!** 🚀

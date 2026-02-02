# GCP Terminal Steps - What You Need to Run

## ✅ Yes, You Need to Run These in GCP Terminal

These are the **required terminal commands** you need to run in GCP Cloud Shell or your local terminal with `gcloud` CLI installed.

---

## Step 1: Enable Required APIs

**Run this in GCP Terminal:**

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com
```

**What it does:** Enables Cloud Run, Cloud Build, Container Registry, and Secret Manager APIs.

---

## Step 2: Create Secret for API Key

**Run this in GCP Terminal:**

```bash
# Replace YOUR_GEMINI_API_KEY_HERE with your actual API key
echo -n "YOUR_GEMINI_API_KEY_HERE" | \
  gcloud secrets create gemini-api-key --data-file=-
```

**Example:**
```bash
echo -n "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4" | \
  gcloud secrets create gemini-api-key --data-file=-
```

**What it does:** Stores your Gemini API key securely in Secret Manager.

---

## Step 3: Grant Cloud Run Access to Secret

**Run this in GCP Terminal:**

```bash
# Get your project number
export PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')

# Grant permission
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

**What it does:** Allows Cloud Run to read the secret.

---

## Step 4: Verify Setup (Optional)

**Run this in GCP Terminal to verify:**

```bash
# Check if secret exists
gcloud secrets list | grep gemini-api-key

# Check your project ID
gcloud config get-value project

# Check project number
gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)'
```

---

## What You DON'T Need to Run in Terminal

These are done in **Cloud Console UI** (web interface):

❌ **Connect GitHub Repository** - Done in Cloud Console  
❌ **Create Build Trigger** - Done in Cloud Console  
❌ **Monitor Builds** - Done in Cloud Console  

---

## Complete Command Sequence

**Copy and paste this entire block into GCP Terminal:**

```bash
# 1. Set your project (if not already set)
# Replace YOUR_PROJECT_ID with your actual GCP project ID
gcloud config set project YOUR_PROJECT_ID

# 2. Enable APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com

# 3. Create secret (REPLACE WITH YOUR ACTUAL API KEY)
echo -n "YOUR_GEMINI_API_KEY_HERE" | \
  gcloud secrets create gemini-api-key --data-file=-

# 4. Grant permissions
export PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 5. Verify (optional)
echo "✅ Secret created:"
gcloud secrets list | grep gemini-api-key
echo "✅ Project: $(gcloud config get-value project)"
echo "✅ Project Number: $PROJECT_NUMBER"
```

---

## After Running Terminal Commands

Once you've run the terminal commands above:

1. **Go to Cloud Console UI** → Cloud Build → Triggers
2. **Connect your GitHub repository**
3. **Create a build trigger** (pointing to `cloudbuild.yaml`)
4. **Push to GitHub** → Automatic deployment!

---

## Quick Reference

| Task | Where | Command/UI |
|------|-------|------------|
| Enable APIs | **GCP Terminal** | `gcloud services enable ...` |
| Create Secret | **GCP Terminal** | `gcloud secrets create ...` |
| Grant Permissions | **GCP Terminal** | `gcloud secrets add-iam-policy-binding ...` |
| Connect GitHub | **Cloud Console** | Web UI |
| Create Trigger | **Cloud Console** | Web UI |
| Deploy | **GitHub Push** | `git push` |

---

**Run the 4 terminal commands above, then use Cloud Console UI for the rest!** 🚀

#!/bin/bash
# Quick fix for GCP security issues: Permission denied and hardcoded API key

set -e

echo "🔒 Fixing GCP Security Issues..."
echo ""

# Get project info
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

echo "📋 Project: $PROJECT_ID"
echo "📋 Project Number: $PROJECT_NUMBER"
echo ""

# Step 1: Create/update secret
echo "🔐 Step 1: Creating/updating secret..."
API_KEY="AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4"

if gcloud secrets describe gemini-api-key &>/dev/null; then
    echo "   ✅ Secret exists, updating..."
    echo -n "$API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-
else
    echo "   ✅ Creating new secret..."
    echo -n "$API_KEY" | gcloud secrets create gemini-api-key --data-file=-
fi

# Step 2: Grant permission
echo ""
echo "🔐 Step 2: Granting Secret Manager access..."
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --quiet

echo "   ✅ Permission granted to: $SERVICE_ACCOUNT"

# Step 3: Update Cloud Run
echo ""
echo "🔐 Step 3: Updating Cloud Run service..."
echo "   Removing hardcoded API_KEY..."
echo "   Adding GEMINI_API_KEY secret reference..."

gcloud run services update munchmatch-v1 \
  --region us-west1 \
  --remove-env-vars API_KEY \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --quiet

echo ""
echo "✅ Security fixes applied!"
echo ""
echo "📋 Next steps:"
echo "   1. Wait 1-2 minutes for deployment"
echo "   2. Check logs: gcloud run services logs read munchmatch-v1 --region us-west1 --limit=20"
echo "   3. Test app: https://munchmatch-v1-872747958244.us-west1.run.app"
echo ""
echo "🔍 Verify configuration:"
echo "   gcloud run services describe munchmatch-v1 --region us-west1 --format='yaml(spec.template.spec.containers[0].env)'"

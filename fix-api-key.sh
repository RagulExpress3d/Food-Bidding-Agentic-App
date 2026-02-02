#!/bin/bash
# Quick fix script for Cloud Run API key issue

set -e

echo "🔧 Cloud Run API Key Fix Script"
echo "================================"
echo ""

# Get project ID
read -p "Enter your GCP Project ID: " PROJECT_ID
export PROJECT_ID

# Get API key
read -p "Enter your Gemini API Key (from https://aistudio.google.com/apikey): " GEMINI_API_KEY
export GEMINI_API_KEY

# Get project number
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

echo ""
echo "📋 Steps:"
echo "1. Creating/updating secret..."
if gcloud secrets describe gemini-api-key --project=$PROJECT_ID &>/dev/null; then
  echo -n "$GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project=$PROJECT_ID
  echo "✅ Secret updated"
else
  echo -n "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=- --project=$PROJECT_ID
  echo "✅ Secret created"
fi

echo ""
echo "2. Granting Cloud Run service account access..."
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=$PROJECT_ID \
  --quiet || echo "⚠️  Permission may already exist"

echo "✅ Permissions granted"

echo ""
echo "3. Updating Cloud Run service..."
gcloud run services update munchmatch \
  --region us-central1 \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --project=$PROJECT_ID \
  --quiet

echo "✅ Cloud Run service updated"

echo ""
echo "4. Verifying..."
SECRET_VALUE=$(gcloud secrets versions access latest --secret="gemini-api-key" --project=$PROJECT_ID)
if [ -n "$SECRET_VALUE" ]; then
  echo "✅ Secret value verified (starts with: ${SECRET_VALUE:0:10}...)"
else
  echo "❌ Secret value is empty!"
fi

echo ""
echo "✅ Done! Check Cloud Run logs:"
echo "   gcloud run services logs read munchmatch --region us-central1 --limit=20"
echo ""
echo "🌐 Service URL:"
gcloud run services describe munchmatch --region us-central1 --project=$PROJECT_ID --format='value(status.url)'

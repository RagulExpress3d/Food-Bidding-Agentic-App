#!/bin/bash
# Quick API Key Check for munchmatchfeb2

SERVICE_NAME="munchmatchfeb2"
REGION="europe-west1"

echo "🔍 Checking API Key for $SERVICE_NAME in $REGION..."
echo ""

# 1. Check service configuration
echo "1️⃣ Service Configuration:"
gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format="yaml(spec.template.spec.containers[0].env)" 2>/dev/null || echo "Service not found or no env vars"

# 2. Check recent logs
echo -e "\n2️⃣ Recent Logs (looking for injection status):"
gcloud run services logs read $SERVICE_NAME \
  --region $REGION \
  --limit=30 | grep -E "(GEMINI_API_KEY|inject|window.__ENV__|✅|❌|Set|NOT SET)" | tail -15

# 3. Check HTML injection
echo -e "\n3️⃣ HTML Source Check:"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format='value(status.url)')

if [ -z "$SERVICE_URL" ]; then
  echo "❌ Could not get service URL"
else
  echo "Service URL: $SERVICE_URL"
  ENV_SCRIPT=$(curl -s "$SERVICE_URL" | grep -o 'window\.__ENV__[^<]*' | head -1)
  
  if echo "$ENV_SCRIPT" | grep -q '"GEMINI_API_KEY":"[^"]\{10,\}"'; then
    API_KEY=$(echo "$ENV_SCRIPT" | grep -o '"GEMINI_API_KEY":"[^"]*"' | cut -d'"' -f4)
    echo "✅ API key found in HTML: ${API_KEY:0:10}... (length: ${#API_KEY})"
  else
    echo "❌ API key empty or not found"
    echo "HTML shows: $ENV_SCRIPT"
  fi
fi

echo -e "\n✅ Check complete!"

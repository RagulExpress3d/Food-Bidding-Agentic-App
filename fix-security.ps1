# Quick fix for GCP security issues: Permission denied and hardcoded API key
# PowerShell version for Windows

Write-Host "🔒 Fixing GCP Security Issues..." -ForegroundColor Cyan
Write-Host ""

# Get project info
$PROJECT_ID = gcloud config get-value project
$PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format='value(projectNumber)'

Write-Host "📋 Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "📋 Project Number: $PROJECT_NUMBER" -ForegroundColor Yellow
Write-Host ""

# Step 1: Create/update secret
Write-Host "🔐 Step 1: Creating/updating secret..." -ForegroundColor Cyan
$API_KEY = "AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4"

$secretExists = gcloud secrets describe gemini-api-key 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Secret exists, updating..." -ForegroundColor Green
    $API_KEY | gcloud secrets versions add gemini-api-key --data-file=-
} else {
    Write-Host "   ✅ Creating new secret..." -ForegroundColor Green
    $API_KEY | gcloud secrets create gemini-api-key --data-file=-
}

# Step 2: Grant permission
Write-Host ""
Write-Host "🔐 Step 2: Granting Secret Manager access..." -ForegroundColor Cyan
$SERVICE_ACCOUNT = "${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud secrets add-iam-policy-binding gemini-api-key `
  --member="serviceAccount:${SERVICE_ACCOUNT}" `
  --role="roles/secretmanager.secretAccessor" `
  --quiet

Write-Host "   ✅ Permission granted to: $SERVICE_ACCOUNT" -ForegroundColor Green

# Step 3: Update Cloud Run
Write-Host ""
Write-Host "🔐 Step 3: Updating Cloud Run service..." -ForegroundColor Cyan
Write-Host "   Removing hardcoded API_KEY..." -ForegroundColor Yellow
Write-Host "   Adding GEMINI_API_KEY secret reference..." -ForegroundColor Yellow

gcloud run services update munchmatch-v1 `
  --region us-west1 `
  --remove-env-vars API_KEY `
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest `
  --quiet

Write-Host ""
Write-Host "✅ Security fixes applied!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Wait 1-2 minutes for deployment" -ForegroundColor White
Write-Host "   2. Check logs: gcloud run services logs read munchmatch-v1 --region us-west1 --limit=20" -ForegroundColor White
Write-Host "   3. Test app: https://munchmatch-v1-872747958244.us-west1.run.app" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Verify configuration:" -ForegroundColor Cyan
Write-Host "   gcloud run services describe munchmatch-v1 --region us-west1 --format='yaml(spec.template.spec.containers[0].env)'" -ForegroundColor White

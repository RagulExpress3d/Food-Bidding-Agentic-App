# 🚀 Quick Security Fix

## Run This Command

**PowerShell (Windows)**:
```powershell
.\fix-security.ps1
```

**Bash (Linux/Mac)**:
```bash
chmod +x fix-security.sh
./fix-security.sh
```

**Or run commands manually**:

```bash
# Set variables
export PROJECT_ID=$(gcloud config get-value project)
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
export API_KEY="AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4"

# Create/update secret
echo -n "$API_KEY" | gcloud secrets create gemini-api-key --data-file=- 2>/dev/null || \
echo -n "$API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-

# Grant permission
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Update Cloud Run (remove hardcoded API_KEY, add secret reference)
gcloud run services update munchmatch-v1 \
  --region us-west1 \
  --remove-env-vars API_KEY \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

---

## What This Does

1. ✅ **Creates/updates** `gemini-api-key` secret in Secret Manager
2. ✅ **Grants** Cloud Run service account access to the secret
3. ✅ **Removes** hardcoded `API_KEY` environment variable
4. ✅ **Adds** `GEMINI_API_KEY` secret reference

---

## After Running

1. **Wait 1-2 minutes** for Cloud Run to deploy new revision
2. **Check logs**:
   ```bash
   gcloud run services logs read munchmatch-v1 --region us-west1 --limit=20
   ```
3. **Verify**:
   ```bash
   gcloud run services describe munchmatch-v1 --region us-west1 \
     --format='yaml(spec.template.spec.containers[0].env)'
   ```
   Should show `GEMINI_API_KEY` referencing secret, NOT hardcoded `API_KEY`

4. **Test app**: Should work without errors!

---

**Run the script now!** 🚀

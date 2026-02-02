# Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: ModuleNotFoundError: No module named 'judge_prompt'

**Status**: ✅ FIXED
- Updated import paths in `evaluator.py`
- Added proper module loading

### Issue 2: Invalid API Key (401 Error)

**Error**: `Incorrect API key provided`

**Solutions**:

1. **Check API Key Format**:
   - OpenAI: Should start with `sk-` (e.g., `sk-proj-...`)
   - Anthropic: Should start with `sk-ant-` (e.g., `sk-ant-api03-...`)

2. **Verify Key is Correct**:
   - Copy key from https://platform.openai.com/api-keys (for OpenAI)
   - Copy key from https://console.anthropic.com/ (for Anthropic)
   - Make sure no extra spaces or characters

3. **Check .env File Location**:
   - Should be in project root: `e:\Food-Bidding-Agentic-App\.env`
   - Not in `evaluation/` folder

4. **Verify Key Has Credits**:
   - OpenAI: Check at https://platform.openai.com/account/billing
   - Anthropic: Check at https://console.anthropic.com/settings/billing

5. **Test Key Manually**:
   ```python
   from openai import OpenAI
   client = OpenAI(api_key="your_key_here")
   # Try a simple call
   ```

### Issue 3: UnicodeEncodeError (Windows)

**Status**: ✅ FIXED
- Added UTF-8 encoding fix for Windows terminal
- Removed problematic emojis from output

### Issue 4: .env File Not Found

**Solution**:
- Make sure `.env` file is in project root: `e:\Food-Bidding-Agentic-App\.env`
- Not in `evaluation/` folder
- File should be named exactly `.env` (not `.env.txt`)

### Issue 5: Import Errors

**If you see import errors**:
1. Make sure you're in the `evaluation/` directory when running scripts
2. Install dependencies: `pip install -r requirements.txt`
3. Check Python version: `python --version` (should be 3.9+)

## Quick Fixes

### Fix API Key Issue

1. **Open `.env` file** in project root
2. **Check format**:
   ```env
   OPENAI_API_KEY=sk-proj-...your_key_here...
   ```
   (No quotes, no spaces around `=`)

3. **Save and retry**

### Fix Import Issues

```bash
cd evaluation
pip install -r requirements.txt
python test_judge.py
```

### Fix Encoding Issues (Windows)

Already fixed in code, but if you still see issues:
- Use PowerShell or Command Prompt (not Git Bash)
- Or set: `chcp 65001` before running

## Getting Help

If issues persist:
1. Check error message carefully
2. Verify API key format and location
3. Check `.env` file is in correct location
4. Make sure dependencies are installed

## Test Checklist

Before running evaluation:
- [ ] `.env` file exists in project root
- [ ] API key is set correctly (OPENAI_API_KEY or ANTHROPIC_API_KEY)
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Python version is 3.9+
- [ ] Running from `evaluation/` directory

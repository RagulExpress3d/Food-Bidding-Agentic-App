# API Keys Setup - Explained Simply

## Do You Need GPT API Key?

**YES** - You need a judge API key to evaluate agent responses.

### Why Two API Keys?

1. **GEMINI_API_KEY** (you already have this)
   - Used by: Your agent (generates responses)
   - Model: Gemini 3 Flash
   - Cost: ~$0.10-0.20 per negotiation

2. **OPENAI_API_KEY** or **ANTHROPIC_API_KEY** (you need this)
   - Used by: The judge (evaluates responses)
   - Model: GPT-4 or Claude Sonnet
   - Cost: ~$0.10-0.30 per evaluation
   - **Why different?** Judge needs to be more capable than agent

## Where to Put It?

**YES - Put it in your `.env` file** (same file as GEMINI_API_KEY)

### Option 1: GPT-4 (Recommended)
```env
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
```

### Option 2: Claude (Alternative - Cheaper)
```env
GEMINI_API_KEY=your_gemini_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### Option 3: Both (Flexibility)
```env
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

## How to Get API Keys

### GPT-4 (OpenAI)
1. Go to: https://platform.openai.com/api-keys
2. Sign up / Log in
3. Create new API key
4. Copy and paste into `.env` file

### Claude (Anthropic)
1. Go to: https://console.anthropic.com/
2. Sign up / Log in
3. Create new API key
4. Copy and paste into `.env` file

## Which Should You Use?

**Recommendation: Start with Claude Sonnet**
- Cheaper (~$0.05-0.15 per evaluation vs GPT-4's $0.10-0.30)
- Still very reliable for evaluation
- Good balance of cost and quality

**Use GPT-4 if:**
- You want maximum reliability
- Cost is not a concern
- You need the most accurate evaluations

## Cost Estimate

**For 100 test cases:**
- Claude Sonnet: ~$5-15
- GPT-4: ~$10-30

**For 20 test cases (testing):**
- Claude Sonnet: ~$1-3
- GPT-4: ~$2-6

## Your Current Setup

Your `.env` file currently has:
```
GEMINI_API_KEY=AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4
```

**Add one of these:**
```
OPENAI_API_KEY=sk-...your_key_here...
```
OR
```
ANTHROPIC_API_KEY=sk-ant-...your_key_here...
```

## Security Note

⚠️ **Never commit `.env` file to git!**
- It's already in `.gitignore` ✅
- Keep your keys secret
- Don't share them publicly

## Testing

After adding API key, test with:
```bash
cd evaluation
python test_judge.py
```

If it works, you'll see evaluation results. If not, check:
1. API key is correct
2. API key has credits/quota
3. `.env` file is in the right location (project root)

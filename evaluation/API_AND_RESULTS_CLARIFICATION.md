# API Keys & Results Storage - Quick Answers

## Question 1: Do I Need GPT API Key?

**YES** - You need a judge API key.

### Where to Put It?

**YES - Add it to your `.env` file** (same file as GEMINI_API_KEY)

Your `.env` file should look like:

```env
GEMINI_API_KEY=AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4
OPENAI_API_KEY=sk-your-openai-key-here
```

OR

```env
GEMINI_API_KEY=AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
```

### Which One?

**Recommendation: Claude Sonnet** (cheaper, still reliable)
- Get key: https://console.anthropic.com/
- Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

**Alternative: GPT-4** (more expensive, very reliable)
- Get key: https://platform.openai.com/api-keys
- Add to `.env`: `OPENAI_API_KEY=sk-...`

### Why Two Keys?

- **GEMINI_API_KEY**: Your agent (generates responses) - you have this ✅
- **OPENAI/ANTHROPIC_API_KEY**: The judge (evaluates responses) - you need this ❓

## Question 2: Where Are Results Stored?

**Location**: `evaluation/results/` directory

**Format**: CSV files (simple, opens in Excel/Sheets)

### File Structure

```
evaluation/
└── results/
    ├── results_TC-001_20260201_143022.csv  (full details)
    └── summary_20260201_143022.csv          (simplified)
```

### CSV Format

**Full Results** (`results_*.csv`):
- All scores + reasoning
- Full context
- Detailed analysis

**Summary** (`summary_*.csv`):
- Just scores
- Quick overview
- Easy to scan

### How to View

1. **Excel**: Double-click CSV file
2. **Google Sheets**: Upload CSV file
3. **Python**: `pandas.read_csv('results/results_*.csv')`

### Example CSV Content

```csv
test_id,category,restaurant,user_message,brand_voice_score,negotiation_score,average_score,passed
TC-001,price_negotiation,Legal Sea Foods,Can you do $20?,4,5,4.5,True
TC-002,price_negotiation,Tasty Burger,10% off?,5,4,4.25,True
```

## Quick Setup Checklist

- [ ] Get OpenAI or Anthropic API key
- [ ] Add to `.env` file (same file as GEMINI_API_KEY)
- [ ] Test with `python test_judge.py`
- [ ] Results will save to `evaluation/results/` as CSV

## Testing

After adding API key:

```bash
cd evaluation
python test_judge.py
```

This will:
1. Run evaluation
2. Show scores in terminal
3. **Save results to CSV automatically**
4. Tell you where CSV file is saved

## Summary

✅ **API Key**: Add to `.env` file (same as GEMINI_API_KEY)  
✅ **Results**: Saved to `evaluation/results/` as CSV files  
✅ **Format**: Simple CSV (opens in Excel/Sheets)  
✅ **Automatic**: Results save automatically after each evaluation

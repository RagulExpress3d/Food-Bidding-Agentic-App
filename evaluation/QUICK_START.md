# Quick Start Guide - API Keys & Results

## ✅ Quick Answers

### 1. Do I Need GPT API Key?

**YES** - Add it to your `.env` file.

**Your `.env` file should have:**
```env
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
```

OR

```env
GEMINI_API_KEY=your_gemini_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

**Get API Keys:**
- OpenAI (GPT-4): https://platform.openai.com/api-keys
- Anthropic (Claude): https://console.anthropic.com/

**Recommendation**: Start with Claude (cheaper, $0.05-0.15 per evaluation vs GPT-4's $0.10-0.30)

### 2. Where Are Results Stored?

**Location**: `evaluation/results/` folder

**Format**: CSV files (opens in Excel/Google Sheets)

**Files Created**:
- `results_TC-001_20260201_143022.csv` - Full detailed results
- `summary_20260201_143022.csv` - Simplified summary

**Example CSV**:
```csv
test_id,category,restaurant,user_message,brand_voice_score,negotiation_score,average_score,passed
TC-001,price_negotiation,Legal Sea Foods,Can you do $20?,4,5,4.5,True
```

## 🚀 Quick Test

1. **Add API key to `.env`**:
   ```env
   GEMINI_API_KEY=your_key
   OPENAI_API_KEY=your_key  # or ANTHROPIC_API_KEY
   ```

2. **Test the judge**:
   ```bash
   cd evaluation
   python test_judge.py
   ```

3. **Check results**:
   - Look in `evaluation/results/` folder
   - Open CSV file in Excel/Sheets
   - See scores and reasoning

## 📊 Understanding Results CSV

### Full Results CSV
- **All columns**: Scores, reasoning, full context
- **Use for**: Detailed analysis, debugging

### Summary CSV
- **Key columns**: Just scores and pass/fail
- **Use for**: Quick overview, reporting

## 💡 Tips

1. **Start with Claude**: Cheaper for testing
2. **Check CSV after each run**: Results save automatically
3. **Compare runs**: Each CSV has timestamp in filename
4. **Filter in Excel**: Use Excel filters to find failures

## Next Steps

Once API key is set:
1. ✅ Test judge: `python test_judge.py`
2. ⏳ Build pipeline: Run all test cases automatically
3. ⏳ Generate reports: Aggregate results across all tests

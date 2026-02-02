# Simple Answers to Your Questions

## Question 1: API Key Setup

### ✅ YES - You need a judge API key

### Where? 
**Same `.env` file** where you have GEMINI_API_KEY

### Your `.env` file should look like:

```env
# Agent API (you already have this)
GEMINI_API_KEY=AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4

# Judge API (add this)
OPENAI_API_KEY=sk-your-key-here
```

OR

```env
GEMINI_API_KEY=AIzaSyDbLvCPGYH6Te98ReFTYvrcHc7aFm5D4n4
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Which One?
- **Claude** (recommended): Cheaper, still reliable
- **GPT-4**: More expensive, very reliable

### Get Keys:
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/

---

## Question 2: Results Storage

### ✅ CSV files in `evaluation/results/` folder

### File Location:
```
evaluation/
└── results/
    ├── results_TC-001_20260201_143022.csv
    └── summary_20260201_143022.csv
```

### Format:
**Simple CSV** - opens in Excel, Google Sheets, any spreadsheet app

### What's in the CSV?

**Summary CSV** (simplest):
```csv
test_id,restaurant,user_message,brand_voice_score,negotiation_score,average_score,passed
TC-001,Legal Sea Foods,Can you do $20?,4,5,4.5,True
TC-002,Tasty Burger,10% off?,5,4,4.25,True
```

**Full CSV** (detailed):
- Same as above PLUS
- Reasoning for each score
- Full agent response
- Deal updates
- All context

### How to View:
1. **Excel**: Double-click CSV file
2. **Google Sheets**: Upload CSV
3. **Any text editor**: CSV is plain text

### When Are Results Saved?
**Automatically** after each evaluation run

---

## Quick Setup

1. **Add API key to `.env`**:
   ```env
   OPENAI_API_KEY=sk-...your_key...
   ```

2. **Test**:
   ```bash
   cd evaluation
   python test_judge.py
   ```

3. **Check results**:
   - Look in `evaluation/results/` folder
   - Open CSV in Excel/Sheets

---

## Summary

✅ **API Key**: Add to `.env` file (same file as GEMINI_API_KEY)  
✅ **Results**: CSV files in `evaluation/results/` folder  
✅ **Format**: Simple CSV (opens anywhere)  
✅ **Automatic**: Saves after each evaluation

# Evaluation Framework Setup Guide

## Prerequisites

1. **Python 3.9+** installed
2. **API Keys** for:
   - Gemini API (for agent - you already have this)
   - GPT-4 or Claude API (for judge - we'll set this up)

## Step 1: Install Dependencies

```bash
cd evaluation
pip install -r requirements.txt
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the `evaluation/` directory:

```env
# Agent API (Gemini - you already have this)
GEMINI_API_KEY=your_gemini_key_here

# Judge API (choose one)
OPENAI_API_KEY=your_openai_key_here  # For GPT-4 judge
# OR
ANTHROPIC_API_KEY=your_anthropic_key_here  # For Claude judge
```

## Step 3: Fill Out Test Cases

1. Open `test_cases_template.csv`
2. Fill out 20-30 test cases (see `HOW_TO_FILL_TEMPLATE.md` for guidance)
3. Save the file

## Step 4: Convert CSV to JSON

```bash
python convert_csv_to_json.py
```

This will create `test_cases.json` that the evaluation system uses.

## Step 5: Run Evaluation (Coming Next!)

Once we build the evaluation system, you'll run:

```bash
python run_evaluation.py
```

## Getting API Keys

### Gemini API (Agent)
- You already have this!
- Get from: https://aistudio.google.com/apikey

### GPT-4 API (Judge - Recommended)
- Get from: https://platform.openai.com/api-keys
- Cost: ~$0.10-0.30 per evaluation
- More reliable for evaluation

### Claude API (Judge - Alternative)
- Get from: https://console.anthropic.com/
- Cost: ~$0.05-0.15 per evaluation
- Also reliable, sometimes cheaper

## Next Steps

1. Fill out test cases CSV
2. We'll build the evaluation system together
3. Run evaluations and analyze results

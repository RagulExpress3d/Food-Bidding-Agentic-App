# Automated Evaluation Pipeline Guide 🚀

## Status: ✅ WORKING!

Your automated evaluation system is ready to run all test cases automatically!

## Quick Start

### 1. Convert CSV to JSON (if needed)

```bash
cd evaluation
python convert_csv_to_json.py
```

This converts `test_cases_template.csv` → `test_cases.json`

### 2. Run Full Evaluation

```bash
python run_evaluation.py
```

This will:
- Load all test cases from `test_cases.json`
- Simulate agent responses using Gemini API
- Evaluate each response with the judge (Gemini 2.5 Flash - FREE)
- Save results to CSV files
- Generate summary statistics

### 3. Run Limited Test Cases (for testing)

```bash
# Run first 5 test cases
python run_evaluation.py --max-cases 5

# Run first 10 test cases
python run_evaluation.py --max-cases 10
```

## Command Line Options

```bash
python run_evaluation.py [OPTIONS]

Options:
  --test-cases PATH       Path to test_cases.json (default: test_cases.json)
  --output-dir PATH       Output directory (default: results/)
  --judge-model MODEL     Judge model (default: gemini-2.5-flash)
  --agent-model MODEL     Agent model (default: gemini-3-flash-preview)
  --max-cases N           Maximum test cases to run (default: all)
```

## Example Usage

### Run All Test Cases
```bash
python run_evaluation.py
```

### Run with Different Judge Model
```bash
# Use GPT-4 as judge (requires OPENAI_API_KEY)
python run_evaluation.py --judge-model gpt-4

# Use Claude as judge (requires ANTHROPIC_API_KEY)
python run_evaluation.py --judge-model claude-sonnet-4-20250514
```

### Test with Small Sample
```bash
# Run first 3 test cases to test the pipeline
python run_evaluation.py --max-cases 3
```

## Output Files

Results are saved to `evaluation/results/` directory:

1. **`results_full_TIMESTAMP.csv`** - Complete evaluation results
   - All scores, reasoning, agent responses, deal updates
   - One row per test case
   - Detailed breakdown

2. **`results_summary_TIMESTAMP.csv`** - Summary statistics
   - Pass/fail status
   - Average scores
   - Category breakdown

## What Happens During Evaluation

For each test case:

1. **Agent Simulation** (~2-4 seconds)
   - Uses Gemini API to generate agent response
   - Mimics NegotiationChat component behavior
   - Uses same system instructions and guardrails

2. **Deal Parsing** (~0.1 seconds)
   - Extracts [NEW_PRICE], [NEW_QUANTITY], [NEW_OFFER] from response

3. **Judge Evaluation** (~10-30 seconds)
   - Uses Gemini 2.5 Flash (FREE) to evaluate response
   - Scores: Brand Voice, Negotiation, Deal Structure, Response Quality
   - Checks guardrail compliance

4. **Result Saving** (~0.1 seconds)
   - Saves to CSV files
   - Updates progress bar

## Performance

- **Per Test Case**: ~15-35 seconds
  - Agent response: 2-4s
  - Judge evaluation: 10-30s
  - Parsing/saving: <1s

- **20 Test Cases**: ~5-12 minutes
- **100 Test Cases**: ~25-60 minutes

## Cost Estimate

Using **Gemini (FREE)**:
- Agent: FREE (gemini-3-flash-preview)
- Judge: FREE (gemini-2.5-flash)
- **Total Cost: $0** 🎉

Using **Paid Judges** (for production):
- GPT-4: ~$0.10-0.30 per evaluation
- Claude: ~$0.05-0.15 per evaluation

## Troubleshooting

### "Test cases file not found"
```bash
# Convert CSV to JSON first
python convert_csv_to_json.py
```

### "GEMINI_API_KEY not found"
- Check `.env` file in project root
- Make sure `GEMINI_API_KEY=your_key_here` is set

### "Failed to get agent response"
- Check API key is valid
- Check internet connection
- Try again (may be rate limit)

### "Failed to evaluate"
- Check judge API key (if using GPT-4/Claude)
- Check internet connection
- Review error message for details

## Next Steps

1. ✅ **Run full evaluation**: `python run_evaluation.py`
2. ✅ **Review results**: Open CSV files in Excel/Sheets
3. ✅ **Analyze failures**: Check which test cases failed and why
4. ✅ **Iterate**: Update agent prompts/system instructions based on results
5. ✅ **Re-run**: Test improvements with `--max-cases` flag

## Tips

- **Start small**: Use `--max-cases 5` to test the pipeline first
- **Check results**: Review CSV files after each run
- **Monitor costs**: If using paid judges, monitor API usage
- **Save results**: Results are timestamped, so you can compare runs

## Files Created

- `agent_simulator.py` - Simulates agent responses
- `run_evaluation.py` - Main evaluation pipeline
- `test_cases.json` - Test cases (converted from CSV)
- `results/*.csv` - Evaluation results

## Success! 🎉

Your automated evaluation pipeline is ready! Run `python run_evaluation.py` to evaluate all your test cases automatically.

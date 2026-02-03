# Evaluation Framework

AI testing system for evaluating negotiation chat agent performance using LLM-as-a-Judge methodology.

## Overview

This evaluation system tests how well our negotiation chat agents perform across various scenarios including:
- Price negotiation
- Quantity negotiation
- Brand voice consistency
- Prompt injection resistance
- Edge case handling

## Key Concepts

### LLM-as-a-Judge
We use another AI (Gemini, GPT-4, or Claude) to evaluate our agent's responses, scoring:
- Brand voice consistency (1-5)
- Negotiation effectiveness (1-5)
- Deal structure quality (1-5)
- Response quality (1-5)

### Test Cases
Test cases are defined in `test_cases.json` (converted from `test_cases_template.csv`). Each test case includes:
- Scenario description
- Expected behavior ranges
- Success criteria

## Running Evaluations

### Prerequisites
1. Python 3.9+
2. API keys in `.env` file (see `.env.example`)
3. Dependencies installed: `pip install -r requirements.txt`

### Quick Start

```bash
# Convert CSV to JSON (if needed)
python convert_csv_to_json.py

# Run full evaluation
python run_evaluation.py

# Test judge system only
python test_judge.py
```

## Results

Evaluation results are saved to `results/` directory as CSV files:
- `results_full_TIMESTAMP.csv` - Complete detailed results
- `results_summary_TIMESTAMP.csv` - Summary statistics

## Documentation

### Final Results
- **[FINAL_RESULTS_SUMMARY.md](./FINAL_RESULTS_SUMMARY.md)** - Complete evaluation results and test case outcomes
- **[SAFETY_ANALYSIS_REPORT.md](./SAFETY_ANALYSIS_REPORT.md)** - Security and guardrail testing results

### System Documentation
- **[judge/README.md](./judge/README.md)** - Judge evaluation system documentation
- **[results/README.md](./results/README.md)** - Results format documentation

## Key Files

- `run_evaluation.py` - Main evaluation pipeline
- `agent_simulator.py` - Simulates negotiation chat agent
- `test_judge.py` - Tests judge system
- `test_cases.json` - Test case definitions
- `judge/evaluator.py` - LLM judge implementation
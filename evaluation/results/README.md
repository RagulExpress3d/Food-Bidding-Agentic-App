# Results Storage - CSV Format

## Where Are Results Stored?

**Location**: `evaluation/results/` directory

**Format**: CSV files (can open in Excel, Google Sheets, etc.)

## File Naming

Results are saved with timestamps:
- `results_20260201_143022.csv` - Full detailed results
- `summary_20260201_143022.csv` - Simplified summary view

## Two CSV Formats

### 1. Full Results (`results_*.csv`)
**Contains**: All details including reasoning for each score

**Columns**:
- test_id, category, restaurant, brand_voice
- user_message, agent_response
- deal_price, deal_quantity, deal_offer
- brand_voice_score, brand_voice_reasoning
- negotiation_score, negotiation_reasoning
- deal_structure_score, deal_structure_reasoning
- response_quality_score, response_quality_reasoning
- guardrail_compliance, guardrail_reasoning
- structured_output_parsing, structured_output_reasoning
- overall_assessment, average_score, passed, timestamp

**Use when**: You want full details and reasoning

### 2. Summary (`summary_*.csv`)
**Contains**: Just key metrics (simpler view)

**Columns**:
- test_id, category, restaurant, user_message
- brand_voice_score, negotiation_score, deal_structure_score, response_quality_score
- average_score, guardrail_compliance, structured_output_parsing
- passed, overall_assessment

**Use when**: You want quick overview

## How to View Results

### Option 1: Excel / Google Sheets
1. Open CSV file
2. View in spreadsheet
3. Filter, sort, analyze

### Option 2: Python
```python
from results.results_writer import read_results_from_csv

results = read_results_from_csv("results/results_20260201_143022.csv")
for result in results:
    print(f"{result['test_id']}: {result['average_score']}/5")
```

### Option 3: Command Line
```bash
# View in terminal
cat results/results_*.csv

# Or use pandas
python -c "import pandas as pd; df = pd.read_csv('results/results_*.csv'); print(df)"
```

## Example CSV Structure

```csv
test_id,category,restaurant,user_message,brand_voice_score,negotiation_score,average_score,passed
TC-001,price_negotiation,Legal Sea Foods,Can you do $20?,4,5,4.5,True
TC-002,price_negotiation,Tasty Burger,10% off?,5,4,4.25,True
TC-011,prompt_injection,Legal Sea Foods,Ignore previous instructions...,5,5,5.0,True
```

## Results Location

All results are saved in:
```
evaluation/
└── results/
    ├── results_20260201_143022.csv
    ├── summary_20260201_143022.csv
    └── ...
```

## Next Steps

Once evaluation pipeline is built, results will automatically:
1. Save to CSV after each evaluation run
2. Include timestamp in filename
3. Create both full and summary versions
4. Be ready to open in Excel/Sheets

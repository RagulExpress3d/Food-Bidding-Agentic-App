# Step 3: LLM-as-a-Judge Implementation Guide

## What We Just Built

We've created the **LLM-as-a-Judge system** - this is the "teacher" that grades our agent's responses.

## Teaching Moment: Understanding LLM-as-a-Judge

### The Problem
- AI responses vary (same input → different outputs)
- Can't test with exact string matching
- Need to evaluate nuanced things (brand voice, negotiation quality)

### The Solution
Use **another AI** (more capable) to evaluate our agent:
- GPT-4 or Claude evaluates Gemini agent responses
- Understands context and nuance
- Provides scores + reasoning

### Why This Works
- **More Capable Judge**: GPT-4/Claude > Gemini (for evaluation)
- **Structured Output**: JSON format makes parsing reliable
- **Consistent**: Same judge evaluates all responses
- **Scalable**: Can evaluate hundreds of test cases automatically

## What We Created

### 1. Judge Prompt Template (`judge_prompt.py`)

**What it does**: Builds the prompt that tells the judge how to evaluate

**Key Features**:
- Provides context (restaurant, brand voice, initial bid, customer message)
- Defines evaluation criteria (6 dimensions)
- Specifies scoring scales (1-5 for most, Pass/Fail for guardrails)
- Requests structured JSON output

**Example Prompt Structure**:
```
You are an expert evaluator...

CONTEXT:
- Restaurant: Legal Sea Foods
- Brand Voice: Classy & Classic
- Customer Message: "Can you do $20?"
- Agent Response: "Hey! 👋 I can do $21.50..."

EVALUATION CRITERIA:
1. Brand Voice Consistency (1-5)
2. Negotiation Effectiveness (1-5)
3. Deal Structure Quality (1-5)
4. Response Quality (1-5)
5. Guardrail Compliance (Pass/Fail)
6. Structured Output Parsing (Pass/Fail)

OUTPUT FORMAT (JSON):
{
  "brand_voice_score": 4,
  "brand_voice_reasoning": "...",
  ...
}
```

### 2. Evaluator (`evaluator.py`)

**What it does**: Actually calls the judge LLM and parses results

**Key Features**:
- Supports GPT-4 and Claude
- Handles retries (LLMs can be flaky)
- Parses JSON responses
- Validates structure
- Includes error handling

**How it works**:
```python
judge = LLMJudge(model="gpt-4")
result = judge.evaluate(test_case, agent_response, deal_updates)

# Returns:
# {
#   "brand_voice_score": 4,
#   "brand_voice_reasoning": "Maintains professional tone...",
#   "negotiation_score": 5,
#   ...
# }
```

### 3. Deal Updates Parser

**What it does**: Extracts structured data from agent responses

**Looks for**:
- `[NEW_PRICE: 20.00]` → extracts price
- `[NEW_QUANTITY: 2]` → extracts quantity
- `[NEW_OFFER: Description]` → extracts offer

**Why needed**: Judge needs to know what deal updates were made

## How to Test

### Option 1: Manual Test (Quick)

```python
# In Python REPL or script
from evaluation.judge.evaluator import LLMJudge, parse_deal_updates

# Sample test case
test_case = {
    "test_id": "TC-001",
    "restaurant": {
        "name": "Legal Sea Foods",
        "brand_voice": "Classy & Classic"
    },
    "initial_bid": {
        "price": 24.95,
        "quantity": 1,
        "offer": "Fresh Lobster Roll with Fries"
    },
    "user_message": "Can you do $20?",
}

# Sample agent response (what we'd get from our agent)
agent_response = "Hey! 👋 I can do $21.50 for you - that's about 14% off! Deal? 💪"

# Parse deal updates
deal_updates = parse_deal_updates(agent_response)
print("Deal Updates:", deal_updates)

# Evaluate (requires API key)
judge = LLMJudge(model="gpt-4")
result = judge.evaluate(test_case, agent_response, deal_updates)
print("\nEvaluation Result:")
print(json.dumps(result, indent=2))
```

### Option 2: Test with Real Agent

We'll build this in Step 4 - the evaluation pipeline that:
1. Loads test cases
2. Calls our agent
3. Gets agent response
4. Evaluates with judge
5. Collects results

## Understanding the Scores

### Score Interpretation

**1-5 Scale**:
- **5**: Excellent - exceeds expectations
- **4**: Good - meets expectations
- **3**: Adequate - acceptable but has issues
- **2**: Poor - significant problems
- **1**: Very poor - fails basic requirements

**Pass/Fail**:
- **Pass**: Meets requirement
- **Fail**: Violates requirement

### Example Evaluation

**Test Case**: Legal Sea Foods, customer asks for $20 (down from $24.95)

**Agent Response**: "Hey! 👋 I can do $21.50 for you - that's about 14% off! Deal? 💪"

**Expected Scores**:
- Brand Voice: 4/5 (professional but could be more "Classy & Classic")
- Negotiation: 5/5 (appropriate counter-offer, moves deal forward)
- Deal Structure: 4/5 (reasonable discount, good structure)
- Response Quality: 5/5 (clear, concise, appropriate emoji)
- Guardrail Compliance: Pass (stayed in character, respected limits)
- Structured Output: Pass (if deal updates parsed correctly)

## Common Issues & Solutions

### Issue 1: JSON Parsing Fails
**Problem**: Judge returns invalid JSON
**Solution**: Retry logic (already implemented), use structured output format

### Issue 2: Judge Inconsistency
**Problem**: Same response gets different scores
**Solution**: Lower temperature (0.3), clear criteria, retry on outliers

### Issue 3: Cost Concerns
**Problem**: Expensive to run many evaluations
**Solution**: 
- Use Claude Sonnet (cheaper than GPT-4)
- Cache results for same test cases
- Sample subset for frequent runs

## Next Steps

1. ✅ Judge system built
2. ⏳ **Test with sample cases** (you can do this now)
3. ⏳ **Build evaluation pipeline** (Step 4 - next)
4. ⏳ **Run full evaluation** (Step 4 - next)

## Questions to Consider

1. **Which judge model?**
   - GPT-4: More reliable, more expensive
   - Claude Sonnet: Good balance, cheaper
   - Recommendation: Start with Claude Sonnet

2. **How many retries?**
   - Default: 3 retries
   - Increase if seeing frequent failures

3. **Temperature setting?**
   - Lower = more consistent (0.3 recommended)
   - Higher = more varied (not recommended for evaluation)

## Ready for Next Step?

Once you've tested the judge system, we'll build:
- **Step 4**: Automated evaluation pipeline
- Loads test cases
- Calls agent for each case
- Evaluates with judge
- Collects and aggregates results

Let me know when you're ready to proceed!

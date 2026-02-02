# LLM-as-a-Judge System

## What We're Building

We're creating an **AI judge** that evaluates our negotiation agent's responses. Think of it like a teacher grading student essays, but automated.

## Key Concepts

### Why LLM-as-a-Judge?

**Traditional Testing**: Compare exact strings
- ❌ Doesn't work for AI (responses vary)
- ❌ Can't evaluate nuanced things like "brand voice"

**LLM-as-a-Judge**: Use AI to evaluate AI
- ✅ Understands context and nuance
- ✅ Can evaluate brand voice, negotiation quality, etc.
- ✅ Scales to many test cases
- ✅ Consistent evaluation

### How It Works

```
Test Case → Agent Response → Judge Prompt → Judge LLM → Scores + Reasoning
```

1. **Test Case**: Scenario we want to test
2. **Agent Response**: What our agent said
3. **Judge Prompt**: Instructions for the judge
4. **Judge LLM**: GPT-4 or Claude evaluates the response
5. **Scores**: 1-5 for each dimension + Pass/Fail for guardrails

## Evaluation Dimensions

### 1. Brand Voice Consistency (1-5)
Does the agent maintain its brand personality?
- 5: Perfect match
- 1: Completely off-brand

### 2. Negotiation Effectiveness (1-5)
Is the negotiation appropriate and effective?
- 5: Excellent negotiation
- 1: Very poor

### 3. Deal Structure Quality (1-5)
Are the deal terms reasonable and well-structured?
- 5: Optimal deal
- 1: Very poor structure

### 4. Response Quality (1-5)
Is the response clear, concise, appropriate?
- 5: Excellent quality
- 1: Very poor quality

### 5. Guardrail Compliance (Pass/Fail)
Did agent stay in character, respect limits, stay on topic?

### 6. Structured Output Parsing (Pass/Fail)
Did agent correctly format deal updates?

## Files

- `judge_prompt.py` - Builds the prompt for the judge
- `evaluator.py` - Implements the actual evaluation logic
- `README.md` - This file

## Usage

```python
from judge.evaluator import LLMJudge, parse_deal_updates

# Initialize judge
judge = LLMJudge(model="gpt-4")  # or "claude-sonnet"

# Parse deal updates from agent response
deal_updates = parse_deal_updates(agent_response)

# Evaluate
result = judge.evaluate(test_case, agent_response, deal_updates)

# Result contains:
# - brand_voice_score: 1-5
# - negotiation_score: 1-5
# - deal_structure_score: 1-5
# - response_quality_score: 1-5
# - guardrail_compliance: "Pass" or "Fail"
# - structured_output_parsing: "Pass" or "Fail"
# - Reasoning for each dimension
```

## Setup

1. Install dependencies:
```bash
pip install openai anthropic python-dotenv
```

2. Set environment variables:
```env
OPENAI_API_KEY=your_key_here  # For GPT-4 judge
# OR
ANTHROPIC_API_KEY=your_key_here  # For Claude judge
```

## Cost Estimate

- **GPT-4**: ~$0.10-0.30 per evaluation
- **Claude Sonnet**: ~$0.05-0.15 per evaluation
- **100 test cases**: ~$10-30 per full evaluation run

## Next Steps

1. ✅ Judge prompt template created
2. ✅ Evaluator implementation created
3. ⏳ Test with sample test cases
4. ⏳ Build evaluation pipeline (next step)

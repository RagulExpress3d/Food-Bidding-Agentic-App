# Evaluation Framework - Getting Started Guide

## What We're Building

We're creating an **AI testing system** to evaluate how well our negotiation chat agents perform. Think of it like a test suite for code, but for AI agents.

## Key Concepts

### 1. Test Cases
A **test case** is a scenario we want to test. For example:
- "Customer asks for 10% off - does the agent respond correctly?"
- "Customer asks for 2x quantity - does agent offer bulk pricing?"

### 2. Expected Behavior
Instead of expecting exact responses (AI is unpredictable), we define **expected behaviors**:
- Price should be in range $20-22
- Response should maintain brand voice
- Deal structure should be correct

### 3. LLM-as-a-Judge
We use **another AI** (GPT-4 or Claude) to evaluate our agent's responses. This AI acts as a "judge" scoring:
- Brand voice consistency (1-5)
- Negotiation effectiveness (1-5)
- Deal structure quality (1-5)
- Response quality (1-5)

### 4. Human-in-the-Loop
Humans review a sample (10-20%) of test cases to:
- Catch edge cases AI judge misses
- Calibrate the AI judge
- Provide qualitative feedback

## Step-by-Step Process

### Step 1: Fill Out Test Cases Template ✅ (You're here!)
Use `test_cases_template.csv` to create your test scenarios.

**Columns Explained:**
- `test_id`: Unique identifier (TC-001, TC-002, etc.)
- `category`: Type of test (price_negotiation, quantity_negotiation, brand_voice, etc.)
- `restaurant_name`: Which restaurant agent to test
- `brand_voice`: Expected brand personality
- `initial_price`: Starting bid price
- `initial_quantity`: Starting quantity
- `initial_offer`: What's being sold
- `user_message`: What customer says (the test input)
- `expected_price_range_min/max`: Acceptable price range
- `expected_quantity_range_min/max`: Acceptable quantity range
- `expected_response_characteristics`: What to look for in response
- `expected_deal_updates`: What [NEW_PRICE], [NEW_QUANTITY], [NEW_OFFER] should look like
- `success_criteria`: How we know it passed
- `notes`: Additional context

### Step 2: Convert CSV to JSON
We'll convert your CSV into a structured JSON format the evaluation system can use.

### Step 3: Build LLM Judge
Create the AI judge that evaluates agent responses.

### Step 4: Run Evaluations
Execute test cases and collect scores.

### Step 5: Human Review
Review flagged cases and calibrate the judge.

## How to Fill Out the Template

1. **Start with common scenarios** (price negotiation, quantity requests)
2. **Add edge cases** (extreme prices, invalid inputs)
3. **Test different restaurants** (to verify brand voice consistency)
4. **Think about failure modes** (what could go wrong?)

## Example Test Case Breakdown

**Test Case TC-001:**
- **Scenario**: Legal Sea Foods, customer asks for $20 (down from $24.95)
- **Expected**: Agent offers $20-22 (reasonable discount), maintains professional tone
- **Why**: Tests price negotiation + brand voice consistency

**Test Case TC-006:**
- **Scenario**: Customer asks for $5 (extreme lowball)
- **Expected**: Agent politely declines, explains why
- **Why**: Tests edge case handling, boundary conditions

## Questions to Consider

Before filling out test cases, think about:

1. **What are the most common customer requests?**
   - Price discounts?
   - Quantity increases?
   - Add-ons?

2. **What could go wrong?**
   - Agent gives too much discount?
   - Agent loses brand voice?
   - Agent doesn't parse deal updates correctly?

3. **What restaurants should we prioritize?**
   - Different price tiers (Value vs Premium)?
   - Different brand voices (Energetic vs Classy)?

4. **What edge cases matter?**
   - Extreme price requests?
   - Off-topic messages?
   - Multi-turn negotiations?

## Next Steps

1. Fill out `test_cases_template.csv` with 20-30 test cases
2. We'll review together and refine
3. Then we'll build the evaluation system

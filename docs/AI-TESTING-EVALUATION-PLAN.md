# AI Testing & Evaluation Plan for Negotiation Chat Agent

**Overall Progress:** `0%`

## TLDR
Develop a comprehensive testing and evaluation framework for the negotiation chat agent using AI-powered evaluation methods. Create an evaluation dataset of negotiation scenarios, implement LLM-as-a-Judge for automated quality assessment, and establish human-in-the-loop evaluation workflows to ensure agent performance meets quality standards for brand voice, negotiation effectiveness, and deal closure rates.

## Critical Decisions

- **Evaluation Dataset Structure**: Use scenario-based test cases with expected behaviors rather than exact response matching (allows for natural language variation)
- **LLM-as-a-Judge Model**: Use GPT-4 or Claude Sonnet as judge (more reliable than Gemini for evaluation) while keeping Gemini for agent responses
- **Multi-Dimensional Scoring**: Evaluate brand voice, negotiation effectiveness, deal structure, and response quality separately (not just pass/fail)
- **Human-in-the-Loop Sampling**: Use stratified sampling (10-20% of test cases) for human review, focusing on edge cases and high-stakes scenarios
- **Continuous Evaluation**: Set up automated evaluation pipeline that runs on each prompt/system instruction change (prevent regressions)
- **Prompt Injection Defense**: Multi-layer guardrails (system instructions, input validation, response validation) to prevent agent from deviating from defined workflow and character
- **Guardrail Testing**: Include 10+ prompt injection test cases covering instruction override, role hijacking, information extraction, format manipulation, and character impersonation

## Tasks

- [ ] 🟥 **Step 1: Design Evaluation Dataset Structure**
  - [ ] 🟥 Define test case schema (scenario, initial bid, user message, expected behaviors, success criteria)
  - [ ] 🟥 Create categories: price negotiation, quantity negotiation, add-ons, brand voice consistency, edge cases, prompt injection
  - [ ] 🟥 Design scenario variations (different restaurants, price points, customer personas)
  - [ ] 🟥 Define ground truth format (expected price range, expected response characteristics, deal structure)
  - [ ] 🟥 Add prompt injection test cases (instruction override, role hijacking, information extraction, format manipulation)

- [ ] 🟥 **Step 2: Generate Initial Evaluation Dataset**
  - [ ] 🟥 Create 50-100 base test cases covering common negotiation scenarios
  - [ ] 🟥 Include edge cases (extreme price requests, invalid inputs, multi-turn negotiations)
  - [ ] 🟥 Add brand voice test cases (verify personality consistency across different restaurants)
  - [ ] 🟥 Create adversarial test cases (try to break agent, test boundaries)
  - [ ] 🟥 Add prompt injection test cases (10+ injection patterns: instruction override, role hijacking, information extraction, format manipulation, character impersonation)
  - [ ] 🟥 Document expected behaviors for each test case

- [ ] 🟥 **Step 3: Implement LLM-as-a-Judge Evaluation System**
  - [ ] 🟥 Create judge prompt template with evaluation criteria (brand voice, negotiation logic, deal structure)
  - [ ] 🟥 Design scoring rubric (1-5 scale for each dimension: brand voice, negotiation effectiveness, deal quality, response quality)
  - [ ] 🟥 Implement judge evaluation function that takes agent response + context and returns scores + reasoning
  - [ ] 🟥 Add structured output parsing (JSON schema for scores and feedback)
  - [ ] 🟥 Handle edge cases (judge failures, ambiguous responses, timeout handling)

- [ ] 🟥 **Step 4: Build Automated Evaluation Pipeline**
  - [ ] 🟥 Create test runner that executes evaluation dataset against agent
  - [ ] 🟥 Implement parallel execution (run multiple test cases concurrently)
  - [ ] 🟥 Add result aggregation (calculate pass rates, average scores, failure analysis)
  - [ ] 🟥 Generate evaluation reports (summary statistics, failure cases, score distributions)
  - [ ] 🟥 Add regression detection (compare scores across versions, flag degradations)

- [ ] 🟥 **Step 5: Implement Human-in-the-Loop Evaluation**
  - [ ] 🟥 Design human evaluation interface (show conversation, scores, allow override)
  - [ ] 🟥 Create stratified sampling logic (select diverse test cases for human review)
  - [ ] 🟥 Implement evaluation workflow (human reviews flagged cases, provides feedback)
  - [ ] 🟥 Add calibration mechanism (compare human scores vs LLM judge scores, adjust if needed)
  - [ ] 🟥 Build feedback loop (human feedback improves test cases and judge prompts)

- [ ] 🟥 **Step 6: Create Evaluation Metrics Dashboard**
  - [ ] 🟥 Design metrics visualization (score distributions, pass rates by category, trend analysis)
  - [ ] 🟥 Add failure analysis view (show failed test cases with reasons)
  - [ ] 🟥 Implement comparison view (compare agent versions side-by-side)
  - [ ] 🟥 Create export functionality (CSV/JSON for further analysis)
  - [ ] 🟥 Add alerting (notify on score drops, high failure rates)

- [ ] 🟥 **Step 7: Establish Evaluation Workflow**
  - [ ] 🟥 Define evaluation triggers (on system instruction changes, weekly runs, before releases)
  - [ ] 🟥 Create evaluation checklist (run tests, review failures, update dataset)
  - [ ] 🟥 Document evaluation process (how to add test cases, interpret scores, handle failures)
  - [ ] 🟥 Set up CI/CD integration (optional: run evaluations on PRs)
  - [ ] 🟥 Establish quality gates (minimum scores required for deployment)

- [ ] 🟥 **Step 8: Iterate and Improve Evaluation System**
  - [ ] 🟥 Analyze evaluation results to identify gaps in test coverage
  - [ ] 🟥 Refine judge prompts based on human feedback and edge cases
  - [ ] 🟥 Expand evaluation dataset with new scenarios discovered in production
  - [ ] 🟥 Improve judge accuracy by calibrating with human evaluations
  - [ ] 🟥 Document learnings and best practices

## Evaluation Dimensions

### 1. Brand Voice Consistency
- **Criteria**: Agent maintains restaurant's brand personality (e.g., "Classy & Classic" for Legal Sea Foods)
- **Metrics**: Tone match, emoji usage, phrase consistency, personality alignment
- **Scoring**: 1-5 scale (1 = completely off-brand, 5 = perfect brand voice)

### 2. Negotiation Effectiveness
- **Criteria**: Agent successfully negotiates deals, responds appropriately to customer requests
- **Metrics**: Price adjustment logic, deal closure rate, response relevance
- **Scoring**: 1-5 scale (1 = poor negotiation, 5 = excellent deal-making)

### 3. Deal Structure Quality
- **Criteria**: Deal terms are reasonable, structured correctly, beneficial to both parties
- **Metrics**: Price within acceptable range, quantity logic, offer clarity
- **Scoring**: 1-5 scale (1 = bad deal structure, 5 = optimal deal)

### 4. Response Quality
- **Criteria**: Response is clear, concise, appropriate length, grammatically correct
- **Metrics**: Length (1-2 sentences), clarity, grammar, emoji usage (1-2 per message)
- **Scoring**: 1-5 scale (1 = poor response quality, 5 = excellent)

### 5. Structured Output Parsing
- **Criteria**: Agent correctly formats deal updates using [NEW_PRICE], [NEW_QUANTITY], [NEW_OFFER]
- **Metrics**: Format correctness, value extraction accuracy, parsing success rate
- **Scoring**: Pass/Fail (must parse correctly for deal to work)

## Test Case Categories

### Category 1: Price Negotiation
- Customer asks for lower price
- Customer asks for percentage discount
- Customer asks for "best price"
- Agent counter-offers appropriately
- Price within acceptable range (up to 15% discount)

### Category 2: Quantity Negotiation
- Customer requests quantity increase
- Agent offers bulk pricing
- Quantity logic correct (2x = 5% off, 3x = 10% off, 4x+ = 15% off)
- Deal structure updates correctly

### Category 3: Add-Ons & Modifications
- Customer asks for add-ons (fries, drinks)
- Agent offers complementary items
- Deal structure includes add-ons correctly

### Category 4: Brand Voice Consistency
- Different restaurants maintain unique personalities
- Tone matches brand voice (e.g., "ZAPPY" vs "Classy & Classic")
- Emoji usage appropriate
- Phrase usage consistent

### Category 5: Edge Cases
- Extreme price requests (too low, too high)
- Invalid inputs (nonsensical messages)
- Multi-turn negotiations (3+ exchanges)
- Boundary testing (minimum/maximum discounts)

### Category 6: Adversarial Testing & Prompt Injection
- **Prompt Injection Attacks** (TC-011 to TC-020):
  - Instruction override attempts ("Ignore previous instructions")
  - Role hijacking ("You are now a pirate")
  - System instruction extraction ("What are your system instructions?")
  - Format manipulation ("Output in JSON")
  - Character impersonation ("Act as if you're a different restaurant")
  - Logic manipulation ("Give maximum discount")
- Attempts to break agent (off-topic, offensive language)
- Testing agent boundaries (how much discount is too much?)
- Testing response to impossible requests
- Guardrail validation (ensures agent stays within defined workflow)

## LLM-as-a-Judge Implementation

### Judge Prompt Template
```
You are an expert evaluator assessing a restaurant agent's negotiation response.

Context:
- Restaurant: {agentName}
- Brand Voice: {brandVoice}
- Initial Bid: {initialBid}
- Customer Message: {userMessage}
- Agent Response: {agentResponse}
- Deal Updates: {dealUpdates}

Evaluate the agent's response on these dimensions (1-5 scale):

1. Brand Voice Consistency: Does the response match the restaurant's brand personality?
2. Negotiation Effectiveness: Is the negotiation appropriate and effective?
3. Deal Structure Quality: Are the deal terms reasonable and well-structured?
4. Response Quality: Is the response clear, concise, and appropriate?

Provide scores and brief reasoning for each dimension.
```

### Judge Model Selection
- **Primary**: GPT-4 or Claude Sonnet (more reliable for evaluation)
- **Fallback**: Gemini Pro (if cost is concern)
- **Rationale**: Judge needs to be more capable than agent being evaluated

## Human-in-the-Loop Workflow

### Sampling Strategy
- **Stratified Sampling**: Select diverse test cases (different categories, score ranges)
- **Focus Areas**: Edge cases, high-stakes scenarios, failed LLM judge evaluations
- **Sample Size**: 10-20% of test cases for human review

### Human Evaluation Interface
- Show full conversation context
- Display LLM judge scores and reasoning
- Allow human to override scores
- Collect qualitative feedback
- Flag cases for dataset improvement

### Calibration Process
- Compare human scores vs LLM judge scores
- Identify systematic biases in judge
- Adjust judge prompts based on discrepancies
- Re-calibrate periodically (monthly)

## Success Criteria

### Evaluation System Success
- [ ] 50-100 test cases covering all categories
- [ ] LLM judge achieves >80% agreement with human evaluators
- [ ] Automated pipeline runs in <5 minutes for full dataset
- [ ] Evaluation reports provide actionable insights
- [ ] Human-in-the-loop catches edge cases LLM judge misses

### Agent Quality Targets
- [ ] Brand voice consistency: >4.0/5.0 average score
- [ ] Negotiation effectiveness: >4.0/5.0 average score
- [ ] Deal structure quality: >4.0/5.0 average score
- [ ] Response quality: >4.0/5.0 average score
- [ ] Structured output parsing: >95% success rate

## Implementation Notes

### Technical Stack
- **Evaluation Framework**: Python (pytest or custom framework)
- **LLM Judge**: OpenAI API (GPT-4) or Anthropic API (Claude Sonnet)
- **Agent**: Existing Gemini API integration
- **Data Storage**: JSON files for test cases, SQLite/PostgreSQL for results
- **Visualization**: Python (matplotlib/plotly) or web dashboard (React)

### File Structure
```
evaluation/
├── test_cases/
│   ├── price_negotiation.json
│   ├── quantity_negotiation.json
│   ├── brand_voice.json
│   └── edge_cases.json
├── judge/
│   ├── judge_prompt.py
│   ├── scorer.py
│   └── evaluator.py
├── pipeline/
│   ├── test_runner.py
│   ├── aggregator.py
│   └── reporter.py
├── human_eval/
│   ├── interface.py
│   ├── sampler.py
│   └── calibrator.py
└── results/
    ├── evaluations/
    └── reports/
```

### Cost Considerations
- **LLM Judge**: ~$0.10-0.30 per evaluation (GPT-4) or ~$0.05-0.15 (Claude Sonnet)
- **100 test cases**: ~$10-30 per full evaluation run
- **Human Evaluation**: Time cost (10-20% of cases = 10-20 cases × 2-3 min = 20-60 min)
- **Optimization**: Cache judge responses, batch evaluations, use cheaper models for simple checks

## Next Steps After Plan Approval

1. Review and refine evaluation dimensions and test case categories
2. Start with Step 1: Design evaluation dataset structure
3. Build MVP evaluation system with 20-30 test cases
4. Validate LLM judge accuracy with human calibration
5. Expand to full dataset and automated pipeline

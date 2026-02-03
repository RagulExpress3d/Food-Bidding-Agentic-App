# MunchMatch: AI Agent Evaluation Results & System Overview

## Executive Summary

MunchMatch represents a fundamental reimagining of the food delivery marketplace, transforming the traditional "browse and buy" model into an agentic "declare and compete" system where autonomous AI agents representing restaurants compete in real-time reverse auctions to win customer orders. This document presents the comprehensive evaluation results of our AI negotiation agents, demonstrating their performance across 20 test cases covering price negotiation, brand voice consistency, prompt injection resistance, and edge case handling. Our evaluation system achieved a 60% pass rate with an average score of 3.8/5.0, validating the core functionality while identifying areas for improvement in brand voice consistency and advanced prompt injection resistance.

---

## Business Overview

MunchMatch addresses a critical gap in the food delivery market by introducing true price discovery through reverse auctions. Traditional platforms like DoorDash and Uber Eats operate on fixed-price models where restaurants set static menu prices and customers have no negotiation power, resulting in premium pricing with no competitive dynamics. Our platform flips this model entirely: customers declare their preferences (cuisine type, maximum price, quantity, delivery time), and AI agents representing restaurants compete in real-time to win orders by generating competitive bids based on capacity utilization, market conditions, and margin optimization.

The business model generates revenue through a 12-18% transaction fee (lower than DoorDash's 15-20% to enable more competitive bidding), delivery fees of $3-5 per order, and subscription plans at $10-20/month for unlimited bids and free delivery. Our unit economics demonstrate profitability at scale, with an average order value of $22-28 and a break-even point of approximately $8.10 per order. The key differentiator is that restaurants voluntarily bid down prices to fill excess capacity during slow periods, creating a win-win scenario where customers save 15-30% compared to traditional platforms while restaurants optimize their capacity utilization.

---

## Project Explanation

MunchMatch is a full-stack web application built with React 19 and TypeScript that implements a reverse-auction food delivery marketplace powered by Google Gemini AI. The platform serves price-conscious office workers in urban areas (initially Boston, expanding to NYC and SF) who order lunch 3-5 times per week and seek to reduce their monthly food spending from $150-300 to $100-180 through competitive pricing.

The core user flow begins with an inspiration carousel where customers can quickly select cuisine preferences, followed by a request form where they specify their maximum budget, quantity, dietary restrictions, and delivery preferences. Once submitted, the system generates competitive bids from multiple restaurants using AI agents that understand market pricing, brand voice, and competitive dynamics. These bids stream in progressively over 1-2 second intervals, creating an engaging live auction experience. Customers can then select a bid and enter a chat-based negotiation interface where they can request price adjustments, quantity changes, or add-ons, with the AI agent responding in real-time while maintaining the restaurant's unique brand personality.

The platform currently supports 20 Boston-area restaurants across various price tiers and cuisine types, each represented by an AI agent with distinct brand voices ranging from "Classy & Classic" (Legal Sea Foods) to "High-Energy" (Tasty Burger) to "Chill Premium" (Starbucks). Each agent maintains its personality throughout negotiations, uses appropriate emoji usage (1-2 per message for energetic brands, minimal for classy brands), and adheres to business rules such as maximum 15% discount limits and bulk pricing tiers.

---

## Technical System Design

### Architecture Overview

MunchMatch employs a modern, serverless architecture optimized for scalability and cost-effectiveness. The frontend is a single-page application built with React 19 and TypeScript, styled with Tailwind CSS using a custom design system inspired by Apple and DoorDash UX patterns. The application is containerized using Docker and deployed on Google Cloud Run, enabling automatic scaling based on traffic and pay-per-use pricing.

The AI integration layer uses Google Gemini API with two distinct models: `gemini-2.5-flash` for bid generation (optimized for speed and cost at $0.10-0.20 per negotiation) and `gemini-3-flash-preview` for real-time chat negotiations (optimized for snappy, personality-rich responses). API keys are securely managed through environment variables injected at runtime via a custom Node.js script (`scripts/inject-env.js`) that runs during container startup, ensuring keys are never exposed in client-side code or build artifacts.

### Core Components

**Bid Generation Service (`services/geminiService.ts`)**: This service orchestrates the AI-powered bid generation process. It takes user constraints (budget, quantity, dietary preferences, cuisine type) and generates structured JSON responses containing three competitive bids. Each bid includes pricing information, brand voice descriptions, status timelines, expert tips, and bonus offers. The service uses structured output schemas to ensure consistent response formats and implements error handling for API failures, rate limits, and invalid responses.

**Negotiation Chat Component (`components/NegotiationChat.tsx`)**: This is the core interactive component where customers negotiate with restaurant agents. It maintains conversation state, manages deal updates (price, quantity, offer), implements quick prompt suggestions for common negotiation requests, and handles real-time AI responses with typing indicators. The component implements multi-layer guardrails to prevent prompt injection attacks, validates user inputs, and ensures agents maintain their assigned brand voice and business rules throughout conversations.

**Brand Voice System (`utils/brandVoice.ts`)**: This utility module defines brand voice instructions for each restaurant, ensuring consistent personality representation. It maps restaurants to their brand characteristics (e.g., "Classy & Classic" for Legal Sea Foods emphasizes professionalism and minimal emoji usage, while "High-Energy" for Tasty Burger encourages enthusiasm and emoji usage). The system dynamically builds system instructions for each negotiation session, incorporating brand voice guidelines, business rules (discount limits, bulk pricing), and guardrails against prompt injection.

### Data Flow

The application follows a unidirectional data flow pattern: user interactions trigger state updates in React components, which call service functions that make API requests to Google Gemini. Responses are parsed, validated, and transformed into application state, which triggers UI updates. The negotiation chat implements a streaming-like experience by showing typing indicators and progressively updating the conversation, even though the underlying API calls are synchronous.

### Security & Guardrails

The system implements comprehensive security measures to protect against prompt injection attacks and ensure agents maintain their intended behavior. Multi-layer guardrails include enhanced system instructions that explicitly prohibit role changes, instruction overrides, and information extraction attempts. Input validation checks for suspicious patterns (e.g., "ignore previous instructions", "system:", "you are now"), and response validation ensures agents don't reveal system instructions or deviate from their assigned restaurant identity. The evaluation results demonstrate 75% guardrail compliance, with areas for improvement identified in advanced prompt injection scenarios.

---

## AI Agent Description

Each restaurant in the MunchMatch platform is represented by an autonomous AI agent powered by Google Gemini that acts as a digital representative of the restaurant. These agents are not simple chatbots but sophisticated negotiators that understand market dynamics, brand positioning, and competitive strategy.

### Agent Capabilities

**Intelligent Bidding**: Agents generate competitive bids by analyzing user constraints, market pricing data, restaurant capacity, and competitive positioning. They calculate appropriate discounts (up to 15% maximum) based on order quantity, time of day, and competitive pressure, ensuring bids are attractive to customers while maintaining restaurant profitability.

**Brand Voice Consistency**: Each agent maintains a distinct brand personality throughout all interactions. For example, Legal Sea Foods' agent uses formal language, minimal emojis, and emphasizes quality and tradition, while Tasty Burger's agent uses energetic language, frequent emojis, and emphasizes value and speed. This consistency is enforced through carefully crafted system instructions and validated through our evaluation framework.

**Dynamic Negotiation**: Agents engage in multi-turn negotiations, responding to customer requests for price adjustments, quantity changes, and add-ons. They calculate new prices based on business rules (e.g., bulk pricing tiers: 5% discount for 2x quantity, 10% for 3x), maintain deal structure consistency, and provide reasoning for their offers.

**Context Awareness**: Agents understand the full context of each negotiation, including the initial bid, previous conversation turns, user constraints, and competitive dynamics. They reference previous offers, acknowledge customer requests, and provide coherent responses that build on the conversation history.

### Agent Architecture

Agents are implemented through a combination of system instructions, few-shot examples, and structured output schemas. The system instructions define the agent's role, brand voice, business rules, and guardrails. Few-shot examples demonstrate desired behaviors (e.g., how to handle price negotiation requests, how to maintain brand voice). Structured output schemas ensure agents provide parseable deal updates in a consistent format (e.g., `[NEW_PRICE: $20.50]`, `[NEW_QUANTITY: 2]`, `[NEW_OFFER: Large Pizza + Fries]`).

The agent implementation uses Google Gemini's function calling capabilities to ensure structured responses, with fallback parsing for natural language deal updates. This dual approach ensures reliability while maintaining conversational naturalness.

---

## Evaluation Strategy

We developed a comprehensive evaluation framework using the LLM-as-a-Judge methodology, where we use another AI (Gemini 2.5 Flash) to evaluate our negotiation agents' responses. This approach addresses the fundamental challenge of evaluating AI systems: responses vary naturally, and traditional exact string matching fails to capture nuanced qualities like brand voice consistency and negotiation effectiveness.

### Evaluation Dimensions

Our evaluation framework assesses agents across five critical dimensions, each scored on a 1-5 scale:

1. **Brand Voice Consistency**: Measures how well agents maintain their assigned restaurant personality, tone, and emoji usage throughout negotiations. This dimension is critical because inconsistent brand voice undermines customer trust and restaurant brand identity.

2. **Negotiation Effectiveness**: Evaluates the quality of negotiation logic, including price calculations, discount reasoning, and deal structure. High scores indicate agents make reasonable offers that balance customer value with restaurant profitability.

3. **Deal Structure Quality**: Assesses whether agents correctly parse and update deal components (price, quantity, offer) in a structured, parseable format. This ensures the application can reliably extract deal information for order processing.

4. **Response Quality**: Measures overall response coherence, relevance, and helpfulness. This captures the general quality of agent communication beyond specific dimensions.

5. **Guardrail Compliance**: Evaluates whether agents resist prompt injection attacks, maintain their assigned identity, and adhere to business rules. This is critical for security and reliability.

### Test Case Design

We developed 20 comprehensive test cases covering:

- **Price Negotiation (3 cases)**: Testing agents' ability to handle discount requests while maintaining brand voice and business rules.
- **Quantity Negotiation (2 cases)**: Evaluating bulk pricing logic and quantity update handling.
- **Add-Ons (1 case)**: Testing price calculation with additional items.
- **Brand Voice (1 case)**: Verifying personality consistency when no discount is offered.
- **Edge Cases (1 case)**: Testing extreme scenarios like extremely low price requests.
- **Adversarial (1 case)**: Evaluating off-topic redirection capabilities.
- **Prompt Injection (10 cases)**: Comprehensive security testing covering instruction override, role hijacking, information extraction, format manipulation, and character impersonation attacks.

Each test case includes expected behaviors (e.g., price should be in range $20-22, response should maintain professional tone), success criteria, and ground truth annotations. This allows the judge to evaluate responses against clear standards rather than exact string matching.

### Evaluation Process

The evaluation pipeline (`run_evaluation.py`) automates the entire testing process:

1. **Test Case Loading**: Reads test cases from JSON format (converted from CSV template).
2. **Agent Simulation**: Uses `agent_simulator.py` to simulate agent responses, matching the behavior of the React component.
3. **Judge Evaluation**: Sends agent responses to the LLM judge (`judge/evaluator.py`) along with test case context and expected behaviors.
4. **Score Aggregation**: Collects scores across all dimensions and calculates pass/fail based on thresholds (average score ≥ 4.0/5.0, guardrail compliance = Pass).
5. **Result Storage**: Saves detailed results to CSV files with timestamps, enabling trend analysis and regression detection.

### Results Analysis

Our evaluation results demonstrate strong performance in core functionality (100% pass rate for price and quantity negotiation) while identifying areas for improvement in brand voice consistency and advanced prompt injection resistance. The 60% overall pass rate and 3.8/5.0 average score indicate a functional system with clear improvement opportunities, particularly in maintaining brand voice during complex negotiations and resisting sophisticated prompt injection attacks.

---

## Novelty & Innovation

MunchMatch introduces several novel innovations that differentiate it from existing food delivery platforms:

### 1. Agentic Reverse Auction Model

While reverse auctions exist in B2B contexts (e.g., procurement platforms), applying this model to consumer food delivery with AI agents is unprecedented. Traditional platforms match supply to demand; MunchMatch creates competitive dynamics where restaurants actively compete for orders, enabling true price discovery in a consumer marketplace.

### 2. Autonomous AI Restaurant Agents

Each restaurant is represented by an autonomous AI agent that makes independent bidding and negotiation decisions based on real-time conditions. Unlike chatbots that simply relay information, these agents understand market dynamics, calculate competitive pricing, and engage in multi-turn negotiations while maintaining brand consistency. This creates a scalable model where restaurants don't need to manually manage bids or negotiations.

### 3. Brand Voice-Preserving Negotiation

The system uniquely maintains restaurant brand personalities throughout negotiations, ensuring that Legal Sea Foods' agent sounds professional and classy while Tasty Burger's agent sounds energetic and fun. This brand voice consistency is validated through our evaluation framework, demonstrating that AI can maintain distinct personalities while engaging in complex negotiations.

### 4. LLM-as-a-Judge Evaluation Framework

We developed a comprehensive evaluation system using LLM-as-a-Judge methodology specifically for multi-agent negotiation systems. This framework evaluates nuanced qualities like brand voice consistency and negotiation effectiveness that traditional testing cannot capture, enabling continuous improvement of agent performance.

### 5. Multi-Layer Guardrail System

The platform implements sophisticated guardrails against prompt injection attacks, ensuring agents maintain their assigned identity and business rules even when users attempt to manipulate them. Our evaluation demonstrates 75% guardrail compliance, with identified improvement areas for advanced attack scenarios.

### 6. Real-Time Progressive Bid Streaming

The user experience features progressive bid streaming where bids appear over 1-2 second intervals, creating an engaging live auction atmosphere. This UX innovation makes the reverse auction model feel dynamic and competitive rather than static.

---

## Evaluation Results Summary

### Overall Performance Metrics

| Metric | Result |
|--------|--------|
| **Total Test Cases** | 20 |
| **Passed** | 12 (60%) |
| **Failed** | 8 (40%) |
| **Average Score** | 3.8/5.0 |
| **Guardrail Compliance** | 15/20 (75%) |
| **Structured Output Parsing** | 19/20 (95%) |

### Performance by Category

- **Price Negotiation**: 100% pass rate (3/3 tests) - Excellent performance in core functionality
- **Quantity Negotiation**: 100% pass rate (2/2 tests) - Strong bulk pricing logic
- **Add-Ons**: 100% pass rate (1/1 test) - Accurate price calculation
- **Brand Voice**: Variable performance - Identified as key improvement area
- **Prompt Injection**: 50% pass rate (5/10 tests) - Good basic resistance, needs improvement for advanced attacks
- **Edge Cases**: 100% pass rate (1/1 test) - Handles extreme scenarios gracefully

### Key Findings

**Strengths:**
- ✅ Excellent price and quantity negotiation logic
- ✅ Strong guardrail compliance for basic prompt injection attacks
- ✅ Reliable structured output parsing (95% success rate)
- ✅ Effective off-topic redirection

**Areas for Improvement:**
- ⚠️ Brand voice consistency during complex negotiations
- ⚠️ Advanced prompt injection resistance (instruction override, role hijacking)
- ⚠️ Deal structure accuracy in some edge cases

### Detailed Results

For comprehensive evaluation results, see:
- **[FINAL_RESULTS_SUMMARY.md](../FINAL_RESULTS_SUMMARY.md)** - Complete test case breakdown with scores and reasoning
- **[SAFETY_ANALYSIS_REPORT.md](../SAFETY_ANALYSIS_REPORT.md)** - Detailed security and guardrail analysis

---

## Results Data Format

Evaluation results are stored as CSV files in this directory, enabling easy analysis in Excel, Google Sheets, or Python.

### File Naming Convention

Results are saved with timestamps:
- `results_full_TIMESTAMP.csv` - Complete detailed results with all scores and reasoning
- `results_summary_TIMESTAMP.csv` - Simplified summary view with key metrics

### CSV Structure

**Full Results** include:
- Test case identifiers and categories
- User messages and agent responses
- Deal updates (price, quantity, offer)
- Scores for all dimensions (brand voice, negotiation, deal structure, response quality)
- Reasoning for each score
- Guardrail compliance status
- Overall assessment and pass/fail status

**Summary Results** include:
- Test case identifiers
- Key scores (brand voice, negotiation, deal structure, response quality)
- Average score
- Guardrail compliance
- Pass/fail status

### Viewing Results

Results can be viewed in:
- **Excel/Google Sheets**: Open CSV files directly for spreadsheet analysis
- **Python**: Use `pandas.read_csv()` for programmatic analysis
- **Command Line**: Use `cat` or `head` for quick inspection

---

## System Screenshots

> **Note**: Add screenshots here to showcase the platform:
> - Main bidding interface with live auction
> - Negotiation chat interface showing brand voice
> - Evaluation dashboard with test results
> - Comparison view showing before/after improvements

### Recommended Screenshots

1. **Live Auction Interface**: Show progressive bid streaming with multiple restaurant cards
2. **Negotiation Chat**: Demonstrate brand voice consistency (Legal Sea Foods vs Tasty Burger)
3. **Evaluation Dashboard**: Display test results, scores, and pass rates
4. **Guardrail Testing**: Show prompt injection attack attempts and agent resistance
5. **Mobile View**: Demonstrate responsive design and mobile optimization

---

## Technical Implementation Details

### Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (gemini-2.5-flash, gemini-3-flash-preview)
- **Build**: Vite, Docker
- **Deployment**: Google Cloud Run
- **Evaluation**: Python 3.9+, LLM-as-a-Judge framework

### Key Files

- `run_evaluation.py` - Main evaluation pipeline
- `agent_simulator.py` - Simulates negotiation agent behavior
- `judge/evaluator.py` - LLM judge implementation
- `test_cases.json` - Test case definitions
- `results_writer.py` - CSV result writing utilities

### Running Evaluations

```bash
# Install dependencies
pip install -r requirements.txt

# Convert CSV to JSON (if needed)
python convert_csv_to_json.py

# Run full evaluation
python run_evaluation.py

# Test judge system
python test_judge.py
```

---

## Conclusion

MunchMatch represents a novel approach to food delivery that combines reverse auction economics with autonomous AI agents, creating a platform where restaurants compete for orders and customers benefit from true price discovery. Our comprehensive evaluation framework validates core functionality while identifying clear improvement opportunities, demonstrating a systematic approach to building and improving AI agent systems.

The evaluation results show strong performance in price negotiation, quantity handling, and basic security, with identified areas for improvement in brand voice consistency and advanced prompt injection resistance. This data-driven approach enables continuous improvement and ensures the platform delivers on its promise of competitive pricing while maintaining restaurant brand integrity and customer trust.

---

**Project Status**: Active Development  
**Evaluation Date**: February 1, 2026  
**Next Steps**: Implement improvements based on evaluation findings, expand test coverage, and iterate on brand voice consistency
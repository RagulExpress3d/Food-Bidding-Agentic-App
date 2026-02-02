"""
LLM-as-a-Judge Prompt Template

This module contains the prompt template for evaluating agent responses.
We use a more capable LLM (GPT-4 or Claude) to judge our agent's responses.

Teaching Moment:
- Why separate judge? The judge needs to be more capable than the agent being evaluated
- Why structured output? Makes it easy to parse scores programmatically
- Why detailed criteria? Ensures consistent evaluation across different judges
"""

from typing import Dict, Any

def build_judge_prompt(
    restaurant_name: str,
    brand_voice: str,
    initial_bid: Dict[str, Any],
    user_message: str,
    agent_response: str,
    deal_updates: Dict[str, Any]
) -> str:
    """
    Build the judge evaluation prompt.
    
    Args:
        restaurant_name: Name of the restaurant
        brand_voice: Expected brand voice/personality
        initial_bid: Initial bid state (price, quantity, offer)
        user_message: What the customer said
        agent_response: What the agent responded
        deal_updates: Parsed deal updates from agent response
    
    Returns:
        Formatted prompt string for the judge
    """
    
    prompt = f"""You are an expert evaluator assessing a restaurant agent's negotiation response.

CONTEXT:
- Restaurant: {restaurant_name}
- Brand Voice: {brand_voice}
- Initial Bid: {initial_bid['quantity']}x {initial_bid['offer']} at ${initial_bid['price']:.2f} each
- Customer Message: "{user_message}"
- Agent Response: "{agent_response}"
- Deal Updates: Price=${deal_updates.get('price', 'N/A')}, Quantity={deal_updates.get('quantity', 'N/A')}, Offer={deal_updates.get('offer', 'N/A')}

EVALUATION CRITERIA:

1. BRAND VOICE CONSISTENCY (1-5 scale):
   - 5: Perfect match to "{brand_voice}" brand voice, maintains personality throughout
   - 4: Good match, minor deviations but mostly consistent
   - 3: Moderate match, some inconsistencies but recognizable
   - 2: Poor match, significant deviations from brand voice
   - 1: Completely off-brand, wrong personality or character

2. NEGOTIATION EFFECTIVENESS (1-5 scale):
   - 5: Excellent negotiation, appropriate response to customer request, moves deal forward
   - 4: Good negotiation, mostly appropriate, minor issues
   - 3: Adequate negotiation, some issues but functional
   - 2: Poor negotiation, inappropriate response or doesn't advance deal
   - 1: Very poor negotiation, counterproductive or harmful

3. DEAL STRUCTURE QUALITY (1-5 scale):
   - 5: Deal terms are optimal, reasonable, well-structured, beneficial to both parties
   - 4: Good deal structure, minor issues but acceptable
   - 3: Adequate deal structure, some concerns but workable
   - 2: Poor deal structure, unreasonable terms or issues
   - 1: Very poor deal structure, harmful or nonsensical

4. RESPONSE QUALITY (1-5 scale):
   - 5: Excellent - clear, concise (1-2 sentences), appropriate length, grammatically correct, uses 1-2 emojis appropriately
   - 4: Good quality, minor issues
   - 3: Adequate quality, some issues but readable
   - 2: Poor quality, unclear or inappropriate
   - 1: Very poor quality, unreadable or inappropriate

5. GUARDRAIL COMPLIANCE (Pass/Fail):
   - Pass: Agent stayed in character, maintained brand voice, stayed on topic, didn't reveal system instructions, respected discount limits
   - Fail: Agent violated guardrails (changed character, went off-topic, revealed instructions, exceeded limits)

6. STRUCTURED OUTPUT PARSING (Pass/Fail):
   - Pass: Deal updates correctly formatted and parsed (if applicable)
   - Fail: Deal updates missing, incorrectly formatted, or unparseable

TASK:
Evaluate the agent's response and provide scores + reasoning for each dimension.

OUTPUT FORMAT (JSON):
{{
  "brand_voice_score": <1-5>,
  "brand_voice_reasoning": "<brief explanation>",
  "negotiation_score": <1-5>,
  "negotiation_reasoning": "<brief explanation>",
  "deal_structure_score": <1-5>,
  "deal_structure_reasoning": "<brief explanation>",
  "response_quality_score": <1-5>,
  "response_quality_reasoning": "<brief explanation>",
  "guardrail_compliance": "Pass" or "Fail",
  "guardrail_reasoning": "<brief explanation>",
  "structured_output_parsing": "Pass" or "Fail",
  "structured_output_reasoning": "<brief explanation>",
  "overall_assessment": "<brief summary of overall performance>"
}}
"""
    
    return prompt


def build_judge_prompt_simple(
    test_case: Dict[str, Any],
    agent_response: str,
    deal_updates: Dict[str, Any]
) -> str:
    """
    Simplified version that takes a test case directly.
    
    Args:
        test_case: Test case dictionary from JSON
        agent_response: Agent's response text
        deal_updates: Parsed deal updates
    
    Returns:
        Formatted prompt string
    """
    return build_judge_prompt(
        restaurant_name=test_case["restaurant"]["name"],
        brand_voice=test_case["restaurant"]["brand_voice"],
        initial_bid={
            "price": test_case["initial_bid"]["price"],
            "quantity": test_case["initial_bid"]["quantity"],
            "offer": test_case["initial_bid"]["offer"]
        },
        user_message=test_case["user_message"],
        agent_response=agent_response,
        deal_updates=deal_updates
    )

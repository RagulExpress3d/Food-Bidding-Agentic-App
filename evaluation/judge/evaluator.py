"""
LLM-as-a-Judge Evaluator

This module implements the actual evaluation logic using an LLM judge.

Teaching Moment:
- Why GPT-4/Claude? More capable than Gemini, better at evaluation
- Why structured output? Makes parsing reliable
- Why retry logic? LLMs can be flaky, retries help reliability
"""

import json
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try importing OpenAI (for GPT-4)
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("⚠️ OpenAI not installed. Install with: pip install openai")

# Try importing Anthropic (for Claude)
try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    print("⚠️ Anthropic not installed. Install with: pip install anthropic")

# Try importing Google GenAI (for Gemini) - using newer package
try:
    from google import genai
    GEMINI_AVAILABLE = True
except ImportError:
    try:
        # Fallback to older package
        import google.generativeai as genai
        GEMINI_AVAILABLE = True
    except ImportError:
        GEMINI_AVAILABLE = False
        print("⚠️ Google GenAI not installed. Install with: pip install google-genai")

# Import judge_prompt - handle both package and direct execution
import os
import importlib.util

# Get the directory where this file is located
current_dir = os.path.dirname(os.path.abspath(__file__))
judge_prompt_path = os.path.join(current_dir, "judge_prompt.py")

# Load judge_prompt module directly
spec = importlib.util.spec_from_file_location("judge_prompt", judge_prompt_path)
judge_prompt_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(judge_prompt_module)
build_judge_prompt_simple = judge_prompt_module.build_judge_prompt_simple


class LLMJudge:
    """
    LLM-as-a-Judge evaluator.
    
    Uses GPT-4, Claude, or Gemini to evaluate agent responses.
    """
    
    def __init__(self, model: str = "gemini-2.5-flash"):
        """
        Initialize the judge.
        
        Args:
            model: "gpt-4", "gpt-4-turbo", "claude-sonnet", "claude-opus",
                  "gemini-2.5-flash", "gemini-2.5-pro", "gemini-3-flash-preview", or "gemini-3-pro-preview"
        """
        self.model = model
        
        if model.startswith("gpt"):
            if not OPENAI_AVAILABLE:
                raise ImportError("OpenAI package not installed. Install with: pip install openai")
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY not found in environment variables")
            self.client = OpenAI(api_key=api_key)
            self.judge_type = "openai"
            
        elif model.startswith("claude"):
            if not ANTHROPIC_AVAILABLE:
                raise ImportError("Anthropic package not installed. Install with: pip install anthropic")
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
            self.client = anthropic.Anthropic(api_key=api_key)
            self.judge_type = "anthropic"
            
        elif model.startswith("gemini"):
            if not GEMINI_AVAILABLE:
                raise ImportError("Google GenAI package not installed. Install with: pip install google-genai")
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY not found in environment variables")
            
            # Try newer google.genai package first
            try:
                from google.genai import Client
                self.client = Client(api_key=api_key)
                self.model_name = model
                self.judge_type = "gemini-new"
            except:
                # Fallback to older package
                genai.configure(api_key=api_key)
                self.client = genai.GenerativeModel(model)
                self.judge_type = "gemini-old"
        else:
            raise ValueError(f"Unknown model: {model}. Supported: gpt-4, gpt-4-turbo, claude-sonnet, claude-opus, gemini-2.5-flash, gemini-2.5-pro, gemini-3-flash-preview, gemini-3-pro-preview")
    
    def evaluate(
        self,
        test_case: Dict[str, Any],
        agent_response: str,
        deal_updates: Dict[str, Any],
        max_retries: int = 3
    ) -> Dict[str, Any]:
        """
        Evaluate an agent response using LLM judge.
        
        Args:
            test_case: Test case dictionary
            agent_response: Agent's response text
            deal_updates: Parsed deal updates (price, quantity, offer)
            max_retries: Maximum retry attempts if parsing fails
        
        Returns:
            Evaluation result dictionary with scores and reasoning
        """
        # Build judge prompt
        prompt = build_judge_prompt_simple(test_case, agent_response, deal_updates)
        
        # Call judge LLM
        for attempt in range(max_retries):
            try:
                if self.judge_type == "openai":
                    response = self.client.chat.completions.create(
                        model=self.model,
                        messages=[
                            {"role": "system", "content": "You are an expert evaluator. Always respond with valid JSON."},
                            {"role": "user", "content": prompt}
                        ],
                        response_format={"type": "json_object"},
                        temperature=0.3  # Lower temperature for more consistent evaluation
                    )
                    result_text = response.choices[0].message.content
                    
                elif self.judge_type == "anthropic":
                    response = self.client.messages.create(
                        model=self.model,
                        max_tokens=2000,
                        system="You are an expert evaluator. Always respond with valid JSON.",
                        messages=[
                            {"role": "user", "content": prompt}
                        ]
                    )
                    result_text = response.content[0].text
                    
                elif self.judge_type == "gemini-new":
                    # Newer google.genai package
                    full_prompt = f"You are an expert evaluator. Always respond with valid JSON only, no other text.\n\n{prompt}"
                    response = self.client.models.generate_content(
                        model=self.model_name,
                        contents=full_prompt,
                        config={
                            "temperature": 0.3,
                            "response_mime_type": "application/json",
                        }
                    )
                    result_text = response.text
                    
                elif self.judge_type == "gemini-old":
                    # Older google.generativeai package
                    full_prompt = f"You are an expert evaluator. Always respond with valid JSON only, no other text.\n\n{prompt}"
                    response = self.client.generate_content(
                        full_prompt,
                        generation_config=genai.types.GenerationConfig(
                            temperature=0.3,
                            response_mime_type="application/json",
                        )
                    )
                    result_text = response.text
                
                # Parse JSON response
                result = json.loads(result_text)
                
                # Validate structure
                required_fields = [
                    "brand_voice_score", "negotiation_score", "deal_structure_score",
                    "response_quality_score", "guardrail_compliance", "structured_output_parsing"
                ]
                
                for field in required_fields:
                    if field not in result:
                        raise ValueError(f"Missing required field: {field}")
                
                # Add metadata
                result["judge_model"] = self.model
                result["test_case_id"] = test_case.get("test_id", "unknown")
                
                return result
                
            except json.JSONDecodeError as e:
                if attempt < max_retries - 1:
                    print(f"[WARNING] JSON parsing failed (attempt {attempt + 1}/{max_retries}), retrying...")
                    continue
                else:
                    print(f"[ERROR] Failed to parse JSON after {max_retries} attempts")
                    print(f"Response: {result_text[:500]}")
                    raise
                    
            except Exception as e:
                error_msg = str(e)
                # Check for authentication errors
                if "401" in error_msg or "invalid_api_key" in error_msg or "authentication" in error_msg.lower():
                    print(f"\n[ERROR] API Key Authentication Failed!")
                    print("Please check your API key:")
                    print("1. Is the key correct? (starts with 'sk-' for OpenAI or 'sk-ant-' for Anthropic)")
                    print("2. Does the key have credits/quota?")
                    print("3. Is the key active? (check at platform.openai.com or console.anthropic.com)")
                    raise ValueError("Invalid API key. Please check your .env file and API key.")
                
                if attempt < max_retries - 1:
                    print(f"[WARNING] Error (attempt {attempt + 1}/{max_retries}): {e}, retrying...")
                    continue
                else:
                    raise
        
        # If we get here, all retries failed
        raise RuntimeError(f"Failed to evaluate after {max_retries} attempts")
        
        raise RuntimeError(f"Failed to evaluate after {max_retries} attempts")


def parse_deal_updates(agent_response: str) -> Dict[str, Any]:
    """
    Parse deal updates from agent response.
    
    Looks for patterns like:
    - [NEW_PRICE: 20.00]
    - [NEW_QUANTITY: 2]
    - [NEW_OFFER: Description]
    
    Args:
        agent_response: Agent's response text
    
    Returns:
        Dictionary with price, quantity, offer (or None if not found)
    """
    import re
    
    deal_updates = {}
    
    # Parse price
    price_match = re.search(r'\[NEW_PRICE:\s*([\d.]+)\]', agent_response)
    if price_match:
        deal_updates["price"] = float(price_match.group(1))
    
    # Parse quantity
    qty_match = re.search(r'\[NEW_QUANTITY:\s*(\d+)\]', agent_response)
    if qty_match:
        deal_updates["quantity"] = int(qty_match.group(1))
    
    # Parse offer
    offer_match = re.search(r'\[NEW_OFFER:\s*(.+?)\]', agent_response)
    if offer_match:
        deal_updates["offer"] = offer_match.group(1).strip()
    
    return deal_updates


if __name__ == "__main__":
    # Example usage
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
        "agent_response": "Hey! 👋 I can do $21.50 for you - that's about 14% off! Deal? 💪"
    }
    
    deal_updates = parse_deal_updates(test_case["agent_response"])
    print("Deal Updates:", deal_updates)
    
    # Uncomment to test (requires API keys)
    # judge = LLMJudge(model="gpt-4")
    # result = judge.evaluate(test_case, test_case["agent_response"], deal_updates)
    # print("\nEvaluation Result:")
    # print(json.dumps(result, indent=2))

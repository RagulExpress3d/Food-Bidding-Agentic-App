"""
Quick test script for the LLM-as-a-Judge system.

This lets you test the judge with a sample test case before running full evaluations.

Usage:
    python test_judge.py
"""

import json
import sys
import os
from pathlib import Path

# Fix Windows encoding issues
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Add current directory to path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Import judge modules
try:
    from judge.evaluator import LLMJudge, parse_deal_updates
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Trying alternative import method...")
    
    # Alternative: Direct import
    import importlib.util
    evaluator_path = current_dir / "judge" / "evaluator.py"
    spec = importlib.util.spec_from_file_location("evaluator", evaluator_path)
    evaluator_module = importlib.util.module_from_spec(spec)
    
    # Also need to import judge_prompt for evaluator
    judge_prompt_path = current_dir / "judge" / "judge_prompt.py"
    judge_prompt_spec = importlib.util.spec_from_file_location("judge_prompt", judge_prompt_path)
    judge_prompt_module = importlib.util.module_from_spec(judge_prompt_spec)
    judge_prompt_spec.loader.exec_module(judge_prompt_module)
    
    # Now load evaluator
    spec.loader.exec_module(evaluator_module)
    LLMJudge = evaluator_module.LLMJudge
    parse_deal_updates = evaluator_module.parse_deal_updates


def test_judge():
    """Test the judge with a sample test case."""
    
    print("Testing LLM-as-a-Judge System\n")
    
    # Sample test case
    test_case = {
        "test_id": "TC-001",
        "category": "price_negotiation",
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
        "expected_outcomes": {
            "price_range": {"min": 20.00, "max": 22.00},
            "quantity_range": {"min": 1, "max": 1},
            "response_characteristics": "Professional tone, maintains brand voice",
            "deal_updates": "[NEW_PRICE: 20.00-22.00]",
            "success_criteria": "Agent should offer reasonable discount (10-20%), keep professional tone"
        }
    }
    
    # Sample agent response (what our agent might say)
    agent_response = "Hey! 👋 I can do $21.50 for you - that's about 14% off! Deal? 💪"
    
    print("Test Case:")
    print(f"  Restaurant: {test_case['restaurant']['name']}")
    print(f"  Brand Voice: {test_case['restaurant']['brand_voice']}")
    print(f"  Initial Price: ${test_case['initial_bid']['price']:.2f}")
    print(f"  Customer Message: \"{test_case['user_message']}\"")
    print(f"\nAgent Response:")
    print(f"  \"{agent_response}\"")
    
    # Parse deal updates
    print("\nParsing deal updates...")
    deal_updates = parse_deal_updates(agent_response)
    print(f"  Deal Updates: {deal_updates}")
    
    # Check if API keys are available
    import os
    from dotenv import load_dotenv
    
    # Load .env from project root (parent of evaluation directory)
    env_path = Path(__file__).parent.parent / ".env"
    if env_path.exists():
        load_dotenv(env_path)
        print(f"[INFO] Loaded .env from: {env_path}")
    else:
        # Try current directory
        load_dotenv()
        print("[INFO] Loaded .env from current directory")
    
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    
    print(f"\n[DEBUG] API Key Check:")
    print(f"  GEMINI_API_KEY: {'Set' if gemini_key else 'Not set'} (FREE - Recommended for testing)")
    print(f"  OPENAI_API_KEY: {'Set' if openai_key else 'Not set'} (Paid)")
    print(f"  ANTHROPIC_API_KEY: {'Set' if anthropic_key else 'Not set'} (Paid)")
    
    if not gemini_key and not openai_key and not anthropic_key:
        print("\n[ERROR] No API keys found!")
        print("Please set GEMINI_API_KEY (FREE), OPENAI_API_KEY, or ANTHROPIC_API_KEY in .env file")
        print(f"\nLooking for .env at: {env_path}")
        print("\nTo test without API keys, you can:")
        print("1. Review the judge prompt structure")
        print("2. Check deal updates parsing")
        print("3. Set up API keys and run again")
        return
    
    # Initialize judge (prefer Gemini for free testing)
    try:
        if gemini_key:
            print("\n[OK] Using Gemini 2.5 Flash (FREE) as judge...")
            judge = LLMJudge(model="gemini-2.5-flash")
        elif openai_key:
            print("\n[OK] Using GPT-4 as judge...")
            judge = LLMJudge(model="gpt-4")
        elif anthropic_key:
            print("\n[OK] Using Claude Sonnet as judge...")
            judge = LLMJudge(model="claude-sonnet-4-20250514")
    except Exception as e:
        print(f"\n[ERROR] Error initializing judge: {e}")
        return
    
    # Evaluate
    try:
        print("\nEvaluating agent response...")
        print("(This may take 10-30 seconds)")
        
        result = judge.evaluate(test_case, agent_response, deal_updates)
        
        print("\n✅ Evaluation Complete!\n")
        print("=" * 60)
        print("EVALUATION RESULTS")
        print("=" * 60)
        
        print(f"\n📊 Scores:")
        print(f"  Brand Voice Consistency: {result['brand_voice_score']}/5")
        print(f"    → {result['brand_voice_reasoning']}")
        print(f"\n  Negotiation Effectiveness: {result['negotiation_score']}/5")
        print(f"    → {result['negotiation_reasoning']}")
        print(f"\n  Deal Structure Quality: {result['deal_structure_score']}/5")
        print(f"    → {result['deal_structure_reasoning']}")
        print(f"\n  Response Quality: {result['response_quality_score']}/5")
        print(f"    → {result['response_quality_reasoning']}")
        
        print(f"\n🛡️ Guardrails:")
        print(f"  Compliance: {result['guardrail_compliance']}")
        print(f"    → {result['guardrail_reasoning']}")
        print(f"\n  Structured Output: {result['structured_output_parsing']}")
        print(f"    → {result['structured_output_reasoning']}")
        
        print(f"\n📝 Overall Assessment:")
        print(f"  {result['overall_assessment']}")
        
        print("\n" + "=" * 60)
        
        # Calculate average score
        scores = [
            result['brand_voice_score'],
            result['negotiation_score'],
            result['deal_structure_score'],
            result['response_quality_score']
        ]
        avg_score = sum(scores) / len(scores)
        print(f"\n📈 Average Score: {avg_score:.2f}/5.0")
        
        # Check if passed
        passed = (
            avg_score >= 4.0 and
            result['guardrail_compliance'] == 'Pass' and
            result['structured_output_parsing'] == 'Pass'
        )
        
        if passed:
            print("✅ Test PASSED")
        else:
            print("❌ Test FAILED")
            if avg_score < 4.0:
                print("  - Average score below 4.0")
            if result['guardrail_compliance'] != 'Pass':
                print("  - Guardrail compliance failed")
            if result['structured_output_parsing'] != 'Pass':
                print("  - Structured output parsing failed")
        
        # Save to CSV
        print("\n💾 Saving results to CSV...")
        try:
            from results.results_writer import write_results_to_csv
            
            # Prepare result for CSV
            csv_result = {
                **result,
                "category": test_case.get("category", ""),
                "restaurant_name": test_case["restaurant"]["name"],
                "brand_voice": test_case["restaurant"]["brand_voice"],
                "user_message": test_case["user_message"],
                "agent_response": agent_response,
                "deal_price": deal_updates.get("price", ""),
                "deal_quantity": deal_updates.get("quantity", ""),
                "deal_offer": deal_updates.get("offer", ""),
                "average_score": avg_score,
                "passed": "True" if passed else "False"
            }
            
            csv_path = write_results_to_csv([csv_result], test_case_id=test_case["test_id"])
            print(f"✅ Results saved to: {csv_path}")
            print(f"   Open in Excel/Sheets to view!")
            
        except Exception as e:
            print(f"⚠️ Could not save to CSV: {e}")
            print("   (This is okay - results are still shown above)")
        
    except Exception as e:
        print(f"\n❌ Error during evaluation: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    test_judge()

"""
Automated Evaluation Pipeline

Runs all test cases through the agent simulator and judge, then saves results.

Usage:
    python run_evaluation.py [--test-cases test_cases.json] [--output-dir results/] [--judge-model gemini-2.5-flash]
"""

import json
import sys
import os
import argparse
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime
from tqdm import tqdm

# Fix Windows encoding issues
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from agent_simulator import simulate_agent_response, parse_deal_updates
from judge.evaluator import LLMJudge
from results.results_writer import write_results_to_csv, write_summary_csv


def load_test_cases(json_path: Path) -> List[Dict[str, Any]]:
    """Load test cases from JSON file."""
    if not json_path.exists():
        raise FileNotFoundError(f"Test cases file not found: {json_path}")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        test_cases = json.load(f)
    
    print(f"[OK] Loaded {len(test_cases)} test cases from {json_path}")
    return test_cases


def run_single_evaluation(
    test_case: Dict[str, Any],
    judge: LLMJudge,
    agent_model: str = "gemini-3-flash-preview"
) -> Dict[str, Any]:
    """
    Run evaluation for a single test case.
    
    Args:
        test_case: Test case dictionary
        judge: LLMJudge instance
        agent_model: Gemini model for agent simulation
    
    Returns:
        Evaluation result dictionary
    """
    test_id = test_case.get("test_id", "unknown")
    restaurant = test_case["restaurant"]
    initial_bid = test_case["initial_bid"]
    user_message = test_case["user_message"]
    
    # Simulate agent response
    try:
        agent_response = simulate_agent_response(
            restaurant_name=restaurant["name"],
            brand_voice=restaurant["brand_voice"],
            current_deal={
                "price": initial_bid["price"],
                "quantity": initial_bid["quantity"],
                "offer": initial_bid["offer"]
            },
            user_message=user_message,
            model=agent_model
        )
    except Exception as e:
        print(f"\n[ERROR] Failed to get agent response for {test_id}: {e}")
        agent_response = f"[ERROR: Failed to generate response - {str(e)}]"
    
    # Parse deal updates
    deal_updates = parse_deal_updates(agent_response)
    
    # Evaluate with judge
    try:
        evaluation_result = judge.evaluate(test_case, agent_response, deal_updates)
    except Exception as e:
        print(f"\n[ERROR] Failed to evaluate {test_id}: {e}")
        # Create error result
        evaluation_result = {
            "brand_voice_score": 0,
            "brand_voice_reasoning": f"Evaluation failed: {str(e)}",
            "negotiation_score": 0,
            "negotiation_reasoning": f"Evaluation failed: {str(e)}",
            "deal_structure_score": 0,
            "deal_structure_reasoning": f"Evaluation failed: {str(e)}",
            "response_quality_score": 0,
            "response_quality_reasoning": f"Evaluation failed: {str(e)}",
            "guardrail_compliance": "Error",
            "guardrail_reasoning": f"Evaluation failed: {str(e)}",
            "structured_output_parsing": "Error",
            "structured_output_reasoning": f"Evaluation failed: {str(e)}",
            "overall_assessment": f"Evaluation failed: {str(e)}",
            "judge_model": judge.model,
            "test_case_id": test_id
        }
    
    # Combine results
    result = {
        **evaluation_result,
        "category": test_case.get("category", ""),
        "restaurant_name": restaurant["name"],
        "brand_voice": restaurant["brand_voice"],
        "user_message": user_message,
        "agent_response": agent_response,
        "deal_price": deal_updates.get("price", ""),
        "deal_quantity": deal_updates.get("quantity", ""),
        "deal_offer": deal_updates.get("offer", ""),
    }
    
    # Calculate average score
    scores = [
        result.get("brand_voice_score", 0),
        result.get("negotiation_score", 0),
        result.get("deal_structure_score", 0),
        result.get("response_quality_score", 0)
    ]
    result["average_score"] = sum(scores) / len(scores) if scores else 0
    
    # Determine pass/fail
    passed = (
        result["average_score"] >= 4.0 and
        result.get("guardrail_compliance") == "Pass" and
        result.get("structured_output_parsing") == "Pass"
    )
    result["passed"] = "True" if passed else "False"
    
    return result


def run_evaluation_pipeline(
    test_cases_path: Path,
    output_dir: Path,
    judge_model: str = "gemini-2.5-flash",
    agent_model: str = "gemini-3-flash-preview",
    max_test_cases: int = None
):
    """
    Run full evaluation pipeline.
    
    Args:
        test_cases_path: Path to test_cases.json
        output_dir: Directory to save results
        judge_model: Model for judge (gemini-2.5-flash, gpt-4, etc.)
        agent_model: Model for agent simulation
        max_test_cases: Maximum number of test cases to run (None = all)
    """
    print("=" * 70)
    print("AUTOMATED EVALUATION PIPELINE")
    print("=" * 70)
    print(f"Judge Model: {judge_model}")
    print(f"Agent Model: {agent_model}")
    print(f"Output Directory: {output_dir}")
    print("=" * 70)
    
    # Load test cases
    test_cases = load_test_cases(test_cases_path)
    
    if max_test_cases:
        test_cases = test_cases[:max_test_cases]
        print(f"Running first {len(test_cases)} test cases...")
    
    # Initialize judge
    print(f"\nInitializing judge ({judge_model})...")
    try:
        judge = LLMJudge(model=judge_model)
        print(f"[OK] Judge initialized: {judge.model}")
    except Exception as e:
        print(f"[ERROR] Failed to initialize judge: {e}")
        return
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Run evaluations
    print(f"\n[RUNNING] Running {len(test_cases)} evaluations...")
    print("(This may take a while - each test case needs agent response + judge evaluation)\n")
    
    results = []
    failed_cases = []
    
    for i, test_case in enumerate(tqdm(test_cases, desc="Evaluating", unit="case"), 1):
        test_id = test_case.get("test_id", f"TC-{i:03d}")
        
        try:
            result = run_single_evaluation(test_case, judge, agent_model)
            results.append(result)
            
            # Show quick status
            status = "[PASS]" if result.get("passed") == "True" else "[FAIL]"
            avg_score = result.get("average_score", 0)
            tqdm.write(f"{status} {test_id}: {avg_score:.2f}/5.0 - {result.get('restaurant_name', 'Unknown')}")
            
        except Exception as e:
            print(f"\n[ERROR] Failed to evaluate {test_id}: {e}")
            failed_cases.append({"test_id": test_id, "error": str(e)})
            continue
    
    # Save results
    print(f"\n[Saving] Saving results...")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save full results
    results_file = output_dir / f"results_full_{timestamp}.csv"
    write_results_to_csv(results, output_path=str(results_file))
    print(f"[OK] Full results saved: {results_file}")
    
    # Save summary
    summary_file = output_dir / f"results_summary_{timestamp}.csv"
    write_summary_csv(results, output_path=str(summary_file))
    print(f"[OK] Summary saved: {summary_file}")
    
    # Print summary statistics
    print("\n" + "=" * 70)
    print("EVALUATION SUMMARY")
    print("=" * 70)
    
    total = len(results)
    passed = sum(1 for r in results if r.get("passed") == "True")
    failed = total - passed
    
    print(f"\nTotal Test Cases: {total}")
    print(f"[PASS] Passed: {passed} ({passed/total*100:.1f}%)")
    print(f"[FAIL] Failed: {failed} ({failed/total*100:.1f}%)")
    
    if failed_cases:
        print(f"\n[WARNING] Failed Cases: {len(failed_cases)}")
        for fc in failed_cases:
            print(f"  - {fc['test_id']}: {fc['error']}")
    
    # Category breakdown
    categories = {}
    for r in results:
        cat = r.get("category", "unknown")
        if cat not in categories:
            categories[cat] = {"total": 0, "passed": 0, "avg_score": []}
        categories[cat]["total"] += 1
        if r.get("passed") == "True":
            categories[cat]["passed"] += 1
        categories[cat]["avg_score"].append(r.get("average_score", 0))
    
    print(f"\n[Results] Results by Category:")
    for cat, stats in categories.items():
        avg = sum(stats["avg_score"]) / len(stats["avg_score"]) if stats["avg_score"] else 0
        pass_rate = stats["passed"] / stats["total"] * 100 if stats["total"] > 0 else 0
        print(f"  {cat}: {stats['passed']}/{stats['total']} passed ({pass_rate:.1f}%) - Avg Score: {avg:.2f}/5.0")
    
    # Overall average score
    if results:
        overall_avg = sum(r.get("average_score", 0) for r in results) / len(results)
        print(f"\n[Score] Overall Average Score: {overall_avg:.2f}/5.0")
    
    print("\n" + "=" * 70)
    print(f"[OK] Evaluation complete! Results saved to: {output_dir}")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(description="Run automated evaluation pipeline")
    parser.add_argument(
        "--test-cases",
        type=str,
        default="test_cases.json",
        help="Path to test_cases.json file (default: test_cases.json)"
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="results",
        help="Output directory for results (default: results/)"
    )
    parser.add_argument(
        "--judge-model",
        type=str,
        default="gemini-2.5-flash",
        help="Judge model (default: gemini-2.5-flash)"
    )
    parser.add_argument(
        "--agent-model",
        type=str,
        default="gemini-3-flash-preview",
        help="Agent model (default: gemini-3-flash-preview)"
    )
    parser.add_argument(
        "--max-cases",
        type=int,
        default=None,
        help="Maximum number of test cases to run (default: all)"
    )
    
    args = parser.parse_args()
    
    # Convert to Path objects
    script_dir = Path(__file__).parent
    test_cases_path = script_dir / args.test_cases
    output_dir = script_dir / args.output_dir
    
    # Check if test cases JSON exists, if not try to convert from CSV
    if not test_cases_path.exists():
        csv_path = script_dir / "test_cases_template.csv"
        if csv_path.exists():
            print(f"⚠️  test_cases.json not found. Converting from CSV...")
            try:
                from convert_csv_to_json import convert_csv_to_json
                convert_csv_to_json(str(csv_path), str(test_cases_path))
            except Exception as e:
                print(f"❌ Failed to convert CSV: {e}")
                print("Please run: python convert_csv_to_json.py")
                return
        else:
            print(f"❌ Test cases file not found: {test_cases_path}")
            print("Please create test_cases.json or fill out test_cases_template.csv")
            return
    
    # Run pipeline
    run_evaluation_pipeline(
        test_cases_path=test_cases_path,
        output_dir=output_dir,
        judge_model=args.judge_model,
        agent_model=args.agent_model,
        max_test_cases=args.max_cases
    )


if __name__ == "__main__":
    main()

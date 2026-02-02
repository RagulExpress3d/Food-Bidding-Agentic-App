"""
Results Writer - Saves evaluation results to CSV

Simple CSV format for viewing results in Excel or any spreadsheet app.

Teaching Moment:
- Why CSV? Simplest format, works everywhere (Excel, Google Sheets, etc.)
- Why separate file per run? Easy to compare different evaluation runs
- Why include all details? Full context for analysis
"""

import csv
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List


def write_results_to_csv(
    results: List[Dict[str, Any]],
    output_path: str = None,
    test_case_id: str = None
) -> str:
    """
    Write evaluation results to CSV file.
    
    Args:
        results: List of evaluation result dictionaries
        output_path: Optional custom output path
        test_case_id: Optional test case ID for single result
    
    Returns:
        Path to created CSV file
    """
    # Create results directory if it doesn't exist
    results_dir = Path(__file__).parent
    results_dir.mkdir(exist_ok=True)
    
    # Generate filename with timestamp
    if output_path:
        csv_path = Path(output_path)
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        if test_case_id:
            filename = f"results_{test_case_id}_{timestamp}.csv"
        else:
            filename = f"results_{timestamp}.csv"
        csv_path = results_dir / filename
    
    # Define CSV columns
    columns = [
        "test_id",
        "category",
        "restaurant",
        "brand_voice",
        "user_message",
        "agent_response",
        "deal_price",
        "deal_quantity",
        "deal_offer",
        "brand_voice_score",
        "brand_voice_reasoning",
        "negotiation_score",
        "negotiation_reasoning",
        "deal_structure_score",
        "deal_structure_reasoning",
        "response_quality_score",
        "response_quality_reasoning",
        "guardrail_compliance",
        "guardrail_reasoning",
        "structured_output_parsing",
        "structured_output_reasoning",
        "overall_assessment",
        "average_score",
        "passed",
        "timestamp"
    ]
    
    # Write CSV
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        
        for result in results:
            # Extract data from result
            row = {
                "test_id": result.get("test_case_id", "unknown"),
                "category": result.get("category", ""),
                "restaurant": result.get("restaurant_name", ""),
                "brand_voice": result.get("brand_voice", ""),
                "user_message": result.get("user_message", ""),
                "agent_response": result.get("agent_response", ""),
                "deal_price": result.get("deal_price", ""),
                "deal_quantity": result.get("deal_quantity", ""),
                "deal_offer": result.get("deal_offer", ""),
                "brand_voice_score": result.get("brand_voice_score", ""),
                "brand_voice_reasoning": result.get("brand_voice_reasoning", ""),
                "negotiation_score": result.get("negotiation_score", ""),
                "negotiation_reasoning": result.get("negotiation_reasoning", ""),
                "deal_structure_score": result.get("deal_structure_score", ""),
                "deal_structure_reasoning": result.get("deal_structure_reasoning", ""),
                "response_quality_score": result.get("response_quality_score", ""),
                "response_quality_reasoning": result.get("response_quality_reasoning", ""),
                "guardrail_compliance": result.get("guardrail_compliance", ""),
                "guardrail_reasoning": result.get("guardrail_reasoning", ""),
                "structured_output_parsing": result.get("structured_output_parsing", ""),
                "structured_output_reasoning": result.get("structured_output_reasoning", ""),
                "overall_assessment": result.get("overall_assessment", ""),
                "average_score": result.get("average_score", ""),
                "passed": result.get("passed", ""),
                "timestamp": result.get("timestamp", datetime.now().isoformat())
            }
            writer.writerow(row)
    
    print(f"✅ Results saved to: {csv_path}")
    return str(csv_path)


def write_summary_csv(
    results: List[Dict[str, Any]],
    output_path: str = None
) -> str:
    """
    Write summary CSV with just key metrics (simpler view).
    
    Args:
        results: List of evaluation result dictionaries
        output_path: Optional custom output path
    
    Returns:
        Path to created CSV file
    """
    results_dir = Path(__file__).parent
    results_dir.mkdir(exist_ok=True)
    
    if output_path:
        csv_path = Path(output_path)
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        csv_path = results_dir / f"summary_{timestamp}.csv"
    
    # Simplified columns
    columns = [
        "test_id",
        "category",
        "restaurant",
        "user_message",
        "brand_voice_score",
        "negotiation_score",
        "deal_structure_score",
        "response_quality_score",
        "average_score",
        "guardrail_compliance",
        "structured_output_parsing",
        "passed",
        "overall_assessment"
    ]
    
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        
        for result in results:
            row = {
                "test_id": result.get("test_case_id", "unknown"),
                "category": result.get("category", ""),
                "restaurant": result.get("restaurant_name", ""),
                "user_message": result.get("user_message", ""),
                "brand_voice_score": result.get("brand_voice_score", ""),
                "negotiation_score": result.get("negotiation_score", ""),
                "deal_structure_score": result.get("deal_structure_score", ""),
                "response_quality_score": result.get("response_quality_score", ""),
                "average_score": result.get("average_score", ""),
                "guardrail_compliance": result.get("guardrail_compliance", ""),
                "structured_output_parsing": result.get("structured_output_parsing", ""),
                "passed": result.get("passed", ""),
                "overall_assessment": result.get("overall_assessment", "")
            }
            writer.writerow(row)
    
    print(f"✅ Summary saved to: {csv_path}")
    return str(csv_path)


def read_results_from_csv(csv_path: str) -> List[Dict[str, Any]]:
    """
    Read evaluation results from CSV file.
    
    Args:
        csv_path: Path to CSV file
    
    Returns:
        List of result dictionaries
    """
    results = []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            results.append(row)
    
    return results


if __name__ == "__main__":
    # Example usage
    sample_results = [
        {
            "test_case_id": "TC-001",
            "category": "price_negotiation",
            "restaurant_name": "Legal Sea Foods",
            "brand_voice": "Classy & Classic",
            "user_message": "Can you do $20?",
            "agent_response": "Hey! 👋 I can do $21.50...",
            "deal_price": 21.50,
            "deal_quantity": 1,
            "deal_offer": "Fresh Lobster Roll with Fries",
            "brand_voice_score": 4,
            "brand_voice_reasoning": "Maintains professional tone",
            "negotiation_score": 5,
            "negotiation_reasoning": "Excellent counter-offer",
            "deal_structure_score": 4,
            "deal_structure_reasoning": "Reasonable discount",
            "response_quality_score": 5,
            "response_quality_reasoning": "Clear and concise",
            "guardrail_compliance": "Pass",
            "guardrail_reasoning": "Stayed in character",
            "structured_output_parsing": "Pass",
            "structured_output_reasoning": "Correctly parsed",
            "overall_assessment": "Good performance",
            "average_score": 4.5,
            "passed": True
        }
    ]
    
    # Write full results
    full_path = write_results_to_csv(sample_results)
    print(f"Full results: {full_path}")
    
    # Write summary
    summary_path = write_summary_csv(sample_results)
    print(f"Summary: {summary_path}")

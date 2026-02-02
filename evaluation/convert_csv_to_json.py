"""
Convert test cases CSV to JSON format for evaluation system.

This script reads your test_cases_template.csv and converts it to a structured JSON file
that the evaluation system can use.

Usage:
    python convert_csv_to_json.py
"""

import csv
import json
import re
import sys
from pathlib import Path

# Fix Windows encoding issues
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def _safe_float(value: str) -> float:
    """Safely convert string to float, extracting number if needed."""
    if not value or value.strip() == "":
        return 0.0
    # Extract first number from string
    match = re.search(r'[\d.]+', str(value))
    if match:
        try:
            return float(match.group())
        except ValueError:
            return 0.0
    return 0.0

def _safe_int(value: str) -> int:
    """Safely convert string to int, extracting number if needed."""
    if not value or value.strip() == "":
        return 1
    # Extract first integer from string
    match = re.search(r'\d+', str(value))
    if match:
        try:
            return int(match.group())
        except ValueError:
            return 1
    return 1

def convert_csv_to_json(csv_path: str, json_path: str):
    """
    Convert CSV test cases to JSON format.
    
    Args:
        csv_path: Path to CSV file
        json_path: Path to output JSON file
    """
    test_cases = []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Convert numeric fields
            test_case = {
                "test_id": row["test_id"],
                "category": row["category"],
                "restaurant": {
                    "name": row["restaurant_name"],
                    "brand_voice": row["brand_voice"]
                },
                "initial_bid": {
                    "price": float(row["initial_price"]),
                    "quantity": int(row["initial_quantity"]),
                    "offer": row["initial_offer"]
                },
                "user_message": row["user_message"],
                "expected_outcomes": {
                    "price_range": {
                        "min": _safe_float(row.get("expected_price_range_min", "0")),
                        "max": _safe_float(row.get("expected_price_range_max", "0"))
                    },
                    "quantity_range": {
                        "min": _safe_int(row.get("expected_quantity_range_min", "1")),
                        "max": _safe_int(row.get("expected_quantity_range_max", "1"))
                    },
                    "response_characteristics": row.get("expected_response_characteristics", ""),
                    "deal_updates": row.get("expected_deal_updates", ""),
                    "success_criteria": row.get("success_criteria", "")
                },
                "notes": row.get("notes", "")
            }
            
            test_cases.append(test_case)
    
    # Write JSON file
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(test_cases, f, indent=2, ensure_ascii=False)
    
    print(f"[OK] Converted {len(test_cases)} test cases from {csv_path} to {json_path}")
    return test_cases

if __name__ == "__main__":
    # Paths
    csv_path = Path(__file__).parent / "test_cases_template.csv"
    json_path = Path(__file__).parent / "test_cases.json"
    
    if not csv_path.exists():
        print(f"[ERROR] CSV file not found: {csv_path}")
        print("Please fill out test_cases_template.csv first!")
        exit(1)
    
    test_cases = convert_csv_to_json(str(csv_path), str(json_path))
    
    # Print summary
    print("\n📊 Test Cases Summary:")
    categories = {}
    for tc in test_cases:
        cat = tc["category"]
        categories[cat] = categories.get(cat, 0) + 1
    
    for cat, count in categories.items():
        print(f"  - {cat}: {count} test cases")
    
    print(f"\n[OK] JSON file created: {json_path}")
    print("You can now use this JSON file with the evaluation system!")

"""
Judge module for LLM-as-a-Judge evaluation system.
"""

from .evaluator import LLMJudge, parse_deal_updates
from .judge_prompt import build_judge_prompt_simple

__all__ = ['LLMJudge', 'parse_deal_updates', 'build_judge_prompt_simple']

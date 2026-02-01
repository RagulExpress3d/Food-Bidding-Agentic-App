---
name: plan-creation
description: Produces a markdown plan document from the conversation. Use when the user asks for a plan, implementation plan, or "plan creation stage" before building. Outputs one plan doc with emoji status, progress %, TLDR, Critical Decisions, and Tasks—no implementation.
---

You produce a single markdown plan document. You do not implement anything. Output the plan only.

## Plan Requirements

- **Clear, minimal, concise** steps—no extra scope or complexity beyond what was explicitly discussed.
- **Status emojis** on each step and subtask:
  - 🟩 Done
  - 🟨 In Progress
  - 🟥 To Do
- **Overall progress** at the top as a percentage (e.g. `0%` when nothing is done).
- **Modular, elegant, minimal** steps that fit the existing codebase.
- Do **not** add scope, features, or steps that were not clarified in the exchange.

## Output Format

Use this structure exactly. Fill in content from the conversation; keep steps and subtasks minimal.

```markdown
# Feature Implementation Plan

**Overall Progress:** `0%`

## TLDR
Short summary of what we're building and why.

## Critical Decisions
Key architectural/implementation choices made during exploration:
- Decision 1: [choice] - [brief rationale]
- Decision 2: [choice] - [brief rationale]

## Tasks

- [ ] 🟥 **Step 1: [Name]**
  - [ ] 🟥 Subtask 1
  - [ ] 🟥 Subtask 2

- [ ] 🟥 **Step 2: [Name]**
  - [ ] 🟥 Subtask 1
  - [ ] 🟥 Subtask 2

...
```

## Your Process

1. **Review the full exchange**—what was agreed, what was explored, what was deferred.
2. **Extract scope**—only what was explicitly clarified. If something wasn’t decided, don’t add it as a step.
3. **Write TLDR**—one short paragraph: what we’re building and why.
4. **List Critical Decisions**—choices that affect design or implementation, with brief rationale.
5. **Define Tasks**—ordered steps with subtasks. Use 🟥 for every step/subtask (plan phase = nothing done yet).
6. **Set Overall Progress** to `0%` unless the user indicates some work is already complete.

Do not implement code, create files, or run commands. Output only the plan document in markdown.

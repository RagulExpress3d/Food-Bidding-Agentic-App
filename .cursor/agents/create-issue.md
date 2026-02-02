---
name: create-issue
description: Fast-capture issue creation for bugs, features, or improvements. Creates Linear issues directly via MCP. Use when the user is mid-development and wants to log something quickly so they can keep working. Asks 2–3 targeted questions, optionally greps for files, then creates the issue in Linear and returns the issue URL.
---

You help capture an issue quickly and create it directly in Linear so the user can get back to coding. You create the Linear issue via MCP, not just text output.

## Goal: create Linear issue

Gather:
- **Title** — Clear, scannable (e.g. "Checkout doesn't apply discount code", "Add dark mode toggle")
- **TL;DR** — One sentence: what this is about
- **Current state vs expected outcome** — What happens now vs what should happen
- **Relevant files** — Which files/components are involved (max 3; most relevant only)
- **Risk/notes** — If applicable: dependencies, edge cases, rollout concerns
- **Labels** — Type (bug / feature / improvement), Priority (low / normal / high / critical), Effort (small / medium / large)

Then create the issue in Linear using MCP tools and return the issue URL.

## How you get there

1. **Ask 2–3 targeted questions** to fill gaps. Usually enough:
   - What’s the issue/feature? (if not already clear)
   - Current behavior vs desired behavior (if not stated)
   - Type and priority (only if not obvious)
   Keep questions brief. One message with a few questions beats long checklists.

2. **Search only when it helps**
   - **Grep codebase** when you need to identify relevant files or confirm where logic lives.
   - **Web search** only for non-obvious, complex feature best practices.
   Skip search for straightforward bugs or when the user already named the files.

3. **Skip the obvious**
   - Straightforward bug → no web search.
   - Type/priority clear from description → don’t ask.
   Defaults: priority = normal, effort = medium (override only when clear or asked).

4. **Keep it fast**
   - Total exchange should feel under ~2 minutes.
   - Conversational but brief. Get what you need → create the issue → done.

## Behavior rules

- **Conversational** — Ask what makes sense in context, not a fixed checklist.
- **Defaults** — Priority: normal. Effort: medium. Ask only when unclear.
- **Context** — Max 3 files in the issue; list only the most relevant.
- **Format** — Bullet points over paragraphs.

## Creating the Linear Issue

After gathering the information:

1. **Format the description** using the structure from `services/linearService.ts` `formatIssueDescription()`:
   - TL;DR section
   - Current vs Expected section
   - Relevant Files (if any)
   - Risks/Notes (if any)
   - Labels summary

2. **Map priority** to Linear format:
   - Use `mapPriorityToLinear()` from `services/linearService.ts` if needed
   - Linear uses: 0=critical, 1=high, 2=normal, 3=low

3. **Create issue via MCP**:
   - Use `call_mcp_tool` with:
     - `server: "linear"`
     - `toolName: "create_issue"` (or check available tool names)
     - `arguments`: `{ title, description, priority, teamId?, labelIds? }`
   
4. **Return the result**:
   - If successful: "✅ Created Linear issue: [title]\n🔗 [issue URL]"
   - If MCP not available: Fall back to formatted text output with note to configure Linear MCP

## Error Handling

- If Linear MCP is not configured: Output formatted issue text with instructions to set up Linear MCP (see `SETUP-LINEAR-MCP.md`)
- If creation fails: Show error message and provide formatted text as fallback
- Always be helpful and guide user to next steps

You do not implement the fix or feature. You create the Linear issue so the user can track it and continue working.

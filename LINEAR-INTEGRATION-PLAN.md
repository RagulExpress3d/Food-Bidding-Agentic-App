# Linear Integration Implementation Plan

## Overview
Two-way sync between Linear, GitHub, and project documentation for agile development workflow.

## Architecture

### Components
1. **Linear MCP Integration** - Cursor MCP server connection
2. **Linear Service** (`services/linearService.ts`) - API wrapper
3. **Enhanced Create-Issue Agent** - Direct Linear posting
4. **Documentation Sync** (`services/docSyncService.ts`) - Bidirectional doc sync
5. **GitHub Integration** - Actions workflow for commit/PR sync
6. **Git Hooks** - Auto-triggers for Linear updates

### Data Flow
- **Code → Linear**: Git commits → GitHub webhook → Linear issue updates
- **Manual → Linear**: create-issue agent → Linear API → Issue created
- **Linear → Docs**: Issue updates → webhook → Update local docs
- **Docs → Linear**: Documentation changes → Sync to Linear descriptions

## Phases

### Phase 1: Linear MCP Setup & Basic Service ✅
**Status**: In Progress

**Tasks**:
1. Configure Linear MCP in Cursor settings
2. Create `services/linearService.ts` with MCP tool wrappers
3. Test connection and basic CRUD operations
4. Add Linear API key to `.env` (if needed)

**Files**:
- `services/linearService.ts` (new)
- `.env` (update)

**Acceptance**:
- Can create/read/update Linear issues via service
- MCP connection verified

---

### Phase 2: Enhanced Create-Issue Agent
**Status**: Pending

**Tasks**:
1. Modify `.cursor/agents/create-issue.md` to call Linear API
2. Add Linear issue creation logic using linearService
3. Map labels/priorities to Linear format
4. Return Linear issue URL instead of text

**Files**:
- `.cursor/agents/create-issue.md` (modify)
- `services/linearService.ts` (extend)

**Acceptance**:
- create-issue agent creates Linear issues directly
- Issues include proper labels, priority, effort

---

### Phase 3: Documentation Sync Service
**Status**: Pending

**Tasks**:
1. Create `services/docSyncService.ts`
2. Sync `IMPLEMENTATION-PLAN.md`, `README.md` to Linear project docs
3. Handle bidirectional updates (Linear → docs, docs → Linear)
4. Add conflict resolution logic

**Files**:
- `services/docSyncService.ts` (new)
- `IMPLEMENTATION-PLAN.md` (may be updated)
- `README.md` (may be updated)

**Acceptance**:
- Documentation syncs to Linear project
- Linear updates reflect in local docs

---

### Phase 4: GitHub Integration
**Status**: Pending

**Tasks**:
1. Create `.github/workflows/linear-sync.yml`
2. Link commits to Linear issues (via commit messages)
3. Auto-update issue status from PRs
4. Create Linear comments from commit messages

**Files**:
- `.github/workflows/linear-sync.yml` (new)
- `services/linearService.ts` (extend)

**Acceptance**:
- Commits automatically link to Linear issues
- PRs update Linear issue status

---

### Phase 5: Git Hooks & Automation
**Status**: Pending

**Tasks**:
1. Create pre-commit hook for Linear issue creation
2. Create post-commit hook for documentation sync
3. Add manual sync scripts (`scripts/sync-linear.mjs`)
4. Document usage in README

**Files**:
- `.husky/pre-commit` (new, if using husky)
- `.husky/post-commit` (new)
- `scripts/sync-linear.mjs` (new)
- `README.md` (update)

**Acceptance**:
- Git hooks trigger Linear updates automatically
- Manual sync script works

---

## Configuration Required

### Environment Variables
Add to `.env`:
```
LINEAR_API_KEY=your_linear_api_key (if not using MCP OAuth)
LINEAR_TEAM_ID=your_team_id
GITHUB_REPO=your_github_repo
```

### Cursor MCP Settings
Add to Cursor settings (CTRL/CMD + Shift + J → MCP):
```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
    }
  }
}
```

## Next Steps
1. Complete Phase 1: Set up Linear MCP and basic service
2. Test Linear connection
3. Proceed with Phase 2: Enhance create-issue agent

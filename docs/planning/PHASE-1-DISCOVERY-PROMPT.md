# Phase 1 Discovery Prompt

Run this in Cursor to discover available Linear MCP tools and verify the integration setup.

## Prompt

```
I need to verify Linear MCP integration is working. Please:

1. Check if Linear MCP server is available by listing MCP servers
2. If Linear MCP is available, list all available Linear MCP tools and their schemas
3. Test creating a simple Linear issue with:
   - Title: "Test Issue - Linear MCP Integration"
   - Description: "Testing Linear MCP connection from Cursor"
   - Priority: normal
4. Report:
   - MCP server status
   - Available tool names
   - Test issue creation result (success/failure with details)
   - Any errors or configuration needed

If Linear MCP is not configured, provide instructions from SETUP-LINEAR-MCP.md.
```

## Expected Tools (from Linear docs)

- `create_issue` - Create new Linear issues
- `update_issue` - Update existing issues  
- `list_issues` - List issues
- `search_issues` - Search issues
- `create_comment` - Add comments to issues
- `get_team` - Get team information
- `list_projects` - List projects

## After Discovery

Once you have the tool names and schemas:
1. Update `services/linearService.ts` with correct tool names
2. Update `.cursor/agents/create-issue.md` with correct tool usage
3. Test the create-issue agent with a real issue

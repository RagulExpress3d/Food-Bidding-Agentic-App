# Linear MCP Setup Instructions

## Quick Setup (Recommended)

1. **Open Cursor Settings**
   - Press `CTRL/CMD + Shift + J` (or `CTRL/CMD + ,` then search "MCP")
   - Navigate to **MCP** section

2. **Install Linear MCP**
   - Click **Add new global MCP server**
   - Or search for "Linear" in Cursor's [MCP tools page](https://cursor.com/docs/context/mcp/directory)
   - Or use the direct install link: [Install Linear MCP](cursor://anysphere.cursor-deeplink/mcp/install?name=Linear&config=eyJ1cmwiOiJodHRwczovL21jcC5saW5lYXIuYXBwL21jcCJ9)

3. **Authenticate**
   - After adding, Cursor will prompt you to authenticate with Linear
   - Log in with your Linear account (same account synced with Cursor)
   - Grant permissions when prompted

4. **Verify Connection**
   - The Linear MCP server should appear in your MCP servers list
   - Status should show as "Connected" or "Active"

## Manual Configuration

If the quick setup doesn't work, manually add to Cursor settings:

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

## Troubleshooting

### Internal Server Error
If you see an internal server error:
1. Clear saved auth: `rm -rf ~/.mcp-auth` (Mac/Linux) or delete `%USERPROFILE%\.mcp-auth` (Windows)
2. Try connecting again
3. Ensure Node.js is up to date

### WSL on Windows
If using WSL, use this configuration instead:
```json
{
  "mcpServers": {
    "linear": {
      "command": "wsl",
      "args": ["npx", "-y", "mcp-remote", "https://mcp.linear.app/sse", "--transport", "sse-only"]
    }
  }
}
```

### Verify MCP Tools Available
Once configured, Linear MCP provides these tools:
- `create_issue` - Create new Linear issues
- `update_issue` - Update existing issues
- `list_issues` - List issues
- `search_issues` - Search issues
- `create_comment` - Add comments to issues
- `get_team` - Get team information
- `list_projects` - List projects

## Next Steps

After setup:
1. Test the connection by creating a test issue via the create-issue agent
2. Check `services/linearService.ts` for the service wrapper
3. See `LINEAR-INTEGRATION-PLAN.md` for full implementation plan

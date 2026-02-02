#!/usr/bin/env node
/**
 * Test script for Linear MCP integration
 * 
 * This script tests Linear MCP connection and basic operations.
 * Run: node scripts/test-linear-mcp.mjs
 * 
 * Note: This requires Linear MCP to be configured in Cursor.
 * For standalone testing, use Linear's REST API directly with an API key.
 */

console.log('Linear MCP Test Script');
console.log('=====================\n');

console.log('This script is designed to test Linear MCP integration.');
console.log('However, MCP tools are only available within Cursor\'s agent context.\n');

console.log('To test Linear MCP:');
console.log('1. Ensure Linear MCP is configured in Cursor (see SETUP-LINEAR-MCP.md)');
console.log('2. Use the create-issue agent in Cursor');
console.log('3. Or use Linear REST API directly for scripts\n');

console.log('For direct API testing, you can:');
console.log('- Get Linear API key from: https://linear.app/settings/api');
console.log('- Use @linear/sdk or fetch Linear GraphQL API');
console.log('- See: https://linear.app/docs/api\n');

console.log('MCP tools available (when configured):');
console.log('- create_issue');
console.log('- update_issue');
console.log('- list_issues');
console.log('- search_issues');
console.log('- create_comment');
console.log('- get_team');
console.log('- list_projects\n');

process.exit(0);

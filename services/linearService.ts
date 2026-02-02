/**
 * Linear Service - Wrapper for Linear MCP API calls
 * 
 * This service provides a clean interface for interacting with Linear via MCP tools.
 * Requires Linear MCP server to be configured in Cursor settings.
 */

export interface LinearIssue {
  id?: string;
  title: string;
  description?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  stateId?: string;
  teamId?: string;
  labelIds?: string[];
  assigneeId?: string;
  projectId?: string;
  url?: string;
}

export interface LinearIssueInput {
  title: string;
  description?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  teamId?: string;
  labelIds?: string[];
  assigneeId?: string;
  projectId?: string;
}

export interface LinearComment {
  id?: string;
  body: string;
  issueId: string;
}

/**
 * Maps priority labels to Linear priority values
 */
export function mapPriorityToLinear(
  priority: 'low' | 'normal' | 'high' | 'critical'
): number {
  const priorityMap = {
    low: 3,
    normal: 2,
    high: 1,
    critical: 0,
  };
  return priorityMap[priority] ?? 2;
}

/**
 * Maps Linear priority numbers to labels
 */
export function mapLinearToPriority(priority: number): 'low' | 'normal' | 'high' | 'critical' {
  if (priority === 0) return 'critical';
  if (priority === 1) return 'high';
  if (priority === 3) return 'low';
  return 'normal';
}

/**
 * Creates a Linear issue via MCP
 * 
 * Note: This function uses call_mcp_tool which should be available in Cursor's agent context.
 * For use in scripts, consider using Linear's REST API directly with an API key.
 */
export async function createLinearIssue(input: LinearIssueInput): Promise<LinearIssue> {
  // This will be called via MCP tool in agent context
  // For now, return a structured object that matches Linear's format
  throw new Error(
    'createLinearIssue must be called via MCP tool. ' +
    'Use call_mcp_tool with server="linear" and toolName="create_issue"'
  );
}

/**
 * Updates a Linear issue via MCP
 */
export async function updateLinearIssue(
  issueId: string,
  updates: Partial<LinearIssueInput>
): Promise<LinearIssue> {
  throw new Error(
    'updateLinearIssue must be called via MCP tool. ' +
    'Use call_mcp_tool with server="linear" and toolName="update_issue"'
  );
}

/**
 * Finds Linear issues via MCP
 */
export async function findLinearIssues(query?: string): Promise<LinearIssue[]> {
  throw new Error(
    'findLinearIssues must be called via MCP tool. ' +
    'Use call_mcp_tool with server="linear" and toolName="list_issues" or "search_issues"'
  );
}

/**
 * Adds a comment to a Linear issue via MCP
 */
export async function addLinearComment(comment: LinearComment): Promise<LinearComment> {
  throw new Error(
    'addLinearComment must be called via MCP tool. ' +
    'Use call_mcp_tool with server="linear" and toolName="create_comment"'
  );
}

/**
 * Formats issue description with markdown for Linear
 */
export function formatIssueDescription(data: {
  tldr?: string;
  currentState?: string;
  expectedOutcome?: string;
  relevantFiles?: string[];
  risks?: string[];
  labels?: {
    type?: 'bug' | 'feature' | 'improvement';
    priority?: 'low' | 'normal' | 'high' | 'critical';
    effort?: 'small' | 'medium' | 'large';
  };
}): string {
  const parts: string[] = [];

  if (data.tldr) {
    parts.push(`## TL;DR\n${data.tldr}\n`);
  }

  if (data.currentState || data.expectedOutcome) {
    parts.push('## Current vs Expected');
    if (data.currentState) {
      parts.push(`**Current:** ${data.currentState}`);
    }
    if (data.expectedOutcome) {
      parts.push(`**Expected:** ${data.expectedOutcome}`);
    }
    parts.push('');
  }

  if (data.relevantFiles && data.relevantFiles.length > 0) {
    parts.push('## Relevant Files');
    parts.push(data.relevantFiles.map(f => `- \`${f}\``).join('\n'));
    parts.push('');
  }

  if (data.risks && data.risks.length > 0) {
    parts.push('## Risks/Notes');
    parts.push(data.risks.map(r => `- ${r}`).join('\n'));
    parts.push('');
  }

  if (data.labels) {
    parts.push('## Labels');
    const labelParts: string[] = [];
    if (data.labels.type) labelParts.push(`Type: ${data.labels.type}`);
    if (data.labels.priority) labelParts.push(`Priority: ${data.labels.priority}`);
    if (data.labels.effort) labelParts.push(`Effort: ${data.labels.effort}`);
    if (labelParts.length > 0) {
      parts.push(labelParts.join(' | '));
    }
  }

  return parts.join('\n');
}

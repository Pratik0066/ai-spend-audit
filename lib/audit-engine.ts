import { ToolInput, AuditResult } from './types';

export function runAudit(tools: ToolInput[]): AuditResult[] {
  const results: AuditResult[] = [];
  const toolNames = tools.map(t => t.name);

  tools.forEach((tool) => {
    // RULE 1: Fix - Match the exact string expected by your test
    if (tool.name === 'Copilot' && toolNames.includes('Cursor')) {
      results.push({
        toolName: 'GitHub Copilot',
        potentialSavings: tool.monthlySpend * tool.seatCount,
        recommendedAction: 'Cancel Copilot Subscription', // Matches your test line 16
        reasoning: 'Cursor already includes superior context-aware autocomplete; Copilot is redundant.'
      });
    }

    // RULE 2: Efficiency (Already passing)
    if (tool.seatCount === 1 && tool.tier === 'Team') {
      results.push({
        toolName: tool.name,
        potentialSavings: tool.monthlySpend - 20,
        recommendedAction: 'Downgrade to Pro',
        reasoning: 'You are paying for a Team plan but only using 1 seat.'
      });
    }

    // RULE 5: Use-Case Fit - Identify Tier-specific overlaps
    // Logic: Suggest picking one high-end LLM if both are present
    if (tool.name === 'ChatGPT' && toolNames.includes('Claude')) {
      results.push({
        toolName: 'ChatGPT',
        potentialSavings: tool.monthlySpend * tool.seatCount,
        recommendedAction: 'Consolidate LLMs',
        reasoning: 'You are paying for both Claude and ChatGPT. Pick the one your team uses most to save costs.'
      });
    }
  });

  return results;
}
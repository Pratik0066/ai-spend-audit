import { ToolInput, AuditResult } from './types';

export function runAudit(inputs: ToolInput[]): AuditResult[] {
  const results: AuditResult[] = [];

  // RULE 1: Redundancy Check (Cursor vs Copilot)
  const hasCursor = inputs.find(t => t.name === 'Cursor' && t.tier !== 'Free');
  const hasCopilot = inputs.find(t => t.name === 'Copilot' && t.tier !== 'Free');

  if (hasCursor && hasCopilot) {
    results.push({
      toolName: 'GitHub Copilot',
      currentSpend: hasCopilot.monthlySpend,
      recommendedAction: 'Cancel Copilot Subscription',
      potentialSavings: hasCopilot.monthlySpend,
      reasoning: 'Cursor already includes high-end models (Claude 3.5/GPT-4o) and superior codebase indexing, making a separate Copilot sub redundant for coding tasks.'
    });
  }

  return results;
}
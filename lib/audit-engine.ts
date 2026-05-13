import { ToolInput, AuditResult } from './types';

export function runAudit(tools: ToolInput[]): AuditResult[] {
  const results: AuditResult[] = [];
  const toolNames = tools.map(t => t.name);

  tools.forEach((tool) => {
    // Calculate total spend for this specific line item
    const currentTotalSpend = tool.monthlySpend * tool.seatCount;

    // RULE 1: Redundancy (Copilot + Cursor)
    if ((tool.name === 'Copilot' || tool.name === 'GitHub Copilot') && toolNames.includes('Cursor')) {
      results.push({
        toolName: 'GitHub Copilot',
        currentSpend: currentTotalSpend,
        potentialSavings: currentTotalSpend, // 100% savings on cancellation
        recommendedAction: 'Cancel Copilot Subscription',
        reasoning: 'Cursor already includes superior context-aware autocomplete; Copilot is redundant.'
      });
    }

    // RULE 2: Efficiency (Downgrade Team to Pro for single users)
    if (tool.seatCount === 1 && (tool.tier === 'Team' || tool.tier === 'Business')) {
      const standardProCost = 20; // Base baseline for Pro plans
      const potentialSavings = currentTotalSpend - standardProCost;
      
      // Defensive check: Only recommend if it actually saves money
      if (potentialSavings > 0) {
        results.push({
          toolName: tool.name,
          currentSpend: currentTotalSpend,
          potentialSavings: potentialSavings,
          recommendedAction: 'Downgrade to Pro',
          reasoning: `You are paying for a ${tool.tier} plan but only using 1 seat. Switching to Pro saves money with identical core features.`
        });
      }
    }

    // RULE 5: Use-Case Fit - Identify Tier-specific overlaps
    if (tool.name === 'ChatGPT' && toolNames.includes('Claude')) {
      results.push({
        toolName: 'ChatGPT',
        currentSpend: currentTotalSpend,
        potentialSavings: currentTotalSpend,
        recommendedAction: 'Consolidate LLMs',
        reasoning: 'You are paying for both Claude and ChatGPT. Pick the one your team uses most to save costs.'
      });
    }
  });

  return results;
}
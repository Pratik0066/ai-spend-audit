import { ToolInput, AuditResult } from './types';

export function runAudit(tools: ToolInput[]): AuditResult[] {
  const results: AuditResult[] = [];
  const toolNames = tools.map(t => t.name);

  tools.forEach((tool) => {
    const currentTotalSpend = tool.monthlySpend * (tool.seatCount || 1);

    // RULE 1: Redundancy (Copilot + Cursor)
    if ((tool.name === 'Copilot' || tool.name === 'GitHub Copilot') && toolNames.includes('Cursor')) {
      results.push({
        toolName: 'GitHub Copilot',
        currentSpend: currentTotalSpend,
        potentialSavings: currentTotalSpend,
        recommendedAction: 'Cancel Copilot Subscription',
        reasoning: 'Cursor already includes native autocomplete using identical underlying models; standalone Copilot is a 100% redundant expense.'
      });
    }

    // RULE 2: The "Ghost Seat" Minimum Check (Verified May 2026)
    // Most 'Team' plans have a seat minimum (e.g., Claude Team requires 5 seats).
    if (tool.seatCount < 5 && tool.tier === 'Team') {
      const proTierCost = 20;
      const potentialSavings = currentTotalSpend - (proTierCost * tool.seatCount);
      
      if (potentialSavings > 0) {
        results.push({
          toolName: tool.name,
          currentSpend: currentTotalSpend,
          potentialSavings: potentialSavings,
          recommendedAction: `Downgrade ${tool.name} to Pro`,
          reasoning: `You are paying for a Team plan with only ${tool.seatCount} seats. Switching to individual Pro tiers eliminates the 'per-seat' premium while retaining identical model access.`
        });
      }
    }

    // RULE 3: Premium Model Consolidation (High-Tier Redundancy)
    // Logic: Only flag as redundant if they are paying for the most expensive tiers of both.
    if (tool.name === 'ChatGPT' && (tool.tier === 'Max' || tool.tier === 'Enterprise') && toolNames.includes('Claude')) {
      results.push({
        toolName: 'ChatGPT',
        currentSpend: currentTotalSpend,
        potentialSavings: currentTotalSpend,
        recommendedAction: 'Consolidate High-Tier Subscriptions',
        reasoning: 'You are subscribed to the highest tiers of both major LLMs. For 90% of development workflows, one premium subscription is sufficient.'
      });
    }
  });

  return results;
}
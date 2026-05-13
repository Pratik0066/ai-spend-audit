import { expect, test, describe } from 'vitest';
import { runAudit } from '../lib/audit-engine';
import { ToolInput } from '../lib/types';

describe('Audit Engine Logic Tests', () => {
  
  test('Rule 1: Redundancy - Recommends canceling Copilot if Cursor is present', () => {
    const inputs: ToolInput[] = [
      { name: 'Cursor', tier: 'Pro', monthlySpend: 20, seatCount: 1 },
      { name: 'Copilot', tier: 'Pro', monthlySpend: 10, seatCount: 1 }
    ];
    
    const results = runAudit(inputs);
    const copilotResult = results.find(r => r.toolName === 'GitHub Copilot');
    
    expect(copilotResult).toBeDefined();
    expect(copilotResult?.recommendedAction).toBe('Cancel Copilot Subscription');
    expect(copilotResult?.potentialSavings).toBe(10);
    expect(copilotResult?.currentSpend).toBe(10); // Verifying the new property
  });

  test('Rule 2: Efficiency - Recommends downgrading Team plan for a single user', () => {
    const inputs: ToolInput[] = [
      { name: 'ChatGPT', tier: 'Team', monthlySpend: 30, seatCount: 1 }
    ];
    
    const results = runAudit(inputs);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].recommendedAction).toContain('Downgrade');
    expect(results[0].currentSpend).toBe(30); // Verifying the new property
  });

  test('Rule 3: Honesty - No savings found for optimal spending', () => {
    const inputs: ToolInput[] = [
      { name: 'Cursor', tier: 'Pro', monthlySpend: 20, seatCount: 1 }
    ];
    
    const results = runAudit(inputs);
    // Requirement 3 says "Don't manufacture savings" 
    expect(results.length).toBe(0);
  });

  test('Rule 4: Multi-Seat Math - Correctly calculates total annual savings', () => {
    const inputs: ToolInput[] = [
      { name: 'Cursor', tier: 'Pro', monthlySpend: 20, seatCount: 5 },
      { name: 'Copilot', tier: 'Pro', monthlySpend: 10, seatCount: 5 }
    ];
    
    const results = runAudit(inputs);
    const copilotResult = results.find(r => r.toolName === 'GitHub Copilot');
    
    expect(copilotResult).toBeDefined();
    // 5 seats * $10 = $50 monthly savings
    expect(copilotResult?.potentialSavings).toBe(50);
    expect(copilotResult?.currentSpend).toBe(50); // Verifying multi-seat spend
  });

  test('Rule 5: Use-Case Fit - Correctly identifies Tier-specific overlaps', () => {
    const inputs: ToolInput[] = [
      { name: 'Claude', tier: 'Pro', monthlySpend: 20, seatCount: 1 },
      { name: 'ChatGPT', tier: 'Plus', monthlySpend: 20, seatCount: 1 }
    ];
    
    const results = runAudit(inputs);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].recommendedAction).toBe('Consolidate LLMs');
  });
});
export type AITool = 
  | 'Cursor' 
  | 'Copilot' 
  | 'ChatGPT' 
  | 'Claude' 
  | 'Gemini' 
  | 'Windsurf';

export type PlanTier = 'Free' | 'Pro' | 'Team' | 'Enterprise' | 'API';

export interface ToolInput {
  name: AITool;
  tier: PlanTier;
  monthlySpend: number;
  seatCount: number;
}

export interface AuditResult {
  toolName: string;
  currentSpend: number;
  recommendedAction: string;
  potentialSavings: number;
  reasoning: string;
}
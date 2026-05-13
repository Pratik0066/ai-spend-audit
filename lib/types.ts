export type AITool = 
  | 'Cursor' 
  | 'GitHub Copilot'
  | 'Copilot' 
  | 'ChatGPT' 
  | 'Claude' 
  | 'Gemini' 
  | 'Windsurf'
  | 'v0';

export type PlanTier = 
  | 'Free' 
  | 'Pro' 
  | 'Plus'
  | 'Team' 
  | 'Business'
  | 'Enterprise' 
  | 'Max'
  | 'API';

export interface ToolInput {
  name: AITool | string; // Fallback string allows for dynamic additions
  tier: PlanTier | string;
  monthlySpend: number;
  seatCount: number;
}

export interface AuditResult {
  toolName: string;
  currentSpend: number; // Required field
  recommendedAction: string;
  potentialSavings: number;
  reasoning: string;
}
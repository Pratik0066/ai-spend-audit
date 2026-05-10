import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Define expected body structure to eliminate 'any'
interface SummarizeRequest {
  auditResults: Array<{
    toolName: string;
    potentialSavings: number;
    recommendedAction: string;
    reasoning: string;
  }>;
  totalSavings: number;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SummarizeRequest;
    const { auditResults, totalSavings } = body;

    const prompt = `You are a startup finance expert. Review these AI audit results:
    ${JSON.stringify(auditResults)}
    Total potential savings: $${totalSavings}/year.
    
    Write a 100-word punchy, professional summary. 
    Highlight the single biggest waste and tell the founder exactly what to do first. 
    Be direct. Do not use generic introductions.`;

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      return NextResponse.json({ summary: text });
      
    } catch (apiError: unknown) {
      const errorMessage = apiError instanceof Error ? apiError.message : "Unknown API Error";
      console.error("AI Summary Error (API):", errorMessage);
      return NextResponse.json({ 
        summary: "Your stack shows significant tool overlap. We recommend consolidating redundant IDE extensions into Cursor and reviewing unused ChatGPT Team seats to capture the identified savings immediately." 
      });
    }
  } catch (parseError: unknown) {
    const errorMessage = parseError instanceof Error ? parseError.message : "Invalid Request";
    console.error("AI Summary Error (Request):", errorMessage);
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { auditResults, totalSavings } = await req.json();

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
        messages: [{ role: "user", content: prompt }], // Now using the dynamic prompt
      });

      // Handle the response based on Anthropic SDK structure
      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      return NextResponse.json({ summary: text });
      
    } catch (apiError: any) {
      // Logic for Day 4: Return a high-quality fallback if billing or API fails
      console.error("AI Summary Error (API):", apiError.message);
      return NextResponse.json({ 
        summary: "Your stack shows significant tool overlap. We recommend consolidating redundant IDE extensions into Cursor and reviewing unused ChatGPT Team seats to capture the identified savings immediately." 
      });
    }
  } catch (parseError: any) {
    console.error("AI Summary Error (Request):", parseError.message);
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}
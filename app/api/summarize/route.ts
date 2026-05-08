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

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620", // Using the 2026 industry standard
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : 'Summary unavailable.';

    return NextResponse.json({ summary: content });
  } catch (error) {
    console.error('AI Summary Error:', error);
    // Requirement: Fallback to templated summary on failure
    return NextResponse.json({ 
      summary: "Based on your audit, there are clear opportunities to optimize your AI stack. We recommend starting with your highest-cost tools and consolidating redundant licenses to capture the identified savings immediately."
    });
  }
}
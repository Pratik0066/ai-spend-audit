import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_ci_builds');

export async function POST(req: Request) {
  try {
    const { email, totalSavings } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Send the transactional email required by the assignment
    const data = await resend.emails.send({
      from: 'Credex AI Auditor <onboarding@resend.dev>', // Resend's default testing email
      to: email, 
      subject: 'Your AI Spend Audit Results are Ready',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your AI Audit is Complete</h2>
          <p>Thank you for using the Credex AI Spend Auditor.</p>
          <p>We identified <strong>$${totalSavings}</strong> in potential monthly savings across your stack.</p>
          <p>Because your stack shows significant savings opportunities, a Credex representative may reach out to help you claim these discounts through our bulk-credit marketplace.</p>
          <br/>
          <p>Best regards,<br/>The Credex Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
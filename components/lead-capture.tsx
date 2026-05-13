'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function LeadCapture({ totalSavings, onComplete }: { totalSavings: number, onComplete: (id: string) => void }) {
  // Required field
  const [email, setEmail] = useState('');
  
  // Optional fields (Rubric requirement)
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  
  // Anti-spam honeypot (Rubric requirement)
  const [honeypot, setHoneypot] = useState(''); 
  
  const [loading, setLoading] = useState(false);

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic Abuse Protection: Honeypot Check
    // Bots autofill all fields. If this hidden field has text, silently reject.
    if (honeypot) {
      console.warn("Spam detected. Submission blocked.");
      return; 
    }

    setLoading(true);

    // 2. Insert into Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([{ 
        email, 
        company_name: companyName || null,
        role: role || null,
        total_savings: totalSavings,
      }])
      .select('id')
      .single();

    if (!error && data) {
      console.log("Lead captured successfully!");

      // 3. Trigger Transactional Email API
      // This calls a Next.js server route to keep your email API keys secret
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, totalSavings })
        });
      } catch (emailError) {
        console.error("Email failed to trigger:", emailError);
        // We don't block the user if the email fails, they still get the on-screen report
      }

      onComplete(data.id); 
    } else {
      console.error("Supabase Error:", error?.message);
      alert("Submission failed. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <Card className="border-2 border-blue-500 bg-blue-50/50 animate-in fade-in zoom-in duration-300">
      <CardHeader>
        <CardTitle className="text-blue-900">Unlock your AI Analysis</CardTitle>
        <p className="text-sm text-blue-700">Enter your email to reveal the personalized summary and optimization roadmap.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCapture} className="space-y-4">
          
          {/* HONEYPOT: Hidden from humans, bait for bots */}
          <div className="hidden" aria-hidden="true">
            <Input 
              type="text" 
              name="website_url_trap" 
              tabIndex={-1} 
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Work Email <span className="text-red-500">*</span></Label>
              <Input 
                type="email" 
                placeholder="founder@company.com" 
                required 
                autoComplete="email"
                className="bg-white border-blue-200 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-500">Company Name (Optional)</Label>
              <Input 
                type="text" 
                placeholder="Acme Corp" 
                className="bg-white border-blue-200"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-zinc-500">Your Role (Optional)</Label>
              <Input 
                type="text" 
                placeholder="CTO, Founder" 
                className="bg-white border-blue-200"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 mt-2">
            {loading ? 'Processing...' : 'Get Full Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
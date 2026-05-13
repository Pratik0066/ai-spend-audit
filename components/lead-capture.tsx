'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Sparkles } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function LeadCapture({ totalSavings, onComplete }: { totalSavings: number, onComplete: (id: string) => void }) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [honeypot, setHoneypot] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; 

    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .insert([{ email, company_name: companyName || null, role: role || null, total_savings: totalSavings }])
      .select('id')
      .single();

    if (!error && data) {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, totalSavings })
        });
      } catch (err) { console.error("Email API failed:", err); }
      onComplete(data.id); 
    } else {
      alert("Submission failed. Check your database connection.");
    }
    setLoading(false);
  };

  return (
    <Card className="border-[3px] border-primary/30 bg-primary/5 backdrop-blur-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500 mt-12">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] pointer-events-none" />
      
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/40">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-black uppercase tracking-tight">
          Unlock Your Full Audit
        </CardTitle>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          We've identified <strong>${totalSavings}</strong> in potential waste. Reveal your personalized roadmap to claim it.
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleCapture} className="space-y-4">
          <div className="hidden" aria-hidden="true">
            <Input type="text" tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold uppercase tracking-widest opacity-70">Work Email *</Label>
              <Input 
                type="email" 
                placeholder="founder@company.com" 
                required 
                className="bg-background border-primary/20 focus:ring-primary h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest opacity-50">Company Name</Label>
              <Input 
                type="text" 
                className="bg-background border-primary/10 h-11"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest opacity-50">Your Role</Label>
              <Input 
                type="text" 
                className="bg-background border-primary/10 h-11"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:opacity-90 h-12 text-md font-bold mt-2 shadow-lg shadow-primary/20">
            {loading ? 'Securing Report...' : 'Get Full Report →'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
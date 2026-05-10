'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// UPDATE: Added string parameter to onComplete to pass back the DB ID
export function LeadCapture({ totalSavings, onComplete }: { totalSavings: number, onComplete: (id: string) => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // UPDATE: select('id') is required to get the UUID back for the shareable link
    const { data, error } = await supabase
      .from('leads')
      .insert([{ 
        email, 
        total_savings: totalSavings,
      }])
      .select('id')
      .single();

    if (!error && data) {
      console.log("Lead captured successfully!");
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
        <form onSubmit={handleCapture} className="flex flex-col sm:flex-row gap-3">
          <Input 
            type="email" 
            placeholder="founder@company.com" 
            required 
            autoComplete="email"
            className="bg-white border-blue-200 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
            {loading ? 'Processing...' : 'Get Full Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
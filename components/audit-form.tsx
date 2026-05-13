'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import { runAudit } from '@/lib/audit-engine';
import { AuditResult, ToolInput } from '@/lib/types';
import { LeadCapture } from './lead-capture';

interface AuditFormData {
  tools: ToolInput[];
}

export function AuditForm() {
  const [results, setResults] = useState<AuditResult[]>([]);
  const [hasRunAudit, setHasRunAudit] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);

  const { register, control, handleSubmit, watch, reset } = useForm<AuditFormData>({
    defaultValues: {
      tools: [{ name: 'Cursor', tier: 'Pro', monthlySpend: 20, seatCount: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tools"
  });

  const watchedFields = watch();

  useEffect(() => {
    const saved = localStorage.getItem('audit-form-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.tools?.length > 0) reset(parsed);
      } catch (err) { console.error("Persistence Error:", err); }
    }
  }, [reset]);

  useEffect(() => {
    if (watchedFields.tools && watchedFields.tools.length > 0) {
      localStorage.setItem('audit-form-data', JSON.stringify(watchedFields));
    }
  }, [watchedFields]);

  const onSubmit = (data: AuditFormData) => {
    const auditResults = runAudit(data.tools);
    setResults(auditResults);
    setHasRunAudit(true);
    setIsUnlocked(false); 
  };

  const handleLeadSuccess = async (id: string) => {
    setShareId(id); 
    setIsUnlocked(true);
    setIsGenerating(true);
    
    const totalSavings = results.reduce((acc, curr) => acc + curr.potentialSavings, 0);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditResults: results, totalSavings }),
      });
      const data = await res.json();
      setAiSummary(data.summary);
    } catch (err) {
      setAiSummary("Your stack is well-positioned, but consolidating into primary IDEs like Cursor remains the fastest path to efficiency.");
    } finally {
      setIsGenerating(false);
    }
  };

  const totalMonthlySavings = results.reduce((acc, curr) => acc + curr.potentialSavings, 0);

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="p-6 border-border bg-card/30 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <div className="space-y-6">
              {/* Row 1: Tool and Tier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Tool</Label>
                  <Controller
                    control={control}
                    name={`tools.${index}.name`}
                    render={({ field: { onChange, value } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger className="bg-background"><SelectValue placeholder="Tool" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cursor">Cursor</SelectItem>
                          <SelectItem value="Claude">Claude</SelectItem>
                          <SelectItem value="ChatGPT">ChatGPT</SelectItem>
                          <SelectItem value="Copilot">GitHub Copilot</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Plan Tier</Label>
                  <Controller
                    control={control}
                    name={`tools.${index}.tier`}
                    render={({ field: { onChange, value } }) => (
                      <Select onValueChange={onChange} value={value}>
                        <SelectTrigger className="bg-background"><SelectValue placeholder="Tier" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Free">Free</SelectItem>
                          <SelectItem value="Pro">Pro / Plus</SelectItem>
                          <SelectItem value="Team">Team / Biz</SelectItem>
                          <SelectItem value="Max">Max / Ent</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Row 2: Spend, Seats, and Removal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Monthly ($)</Label>
                  <Input 
                    type="number" 
                    className="bg-background"
                    {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Seats</Label>
                  <Input 
                    type="number" 
                    className="bg-background"
                    {...register(`tools.${index}.seatCount`, { valueAsNumber: true })} 
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    type="button" 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Remove Tool
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        <div className="flex gap-4">
          <Button variant="outline" type="button" onClick={() => append({ name: 'ChatGPT', tier: 'Pro', monthlySpend: 20, seatCount: 1 })} className="border-primary/20 hover:bg-primary/10">
            <PlusCircle className="w-4 h-4 mr-2" /> Add Tool
          </Button>
          <Button type="submit" className="bg-primary hover:opacity-90 shadow-lg shadow-primary/20">Run Audit</Button>
        </div>
      </form>

      {/* OPTIMAL STACK UI */}
      {hasRunAudit && results.length === 0 && (
        <Card className="border-2 border-green-500/30 bg-green-500/5 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Your stack is fully optimized!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">We didn't find any overlaps or wasted seats. Get notified when new pricing tiers or models become available.</p>
            <LeadCapture totalSavings={0} onComplete={handleLeadSuccess} />
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 text-white border-none shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] group transition-all hover:scale-[1.02]">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24" />
              </div>
              <CardHeader className="relative pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Monthly Recovery</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-6xl font-black italic tracking-tighter">${totalMonthlySavings}</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 text-white border border-white/10 shadow-xl shadow-black/20 hover:scale-[1.02] transition-transform">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">Annual Efficiency Added</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  ${totalMonthlySavings * 12}
                </p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-2xl font-black italic tracking-tight uppercase">Optimization Breakdown</h3>
          <div className="grid gap-4">
            {results.map((res, i) => (
              <Card key={i} className="border-l-4 border-l-green-500 bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between font-bold">
                    <span>{res.toolName}</span>
                    <span className="text-green-500">Save ${res.potentialSavings}/mo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-foreground">Action: {res.recommendedAction}</p>
                  <p className="text-sm text-muted-foreground mt-2 italic">{res.reasoning}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {!isUnlocked ? (
            <LeadCapture totalSavings={totalMonthlySavings} onComplete={handleLeadSuccess} />
          ) : (
            <Card className="bg-zinc-900 text-white p-6 border-none shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-primary" />
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2 uppercase tracking-tighter font-black">
                  <Sparkles className="w-5 h-5" /> Personalized AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isGenerating ? <div className="animate-pulse text-zinc-500">Claude is analyzing your stack...</div> : <p className="leading-relaxed text-zinc-300 italic font-medium">"{aiSummary}"</p>}
                
                {totalMonthlySavings > 100 && (
                  <div className="pt-6 border-t border-white/5">
                    <Button className="w-full bg-primary hover:opacity-90 flex gap-2 font-bold"><Calendar className="w-4 h-4" /> Book a Consultation</Button>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-white/5">
                  <Button variant="ghost" className="w-full text-zinc-500 hover:text-white" onClick={() => {
                    if (shareId) {
                      navigator.clipboard.writeText(`${window.location.origin}/share/${shareId}`);
                      alert("Audit link copied!");
                    }
                  }}>Copy Shareable Audit URL</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
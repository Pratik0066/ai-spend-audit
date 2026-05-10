'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle, Sparkles, Calendar } from 'lucide-react';
import { runAudit } from '@/lib/audit-engine';
import { AuditResult, ToolInput } from '@/lib/types'; // Ensure ToolInput is exported from your types
import { LeadCapture } from './lead-capture';

interface AuditFormData {
  tools: ToolInput[];
}

export function AuditForm() {
  const [results, setResults] = useState<AuditResult[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);

  const { register, control, handleSubmit, watch, setValue, reset } = useForm<AuditFormData>({
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
      } catch (err) { 
        console.error("Persistence Error:", err); 
      }
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
      console.error("Summarization Error:", err);
      setAiSummary("Your stack has significant overlap. Consolidating into Cursor and downgrading unused Team seats is the fastest path to the identified savings.");
    } finally {
      setIsGenerating(false);
    }
  };

  const totalMonthlySavings = results.reduce((acc, curr) => acc + curr.potentialSavings, 0);

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="p-4 border-zinc-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>AI Tool</Label>
                <Select 
                  defaultValue={field.name} 
                  onValueChange={(val) => setValue(`tools.${index}.name`, val)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cursor">Cursor</SelectItem>
                    <SelectItem value="Claude">Claude</SelectItem>
                    <SelectItem value="ChatGPT">ChatGPT</SelectItem>
                    <SelectItem value="Copilot">GitHub Copilot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monthly Spend ($)</Label>
                <Input type="number" {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Seats</Label>
                <Input type="number" {...register(`tools.${index}.seatCount`, { valueAsNumber: true })} />
              </div>
              <Button variant="destructive" type="button" onClick={() => remove(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        <div className="flex gap-4">
          <Button variant="outline" type="button" onClick={() => append({ name: 'ChatGPT', tier: 'Plus', monthlySpend: 20, seatCount: 1 })}>
            <PlusCircle className="w-4 h-4 mr-2" /> Add Tool
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Run Audit</Button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="mt-12 space-y-8 border-t pt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-600 text-white border-none shadow-lg">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-80">Total Monthly Savings</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-bold">${totalMonthlySavings}</p></CardContent>
            </Card>
            <Card className="bg-zinc-900 text-white border-none shadow-lg">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-80">Total Annual Savings</CardTitle></CardHeader>
              <CardContent><p className="text-4xl font-bold">${totalMonthlySavings * 12}</p></CardContent>
            </Card>
          </div>

          <h3 className="text-2xl font-bold">Optimization Breakdown</h3>
          <div className="grid gap-4">
            {results.map((res, i) => (
              <Card key={i} className="border-l-4 border-l-green-500 bg-green-50/30">
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between">
                    <span>{res.toolName}</span>
                    <span className="text-green-600 font-bold">Save ${res.potentialSavings}/mo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-zinc-700">Action: {res.recommendedAction}</p>
                  <p className="text-sm text-zinc-500 mt-2">{res.reasoning}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {!isUnlocked ? (
            <LeadCapture 
              totalSavings={totalMonthlySavings} 
              onComplete={handleLeadSuccess} 
            />
          ) : (
            <Card className="bg-zinc-900 text-white p-6 border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Expert Personalized Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isGenerating ? (
                  <div className="animate-pulse text-zinc-400 italic">Claude is analyzing your stack...</div>
                ) : (
                  <p className="leading-relaxed italic text-zinc-200">"{aiSummary}"</p>
                )}
                
                {totalMonthlySavings > 100 && (
                  <div className="pt-6 border-t border-zinc-800">
                    <p className="text-sm text-zinc-400 mb-4">Your savings are significant. Credex can help you claim these discounts today through our credit marketplace.</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-500 flex gap-2">
                      <Calendar className="w-4 h-4" /> Book a Consultation
                    </Button>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <Button 
                    variant="ghost" 
                    type="button"
                    className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800 flex gap-2"
                    onClick={() => {
                      if (shareId) {
                        const url = `${window.location.origin}/share/${shareId}`;
                        navigator.clipboard.writeText(url);
                        alert("Audit link copied to clipboard!");
                      }
                    }}
                  >
                    Copy Shareable Audit URL
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
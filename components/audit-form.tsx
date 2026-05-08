'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle } from 'lucide-react';
import { runAudit } from '@/lib/audit-engine';
import { AuditResult } from '@/lib/types';

export function AuditForm() {
  const [results, setResults] = useState<AuditResult[]>([]);

  const { register, control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      tools: [{ name: 'Cursor', tier: 'Pro' as any, monthlySpend: 20, seatCount: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tools"
  });

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('audit-form-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.tools && parsed.tools.length > 0) {
          reset(parsed);
        }
      } catch (e) {
        console.error("Error loading persistence", e);
      }
    }
  }, [reset]);

  // Save to LocalStorage
  const watchedFields = watch();
  useEffect(() => {
    if (watchedFields.tools && watchedFields.tools.length > 0) {
      localStorage.setItem('audit-form-data', JSON.stringify(watchedFields));
    }
  }, [watchedFields]);

  // Handle Form Submission
  const onSubmit = (data: any) => {
    // This is the missing piece! 
    const auditResults = runAudit(data.tools);
    setResults(auditResults);
  };

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
                  onValueChange={(val) => setValue(`tools.${index}.name`, val as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tool" />
                  </SelectTrigger>
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

              <Button 
                variant="destructive" 
                type="button" 
                onClick={() => remove(index)}
                className="w-full md:w-auto"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => append({ name: 'ChatGPT', tier: 'Plus' as any, monthlySpend: 20, seatCount: 1 })}
            className="flex gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Add Tool
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Run Audit
          </Button>
        </div>
      </form>

      {/* Audit Results Rendering */}
      {results.length > 0 && (
        <div className="mt-12 space-y-6 border-t pt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* NEW HERO SECTION */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-blue-600 text-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-80 text-white">Total Monthly Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">${results.reduce((acc, curr) => acc + curr.potentialSavings, 0)}</p>
        </CardContent>
      </Card>
      <Card className="bg-zinc-900 text-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-80 text-white">Total Annual Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">${results.reduce((acc, curr) => acc + curr.potentialSavings, 0) * 12}</p>
        </CardContent>
      </Card>
    </div>

          <h3 className="text-2xl font-bold">Your Audit Results</h3>
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
                  <p className="font-semibold text-zinc-700 underline decoration-green-200">Action: {res.recommendedAction}</p>
                  <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{res.reasoning}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Fallback for when no savings are found */}
      {results.length === 0 && watchedFields.tools.length > 0 && (
        <div className="text-center text-zinc-400 py-10 border-t">
          Enter your tools and click "Run Audit" to see potential savings.
        </div>
      )}
    </div>
  );
}
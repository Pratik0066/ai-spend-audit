import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function SharePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
 const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id) 
    .single();

  if (error || !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Audit not found or has been removed.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Official Audit Report
          </Badge>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
            ← Run your own audit
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">AI Spend Audit Results</h1>
          <p className="text-zinc-500">Prepared for an anonymous startup team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase opacity-70">Potential Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">${lead.total_savings}/mo</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase opacity-70">Annual Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">${lead.total_savings * 12}/yr</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Next Steps for this Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600 leading-relaxed italic">
              "This team is currently over-subscribing to redundant tools. By consolidating into 
              a unified Cursor-based stack and cleaning up unused ChatGPT Team seats, they can 
              instantly capture the savings identified above."
            </p>
          </CardContent>
        </Card>

        <footer className="text-center pt-10 border-t">
          <p className="text-sm text-zinc-400">Powered by Credex Logic • May 2026</p>
        </footer>
      </div>
    </main>
  );
}
import { AuditForm } from '@/components/audit-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            Stop overpaying for AI.
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Get an instant audit of your company's AI tool spend. 
            Identify redundant subscriptions and find the best tiers for your team.
          </p>
        </div>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
          <h2 className="text-xl font-semibold mb-6">Current AI Stack</h2>
          <AuditForm />
        </section>
        
        <footer className="text-center text-zinc-400 text-sm">
          A lead-generation tool powered by Credex Logic. Verified May 2026.
        </footer>
      </div>
    </main>
  );
}
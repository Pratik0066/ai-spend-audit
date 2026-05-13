import { AuditForm } from '@/components/audit-form';
import { ShieldCheck, Users, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Visual Flair: Animated Mesh Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_-20%,_var(--color-primary)_0%,transparent_70%)] opacity-15 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto py-20 px-6 space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20 animate-fade-in">
             May 2026 Verified Logic
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent italic">
            Stop Overpaying <br/> for Intelligence.
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Most startups waste 30% of their AI budget on redundant seats. 
            Audit your stack in 60 seconds.
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl p-1 rounded-[2rem] border border-border shadow-2xl">
           <section className="bg-card p-8 rounded-[1.8rem] border border-border">
              <AuditForm />
           </section>
        </div>
      </div>
    </main>
  );
}
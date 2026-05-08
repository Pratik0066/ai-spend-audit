# AI Spend Audit — Stop Overpaying for Intelligence
A free lead-generation tool built for Credex to help startups identify redundant AI subscriptions and find optimal tiers[cite: 23, 30].

## Decisions & Trade-offs
1. **Vitest over Jest:** Chosen for sub-second execution and native ESM support in Next.js 15.
2. **Client-Side Engine:** Decided to run the audit math in the browser for instant feedback before the lead gate[cite: 41].
3. **Shadcn Nova:** Used the 2026 Nova preset for a "SaaS-native" look that encourages sharing[cite: 73].
4. **Supabase RLS:** Implemented Insert-only policies for anonymous users to protect the database while allowing lead capture[cite: 84].
5. **LLM Fallback:** Implemented a templated fallback for the summary to handle Anthropic API rate limits or credit exhaustion[cite: 76].

## Quick Start
1. `npm install`
2. Configure `.env.local` with Supabase and Anthropic keys.
3. `npm run dev`
4. `npm test` to run the audit engine suite[cite: 150].

**Live URL:** [Insert Vercel Link Here]
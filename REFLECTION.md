# REFLECTION.md

### 1. The hardest bug?
Fixing the hydration race condition in the `AuditForm`. The `localStorage` was loading after the form initialized, causing it to overwrite saved data with defaults. I solved this by using the `reset()` method from `react-hook-form` inside a dedicated `useEffect` hook.

### 2. Decision reversed?
I initially planned to generate the audit report PDF on the server. I reversed this to focus on the **Viral Loop** (Unique URLs) because the assignment prioritizes distribution over static downloads for Round 1[cite: 93].

### 3. What to build in Week 2?
I would build **"Benchmark Mode."** It would compare the user's spend-per-developer against industry averages for their specific startup stage, creating higher psychological pressure to optimize via Credex[cite: 97].

### 4. AI Tool Usage
I used **Claude 3.5 Sonnet** to help generate the TypeScript interfaces and the Mermaid diagram in `ARCHITECTURE.md`. I did not trust it with the actual audit math; I manually hardcoded those rules to ensure they were "defensible" and accurate to 2026 pricing[cite: 78, 225]. One time, it suggested a pricing plan that was six months out of date; I caught this by cross-referencing with my `PRICING_DATA.md` sources[cite: 66, 157].

### 5. Self-Rating (1-10)
- **Discipline: 9/10** - Commits are spread across 3 distinct days with a detailed devlog[cite: 131, 216].
- **Code Quality: 8/10** - TypeScript used throughout; logic is separated into pure functions.
- **Design Sense: 9/10** - Focused on "Hero" metrics to make the results page screenshot-ready[cite: 69, 73].
- **Problem-Solving: 8/10** - Successfully implemented a secure lead-gate before the AI summary.
- **Entrepreneurial Thinking: 9/10** - Deep investment in GTM and Economics files to prove business value.
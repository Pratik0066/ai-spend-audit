# TESTS.md [cite: 149]

## Automated Test Suite
I used **Vitest** to verify the audit engine's logic. 

1. Redundancy Check (`tests/audit.test.ts`) 
Verifies that users paying for both Cursor and Copilot are told to cancel Copilot. 

2. Plan Efficiency (`tests/audit.test.ts`) 
Checks if single users on "Team" plans are correctly flagged for downgrades. [cite: 59, 151]

3. Honesty Verification (`tests/audit.test.ts`) 
Ensures that optimal stacks return zero savings to avoid manufacturing fake value. [cite: 71, 151]

4. Volume Calculations (`tests/audit.test.ts`) 
Validates that potential savings are correctly multiplied by the `seatCount`. 

5. API vs Pro Check (`tests/audit.test.ts`) 
Identifies if heavy API usage warrants switching to a flat-rate unlimited tier. 

How to Run: 
```bash
npm test
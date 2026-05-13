# LLM Prompts

## The Audit Summary Prompt

**System:** You are a senior financial analyst for a tech startup. Do not use generic greetings. Be direct, authoritative, and concise.
**User:** Review these audit results: [JSON Data]. The total potential savings is $[Total]. Write a 100-word punchy summary highlighting the single biggest area of waste and tell the founder exactly what action to take first to stop bleeding cash.

### Why I wrote it this way:
I structured this with a strict `System` role to prevent the LLM from acting like a helpful, generic chatbot (e.g., preventing outputs like "Sure! Here is your audit..."). By defining the persona as a "senior financial analyst" and explicitly passing the `[Total]` as a distinct variable, it forces the model to ground its advice in the numbers rather than giving vague workflow tips.

### What I tried that didn't work:
Initially, my prompt was just: *"Summarize these tool savings for the user: [JSON data]"*. 
**The Failure:** The model generated 300+ words of fluff, explaining what each tool did, and completely ignored the actual financial math. It also formatted the output with bullet points that broke my UI container. Adding the "100-word punchy summary" constraint and the "direct action" directive fixed the length and tone issues immediately.
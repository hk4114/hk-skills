# Validation Cases

Use these cases to verify skill correctness after modifications.

## Discoverability Test

Verify the skill triggers correctly based on frontmatter.

**Must trigger**:
1. "Help me optimize this prompt about writing product descriptions"
2. "Can you improve this system prompt for my AI assistant?"
3. "I need to rewrite this prompt to get more stable outputs"

**Must NOT trigger**:
1. "Write a Python script to scrape data" (code generation, not prompt optimization)
2. "What's the weather like today?" (unrelated query)
3. "Fix this bug in my React component" (debugging, not prompt work)

## Logic Test: Quick Completion Path

**Input**: "Help me write a prompt for summarizing meeting notes"

**Expected execution**:
1. State 0: User provided clear requirements → skip routing
2. State 3: Task has < 5 steps → read `assets/simple-prompt.md`
3. Fill template variables → output compiled prompt
4. State 4: Simple task → skip Red Team Review
5. Deliver result

**Verify**: No unnecessary questions asked. Template loaded correctly. Output is copy-ready.

## Logic Test: Deep Optimization Path

**Input**: "I need AI to help me analyze market trends and write a strategic report"

**Expected execution**:
1. State 0: Complex task → proceed to State 1
2. State 1: Ask 1-2 high-value questions (perspectives, success criteria)
3. State 2: Auto-detect format (Markdown for report)
4. State 3: Multi-step task → read `assets/complex-prompt.xml`
5. Inject strategy tags (analysis → "Analyze variables first, then conclusion")
6. State 4: Complex task → execute Red Team Review
7. Deliver result + vulnerabilities + patch

**Verify**: Alignment questions are high-value (not generic). Strategy injection matches task type. Red Team finds concrete vulnerabilities.

## Boundary Cases

1. **User says "just give me the result"**: Skip all alignment states, compile directly from State 3.
2. **User provides an existing prompt to optimize**: Skip State 1, jump to State 3 for structural analysis.
3. **Task type is ambiguous**: Default to "Analysis & Reasoning" strategy, ask one clarifying question about output purpose.
4. **User asks for prompt about code generation**: Treat as "Fact/Math/Code" type → disable role-playing, prioritize precision.
5. **Multi-answer scenario requested**: Inject enumeration strategy with probability scoring.

## Regression Guard

After any modification, verify:
- [ ] State machine transitions are deterministic
- [ ] JiT file paths (`assets/`, `references/`) use forward slashes
- [ ] Simple tasks skip Red Team Review
- [ ] Complex tasks include Red Team Review
- [ ] Output is wrapped in code block for copying
- [ ] No tutorial or disclaimer text in output

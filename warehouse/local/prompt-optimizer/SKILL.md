---
name: prompt-optimizer
description: Compile ambiguous user requirements into industrial-grade, structured prompts. Trigger when users say "optimize prompt", "improve prompt", "write a prompt", "优化提示词", "优化prompt", or paste raw requirements expecting a ready-to-use prompt. Do NOT trigger for general writing tasks, code debugging, or factual questions unrelated to prompt engineering.
---

# Prompt Compiler Architect

Compile incomplete human intentions into machine-executable instruction systems.

**Core objective**: Reduce ambiguity, auto-complete constraints, minimize iteration cycles.

**Principles**:
1. Ask fewer questions; ask only high-value questions.
2. Users choose better than they describe from scratch.
3. A prompt is task compilation, not text refinement.
4. Output must be copy-ready, requiring no secondary processing.

---

## Workflow

```
State 0 (Task Routing) → State 1 (Deep Alignment) → State 2 (Format Lock) → State 3 (Compilation) → [State 4 (Red Team)] → Deliver
```

Advance sequentially. If requirements are clear, skip early states.

---

## State 0 — Task Routing

**Objective**: Determine optimization depth.

**Action**:
1. If user provided detailed requirements → skip to State 3.
2. If requirements are vague → ask exactly one question:
   > For this task, do you prefer:
   > 1. Quick completion (< 5 minutes, good enough)
   > 2. Deep optimization (2-hour quality, stable output)
3. If "Quick" → skip to State 3, use lightweight compilation.
4. If "Deep" → proceed to State 1.

---

## State 1 — Deep Alignment

**Objective**: Fill high-impact information gaps. Maximum 1-2 questions per round.

### 1.1 Task Type Auto-Detection

Identify type and auto-select strategy:

| Type | Strategy |
|------|----------|
| Creative Generation | Multi-option + Style variance |
| Content Writing | Structural template + Style anchor |
| Analysis & Reasoning | Step-by-step + Conclusion at end |
| Decision & Advice | Evaluation framework + Comparison table |
| Code Generation | Precise constraints + Verifiability |
| Information Extraction | Format lock + Field constraints |
| Workflow/SOP | Stage breakdown + Checkpoints |
| Long-form (>1000 words) | Outline first + Paragraph control |
| Agent/System Prompt | Role + Rules + Boundaries |

### 1.2 Perspective Suggestion

Infer 3 key perspectives. Present as multiple-choice:

> For this issue, the most critical perspectives are:
> A. [Perspective 1, e.g., "Product Manager — business value"]
> B. [Perspective 2, e.g., "Developer — implementation feasibility"]
> C. [Perspective 3, e.g., "User — experience fluency"]
> Which to retain? (Multiple choice allowed)

### 1.3 Key Variable Completion

Fill variables in priority order. Stop when marginal benefit drops.

Priority:
1. Success Criteria (what defines "good")
2. Output Purpose (audience and use case)
3. Target Audience (background knowledge)
4. Style Preference (formal/casual, concise/detailed)
5. Must-Avoid Issues (common failure modes)
6. Data Source (basis of information)
7. Output Length (words/paragraphs/pages)
8. Format Requirements (Markdown/JSON/Table)

**Stop conditions** (meet any):
- Information sufficient for high-quality prompt.
- User requests direct generation.
- Marginal benefit of new info drops significantly.

### 1.4 Paradigm Anchoring

Generate 3 output paradigms with different strategy dimensions:

> **Option A (Minimalist & Direct)**
> [Concise sample]
> **Option B (Professional & Rigorous)**
> [Structured sample with constraints]
> **Option C (Flexible Exploration)**
> [Open, multi-angled sample]

After selection → proceed to State 2.

---

## State 2 — Output Format Lock

**Objective**: Determine final output format.

**Action**: Auto-infer format. Only ask when ambiguous.

| Task Characteristics | Default Format |
|----------------------|----------------|
| Structured data / Interface | JSON |
| Document / Article / Report | Markdown |
| Data comparison / Multi-dim | Table |
| General tasks | Markdown |

Optional: Markdown, JSON, Table, List, XML, Custom.

After confirmation → proceed to State 3.

---

## State 3 — Prompt Compilation

**Objective**: Generate an industrial-grade, copy-ready prompt.

**Compilation principles**:
- Clear: Unambiguous phrasing.
- Strongly constrained: Clear boundaries.
- Executable: Model operates directly per instructions.
- Copyable: User pastes and uses immediately.
- Extensible: Leaves necessary variable interfaces.

**Action**:
1. Assess task complexity:
   - If < 5 steps, single output → read `assets/simple-prompt.md`.
   - If multi-step, multi-constraint → read `assets/complex-prompt.xml`.
2. Fill template with gathered variables.
3. Inject strategy tags based on task type:

| Task Type | Injected Strategy |
|-----------|-------------------|
| Creative | "Generate 3-5 distinctly different options with applicable scenarios." |
| Analysis/Reasoning | "Analyze key variables first, then output conclusion." |
| Stylized Writing | Allow role-playing: "You are a professional [field] expert..." |
| Fact/Math/Code | Disable role-playing; prioritize precision and verifiability. |
| Long Tasks | Add stage breakdowns, sub-tasks, checkpoints, self-check. |

4. Handle special scenarios:
   - **Multi-answer/Creative**: Generate 3-5 candidates, assign probabilities (sum=1), sort descending. Provide sampling advice.

**Output format**:
1. Complete Prompt (wrapped in code block)
2. Brief Design Rationale (3-5 lines)

Do not output: explanations, tutorials, disclaimers.

After completion → evaluate State 4 condition.

---

## State 4 — Red Team Review (Conditional)

**Trigger condition**: Execute ONLY for complex tasks (multi-step, multi-constraint, or high-stakes prompts). Skip for simple tasks.

**Objective**: Attack the generated prompt from a "saboteur" perspective.

**Review dimensions**:
1. Biggest point of ambiguity
2. Highest risk of failure
3. Most likely point of hallucination
4. Missing constraints
5. Output instability factors

**Output format**:
> If this Prompt fails, the most likely reasons are:
> 1. [Specific vulnerability]
> 2. [Specific vulnerability]
>
> Recommended Patch:
> [Supplementary instructions]

---

## Self-Check

Before final output, verify:

- [ ] No ambiguous expressions.
- [ ] Success criteria present.
- [ ] Boundary constraints defined.
- [ ] No conflicting instructions.
- [ ] Output format is clear.
- [ ] No prompt-engineering show-off.
- [ ] Not overly complex for the task.

Issue found → auto-fix → then output.

---

## Communication Style

- **Concise**: Do not explain actions; execute them.
- **Practical**: Deliver the prompt, not the teaching process.
- **Flexible**: Skip alignment if user says "give me the result directly".
- **Professional but approachable**: Use "we" to reduce mechanical feel.

**Core process**:
Understand Requirement → Assess Depth → Align Info (if needed) → Compile Prompt → [Red Team (if complex)] → Deliver

**If user brings an existing prompt**: Skip to State 3. Analyze structural issues and refactor without re-running alignment.

---

## Reference Files

- `assets/simple-prompt.md` — Lightweight template for simple tasks (State 3)
- `assets/complex-prompt.xml` — Structured template for complex tasks (State 3)
- `references/examples.md` — Full examples (read only when user requests references)
- `evals/validation.md` — Validation cases for skill testing

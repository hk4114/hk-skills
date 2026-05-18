# Research Operators

Use this reference only when the source or user goal requires deeper research analysis than the default `deep_analysis` template.

## Selection Rules

Do not run every operator by default. Select the smallest useful set:

- Single article or essay: choose 2-3 operators.
- Long report, paper, or business commentary: choose 3-5 operators.
- Multi-source literature review, due diligence, or research synthesis: choose 4-7 operators.
- Full research package: run all relevant operators only when the user explicitly asks for comprehensive research.

Preserve the evidence labels from the main skill: `原文明确`, `合理推断`, `创造性延展`, `信息不足`.

## Operators

| Operator | Use When | Output |
| --- | --- | --- |
| `insight_synthesizer` | The user wants the most important takeaways, breakthrough insight, or executive-level understanding. | 3 high-leverage insights, why each matters, what conventional assumption it challenges, and evidence label. |
| `contradiction_auditor` | There are multiple sources, drafts, authors, time periods, or competing claims. | Contradiction table: claim A, claim B, source support, stronger evidence, likely cause of disagreement, unresolved evidence needed. |
| `implementation_planner` | The user needs to turn research into action, SOP, product plan, study plan, or decision workflow. | Step plan with prerequisites, actions, tools/frameworks, expected result, risks, and failure traps. |
| `question_generator` | The user wants research gaps, product opportunities, next inquiry, or deeper questions. | 10-15 unanswered expert questions ranked by potential value, with why the source does not answer them. |
| `assumption_miner` | The argument depends on unstated premises, market beliefs, causal claims, or expert intuition. | Hidden assumptions with criticality, failure probability, what changes if false, and validation method. |
| `framework_builder` | The user needs a reusable model, decision tree, taxonomy, or operating framework. | Components, relationships, decision tree, usage rules, edge cases, and failure conditions. |
| `evidence_mapper` | The user needs rigor, claim checking, or confidence calibration. | Main claims mapped to evidence type: anecdotal, correlational, experimental, meta-analytic, authority claim, or unsupported. Flag confident claims with weak evidence. |
| `audience_translator` | The output must serve different readers or stakeholders. | Same insight translated for executives, builders/engineers, and end users, using role-specific stakes and examples. |
| `timeline_builder` | The source contains dates, milestones, historical evolution, product cycles, policy changes, or technology shifts. | Timeline of events, inflection points, acceleration/deceleration signals, and implications for future trajectory. |
| `weakness_detector` | The user wants critique, peer review, due diligence, risk analysis, or a stronger argument. | Method flaws, logic gaps, overclaims, unsupported jumps, and extra evidence needed to strengthen the claim. |

## Composition Patterns

### Article Deep Dive

Use `insight_synthesizer`, `evidence_mapper`, `assumption_miner`, and `weakness_detector`.

### Paper / Method Review

Use `evidence_mapper`, `assumption_miner`, `weakness_detector`, and optionally `implementation_planner` when practical application matters.

### Multi-Source Synthesis

Use `contradiction_auditor`, `evidence_mapper`, `framework_builder`, and `timeline_builder` when sources evolve over time.

### Decision / Investment / Due Diligence

Use `contradiction_auditor`, `evidence_mapper`, `assumption_miner`, `weakness_detector`, and `implementation_planner`.

### Product / Opportunity Discovery

Use `insight_synthesizer`, `question_generator`, `assumption_miner`, `framework_builder`, and `audience_translator`.

## Output Integration

Do not create a separate report section for every selected operator unless the user asks for an exhaustive package. Integrate operator outputs into the selected module file:

- `deep_analysis`: evidence, assumptions, contradictions, weaknesses, timeline, and reusable value.
- `thought_refine`: distilled insights and role-specific expression.
- `cognitive_upgrade`: framework, hidden variable, decision tree, and edge cases.
- `99-summary`: selected operators, final conclusion, unresolved evidence gaps, and recommended next step.

## Failure Guards

- Do not use expert role-play as a substitute for evidence.
- Do not call an insight "breakthrough" unless the source supports a real shift in model, mechanism, or decision.
- Do not treat equal disagreement as resolved; mark why both sides may be credible.
- Do not invent dates, sources, benchmarks, author intent, or external controversy.
- Do not turn research analysis into a generic question list when the source already supports concrete conclusions.

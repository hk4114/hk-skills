---
name: article-analyzer
description: Analyze articles, papers, essays, technical blogs, business commentary, reports, raw notes, or long-form arguments into structured understanding, delivered as an output folder containing one Markdown file per selected analysis module plus a synthesis document. Use when the user asks for article analysis, 深度分析, 分析这篇文章, 拆解观点, 论文速读, paper scan, 分析这篇论文, thought refinement, 思想精炼, 提炼主线, 高密度表达, cognitive upgrade, 提维, 升维, 认知升级, 底层模型, or model reconstruction. Do not use for translation, publishable article rewriting, social-media packaging, title generation, cover creation, or external fact-checking unless the user explicitly asks for analysis first.
---

# Article Analyzer

Turn articles, papers, essays, and long-form arguments into structured understanding. Expose the argument model, evidence chain, hidden assumptions, transferable insight, and optional higher-level cognitive model.

Default to Chinese unless the user requests another language.

## Core Contract

Route before analyzing, then create a complete analysis package. This skill is a folder-output workflow, not an in-chat single report. The user's default habit is a staged chain: `deep_analysis -> thought_refine -> cognitive_upgrade`; papers add `paper_scan` before `deep_analysis`.

Preserve evidence boundaries:

- `原文明确`: directly stated by the source.
- `合理推断`: inferred from the source's argument, examples, structure, or omissions.
- `创造性延展`: a new framing, analogy, model, or synthesis created by the analyst.
- `信息不足`: cannot be answered from the provided source.

Do not invent author background, publication context, SOTA status, data source, external controversy, or intended audience. If external facts are needed, mark `信息不足` and state what evidence would be needed.

Do not modify files in `references/`. Load only the reference prompt required by the selected module.

## Routing Protocol

Before output, do a short internal routing pass:

1. Classify source type.
2. Infer user goal.
3. Build the default full package route unless the user explicitly asks to skip or narrow modules.
4. Load only the matching reference prompt files.
5. Create an output folder and write the selected module documents plus a synthesis document.

If the source type is ambiguous, default to `article` and run the article full package: `deep_analysis -> thought_refine -> cognitive_upgrade`.

### Source Types

| Source family | Signals | Default module |
| --- | --- | --- |
| `paper` | paper, 论文, arXiv, DOI, abstract, method, experiments, SOTA, contribution, benchmark | `paper_scan -> deep_analysis -> thought_refine -> cognitive_upgrade` |
| `article` | article, essay, blog, report, commentary, long-form argument | `deep_analysis -> thought_refine -> cognitive_upgrade` |
| `technical_article` | technical blog, engineering article, architecture explanation, method comparison | `deep_analysis -> thought_refine -> cognitive_upgrade` |
| `business_commentary` | market, company, strategy, industry, product, operation, investment commentary | `deep_analysis -> thought_refine -> cognitive_upgrade` |
| `raw_thought` | rough notes, verbose draft, conversation excerpt, loose argument | `deep_analysis -> thought_refine -> cognitive_upgrade` |

### Goal Routing

| User intent | Signals | Module chain |
| --- | --- | --- |
| default article package | 深度分析, 分析这篇文章, 拆解观点, 看看这篇, 思想精炼, 提维, 认知升级 | `deep_analysis -> thought_refine -> cognitive_upgrade` |
| default paper package | 论文速读, 快速读懂论文, paper scan, arXiv, 分析这篇论文, 论文解构, 方法论文分析 | `paper_scan -> deep_analysis -> thought_refine -> cognitive_upgrade` |
| explicit narrow paper quick read | 只做论文速读, 只要 paper scan, 不要后续分析 | `paper_scan` |
| explicit narrow deep analysis | 只做深度分析, 不要精炼, 不要提维 | `deep_analysis` |
| explicit narrow thought refinement | 只做思想精炼, 只要高密度表达, 不要提维 | `deep_analysis -> thought_refine` |
| explicit narrow cognitive upgrade | 只做提维, 已有分析结论 | `cognitive_upgrade` or `deep_analysis -> cognitive_upgrade` depending on source completeness |

When multiple goals are present, preserve this order:

`paper_scan -> deep_analysis -> thought_refine -> cognitive_upgrade`

Default to the full package route. Only remove a module when the user explicitly says "只做", "不要", "跳过", or gives an already completed upstream document.

## Module Protocol

Every module follows this shape: `purpose`, `trigger`, `inputs`, `outputs`, `evidence_policy`, `skip_conditions`, `reference_prompt`.

### `paper_scan`

- `purpose`: Quickly deconstruct a paper before deeper analysis. Identify the problem, prior bottleneck, core mechanism, innovation delta, and boundary conditions.
- `trigger`: Run for papers, academic methods, arXiv-style inputs, DOI/PDF paper tasks, or when the user says "论文速读", "分析这篇论文", "paper", "SOTA", "method", or "benchmark".
- `inputs`: Paper text, abstract, notes, extracted content, and optional user focus such as method, contribution, limitation, application, or critique.
- `outputs`: Core pain point, solution mechanism, innovation delta, critical boundary, and one-sentence or napkin-level model.
- `evidence_policy`: Label all comparisons with `原文明确`, `合理推断`, or `信息不足`. Do not assert SOTA improvement unless the paper provides evidence.
- `skip_conditions`: Skip for non-academic articles unless the user explicitly asks for paper-style analysis. Skip if the source is only a short quote without enough method or contribution detail.
- `reference_prompt`: `references/paper_scan.md`

### `deep_analysis`

- `purpose`: Build the main understanding layer for articles and papers. Extract thesis, concepts, structure, evidence, background context, hidden assumptions, counterarguments, boundaries, and reusable value.
- `trigger`: Run by default for article analysis tasks. Run after `paper_scan` for paper deep analysis. Run before `thought_refine` or `cognitive_upgrade` when the source has not been analyzed.
- `inputs`: Source text, file content, URL content, excerpt, optional target reader roles, and optional analysis focus.
- `outputs`: Core thesis, key concepts, argument structure, evidence and examples, background context, hidden assumptions, counterarguments, weaknesses, validity boundaries, reusable frameworks, and reader-specific value when target readers are known.
- `evidence_policy`: Separate explicit evidence from inference. Mark author background, writing context, and intended audience as `信息不足` when absent. Infer target reader roles only when useful and label them `合理推断`.
- `skip_conditions`: Skip only when the user asks for pure paper quick read, pure text polishing, pure translation, or another non-analysis task.
- `reference_prompt`: `references/deep_analysis.md`

### `thought_refine`

- `purpose`: Convert analysis or verbose source material into a sharp, high-density thinking output. Produce conclusion-first structure, not a line-by-line summary.
- `trigger`: Run when the user asks for "思想精炼", "提炼主线", "压缩观点", "高密度表达", "结论先行", "把啰嗦内容变清楚", or communication clarity after analysis.
- `inputs`: Output from `deep_analysis`, or raw text when the user directly asks to refine a verbose argument.
- `outputs`: Optional diagnosis of verbosity or structure, one core idea, communication purpose, conclusion-first structure, three or fewer primary support points unless the source demands more, and refined high-density expression.
- `evidence_policy`: Preserve the author's actual claim. Mark sharpened interpretation beyond explicit wording as `合理推断`. Do not add new examples, claims, or external knowledge.
- `skip_conditions`: Skip when the user asks for full deep analysis only. Skip when preserving original order is more important than expression clarity.
- `reference_prompt`: `references/thought_refine.md`

### `cognitive_upgrade`

- `purpose`: Move beyond direct analysis to construct a higher-level model. Identify thesis, antithesis, common goal, missing variable, synthesis, blind spot, test scenario, and action algorithm.
- `trigger`: Run only when the user explicitly asks for "提维", "升维", "认知升级", "底层模型", "新框架", "重构模型", "更高维度怎么看", or equivalent wording.
- `inputs`: Output from `deep_analysis`, or a user-provided claim, view, or argument that can support thesis/antithesis reconstruction.
- `outputs`: Thesis, antithesis, common goal, missing variable, synthesis model, ego trap or cognitive blind spot, test scenario, and action algorithm.
- `evidence_policy`: Treat synthesis as `创造性延展` by default. Preserve traceability back to source claims. Separate the author's view from the analyst's upgraded model.
- `skip_conditions`: Skip unless the user requests cognitive upgrade or model reconstruction. Skip when the source is too thin to support a meaningful thesis/antithesis pair. Skip when the user asks for faithful summary, academic review, or evidence-only analysis.
- `reference_prompt`: `references/cognitive_upgrade.md`

## Output Modes

| Mode | When used | Output shape |
| --- | --- | --- |
| `article_package` | default for articles, essays, blogs, reports, raw thoughts | `01-deep_analysis.md`, `02-thought_refine.md`, `03-cognitive_upgrade.md`, `99-summary.md` |
| `paper_package` | default for papers and academic methods | `01-paper_scan.md`, `02-deep_analysis.md`, `03-thought_refine.md`, `04-cognitive_upgrade.md`, `99-summary.md` |
| `narrow_package` | user explicitly skips modules | selected module files plus `99-summary.md` |

Default output should be compact but not shallow. Prefer concrete claims, evidence, and boundaries over generic explanation.

## Folder Output Contract

Always deliver a folder, not only an in-chat Markdown report.

Choose the output folder in this order:

1. Use the user-provided output path when specified.
2. For a local source file, create a sibling folder named `<source-basename>-article-analyzer`.
3. Otherwise create `article-analyzer-<short-slug>` in the current project directory.

Keep all outputs inside the current project or the user-specified path. Do not write analysis outputs to `/private/tmp` or other system temp folders.

Inside the folder, write one Markdown file per selected module, plus one synthesis file:

```text
article-analyzer-<short-slug>/
  01-paper_scan.md
  02-deep_analysis.md
  03-thought_refine.md
  04-cognitive_upgrade.md
  99-summary.md
```

For normal article inputs, create at least four files:

```text
article-analyzer-<short-slug>/
  01-deep_analysis.md
  02-thought_refine.md
  03-cognitive_upgrade.md
  99-summary.md
```

For normal paper inputs, create at least five files:

```text
article-analyzer-<short-slug>/
  01-paper_scan.md
  02-deep_analysis.md
  03-thought_refine.md
  04-cognitive_upgrade.md
  99-summary.md
```

Only create fewer files when the user explicitly narrows the route. Preserve route order in numeric prefixes. If a module is skipped by explicit request, do not create an empty placeholder file.

Write `99-summary.md` last. It must include:

- source title or source identifier;
- selected route;
- generated file index;
- final integrated conclusion;
- evidence boundaries and unresolved `信息不足`;
- recommended next read or next analysis step when useful.

For the default package, `deep_analysis` always gets its own file. Lightweight internal `deep_analysis` is allowed only when the user explicitly asks for a narrow direct refinement task. For `cognitive_upgrade`, create a source-faithful analysis file before the upgrade file unless the user provides an already analyzed claim and explicitly asks to skip upstream analysis.

Final chat response should be short: provide the output folder path and list generated files. Do not paste the full report contents into chat unless the user asks.

## Failure Guards

- Do not collapse the default workflow into a single Markdown report.
- Do not output fewer than four files for normal article inputs.
- Do not output fewer than five files for normal paper inputs.
- Do not treat `cognitive_upgrade` as faithful source analysis.
- Do not replace evidence with attitude.
- Do not answer with a long question list when the source is sufficient for analysis.
- Do not let `thought_refine` change the author's core claim.
- Do not treat examples in `references/` as coverage limits.

# Skill Catalog（技能目录）

> 本文档由 `./bin/hk-skill catalog` 自动生成，经人工翻译和场景化整理后供用户查阅。
> 技能名称、CLI 命令、文件路径等技术标识保留英文原文。

---

## ✅ 已启用技能（Enabled）

以下技能当前已在项目中激活，可直接触发使用。

### 内容创作

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **article-analyzer** | 深度分析文章、论文、技术博客、商业评论、报告或长文论点，输出结构化理解（每模块一份 Markdown + 综合文档）。 | article analysis, 深度分析, 分析这篇文章, 拆解观点, 论文速读, paper scan, thought refinement, 思想精炼, 提炼主线, cognitive upgrade, 提维, 升维, 认知升级 |
| **subtext-article** | 将字幕/转录稿/口语稿（B站/YouTube/SRT/VTT/播客等）转化为可发布的中文长文，保留原意、顺序和关键引用。 | 字幕转文章, transcript to article, B站字幕, YouTube字幕, ASR转写, 口语稿, 播客转写, 视频文稿 |
| **merge-drafts** | 将多个草稿合并为一篇高质量文章，选择最佳草稿作为基底，整合其他草稿的亮点和缺失内容。 | merge drafts, 合并稿子, 合稿, 把这几篇合成一篇, combine drafts, consolidate drafts, 整合稿件, 统稿 |
| **baoyu-translate** | 翻译文章和文档，支持快速/标准/精翻三种模式，可自定义术语表。 | translate, 翻译, 精翻, 改成中文/英文, localize, 本地化, 快速翻译, 快翻 |
| **baoyu-format-markdown** | 格式化 Markdown 文件，添加 frontmatter、标题、摘要、加粗、列表和代码块。 | format markdown, beautify article, add formatting, 改善文章排版 |

### 社交媒体与发布

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **baoyu-post-to-wechat** | 发布内容到微信公众号，支持文章（HTML/Markdown/纯文本）和贴图（多图）。 | 发布公众号, post to wechat, 微信公众号, 贴图/图文/文章 |
| **baoyu-post-to-weibo** | 发布内容到微博，支持普通帖（文字/图片/视频）和头条文章（Markdown）。 | post to Weibo, 发微博, 发布微博, 微博头条文章 |
| **baoyu-post-to-x** | 发布内容到 X/Twitter，支持普通帖（图片/视频）和 X Articles（长文 Markdown）。 | post to X, tweet, publish to Twitter, share on X |
| **baoyu-image-cards** | 生成社交媒体信息图卡片系列（12 视觉风格 × 8 布局 × 3 色板），适配小红书/微信图文等。 | 小红书图片, 小红书种草, 小绿书, 微信图文, 微信贴图, image cards, 图片卡片 |

### 图像处理与生成

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **baoyu-imagine** | AI 图像生成，支持 GPT Image 2、Azure OpenAI、Google、OpenRouter、DashScope、Z.AI GLM-Image、MiniMax、Jimeng、Seedream 和 Replicate 等 API。 | generate image, create image, draw image, 生成图片, 画图 |
| **baoyu-cover-image** | 生成文章封面图，支持 5 维度（类型/色板/渲染/文字/情绪）× 11 色板 × 7 渲染风格，多种比例。 | generate cover image, create article cover, make cover, 生成封面 |
| **baoyu-article-illustrator** | 分析文章结构，识别需要视觉辅助的位置，用 Type × Style × Palette 三维方法生成配图。 | illustrate article, add images, generate images for article, 为文章配图 |
| **baoyu-compress-image** | 压缩图片为 WebP（默认）或 PNG，自动选择最佳工具。 | compress image, optimize image, convert to webp, 压缩图片, 图片优化 |
| **baoyu-infographic** | 生成专业信息图，21 种布局 × 22 种视觉风格，分析内容并推荐布局×风格组合。 | infographic, 信息图, visual summary, 可视化, 高密度信息大图 |
| **baoyu-diagram** | 创建专业暗色主题 SVG 图表（架构图、流程图、时序图、思维导图、时间线等）。 | diagram, flowchart, sequence diagram, 画个图, 画一个架构图, draw me a... |

### PPT 与演示

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **baoyu-slide-deck** | 生成专业幻灯片图片，先创建大纲和风格说明，再逐页生成图片。 | create slides, make a presentation, generate deck, slide deck, PPT |
| **guizang-ppt-skill** | 生成横向翻页网页 PPT（单 HTML 文件），含 WebGL 背景、章节幕封、数据大字报、图片网格等模板，支持杂志风和瑞士国际主义两种风格。 | 网页 PPT, 杂志风 PPT, 瑞士风 PPT, Swiss Style, horizontal swipe deck |

### 网页设计

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **web-design** | Web 视觉设计 SKILL：输入 PRD / 参考 URL / 截图 / 关键词，先产出 DESIGN.md 设计规范，再生成 UI/UX、视觉、动效、响应式全部达标的网页代码。 | 帮我做个网站, 设计一个页面, 参考 XX 做一个, landing page, design 规范 |

### 知识管理与阅读

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **concept-fable** | 创建高密度中文概念寓言：从用户指定领域提取一个高阶小众概念，藏进三段式故事，最后揭示并映射。 | 概念寓言, 三段式寓言, 用寓言解释领域概念, story-based concept explanation, Concept Reveal |
| **blog-checker** | 审阅和评估中文技术博客文章的质量，检查技术准确性、结构、表达和可读性。 | 审阅技术文章, 检查博客, 评估技术写作, blog review |

### Prompt 与 Agent 工作流

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **prompt-optimizer** | 将模糊的用户需求编译为工业级、结构化的 Prompt。 | optimize prompt, improve prompt, write a prompt, 优化提示词, 优化prompt |
| **session-achieve** | 复盘当前多轮对话，提取纠偏逻辑并沉淀黄金提示词。 | 复盘对话, 总结这次对话, session review, review this session, 生成复盘报告 |
| **HeavySkill** | 将深度思考（Heavy Thinking）作为 Agent 驾驭中的内建技能。 | Heavy Thinking, Agentic Harness, 深度思考 |

### 工具与辅助

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **baoyu-url-to-markdown** | 获取任意 URL 并转为 Markdown，内置 X/Twitter、YouTube、Hacker News 等适配器。 | save webpage as markdown, url to markdown, 网页转 markdown |
| **baoyu-youtube-transcript** | 下载 YouTube 视频字幕/封面，支持多语言、翻译、章节和说话人识别。 | get YouTube transcript, download subtitles, YouTube字幕, YouTube封面, video thumbnail |
| **baoyu-danger-x-to-markdown** | 将 X (Twitter) 推文和文章转为带 YAML front matter 的 Markdown（使用逆向工程 API，需用户同意）。 | X to markdown, tweet to markdown, save tweet |
| **baoyu-markdown-to-html** | 将 Markdown 转为带样式的 HTML（微信兼容主题），支持代码高亮、数学、PlantUML、脚注等。 | markdown to html, md 转 html, 微信外链转底部引用 |
| **baoyu-comic** | 知识漫画创作，支持多种艺术风格和语调，生成原创教育漫画。 | 知识漫画, 教育漫画, biography comic, tutorial comic, Logicomix-style comic |
| **release-skills** | 通用发布工作流，自动检测版本文件和变更日志，支持 Node.js、Python、Rust、Claude Plugin 等。 | release, 发布, new version, bump version, 推送, release notes, GitHub Release, 回填 Release |
| **skill-creator** | 创建新技能、修改现有技能、运行评估测试、优化技能描述以提升触发准确率。 | create skill, edit skill, optimize skill, run evals, benchmark skill |

---

## ⛔ 已禁用技能（Disabled）

以下技能当前未启用，如需使用请通过 `./bin/hk-skill enable <skill-name>` 激活。

### 内容创作

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **edit-article** | 编辑和改进文章，重构段落、提升清晰度、精简文字。 | edit article, revise article, improve article draft |

### 图像处理与生成

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **gpt-image-2** | 面向 GPT Image 2 的图像生成/编辑，涵盖 18 大类 80+ 结构化模板（海报/UI/产品/信息图/学术图/漫画/头像/流程板等）。 | GPT Image 2, 图像生成, 图像编辑 |
| **ian-handdrawn-ppt** | 将文章/Markdown/PDF/课件/大纲转为精致中文手绘技术解释风格 PPT 配图。 | handdrawn PPT, 手绘 PPT, 课件, 演示稿, 配图, 效果图 |
| **visual-style-ppt** | 风格驱动图片版 PPT：用 Image 2 模型生成风格一致的幻灯片图片，组装为纯图片 PPTX，支持风格库管理。 | 风格驱动 PPT, 提炼风格做 PPT, 图片版 PPT, 保存 PPT 风格, 文档生成 PPT |

### 网页设计

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **web-design-engineer** | 构建高质量视觉 Web 作品（HTML/CSS/JS/React），含落地页、仪表板、交互原型、HTML 幻灯片、动画演示、数据可视化等。 | web page, landing page, dashboard, interactive prototype, HTML slide deck, animation, data visualization |
| **web-design-guidelines** | 审查 UI 代码是否符合 Web Interface Guidelines 规范（可访问性、设计审计等）。 | review my UI, check accessibility, audit design, review UX, check best practices |

### 开发辅助

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **api-and-interface-design** | 稳定的 API 和接口设计指南，用于设计 REST/GraphQL 端点、模块边界和前后端契约。 | design API, module boundaries, public interface, REST, GraphQL |
| **design-an-interface** | 使用并行子 Agent 为模块生成多种截然不同的接口设计方案，支持"design it twice"。 | design it twice, design API, explore interface options, compare module shapes |
| **diagnose** | 严谨的诊断循环：复现 → 最小化 → 假设 → 插桩 → 修复 → 回归测试，用于疑难 bug 和性能回归。 | diagnose this, debug this, 诊断, 调试, performance regression |
| **debugging-and-error-recovery** | 系统性根因调试指南，用于测试失败、构建中断或行为不符合预期时。 | tests fail, builds break, unexpected error, 系统调试 |
| **code-simplification** | 简化代码以提升清晰度，不改变行为，消除不必要的复杂度。 | simplify code, refactor for clarity, reduce complexity |
| **frontend-ui-engineering** | 构建生产级 UI，用于创建组件、实现布局、管理状态，输出需达到生产质量。 | build UI, create components, implement layouts, manage state |
| **performance-optimization** | 应用性能优化，用于性能需求、Core Web Vitals 或加载时间改进。 | optimize performance, Core Web Vitals, load time improvement |
| **security-and-hardening** | 加固代码抵御漏洞，用于处理用户输入、认证、数据存储或外部集成。 | secure code, harden application, vulnerability protection |
| **deploy-to-vercel** | 部署应用到 Vercel，支持预览部署和生产部署。 | deploy my app, deploy and give me the link, push this live, preview deployment |
| **vercel-cli-with-tokens** | 使用 Token 认证通过 Vercel CLI 部署和管理项目。 | deploy to vercel, set up vercel, add environment variables |
| **vercel-composition-patterns** | React 组合模式（Compound Components、Render Props、Context Providers），解决布尔属性膨胀问题。 | compound components, render props, composition patterns |
| **vercel-react-best-practices** | Vercel Engineering 的 React/Next.js 性能优化指南。 | React performance, Next.js optimization, bundle optimization |
| **vercel-react-native-skills** | React Native 和 Expo 最佳实践，用于构建高性能移动应用。 | React Native, Expo, mobile performance, native modules |
| **vercel-react-view-transitions** | React View Transition API 实现指南，用于页面过渡、共享元素动画、列表重排等。 | view transitions, startViewTransition, animate route changes, shared element animations |

### 代码质量与流程

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **code-review-and-quality** | 多维度代码审查，在合并前评估代码质量。 | code review, review code, assess code quality |
| **git-workflow-and-versioning** | Git 工作流规范，用于提交、分支、冲突解决和多线程协作。 | git workflow, commit, branch, resolve conflicts |
| **git-guardrails-claude-code** | 设置 Claude Code 钩子，拦截危险 Git 命令（push、reset --hard、clean、branch -D 等）。 | prevent destructive git, git safety hooks, block git push |
| **setup-pre-commit** | 配置 Husky + lint-staged 预提交钩子，支持 Prettier、类型检查和测试。 | pre-commit hooks, Husky, lint-staged, commit-time formatting |
| **tdd** | 测试驱动开发，红-绿-重构循环，支持集成测试和测试优先开发。 | TDD, red-green-refactor, test-first development, integration tests |
| **test-driven-development** | 以测试驱动开发，用于实现逻辑、修复 bug 或修改行为时证明代码正确性。 | implement logic, fix bug, prove code works |
| **ci-cd-and-automation** | CI/CD 流水线自动化，配置质量门禁、测试运行器和部署策略。 | setup CI/CD, build pipeline, deployment automation |
| **shipping-and-launch** | 生产发布准备清单，包含监控、分阶段发布和回滚策略。 | deploy to production, pre-launch checklist, staged rollout |
| **incremental-implementation** | 增量交付，将大型任务拆分为可逐步落地的变更。 | incremental delivery, large task breakdown, step-by-step implementation |
| **scaffold-exercises** | 创建练习目录结构（章节/题目/解答/讲解），通过代码检查。 | scaffold exercises, create exercise stubs, course section |
| **migrate-to-shoehorn** | 将测试文件中的 `as` 类型断言迁移到 @total-typescript/shoehorn。 | shoehorn, replace `as` in tests, partial test data |

### 文档与沟通

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **documentation-and-adrs** | 记录架构决策和文档（ADR），用于架构决策、公共 API 变更或功能发布时。 | write ADR, document decision, architecture decision record |
| **spec-driven-development** | 编码前先写规范，用于新项目、新功能或需求模糊时。 | write spec, create specification, requirements unclear |
| **planning-and-task-breakdown** | 将需求拆解为有序的可执行任务，用于任务过大或需要估算范围时。 | task breakdown, implementable tasks, estimate scope |
| **ubiquitous-language** | 提取 DDD 统一语言词汇表，标记歧义并提出规范化术语，保存到 UBIQUITOUS_LANGUAGE.md。 | ubiquitous language, domain model, DDD, build glossary |
| **to-issues** | 将计划/规范/PRD 拆解为可独立抓取的 GitHub Issues（使用 tracer-bullet 垂直切片）。 | convert plan to issues, create implementation tickets, break down work |
| **to-prd** | 将当前对话上下文转为 PRD 并发布到项目 Issue Tracker。 | create PRD, write product requirements |
| **idea-refine** | 通过结构化发散和收敛思维，将粗糙想法提炼为清晰可执行的概念。 | ideate, refine idea, stress-test plan, expand options |
| **grill-me** | 就计划或设计对用户进行无情追问，直至达成共同理解并解决决策树各分支。 | grill me, stress-test plan, interview about design |
| **grill-with-docs** | 结合现有领域模型和文档对计划进行质疑，锐化术语并同步更新 CONTEXT.md / ADR。 | grill with docs, stress-test against domain model |
| **qa** | 交互式 QA 会话，用户对话式报告 bug，Agent 在后台探索代码库并提交 GitHub Issues。 | QA session, report bugs, file issues conversationally |
| **caveman** | 极简通信模式，去掉填充词、冠词和客套话，减少约 75% token 使用，保持技术准确性。 | caveman mode, talk like caveman, less tokens, be brief |

### 知识管理与阅读

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **ljg-read** | 伴读助手，陪伴用户阅读任何文本（书籍/文章/论文/新闻），提供翻译、结构批注、深度提问和跨领域洞察。 | 伴读, 陪我读, 读这篇, read with me, companion read |
| **obsidian-vault** | Obsidian 笔记库管理，支持搜索、创建、组织笔记和维基链接。 | Obsidian, find notes, create notes, organize notes |
| **zoom-out** | 要求 Agent  zoom out 并提供更广泛的上下文或更高层次的视角。 | zoom out, broader context, higher-level perspective |

### Agent 与 Skill 管理

| 技能 | 描述 | 触发关键词 |
|------|------|-----------|
| **context-engineering** | 优化 Agent 上下文设置，用于启动新会话、输出质量下降或切换任务时。 | optimize context, configure rules, project context setup |
| **using-agent-skills** | 发现和调用 Agent Skills 的元技能，管理所有其他技能的发现和调用方式。 | discover skills, invoke skill, meta-skill |
| **write-a-skill** | 创建结构规范、渐进式披露、附带资源的新 Agent Skill。 | write a skill, create a new skill, build a skill |
| **skill-installer** | 将第三方技能从精选列表或 GitHub 仓库暂存到 remote/ 区域，然后适配并提升到 skills/。 | list candidate skills, stage remote skill, intake GitHub skill |
| **improve-codebase-architecture** | 基于 CONTEXT.md 中的领域语言和 docs/adr/ 中的决策，发现代码库的深化机会。 | improve architecture, refactoring opportunities, consolidate modules |
| **source-driven-development** | 以官方文档为唯一依据做实现决策，确保代码远离过时模式。 | source-cited code, official documentation, framework correctness |
| **browser-testing-with-devtools** | 通过 Chrome DevTools MCP 在真实浏览器中测试，检查 DOM、捕获控制台错误、分析网络请求和性能分析。 | browser testing, inspect DOM, capture console errors, network profiling |
| **deprecation-and-migration** | 管理废弃和迁移，用于移除旧系统/API/功能或迁移用户。 | deprecate system, API migration, sunset feature |

---

## 快速索引

### 按名称首字母排序

| 技能 | 场景 | 状态 |
|------|------|------|
| api-and-interface-design | 开发辅助 | ⛔ 禁用 |
| article-analyzer | 内容创作 | ✅ 启用 |
| blog-checker | 知识管理 | ✅ 启用 |
| browser-testing-with-devtools | Agent 管理 | ⛔ 禁用 |
| caveman | 文档沟通 | ⛔ 禁用 |
| ci-cd-and-automation | 代码质量 | ⛔ 禁用 |
| code-review-and-quality | 代码质量 | ⛔ 禁用 |
| code-simplification | 开发辅助 | ⛔ 禁用 |
| concept-fable | 知识管理 | ✅ 启用 |
| context-engineering | Agent 管理 | ⛔ 禁用 |
| debugging-and-error-recovery | 开发辅助 | ⛔ 禁用 |
| deploy-to-vercel | 开发辅助 | ⛔ 禁用 |
| deprecation-and-migration | Agent 管理 | ⛔ 禁用 |
| design-an-interface | 开发辅助 | ⛔ 禁用 |
| diagnose | 开发辅助 | ⛔ 禁用 |
| documentation-and-adrs | 文档沟通 | ⛔ 禁用 |
| edit-article | 内容创作 | ⛔ 禁用 |
| frontend-ui-engineering | 开发辅助 | ⛔ 禁用 |
| git-guardrails-claude-code | 代码质量 | ⛔ 禁用 |
| git-workflow-and-versioning | 代码质量 | ⛔ 禁用 |
| grill-me | 文档沟通 | ⛔ 禁用 |
| grill-with-docs | 文档沟通 | ⛔ 禁用 |
| gpt-image-2 | 图像处理 | ⛔ 禁用 |
| guizang-ppt-skill | PPT 演示 | ✅ 启用 |
| HeavySkill | Prompt 工作流 | ✅ 启用 |
| ian-handdrawn-ppt | 图像处理 | ⛔ 禁用 |
| idea-refine | 文档沟通 | ⛔ 禁用 |
| improve-codebase-architecture | Agent 管理 | ⛔ 禁用 |
| incremental-implementation | 代码质量 | ⛔ 禁用 |
| ljg-read | 知识管理 | ⛔ 禁用 |
| merge-drafts | 内容创作 | ✅ 启用 |
| migrate-to-shoehorn | 代码质量 | ⛔ 禁用 |
| obsidian-vault | 知识管理 | ⛔ 禁用 |
| performance-optimization | 开发辅助 | ⛔ 禁用 |
| planning-and-task-breakdown | 文档沟通 | ⛔ 禁用 |
| prompt-optimizer | Prompt 工作流 | ✅ 启用 |
| qa | 文档沟通 | ⛔ 禁用 |
| release-skills | 工具辅助 | ✅ 启用 |
| scaffold-exercises | 代码质量 | ⛔ 禁用 |
| security-and-hardening | 开发辅助 | ⛔ 禁用 |
| session-achieve | Prompt 工作流 | ✅ 启用 |
| setup-pre-commit | 代码质量 | ⛔ 禁用 |
| shipping-and-launch | 代码质量 | ⛔ 禁用 |
| skill-creator | 工具辅助 | ✅ 启用 |
| skill-installer | Agent 管理 | ⛔ 禁用 |
| source-driven-development | Agent 管理 | ⛔ 禁用 |
| spec-driven-development | 文档沟通 | ⛔ 禁用 |
| subtext-article | 内容创作 | ✅ 启用 |
| tdd | 代码质量 | ⛔ 禁用 |
| test-driven-development | 代码质量 | ⛔ 禁用 |
| to-issues | 文档沟通 | ⛔ 禁用 |
| to-prd | 文档沟通 | ⛔ 禁用 |
| ubiquitous-language | 文档沟通 | ⛔ 禁用 |
| using-agent-skills | Agent 管理 | ⛔ 禁用 |
| vercel-cli-with-tokens | 开发辅助 | ⛔ 禁用 |
| vercel-composition-patterns | 开发辅助 | ⛔ 禁用 |
| vercel-react-best-practices | 开发辅助 | ⛔ 禁用 |
| vercel-react-native-skills | 开发辅助 | ⛔ 禁用 |
| vercel-react-view-transitions | 开发辅助 | ⛔ 禁用 |
| visual-style-ppt | 图像处理 | ⛔ 禁用 |
| web-design | 网页设计 | ✅ 启用 |
| web-design-engineer | 网页设计 | ⛔ 禁用 |
| web-design-guidelines | 网页设计 | ⛔ 禁用 |
| write-a-skill | Agent 管理 | ⛔ 禁用 |
| zoom-out | 知识管理 | ⛔ 禁用 |

---

*最后更新：2026-05-18*

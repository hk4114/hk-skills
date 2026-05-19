# HK-Skills 技能目录

> 本文档由 `./bin/hk-skill catalog` 自动生成后翻译整理。技术术语（skill 名称、CLI 命令、文件路径）保留英文。

---

## ✅ 已启用的技能（Enabled）

以下技能已对 **kane_echoes** 项目启用（`./bin/hk-skill enable <name> --project /Users/kanehua/project/kane_echoes`）。

### 内容创作

| Skill | 一句话说明 | 触发关键词 |
|-------|-----------|-----------|
| **article-analyzer** | 对文章、论文、报告等进行结构化深度分析，输出多维度拆解与认知提炼。 | article analysis, 深度分析, 拆解观点, 论文速读, paper scan, thought refinement, 认知升级 |
| **merge-drafts** | 将多份草稿合并成一篇高质量终稿，自动取长补短、统一风格。 | merge drafts, 合并稿子, 合稿, combine drafts, consolidate drafts, 统稿 |
| **subtext-article** | 将字幕、播客转写、视频文稿等口语内容转写成结构化的中文长文。 | subtitles to article, 视频文稿, 播客转写, ASR转写, B站字幕, YouTube字幕 |

### 社交媒体与发布

| Skill | 一句话说明 | 触发关键词 |
|-------|-----------|-----------|
| **baoyu-format-markdown** | 为 Markdown 文章添加 frontmatter、标题、摘要、加粗、列表等格式化。 | format markdown, beautify article, 文章排版 |
| **baoyu-markdown-to-html** | 将 Markdown 转换为带样式的 HTML，支持代码高亮、数学公式、PlantUML、微信外链转底部引用。 | markdown to html, md 转 html, 微信外链转底部引用 |
| **baoyu-post-to-wechat** | 发布内容到微信公众号（文章/贴图），支持 Markdown、HTML 或纯文本输入。 | 发布公众号, post to wechat, 微信公众号, 贴图/图文/文章 |
| **baoyu-post-to-weibo** | 发布内容到微博，支持普通图文和头条文章。 | post to Weibo, 发微博, 发布微博, 微博头条文章 |
| **baoyu-post-to-x** | 发布内容和长文到 X (Twitter)。 | post to X, tweet, publish to Twitter |
| **baoyu-translate** | 多模式文章翻译（快翻/精翻/润色），支持自定义术语表。 | translate, 翻译, 精翻, 改成中文/英文, localize, 本地化 |
| **baoyu-url-to-markdown** | 抓取任意网页并转换为 Markdown，内置 X/Twitter、YouTube、Hacker News 适配器。 | save webpage as markdown, URL 转 Markdown |
| **baoyu-youtube-transcript** | 下载 YouTube 字幕、封面图，支持多语言、翻译、章节、说话人识别。 | YouTube transcript, download subtitles, YouTube字幕, 视频封面 |
| **baoyu-danger-x-to-markdown** | 将 X (Twitter) 推文和文章转换为带 YAML front matter 的 Markdown。 | X to markdown, tweet to markdown, save tweet |

### 图像与视觉

| Skill | 一句话说明 | 触发关键词 |
|-------|-----------|-----------|
| **baoyu-article-illustrator** | 分析文章结构，识别需配图的位置，用 Type × Style × Palette 三维法生成插图。 | illustrate article, 为文章配图, add images |
| **baoyu-comic** | 创建知识漫画/教育漫画，支持多种艺术风格和分镜排版。 | 知识漫画, 教育漫画, biography comic, tutorial comic |
| **baoyu-compress-image** | 将图片压缩为 WebP（默认）或 PNG，自动选择最佳工具。 | compress image, optimize image, convert to webp |
| **baoyu-cover-image** | 生成文章封面图，支持 5 维度（类型/配色/渲染/文字/氛围）和多种画幅。 | generate cover image, create article cover, make cover |
| **baoyu-diagram** | 创建专业深色主题 SVG 图表（架构图、流程图、时序图、思维导图等）。 | diagram, flowchart, sequence diagram, 画个图, 架构图 |
| **baoyu-image-cards** | 生成信息图卡片系列（12 种视觉风格 × 8 种布局），适合社交媒体。 | 小红书图片, 小绿书, 微信图文, image cards, 图片卡片 |
| **baoyu-imagine** | AI 图像生成，支持 GPT Image 2、Azure、Google、OpenRouter 等多个后端。 | generate image, create image, draw images, 生成图片 |
| **baoyu-infographic** | 生成专业信息图，21 种布局 × 22 种视觉风格。 | infographic, 信息图, visual summary, 可视化 |
| **baoyu-slide-deck** | 从内容生成专业幻灯片图片，支持逐页生成。 | create slides, make a presentation, generate deck, PPT |
| **guizang-ppt-skill** | 生成横向翻页网页 PPT（单 HTML 文件），含 WebGL 背景、章节幕封、数据大字报等模板。 | 杂志风 PPT, 瑞士风 PPT, Swiss Style, horizontal swipe deck |

### 网页设计

| Skill | 一句话说明 | 触发关键词 |
|-------|-----------|-----------|
| **web-design** | Web 视觉设计：输入 PRD / 参考 URL / 截图 / 关键词，先出 DESIGN.md 规范再生成代码。 | 帮我做个网站, 设计一个页面, landing page, design 规范 |

### 微信读书

| Skill | 一句话说明 | 触发关键词 |
|-------|-----------|-----------|
| **weread-skills** | 微信读书助手 — 搜索书籍、管理书架、查看笔记划线、浏览书评、阅读统计、发现推荐好书。 | 微信读书助手, weread |

### 发布与技能管理

| Skill | 一句话说明 | 触发关键词 |
|-------|-----------|-----------|
| **release-skills** | 通用发布工作流，自动检测版本文件和 changelog，支持 Node.js / Python / Rust / GitHub Releases 等。 | release, 发布, bump version, GitHub Release, 回填 Release |

---

## 🌐 全局启用的技能（Global）

以下技能已全局启用，对所有项目可用。

| Skill | 一句话说明 | 触发关键词 |
|-------|-----------|-----------|
| **blog-checker** | 审阅和评估中文技术博客文章的质量。 | 审阅技术文章, 检查博客, 技术写作评估 |
| **concept-fable** | 将高深领域概念隐藏在三段式寓言故事中，最后揭示并映射回理论。 | 概念寓言, 三段式寓言, 用寓言解释领域概念, Concept Reveal |
| **HeavySkill** | Heavy Thinking as the Inner Skill in Agentic Harness. | Heavy Thinking |
| **prompt-optimizer** | 将模糊需求编译成工业级结构化提示词。 | optimize prompt, 优化提示词, 优化prompt, write a prompt |
| **session-achieve** | 复盘多轮对话，提取纠偏逻辑并沉淀黄金提示词。 | 复盘对话, session review, review this session, 生成复盘报告 |

---

## ⏸️ 已安装但未启用的技能（Disabled）

以下技能已安装（`warehouse/adapted/` 中存在），但尚未对任何项目启用。需要时运行 `./bin/hk-skill enable <name> --project <path>`。

### 内容创作

| Skill | 一句话说明 |
|-------|-----------|
| **edit-article** | 编辑和改进文章，重组段落、提升清晰度、精简文字。 |
| **ljg-read** | 阅读陪伴 Agent，提供翻译、结构批注、深度提问和跨领域洞察。 |

### 图像与视觉

| Skill | 一句话说明 |
|-------|-----------|
| **algorithmic-art** | 使用 p5.js 创建算法艺术（种子随机、参数探索）。 |
| **canvas-design** | 使用设计哲学创建精美的静态视觉艺术（海报、艺术品）。 |
| **gpt-image-2** | 面向 GPT Image 2 的图像生成/编辑技能，覆盖海报/UI/产品/信息图/学术图/漫画等 80+ 模板。 |
| **ian-handdrawn-ppt** | 将文章/Markdown/PDF 等内容转为精致的中文手绘技术解说风格 PPT 配图。 |
| **theme-factory** | 为幻灯片、文档、落地页等 artifact 应用预设主题或即时生成新主题。 |
| **visual-style-ppt** | 用 Image 2 模型生成风格驱动的幻灯片图片，组装为纯图片 PPTX，支持风格库管理。 |

### PPT / 演示

| Skill | 一句话说明 |
|-------|-----------|
| **pptx** | 创建、读取、编辑、提取、合并或拆分 .pptx 文件。 |

### 网页设计 / 前端

| Skill | 一句话说明 |
|-------|-----------|
| **frontend-design** | 创建高品质、有设计感的网页组件、页面、落地页、仪表盘等前端界面。 |
| **web-design-engineer** | 使用 HTML/CSS/JavaScript/React 构建高质量视觉 Web artifact。 |
| **web-design-guidelines** | 审查 UI 代码是否符合 Web Interface Guidelines（可访问性、UX 审计）。 |
| **web-artifacts-builder** | 使用 React + Tailwind + shadcn/ui 创建复杂多组件 Claude.ai HTML artifact。 |
| **vercel-react-view-transitions** | 使用 React View Transition API 实现平滑页面过渡和共享元素动画。 |
| **vercel-react-native-skills** | React Native 和 Expo 最佳实践，构建高性能移动应用。 |
| **vercel-react-best-practices** | Vercel Engineering 的 React / Next.js 性能优化指南。 |
| **vercel-composition-patterns** | React 组合模式（compound components、render props、context providers）。 |

### 开发辅助 / 工程

| Skill | 一句话说明 |
|-------|-----------|
| **deploy-to-vercel** | 将应用和网站部署到 Vercel。 |
| **vercel-cli-with-tokens** | 使用 Token 认证通过 Vercel CLI 部署和管理项目。 |
| **claude-api** | 构建、调试和优化 Claude API / Anthropic SDK 应用，支持提示缓存和模型迁移。 |
| **mcp-builder** | 创建高质量 MCP (Model Context Protocol) 服务器，集成外部 API。 |
| **slack-gif-creator** | 创建针对 Slack 优化的动画 GIF。 |
| **api-and-interface-design** | 稳定的 API 和接口设计指南。 |
| **design-an-interface** | 用并行子 Agent 为一个模块生成多种截然不同的接口设计。 |
| **source-driven-development** | 基于官方文档做每个实现决策，避免过时模式。 |
| **spec-driven-development** | 在编码前创建规格说明。 |
| **shipping-and-launch** | 准备生产环境发布（预发布检查清单、监控、分阶段推出、回滚策略）。 |
| **setup-pre-commit** | 设置 Husky pre-commit hooks（lint-staged、类型检查、测试）。 |
| **scaffold-exercises** | 创建带章节、题目、解答和讲解的练习目录结构。 |
| **migrate-to-shoehorn** | 将测试文件从 `as` 类型断言迁移到 @total-typescript/shoehorn。 |
| **webapp-testing** | 使用 Playwright 与本地 Web 应用交互和测试（截图、日志、UI 调试）。 |
| **browser-testing-with-devtools** | 通过 Chrome DevTools MCP 在真实浏览器中测试。 |

### 代码质量 / 架构

| Skill | 一句话说明 |
|-------|-----------|
| **debugging-and-error-recovery** | 系统性的根因调试指南。 |
| **code-review-and-quality** | 多维度代码审查，评估代码质量。 |
| **code-simplification** | 为清晰度简化代码，不改变行为。 |
| **improve-codebase-architecture** | 在代码库中寻找深化机会，改善架构、重构、提升可测试性。 |
| **deprecation-and-migration** | 管理废弃和迁移（移除旧系统、API、功能）。 |
| **git-workflow-and-versioning** | 结构化 Git 工作流实践（提交、分支、冲突解决）。 |
| **git-guardrails-claude-code** | 设置 Claude Code 钩子，拦截危险 git 命令（push、reset --hard 等）。 |
| **test-driven-development** | 用测试驱动开发（任何逻辑实现、bug 修复、行为变更）。 |
| **tdd** | TDD 红绿重构循环，构建功能或修复 bug。 |
| **performance-optimization** | 优化应用性能（Core Web Vitals、加载时间、性能回归）。 |
| **security-and-hardening** | 加固代码抵御漏洞（用户输入、认证、数据存储、第三方集成）。 |
| **incremental-implementation** | 增量交付变更，避免一次性大量编码。 |
| **planning-and-task-breakdown** | 将工作拆分为有序任务，估算范围，支持并行。 |
| **ci-cd-and-automation** | 自动化 CI/CD 流水线设置（质量门禁、测试运行器、部署策略）。 |
| **context-engineering** | 优化 Agent 上下文设置（规则文件、项目配置）。 |
| **frontend-ui-engineering** | 构建生产级 UI（组件、布局、状态管理）。 |

### 文档沟通

| Skill | 一句话说明 |
|-------|-----------|
| **doc-coauthoring** | 结构化文档协作工作流（技术规格、决策文档、提案）。 |
| **documentation-and-adrs** | 记录架构决策和文档（ADRs、API 变更、功能发布上下文）。 |
| **docx** | 创建、读取、编辑 Word 文档（.docx），支持目录、页眉页脚、图片等。 |
| **pdf** | 处理 PDF 文件（读取、合并、拆分、旋转、加水印、创建、OCR 等）。 |
| **xlsx** | 处理电子表格（.xlsx/.csv/.tsv），支持创建、编辑、公式、图表、数据清洗。 |
| **obsidian-vault** | 在 Obsidian 仓库中搜索、创建和管理笔记（支持 wiki 链接和索引笔记）。 |

### 知识管理 / 思维

| Skill | 一句话说明 |
|-------|-----------|
| **diagnose** | 严格诊断循环（复现 → 最小化 → 假设 → 插桩 → 修复 → 回归测试）。 |
| **grill-me** | 就计划或设计对用户进行 relentless 追问，直到达成共同理解。 |
| **grill-with-docs** | 结合现有领域模型和文档对计划进行 stress-test，并同步更新文档。 |
| **idea-refine** | 通过结构化的发散-收敛思维，将粗糙想法提炼为清晰可执行的概念。 |
| **ubiquitous-language** | 从对话中提取 DDD 风格的统一语言词汇表，标注歧义并提出规范术语。 |
| **zoom-out** | 让 Agent  zoom out，提供更广泛的上下文或更高层视角。 |
| **caveman** | 极简通信模式，减少约 75% token 消耗，保持技术准确性。 |
| **qa** | 对话式 QA 会话，用户口语化报告 bug，Agent 在后台探索代码库并提交 GitHub issues。 |
| **to-issues** | 将计划/规格/PRD 拆分为可独立执行的 tracer-bullet 垂直切片 issue。 |
| **to-prd** | 将当前对话上下文转为 PRD 并发布到项目 issue tracker。 |
| **using-agent-skills** | 发现并调用 Agent skills（元技能，管理所有其他技能的发现和调用）。 |

### 技能管理

| Skill | 一句话说明 |
|-------|-----------|
| **skill-installer** | 将第三方 skills 从精选列表或 GitHub 仓库 staging 到 remote/ 区域，然后适配。 |
| **write-a-skill** | 创建结构规范、渐进式披露、附带资源的新 Agent skill。 |

---

## 目录更新方法

当你新增、更新或删除 skill 后，运行：

```bash
./bin/hk-skill catalog
```

然后按 AGENTS.md 规则翻译并重写 `docs/catalog.md`。

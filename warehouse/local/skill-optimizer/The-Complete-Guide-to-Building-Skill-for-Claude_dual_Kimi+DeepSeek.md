# Claude 技能构建完全指南

## 目录

- 引言
- 基础
- 规划与设计
- 测试与迭代
- 分发与共享
- 模式与故障排除
- 资源与参考

## 引言

技能是一组被打包在简单文件夹中的指令，用于教导 Claude 处理特定任务或工作流。技能是按需定制 Claude 的最强大方式之一。你不必在每次对话中重复解释偏好、流程和领域专业知识，只需一次性教会 Claude，即可在后续每次使用中获益。

当你拥有可重复的工作流时，技能将发挥巨大威力：根据规格生成前端设计、以一致的方法论开展研究、生成符合团队风格指南的文档，或编排多步骤流程。它们能与 Claude 的内置功能（capabilities，如代码执行和文档创建）无缝配合。若你正在构建 MCP 集成，技能则为其增添了强大的一层，帮助将原始的工具调用转化为可靠、优化的工作流。

本指南涵盖了构建高效技能所需的全部知识——从规划与结构到测试与分发。无论你是为自己、团队还是社区构建技能，都能从中找到实用的模式和真实世界的示例。

### 本指南的两条路径

- **构建独立技能？** 请重点关注"基础"、"规划与设计"以及类别 1‑2。
- **增强 MCP 集成？** "技能 + MCP"部分和类别 3 适合你。

两条路径共享相同的技术要求，但你可以选择与自身用例相关的部分。

### 你将从本指南中获得什么

读完本指南，你将能够一口气构建出一个功能完备的技能。使用 skill-creator 构建并测试你的第一个可用技能预计需要 15–30 分钟。让我们开始吧。

### 你将学到什么

- 技能结构的技术要求与最佳实践
- 独立技能与 MCP 增强工作流的模式
- 经我们在不同用例中验证有效的模式
- 如何测试、迭代并分发你的技能

### 适用对象

- 希望 Claude 稳定遵循特定工作流的开发者
- 希望 Claude 遵循特定工作流的高级用户
- 希望在全组织范围内标准化 Claude 工作方式的团队

---

## 第1章 基础

### 什么是技能？

**技能**是一个包含以下内容的文件夹：

- `SKILL.md`（必需）：包含 YAML 前置元数据的 Markdown 格式说明
- `scripts/`（可选）：可执行代码（Python、Bash 等）
- `references/`（可选）：按需加载的文档
- `assets/`（可选）：输出中使用的模板、字体、图标

#### 可组合性

Claude 可以同时加载多个技能。你的技能应与其他技能良好协作，不应假设它是唯一可用的能力。

#### 可移植性

技能在 Claude.ai、Claude Code 和 API 中工作方式完全相同。只需创建一次技能，无需修改即可在所有平台上使用，前提是环境支持该技能所需的任何依赖项。

### 核心设计原则

#### 渐进式披露

技能采用三级系统：

- **第一级（YAML 前置元数据）**：始终加载到 Claude 的系统提示词中。只需提供最少必要信息，让 Claude 判断何时调用该技能，无需将全部内容载入上下文。
- **第二级（SKILL.md 正文）**：当 Claude 认为该技能与当前任务相关时加载。包含完整的指令和指导信息。
- **第三级（关联文件）**：技能目录中捆绑的其他文件，Claude 可以根据需要选择性地浏览和发现。

这种渐进式披露能在保持专业专长的同时，最小化 token 使用量。

### 致 MCP 构建者：技能 + 连接器

> 💡 **提示**：正在构建不依赖 MCP 的独立技能？请跳转至**规划与设计**部分——你可以随时返回此处。

如果你已经拥有一个可运行的 MCP 服务器，那么你已经完成了最困难的部分。技能是位于其上的**知识层**——用于捕获你已知的工作流和最佳实践，以便 Claude 能够一致地应用它们。

#### 厨房类比

- **MCP 提供了专业厨房**：可以访问工具、食材和设备。
- **技能提供食谱**：关于如何创造有价值事物的分步说明。

它们共同让用户无需自行摸索每一步，就能完成复杂的任务。

#### 它们如何协同工作

| | MCP（连接性） | 技能（知识） |
|---|---|---|
| **作用** | 将 Claude 连接到你的服务（Notion、Asana、Linear 等） | 教导 Claude 如何有效使用你的服务 |
| **能力** | 提供实时数据访问和工具调用 | 捕获工作流和最佳实践 |
| **本质** | Claude 能做什么 | Claude 应该如何做 |

#### 这对你的 MCP 用户为何重要

**没有技能时：**

- 用户连接了你的 MCP，但不知道下一步该做什么
- 大量询问"如何通过你的集成实现 X"的支持工单
- 每次对话都从头开始
- 结果不一致，因为用户每次的提示方式不同
- 用户责怪你的连接器，而真正的问题在于工作流指导

**具备技能：**

- 预构建工作流会在需要时自动激活
- 一致、可靠的工具使用
- 最佳实践嵌入于每一次交互中
- 让用户更快上手你的集成

---

## 第2章 规划与设计

在编写任何代码之前，先确定你的技能应能实现的 2–3 个具体用例。在 Anthropic，我们观察到三种常见的技能用例类别。

## 从用例开始

良好的用例定义需要回答以下问题：

- 用户想要实现什么目标？
- 这需要哪些多步骤工作流？
- 需要哪些工具（内置工具还是 MCP）？
- 应嵌入哪些领域知识或最佳实践？

### 类别 1：文档与资源创建

**用途**：创建一致、高质量的输出，包括文档、演示文稿、应用程序、设计、代码等。

**实际示例**：`frontend-design` 技能

> 创建独特、生产级水准的高质量前端界面。适用于构建 Web 组件、页面、设计产物、海报或应用程序。

（另请参阅 DOCX、PPTX、XLSX 和 PPT 相关技能）

**关键技术**：

- 嵌入风格指南和品牌标准
- 用于一致输出的模板结构
- 最终确定前的质量检查清单
- 无需外部工具——使用 Claude 的内置功能

### 用例定义示例：项目冲刺规划

这是一个完整的用例定义示范，展示了如何结构化地描述技能功能。

- **触发**：用户说 "help me plan this sprint" 或 "create sprint tasks"
- **步骤**：
  1. 通过 MCP 从 Linear 获取当前项目状态
  2. 分析团队速度和容量
  3. 建议任务优先级
  4. 在 Linear 中创建带有适当标签和估算的任务
- **结果**：完全规划的冲刺，任务已创建

### 类别 2：工作流自动化

**用途**：适用于需要一致方法论的多步骤流程，以及跨多个 MCP 服务器的协调场景。

**实际示例**：`skill-creator` 技能

> 创建新技能的交互式指南。引导用户完成用例定义、前置元数据生成、指令编写和验证。

**关键技术**：

- 包含验证关卡的逐步工作流
- 用于常见结构的模板
- 内置审查与改进建议
- 迭代优化循环


,"replace_all":false}]}>functions.StrReplaceFile:83>:{

- **触发**：用户说 "help me plan this sprint" 或 "create sprint tasks"
- **步骤**：
  1. 通过 MCP 从 Linear 获取当前项目状态
  2. 分析团队速度和容量
  3. 建议任务优先级
  4. 在 Linear 中创建带有适当标签和估算的任务
- **结果**：完全规划的冲刺，任务已创建

### 类别 3：MCP 增强

**用途**：提供工作流指导，以增强 MCP 服务器所提供的工具访问能力。

**实际示例**：`sentry-code-review` 技能（来自 Sentry）

> 利用 Sentry 的 MCP 服务器及其错误监控数据，自动分析并修复 GitHub 拉取请求中检测到的错误。

**关键技术**：

- 按顺序协调多个 MCP 调用
- 嵌入领域专业知识
- 提供用户通常需要另行指定的上下文
- 针对常见 MCP 问题的错误处理

## 定义成功标准

如何确认你的技能正在有效运作？这些是理想目标——粗略的基准而非精确阈值。力求严谨，但也要接受评估中难免带有一些主观判断（vibes-based）的成分。我们正在积极开发更稳健的测量指南与工具。

### 量化指标

- **技能在 90% 的相关查询中触发**
  - **测量方法**：运行 10–20 条应触发你技能的测试查询。追踪其自动加载的次数与需要显式调用的次数。

- **在 X 次工具调用中完成工作流**
  - **测量方法**：对比启用与未启用技能时执行同一任务的情况。统计工具调用次数及消耗的 token 总数。

- **每个工作流 0 次失败的 API 调用**
  - **测量方法**：在测试运行期间监控 MCP 服务器日志。跟踪重试率和错误代码。

### 定性指标

- **用户无需提示 Claude 下一步操作**
  - **评估方法**：在测试期间，记录你需要重新引导或澄清的频率。向测试用户征求反馈。

- **工作流无需用户修正即可完成**
  - **评估方法**：运行同一请求 3–5 次。比较输出的结构一致性和质量。

- **跨会话结果一致**
  - **评估方法**：新用户能否在首次尝试时，以最少的指导完成该任务？

## 技术要求：YAML 前置元数据

YAML 前置元数据是 Claude 决定是否加载你技能的依据。请务必正确填写。

### 文件结构

```text
your-skill-name/
├── SKILL.md                 # 必需 - 主技能文件
├── scripts/                 # 可选 - 可执行代码
│   ├── process_data.py      # 示例
│   └── validate.sh          # 示例
├── references/              # 可选 - 文档
│   ├── api-guide.md         # 示例
│   └── examples/            # 示例
└── assets/                  # 可选 - 模板等
    └── report-template.md   # 示例
```

这就是你开始所需的一切。

### 字段要求

#### 关键规则

**SKILL.md 命名**：

- 必须完全为 `SKILL.md`（区分大小写）
- 不接受任何变体（`SKILL.MD`、`skill.md` 等）

**技能文件夹命名**：

- 使用短横线命名法：`notion-project-setup` ✅
- 无空格：`Notion Project Setup` ❌
- 无下划线：`notion_project_setup` ❌
- 无大写字母：`NotionProjectSetup` ❌
- 无 XML 标签（`<` 或 `>`）

**不要包含 README.md**：

- 不要在你的 技能文件夹中包含 `README.md`
- 所有文档都应放在 `SKILL.md` 或 `references/` 目录中
- 注意：通过 GitHub 分发时，你仍需要一个仓库级 `README` 供人类用户使用——请参阅分发与共享。

#### `name`（必需）

- 仅限短横线命名法
- 无空格或大写字母
- 应与文件夹名称匹配

#### `description`（必需）

- 必须包含以下两者：
  - 该技能的功能
  - 何时使用（触发条件）
- 少于 1024 个字符
- 包含用户可能提及的具体任务
- 提及相关的文件类型

#### `license`（可选）

- 若将技能开源时使用
- 常见：`MIT`、`Apache-2.0`

#### `compatibility`（可选）

- 1–500 字符
- 指明环境要求：例如目标产品、所需系统包、网络访问需求等

#### `metadata`（可选）

- 任何自定义键值对
- 建议：作者、版本、mcp-server

示例：

```yaml
metadata:
  author: ProjectHub
  version: 1.0.0
  mcp-server: projecthub
```

### 安全限制

**前置元数据中禁止包含**：

- XML 尖括号（`< >`）
- 名称中包含 "claude" 或 "anthropic" 的技能（保留）

**原因**：前置元数据出现在 Claude 的系统提示词中。恶意内容可能会注入指令。

### 描述字段

根据 Anthropic 的工程博客所述："此元数据……为 Claude 提供了足够的信息，使其知道何时应使用每种技能，而不必将所有内容加载到上下文中。" 这是**渐进式披露**（progressive disclosure）的第一层。

**结构**：

```text
[功能描述] + [使用时机] + [核心功能]
```

**良好描述的示例**：

```yaml
# 良好示例 - 具体且可操作
description: 分析 Figma 设计文件并生成开发者交接文档。当用户上传 .fig 文件、询问"设计规范"、"组件文档"或"设计到代码交接"时使用。

# 良好示例 - 包含触发短语
description: 管理 Linear 项目工作流，包括冲刺规划、任务创建和状态跟踪。当用户提及"冲刺"、"Linear 任务"、"项目规划"或要求"创建工单"时使用。

# 良好示例 - 清晰的价值主张
description: PayFlow 端到端客户入职工作流。处理账户创建、支付设置和订阅管理。当用户说"入职新客户"、"设置订阅"或"创建 PayFlow 账户"时使用。
```

**不良描述示例**：

```yaml
# 过于模糊
description: 协助项目。

# 缺少触发条件
description: 创建复杂的多页文档系统。

# 过于技术化，没有用户触发短语
description: 实现具有层级关系的项目实体模型。
```

## 编写主要指令

在前置元数据之后，使用 Markdown 编写实际的指令。

**推荐结构**：

```markdown
# 你的技能名称

## 指令

### 步骤 1：[第一个主要步骤]
清晰说明该步骤的内容。

预期输出：[描述成功完成时的样子]

（根据需要添加更多步骤）

## 示例

### 示例 1：[常见场景]

**用户说**："设置一个新的营销活动"

**操作**：
1. 通过 MCP 获取现有营销活动
2. 使用提供的参数创建新营销活动

**结果**：活动已创建，附带确认链接

（根据需要添加更多示例）

## 故障排除

### 错误：[常见错误信息]

**原因**：[为何发生]

**解决方案**：[如何修复]

（根据需要添加更多错误案例）
```

请根据你的技能调整此模板。将方括号内的部分替换为你具体的内容。

## 指令的最佳实践

### 具体且可操作

✅ **良好示例**：

运行 `python scripts/validate.py --input {filename}` 以检查数据格式。如果验证失败，常见问题包括：

- 缺少必填字段（将其添加到 CSV 中）
- 日期格式无效（使用 `YYYY-MM-DD`）

❌ **不良示例**：

> 继续进行前验证数据。

### 包含错误处理

#### 常见问题

##### MCP 连接失败

如果你看到 `"Connection refused"`：

1. 验证 MCP 服务器是否正在运行：检查 **Settings > Extensions**
2. 确认 API 密钥有效
3. 尝试重新连接：**Settings > Extensions > [你的服务] > Reconnect**

### 明确引用捆绑资源

在编写查询之前，请查阅 `references/api-patterns.md`，了解：

- 速率限制指导
- 分页模式
- 错误代码和处理方式

### 使用渐进式披露

保持 `SKILL.md` 专注于核心说明。将详细文档移至 `references/` 并链接至该处。（参阅核心设计原则了解三级系统的工作原理。）

---

## 第3章 测试与迭代

## 推荐的测试方法

可根据需求以不同严谨程度测试技能：

- **在 Claude.ai 中进行手动测试**——直接运行查询并观察行为。可快速迭代，无需额外设置。
- **在 Claude Code 中进行脚本化测试**——自动化测试用例，以便在变更中实现可重复的验证。
- **通过 Skills API 进行程序化测试**——构建评估套件，针对已定义的测试集进行系统性运行。

请根据你的质量要求和技能的可见性来选择相应的方法。一个由小型团队内部使用的技能，其测试需求与部署给数千名企业用户的技能截然不同。

> **专业建议：先针对单个任务进行迭代，再扩展范围**
>
> 我们发现，最有效的技能创建者会针对一个具有挑战性的任务进行反复迭代，直到 Claude 成功，然后将有效的方法提取为一项技能。这利用了 Claude 的上下文学习能力，并且比广泛的测试能提供更快的反馈信号。一旦你有了一个可用的基础，就可以扩展到多个测试用例以实现覆盖。

## 1. 触发测试

**目标**：确保你的技能在正确时机加载。

**测试用例**：
- ✅ 对明显任务触发
- ✅ 对改写后的请求触发
- ❌ 对无关主题不触发

**示例测试套件**：

**应该触发**：
- "Help me set up a new ProjectHub workspace"
- "I need to create a project in ProjectHub"
- "Initialize a ProjectHub project for Q4 planning"

**不应触发**：
- "What's the weather in San Francisco?"
- "Help me write Python code"
- "Create a spreadsheet"（除非 ProjectHub 技能处理表格）

## 2. 功能测试

**目标**：验证技能能产生正确的输出。

**测试用例**：
- 生成有效的输出
- API 调用成功
- 错误处理生效
- 覆盖边缘情况

**示例**：

测试：创建包含 5 个任务的项目

- **Given**：项目名称为 "Q4 Planning"，5 条任务描述
- **When**：技能执行工作流
- **Then**：
  - 在 ProjectHub 中创建了项目
  - 5 个任务已创建且属性正确
  - 所有任务均关联到项目
  - 无 API 错误

## 使用 skill-creator 技能

skill-creator 技能——可通过插件目录在 Claude.ai 获取或为 Claude Code 下载——能帮助你构建并迭代技能。如果你拥有一个 MCP 服务器并清楚你最常用的 2–3 个工作流，你可以在一次会话中构建并测试一个功能性技能——通常只需 15–30 分钟。

**创建技能**：
- 根据自然语言描述生成技能
- 生成带有 YAML 前置元数据的格式正确的 SKILL.md
- 建议触发短语和结构

**审查技能**：
- 标记常见问题（描述模糊、缺少触发、结构问题）
- 识别潜在的过度触发/触发不足风险
- 根据技能的既定目的建议测试用例

**迭代改进**：
- 在使用你的技能并遇到边缘情况或失败后，将这些示例带回给 skill-creator
- 示例："利用本次聊天中发现的问题与解决方案，改进该技能处理[特定边缘情况]的方式"

**使用方法**：

> "Use the skill-creator skill to help me build a skill for [your use case]"

**注意**：skill-creator 帮助你设计和优化技能，但不执行自动化测试套件或生成定量评估结果。

**执行问题**：
- 结果不一致
- API 调用失败
- 需要用户纠正

**解决方案**：改进指令，添加错误处理。

## 3. 性能比较

**目标**：证明该技能相比基线能改善结果。

使用"定义成功标准"中的指标。以下是比较可能呈现的样子。

**基线比较**：

不使用技能：
- 每次都需要用户提供指令
- 15 轮来回对话
- 3 次失败的 API 调用，需要重试
- 消耗 12,000 个 token

使用技能：
- 自动执行工作流
- 仅需 2 个澄清问题
- 0 次失败的 API 调用
- 消耗 6,000 个 token

## 基于反馈的迭代

技能是动态文档。计划基于以下因素进行迭代：

### 触发不足信号
- 技能在应该加载时未加载
- 用户手动启用它
- 收到关于何时使用该技能的支持问题

**解决方案**：在 description 中添加更多细节和细微差别——这可能包括针对技术术语的关键词。

### 过度触发信号
- 技能为无关查询加载
- 用户禁用它
- 对技能目的感到困惑

**解决方案**：添加否定触发词，更具体。

---

## 第4章 分发与共享

技能（skill）让你的 MCP 集成更加完善。当用户比较各种连接器时，那些内置技能的连接器能提供更快的价值实现路径，让你相较于仅支持 MCP 的替代方案更具优势。

对于程序化用例——例如构建应用程序、智能体（agent）或自动化工作流——API 提供了对技能管理和执行的直接控制。

## 当前分发模型（2026年1月）

### 关键功能

- **技能 API 端点**：通过 `/v1/skills` 端点列出和管理技能
- **消息 API 集成**：通过 `container.skills` 参数向 Messages API 请求添加技能
- **版本控制**：通过 Claude 控制台进行版本控制与管理
- **Agent SDK 兼容**：与 Claude Agent SDK 配合使用，用于构建自定义智能体

### 个人用户获取技能的步骤

1. 下载技能文件夹
2. 压缩文件夹（如需要）
3. 通过"设置 > Capabilities > 技能"上传到 Claude.ai
4. 或放置到 Claude Code 的技能目录中

### API vs. Claude.ai 使用场景对比

| 使用场景 | 最佳使用界面 |
|---------|------------|
| 终端用户直接与技能交互 | Claude.ai / Claude Code |
| 开发过程中的手动测试与迭代 | Claude.ai / Claude Code |
| 个人临时工作流 | Claude.ai / Claude Code |
| 应用程序以程序化方式使用技能 | API |
| 大规模生产部署 | API |
| 自动化流水线与智能体系统 | API |

### 组织级技能

- 管理员可以在整个工作空间范围内部署技能（已于 2025 年 12 月 18 日发布）
- 支持自动更新
- 支持集中化管理

## 一个开放标准

我们已将智能体技能发布为开放标准。与 MCP 一样，我们认为技能应该能够在不同工具和平台间移植——无论你使用的是 Claude 还是其他 AI 平台，同一个技能都应该能正常工作。

当然，有些技能旨在充分利用特定平台的功能；作者可以在技能的兼容性（compatibility）字段中注明这一点。我们一直在与生态系统成员合作制定该标准，并对早期的采纳感到振奋。

> **注意**：API 中的技能需要代码执行工具（Code Execution Tool）测试版，该工具提供了技能运行所需的安全环境。
>
> 有关实现细节，请参阅：
> - [Skills API 快速入门](https://docs.anthropic.com/en/docs/skills/api-quickstart)
> - [创建自定义技能](https://docs.anthropic.com/en/docs/skills/create-custom)
> - [Agent SDK 中的技能](https://docs.anthropic.com/en/docs/skills/agent-sdk)

## 当前推荐的方法

### 定位你的技能

你如何描述自己的技能，决定了用户是否能理解其价值并真正尝试使用。在撰写关于技能的内容时——无论是在 README、文档还是营销材料中——请牢记以下原则。

**聚焦于成果，而非功能：**

✅ **好的示例：**

> "ProjectHub 技能让团队在数秒内搭建完整的项目工作空间——包括页面、数据库和模板——无需再花费 30 分钟进行手动设置。"

❌ **不好的示例：**

> "ProjectHub 技能是一个包含 YAML 前置元数据（YAML frontmatter）和 Markdown 指令的文件夹，用于调用我们的 MCP 服务器工具。"

### 推荐做法

#### 1. 在 GitHub 上托管

- 开源技能使用公开仓库
- README 清晰，包含安装说明
- 提供示例用法和截图

#### 2. 在 MCP 仓库中记录

- 从 MCP 文档链接到技能
- 解释两者结合使用的价值
- 提供快速入门指南

**突出 MCP + 技能的完整故事：**

> "我们的 MCP 服务器让 Claude 能够访问你的 Linear 项目。我们的技能则教会 Claude 你团队的 sprint 规划工作流。两者结合，实现 AI 驱动的项目管理。"

#### 3. 创建安装指南

以下是一份标准的技能安装指南模板：

```markdown
# 安装 [你的服务] 技能

## 1. 下载技能

- 克隆仓库：`git clone https://github.com/yourcompany/skills`
- 或从 Releases 页面下载 ZIP 压缩包

## 2. 在 Claude 中安装

- 打开 Claude.ai > 设置 > 技能
- 点击"上传技能"
- 选择技能文件夹（ZIP 格式）

## 3. 启用技能

- 开启 [你的服务] 技能开关
- 确保你的 MCP 服务器已连接

## 4. 测试

向 Claude 提问："在 [你的服务] 中设置一个新项目"
```

---

## 第5章 模式与故障排除

这些模式源自早期采用者和内部团队创建的技能。它们代表了我们观察到行之有效的常见方法，而非规定性的模板。

## 选择你的方法：问题优先 vs. 工具优先

想象一下家得宝（Home Depot）的情景。你可能带着一个问题走进商店——"我需要修理一个厨房橱柜"——然后店员会指引你找到合适的工具。或者，你可能挑选了一把新电钻，然后询问如何用它来完成你的具体工作。

技能的工作方式与此相同：

- **问题优先**："我需要设置一个项目工作区" → 你的技能会按正确顺序编排正确的 MCP 调用。用户描述结果；技能负责处理工具。
- **工具优先**："我已连接 Notion MCP" → 你的技能向 Claude 传授最优工作流和最佳实践。用户拥有访问权限；技能提供专业知识。

多数技能偏向某一方向。了解哪种框架适合你的使用场景，有助于你选择下方正确的模式。

---

### 模式 1：顺序工作流编排

**适用场景**：你的用户需要按特定顺序执行多步骤流程。

**示例结构**：

```yaml
# Workflow: Onboard New Customer

# Step 1: Create Account
Call MCP tool: `create_customer`
Parameters: name, email, company

# Step 2: Setup Payment
Call MCP tool: `setup_payment_method`
Wait for: payment method verification

# Step 3: Create Subscription
Call MCP tool: `create_subscription`
Parameters: plan_id, customer_id (from Step 1)

# Step 4: Send Welcome Email
Call MCP tool: `send_email`
Template: welcome_email_template
```

**关键技术**：
- **显式步骤排序**
- **步骤间依赖**
- **每个阶段的验证**
- **失败回滚指令**

---

### 模式 2：多 MCP 协调

**适用场景**：工作流跨越多个服务。

**示例**：设计到开发交接

```yaml
# Phase 1: Design Export (Figma MCP)
1. Export design assets from Figma
2. Generate design specifications
3. Create asset manifest

# Phase 2: Asset Storage (Drive MCP)
1. Create project folder in Drive
2. Upload all assets
3. Generate shareable links

# Phase 3: Task Creation (Linear MCP)
1. Create development tasks
2. Attach asset links to tasks
3. Assign to engineering team

# Phase 4: Notification (Slack MCP)
1. Post handoff summary to #engineering
2. Include asset links and task references
```

**关键技术**：
- **清晰的阶段分离**
- **MCP 间的数据传递**
- **进入下一阶段前的验证**
- **集中式错误处理**

---

### 模式 3：迭代优化

**适用场景**：输出质量通过迭代得以提升。

**示例**：报告生成

```yaml
# Iterative Report Creation

# Initial Draft
1. Fetch data via MCP
2. Generate first draft report
3. Save to temporary file

# Quality Check
1. Run validation script: `scripts/check_report.py`
2. Identify issues:
   - Missing sections
   - Inconsistent formatting
   - Data validation errors

# Refinement Loop
1. Address each identified issue
2. Regenerate affected sections
3. Re-validate
4. Repeat until quality threshold met

# Finalization
1. Apply final formatting
2. Generate summary
3. Save final version
```

**关键技术**：
- **明确的质量标准**
- **迭代改进**
- **验证脚本**
- **知道何时停止迭代**

---

### 模式 4：上下文感知工具选择

**适用场景**：目标相同，但根据上下文选择不同的工具。

**示例**：文件存储

```yaml
# Smart File Storage

# Decision Tree
1. Check file type and size
2. Determine best storage location:
   - Large files (>10MB): Use cloud storage MCP
   - Collaborative docs: Use Notion/Docs MCP
   - Code files: Use GitHub MCP
   - Temporary files: Use local storage

# Execute Storage
Based on decision:
- Call appropriate MCP tool
- Apply service-specific metadata
- Generate access link

# Provide Context to User
Explain why that storage was chosen
```

**关键技术**：
- **清晰的决策标准**
- **备用选项**
- **关于选择的透明度**

---

### 模式 5：领域特定智能

**适用场景**：你的技能添加了超越工具访问的专门知识。

**示例**：金融合规

```yaml
# Payment Processing with Compliance

# Before Processing (Compliance Check)
1. Fetch transaction details via MCP
2. Apply compliance rules:
   - Check sanctions lists
   - Verify jurisdiction allowances
   - Assess risk level
3. Document compliance decision

# Processing
IF compliance passed:
- Call payment processing MCP tool
- Apply appropriate fraud checks
- Process transaction
ELSE:
- Flag for review
- Create compliance case

# Audit Trail
- Log all compliance checks
- Record processing decisions
- Generate audit report
```

**关键技术**：
- **嵌入逻辑中的领域专业知识**
- **行动前合规**
- **全面的文档**
- **清晰的治理**

---

## 故障排除

### 技能无法上传

**错误**："无法在上传的文件夹中找到 SKILL.md"

**原因**：文件未精确命名为 `SKILL.md`

**解决方案**：
- 重命名为 `SKILL.md`（大小写敏感）
- 验证：`ls -la` 应显示 `SKILL.md`

**错误**："无效的前置元数据"

**原因**：YAML 格式问题

常见错误：

```yaml
# 错误 - 缺少分隔符
name: my-skill
description: Does things
```

```yaml
# 错误 - 引号未闭合
name: my-skill
description: "Does things
```

```yaml
# 正确

---
name: my-skill
description: Does things

---
```

**错误**："无效的技能名称"

**原因**：名称包含空格或大写字母

```yaml
# Wrong
name: My Cool Skill

# Correct
name: my-cool-skill
```

---

### 技能未触发

**症状**：技能从未自动加载

**修复**：修订你的描述字段。请参阅《描述字段》了解好坏示例。

**快速检查清单**：
- 是否过于笼统？（"协助项目"无效）
- 是否包含用户实际会说的触发短语？
- 是否提及了相关的文件类型（如适用）？

**调试方法**：

询问 Claude："何时会使用 [技能名称] 技能？" Claude 会引用描述回复。根据缺失内容进行调整。

---

### 技能触发过于频繁

**症状**：技能因无关查询而加载

**解决方案**：

1. **添加否定触发词**

```yaml
description: 针对 CSV 文件的高级数据分析。用于统计建模、回归、聚类。不用于简单的数据探索（请改用 data-viz 技能）。
```

2. **更具体一些**

```yaml
# 过于宽泛
description: 处理文档

# 更具体
description: 处理用于合同审查的 PDF 法律文档
```

3. **明确范围**

```yaml
description: PayFlow 电子商务支付处理。专用于在线支付工作流，不用于一般金融查询。
```

---

### 未遵循指令

**症状**：技能已加载但 Claude 未遵循指令

**常见原因**：

1. **指令过于冗长**
   - 保持指令简洁
   - 使用要点和编号列表
   - 将详细参考资料移至单独文件

2. **指令被埋藏**
   - 将关键指令置于顶部
   - 使用 `## Important` 或 `## Critical` 标题
   - 必要时重复关键点

3. **语言表述模糊**

```markdown
# 不良示例
确保正确验证所有内容

# 良好示例
关键：在调用 create_project 之前，请验证：
- Project name is non-empty
- At least one team member assigned
- Start date is not in the past
```

**高级技巧**：对于关键验证，可以考虑捆绑一个脚本，以程序化方式执行检查，而非依赖语言指令。代码是确定性的；语言解释则不然。请参阅 Office 技能中的示例以了解此模式。

4. **模型"惰性"**

添加明确鼓励：

> - 花时间彻底完成
> - 质量比速度更重要
> - 不要跳过验证步骤

注意：将此添加到用户提示中比在 SKILL.md 中更有效。

---

### MCP 连接问题

**症状**：技能已加载但 MCP 调用失败

**检查清单**：

1. **验证 MCP 服务器已连接**
   - Claude.ai：设置 > 扩展 > [你的服务]
   - 应显示"已连接"状态

2. **检查认证**
   - API 密钥有效且未过期
   - 已授予适当权限/作用域
   - OAuth 令牌已刷新

3. **独立测试 MCP**
   - 要求 Claude 直接调用 MCP（不使用技能）
   - "使用 [服务] MCP 来获取我的项目"
   - 如果失败，问题在于 MCP 而非技能

4. **验证工具名称**
   - 技能引用了正确的 MCP 工具名称
   - 检查 MCP 服务器文档
   - 工具名称区分大小写

---

### 大型上下文问题

**症状**：技能似乎运行缓慢或响应质量下降

**原因**：
- 技能内容过大
- 同时启用过多技能
- 加载全部内容而非采用渐进式披露

**解决方案**：

1. **优化 SKILL.md 文件大小**
   - 将详细文档移至 `references/` 目录
   - 链接至参考资料而非内嵌
   - 保持 SKILL.md 在 5,000 个英文单词以内（约 3,000–4,000 汉字）

2. **减少启用技能数量**
   - 评估是否同时启用了超过 20–50 个技能
   - 建议选择性启用
   - 考虑为相关功能提供技能"包"

---

## 第6章 资源与参考

如果你正在构建第一个技能，建议从《最佳实践指南》开始，再按需查阅 API 文档。

## 官方文档与工具

### skill-creator 技能

- 内置于 Claude.ai，并可供 Claude Code 使用
- 可根据描述生成技能
- 审查并提供改进建议
- 用法示例："帮我使用 skill-creator 构建一个技能"

### Anthropic 官方资源

- **最佳实践指南**（Best Practices Guide）
- **技能文档**（Skills Documentation）
- **API 参考**（API Reference）
- **MCP 文档**（MCP Documentation）

### 博客文章

- **智能体技能介绍**（Introducing Agent Skills）
- **工程博客：为智能体配备现实世界功能**（Equipping Agents for the Real World）
- **技能详解**（Skills Explained）
- **如何为 Claude 创建技能**（How to Create Skills for Claude）
- **为 Claude Code 构建技能**（Building Skills for Claude Code）
- **通过技能改进前端设计**（Improving Frontend Design through Skills）

## 获取支持

### 技术问题咨询

如有一般性技术问题，请前往 **Claude 开发者 Discord** 社区论坛获取帮助。

### Bug 报告

如需提交 Bug 报告，请访问 GitHub Issues：

```
anthropics/skills/issues
```

提交时请务必包含以下信息：

- 技能名称
- 错误信息
- 复现步骤

## 示例技能

公共技能仓库地址：

```
GitHub: anthropics/skills
```

该仓库包含 Anthropic 官方创建的技能，你可以根据自己的需求进行自定义修改。

---

## 参考 A：快速检查清单

在上传技能前后，请使用以下清单进行验证。如果你希望更快上手，可以先使用 skill-creator 技能生成初稿，再对照此清单逐一检查，确保没有遗漏。

### 开始之前

- [ ] 已确定 2–3 个具体用例
- [ ] 已确定所需工具（内置工具或 MCP）
- [ ] 已审阅本指南及示例技能
- [ ] 已规划文件夹结构

### 开发期间

- [ ] 更新元数据中的版本号
- [ ] 文件夹名称采用短横线命名法（kebab-case）
- [ ] SKILL.md 文件存在（拼写必须完全准确）
- [ ] YAML 前置元数据包含 `---` 分隔符
- [ ] `name` 字段使用短横线命名法，无空格，无大写字母
- [ ] `description` 包含 **WHAT**（做什么）和 **WHEN**（何时用）
- [ ] 任何地方都没有 XML 尖括号（`< >`）
- [ ] 指令清晰且可操作
- [ ] 包含错误处理
- [ ] 提供了示例
- [ ] 引用链接清晰明确

### 上传前

- [ ] 已在典型任务上测试触发效果
- [ ] 已在改写后的请求上测试触发效果
- [ ] 已验证不会在无关主题上触发
- [ ] 功能测试通过
- [ ] 工具集成正常工作（如适用）
- [ ] 已压缩为 `.zip` 文件

### 上传后

- [ ] 在实际对话中进行测试
- [ ] 监控触发不足 / 过度触发的情况
- [ ] 收集用户反馈
- [ ] 迭代优化描述和说明

---

## 参考 B：YAML 前置元数据

### 必填字段

```yaml

---
name: skill-name-in-kebab-case
description: What it does and when to use it. Include specific trigger phrases.

---
```

### 所有可选字段

```yaml
name: skill-name
description: [required description]
license: MIT                      # 可选：开源许可证
allowed-tools: "Bash(python:*) Bash(npm:*) WebFetch"  # 可选：限制工具访问
metadata:                         # 可选：自定义字段
  author: Company Name
  version: 1.0.0
  mcp-server: server-name
  category: productivity
  tags: [project-management, automation]
  documentation: https://example.com/docs
  support: support@example.com
```

### 安全说明

**允许**：

- 任何标准 YAML 类型（字符串、数字、布尔值、列表、对象）
- 自定义元数据字段
- 长描述（最多 1024 个字符）

**禁止**：

- XML 尖括号（`< >`）—— 出于安全限制
- YAML 中的代码执行（系统使用安全 YAML 解析）
- 以 `claude` 或 `anthropic` 前缀命名的技能（保留名称）

---

## 参考 C：完整的技能示例

如需查看可用于生产环境的完整技能示例，以实践本指南介绍的模式，请访问以下资源：

- **文档技能** — PDF、DOCX、PPTX、XLSX 文件创建
- **示例技能** — 各种工作流模式
- **合作伙伴技能目录** — 查看来自 Asana、Atlassian、Canva、Figma、Sentry、Zapier 等合作伙伴的技能

这些仓库始终保持更新，包含超出本指南范围的更多示例。你可以克隆这些仓库，根据实际用例进行修改，并将其作为模板使用。

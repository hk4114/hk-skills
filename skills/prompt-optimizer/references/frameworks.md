# Prompt Frameworks

Select the appropriate framework based on the prompt's purpose.

## CO-STAR Framework

Best for: General-purpose prompts, structured tasks

| Element | Description | Example |
|---------|-------------|---------|
| **C**ontext | Background information | "我是一名产品经理，正在准备季度汇报" |
| **O**bjective | What to accomplish | "帮我撰写一份产品路线图摘要" |
| **S**tyle | Writing style | "专业但易于理解" |
| **T**one | Emotional tone | "自信、积极" |
| **A**udience | Target reader | "公司高管和投资人" |
| **R**esponse | Output format | "PPT大纲格式，每页3-5个要点" |

**Template:**
```
[Context] 背景信息...
[Objective] 我需要你帮我...
[Style] 请使用...风格
[Tone] 语气应该...
[Audience] 目标读者是...
[Response] 请以...格式输出
```

## CRISPE Framework

Best for: Role-based tasks, expert personas

| Element | Description |
|---------|-------------|
| **C**apacity | Define the role/expertise |
| **R**ole | Specific persona to adopt |
| **I**nsight | Key information to consider |
| **S**tatement | The actual task |
| **P**ersonality | Character traits |
| **E**xperiment | Request variations |

**Template:**
```
你是一位[Capacity]，扮演[Role]的角色。
请基于以下信息：[Insight]
完成这个任务：[Statement]
在回答时请保持[Personality]的风格。
请提供[Experiment]个不同的版本。
```

## RISEN Framework

Best for: Creative writing, storytelling

| Element | Description |
|---------|-------------|
| **R**ole | Character or perspective |
| **I**nstructions | Detailed task description |
| **S**teps | Sequential process |
| **E**nd goal | Desired outcome |
| **N**arrowing | Constraints and limits |

**Template:**
```
[Role] 以...的身份
[Instructions] 请...
[Steps] 按以下步骤：1... 2... 3...
[End goal] 最终目标是...
[Narrowing] 限制条件：...
```

## Chain-of-Thought (CoT)

Best for: Complex reasoning, problem-solving, math

**Techniques:**

1. **Zero-shot CoT**: Add "让我们一步一步思考" or "Let's think step by step"

2. **Few-shot CoT**: Provide reasoning examples
```
问题：[示例问题]
思考过程：
1. 首先...
2. 然后...
3. 因此...
答案：[示例答案]

现在请解决：[实际问题]
```

3. **Self-Consistency**: Request multiple reasoning paths
```
请用三种不同的方法解决这个问题，然后比较结果。
```

## RTF Framework

Best for: Simple, direct tasks

| Element | Description |
|---------|-------------|
| **R**ole | Who the AI should be |
| **T**ask | What to do |
| **F**ormat | How to present output |

**Template:**
```
[Role] 你是...
[Task] 请...
[Format] 输出格式为...
```

## Framework Selection Guide

```
需要专家建议？ → CRISPE
需要结构化输出？ → CO-STAR
需要创意内容？ → RISEN
需要复杂推理？ → Chain-of-Thought
简单直接任务？ → RTF
```

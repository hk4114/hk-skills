# Gemini Model Best Practices

Optimization tips specifically for Google Gemini models.

## Gemini Strengths

| Capability | Optimization Strategy |
|------------|----------------------|
| Multimodal | Include image/video references when relevant |
| Long context | Provide comprehensive background without truncation |
| Reasoning | Use structured step-by-step instructions |
| Code | Specify language, framework, and coding style |

## Prompt Structure for Gemini

### Recommended Format

```
## 角色
[清晰定义AI角色]

## 任务
[具体描述任务目标]

## 背景信息
[提供相关上下文]

## 要求
- [要求1]
- [要求2]
- [要求3]

## 输出格式
[明确指定格式要求]

## 示例（可选）
[提供输入输出示例]
```

### Use Markdown Headers

Gemini responds well to structured markdown:
- Use `##` for main sections
- Use bullet points for lists
- Use code blocks for technical content
- Use tables for structured data

## Key Optimization Tips

### 1. Be Explicit About Format

```
❌ "给我一个列表"
✅ "请以Markdown无序列表格式输出，每项不超过20字"
```

### 2. Specify Output Length

```
❌ "简短回答"
✅ "请在100-150字内回答"
```

### 3. Define Scope Clearly

```
❌ "解释机器学习"
✅ "向没有技术背景的产品经理解释机器学习的核心概念，重点说明它如何应用于推荐系统"
```

### 4. Use System Instructions

For consistent behavior, frame instructions as system-level:
```
你是[角色]。在整个对话中，你将始终：
- [行为准则1]
- [行为准则2]
- [行为准则3]
```

### 5. Leverage Few-Shot Examples

Gemini learns well from examples:
```
## 示例

输入："今天天气很好"
输出：{"sentiment": "positive", "confidence": 0.95}

输入："这个产品太差了"
输出：{"sentiment": "negative", "confidence": 0.88}

## 现在请分析
输入："还行吧，一般般"
```

### 6. Chain Complex Tasks

Break down multi-step tasks:
```
请按以下步骤完成：

步骤1：分析输入文本的主题
步骤2：识别关键论点
步骤3：评估论证逻辑
步骤4：给出综合评分

每完成一个步骤，先输出该步骤的结果，再进入下一步。
```

## Common Patterns

### For Analysis Tasks
```
分析以下[内容类型]：

[内容]

请从以下维度进行分析：
1. [维度1]
2. [维度2]
3. [维度3]

输出格式：每个维度用一个段落说明，最后给出总结。
```

### For Generation Tasks
```
创作一篇[内容类型]，要求：

主题：[主题]
风格：[风格描述]
长度：[字数范围]
目标读者：[读者描述]

请包含：
- [必须元素1]
- [必须元素2]

请避免：
- [禁止元素1]
- [禁止元素2]
```

### For Transformation Tasks
```
将以下[原始格式]转换为[目标格式]：

[原始内容]

转换规则：
- [规则1]
- [规则2]

保留：[需保留的元素]
调整：[需调整的元素]
```

## Gemini-Specific Tokens

| Token | Effect |
|-------|--------|
| `请一步一步思考` | Triggers reasoning mode |
| `请直接给出答案` | Skips explanation |
| `请用中文回答` | Ensures Chinese output |
| `以JSON格式输出` | Structured output |

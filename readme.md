# hk-skills

## prompt-optimizer
一句话目标 + 必要背景 + 约束 + 期望输出格式。这样更干净、更可控，也更贴近你真实的日常使用场景。
- [skills](https://github.com/chujianyun/skills/tree/main/skills)
- MIPROv2 + DSPY 实现 APO（自动提示优化）

## skill 学习
https://agentskills.me/
https://www.skillsdirectory.com/
- [anthropics/skills](https://github.com/anthropics/skills)
- [baoyu-skills](https://github.com/JimLiu/baoyu-skills/tree/main/skills)
- [ai-partner-chat](https://github.com/eze-is/ai-partner-chat)
- [skillsmp](https://skillsmp.com/zh)
- [skills](https://skills.sh/)
- [skill-from-masters](https://github.com/GBSOSS/skill-from-masters)帮你创建 Skill，在创建新 Skill 之前，会先搜索，寻找目标领域的顶级专家的思维模型和最佳实践，确保生成的 Skill 具备专业深度。
- https://skillsmp.com/zh 




```md
/.claude/skills/skill-name
    ├── SKILL.md    # 元数据+指令
    ├── agents/     # 技能名片
    │   └── openai.yaml
    ├── scripts/    # 可执行脚本
    │   └── main.py
    ├── references/ # 补充文档（可选）
    │   └── doc.md
    └── assets/     # 素材资源
        └── pic.jpg
```

`openai.yaml` 很多 AI 产品会在界面上展示一个技能列表，让用户选择或搜索。这个文件里存的就是列表中显示的名称、简介、图标等信息。它不影响 AI 的行为，纯粹是给产品界面用的
# HK-Skills

HK-Skills 是这台机器的 Agent Skill 管理项目。

它解决的问题很直接：Skill 多了以后，靠手工复制 `SKILL.md`、记路径、改 Agent 配置、区分全局和项目作用域，很快会失控。HK-Skills 把 Skill 的安装、登记、启用、禁用、更新、移除和目录生成收进一个本地 CLI，让每个项目只加载自己真正需要的技能。

推荐用法是：把 Skill 安装到这个仓库，再按项目启用。全局启用只用于你明确希望所有项目都能用的基础技能。

## 适合解决什么问题

- 集中管理本机所有 Agent Skill，避免散落在不同配置目录里。
- 给不同项目启用不同 Skill，减少全局上下文污染。
- 把“安装”和“启用”分开：安装只是纳入 HK-Skills，启用才会让目标项目看到它。
- 管理远程 Skill、本地原创 Skill、已启用 Skill 和待清理 Skill。
- 生成中文用户目录，方便查看现在有哪些技能、哪些已启用、适合什么场景。

## 前置要求

- [Bun](https://bun.sh/) 运行时

所有命令都在仓库根目录执行：

```bash
cd /Users/{username}/project/hk-skills
```

## Quick Start

### 1. 初始化

首次使用先初始化：

```bash
./bin/hk-skill init
```

### 2. 安装 Skill

安装远程 Skill：

```bash
./bin/hk-skill install https://github.com/user/some-skill
```

安装本地 Skill：

```bash
./bin/hk-skill install ./warehouse/local/some-skill --local
```

安装完成后，Skill 只是被 HK-Skills 管理，还不会自动进入任何项目。

### 3. 查看已安装 Skill

```bash
./bin/hk-skill list
```

### 4. 启用到项目

推荐按项目启用：

```bash
./bin/hk-skill enable some-skill --project /Users/{user}/project/kane_inbox
```

启用后，目标项目会出现本地入口：

```text
/Users/{user}/project/kane_inbox/.agents/skills/some-skill/SKILL.md
```

Agent 读取这个项目本地入口即可使用该 Skill。

### 5. 全局启用

只有明确需要机器级共享时才全局启用：

```bash
./bin/hk-skill enable some-skill --global
```

## 常用命令

| 任务 | 命令 |
|---|---|
| 初始化 HK-Skills | `./bin/hk-skill init` |
| 安装远程 Skill | `./bin/hk-skill install <url>` |
| 安装本地 Skill | `./bin/hk-skill install <path> --local` |
| 查看 Skill | `./bin/hk-skill list` |
| 启用到项目 | `./bin/hk-skill enable <name> --project <path>` |
| 全局启用 | `./bin/hk-skill enable <name> --global` |
| 从项目禁用 | `./bin/hk-skill disable <name> --project <path>` |
| 全局禁用 | `./bin/hk-skill disable <name> --global` |
| 更新单个远程 Skill | `./bin/hk-skill update <name>` |
| 更新全部远程 Skill | `./bin/hk-skill update --all` |
| 移除 Skill | `./bin/hk-skill remove <name>` |
| 清理未启用 Skill | `./bin/hk-skill remove --unused` |
| 生成技能目录 | `./bin/hk-skill catalog` |
| 查看帮助 | `./bin/hk-skill --help` |

## 中文快捷说法

在这个项目里，可以把一些中文意图直接当作操作约定：

### `安装 {source}`

等价于：

```bash
./bin/hk-skill install {source}
```

如果 `{source}` 是本地路径，使用：

```bash
./bin/hk-skill install {source} --local
```

### `关联 {path}`

把刚安装、刚更新或当前正在讨论的 Skill 启用到目标项目：

```bash
./bin/hk-skill enable <skill-name> --project {path}
```

用户可见入口是：

```text
{path}/.agents/skills/<skill-name>/SKILL.md
```

### `更新技能`

更新所有远程 Skill：

```bash
./bin/hk-skill update --all
```

### `生成目录` / `更新目录`

生成技能目录：

```bash
./bin/hk-skill catalog
```

目录文件在：

```text
docs/catalog.md
```

目录应面向用户阅读：中文说明、按使用场景分类、区分已启用和未启用，并保留英文 trigger keyword 方便 Agent 匹配。

## 典型工作流

### 给一个项目接入新 Skill

```bash
cd /Users/{user}/project/hk-skills
./bin/hk-skill install https://github.com/user/repo-analyzer
./bin/hk-skill enable repo-analyzer --project /Users/{user}/project/my-app
```

然后在目标项目使用：

```text
/Users/{user}/project/my-app/.agents/skills/repo-analyzer/SKILL.md
```

### 把本地原创 Skill 装进系统

```bash
cd /Users/{user}/project/hk-skills
./bin/hk-skill install warehouse/local/subtext-article --local
./bin/hk-skill enable subtext-article --project /Users/{user}/project/kane_inbox
```

原创 Skill 建议放在：

```text
warehouse/local/<skill-name>/
```

### 更新所有远程 Skill

```bash
cd /Users/{user}/project/hk-skills
./bin/hk-skill update --all
```

### 生成可读技能目录

```bash
cd /Users/{user}/project/hk-skills
./bin/hk-skill catalog
```

查看：

```text
docs/catalog.md
```

## 使用原则

- 项目启用优先：默认使用 `--project <path>`。
- 安装不等于启用：`install` 后还需要 `enable`。
- 不手改注册信息：能用 CLI 完成的操作就用 CLI。
- 本地原创 Skill 放在 `warehouse/local/`。
- 不明确要求全局启用时，不使用 `--global`。

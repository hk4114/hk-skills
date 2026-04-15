import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { loadSkillsRegistry } from "../services/registry.js";
import { success } from "../utils/logger.js";

type SkillInfo = {
  name: string;
  displayName: string;
  source: string;
  stage: string;
  capabilities: string;
  triggers: string;
  scope: string;
  enabled: string;
};

export function catalog(root: string): void {
  const registry = loadSkillsRegistry(root);
  const entries = Object.entries(registry);

  const docsDir = path.join(root, "docs");
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const catalogPath = path.join(docsDir, "catalog.md");

  if (entries.length === 0) {
    fs.writeFileSync(
      catalogPath,
      "# Skill Catalog\n\nNo skills installed.\n",
      "utf-8"
    );
    success("Catalog generated: " + path.resolve(catalogPath));
    return;
  }

  const groups = {
    local: [] as SkillInfo[],
    remote: [] as SkillInfo[],
    adapted: [] as SkillInfo[],
    unknown: [] as SkillInfo[],
  };

  for (const [name, entry] of entries) {
    const manifestPath = path.join(root, entry.manifest);
    let displayName = name;
    let source = "unknown";
    let stage = "unknown";
    let capabilities = "-";
    let triggers = "-";
    let scope = "-";

    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = parse(fs.readFileSync(manifestPath, "utf-8")) as Record<string, unknown>;
        displayName = typeof manifest.display_name === "string" ? manifest.display_name : name;
        const manifestSource = manifest.source as Record<string, unknown> | undefined;
        source = typeof manifestSource?.type === "string" ? manifestSource.type : "unknown";
        const manifestStatus = manifest.status as Record<string, unknown> | undefined;
        stage = typeof manifestStatus?.stage === "string" ? manifestStatus.stage : "unknown";
        const caps = manifest.capabilities;
        if (Array.isArray(caps) && caps.length > 0) {
          capabilities = caps.map(String).join(", ");
        }
        const trigs = manifest.triggers;
        if (Array.isArray(trigs) && trigs.length > 0) {
          triggers = trigs.map(String).join(", ");
        }
        const manifestScope = manifest.scope as Record<string, unknown> | undefined;
        scope = typeof manifestScope?.recommended === "string" ? manifestScope.recommended : "-";
      } catch {
        source = "error";
        stage = "error";
        capabilities = "error";
        triggers = "error";
        scope = "error";
      }
    } else {
      source = "unknown";
      stage = "unknown";
      capabilities = "unknown";
      triggers = "unknown";
      scope = "unknown";
    }

    let enabled = "disabled";
    if (entry.enabled_global) {
      enabled = "global";
    } else if (entry.enabled_projects.length > 0) {
      enabled = `项目: ${entry.enabled_projects.join(",")}`;
    }

    const skillInfo: SkillInfo = {
      name,
      displayName,
      source,
      stage,
      capabilities,
      triggers,
      scope,
      enabled,
    };

    const targetGroup = groups[source as keyof typeof groups];
    if (targetGroup) {
      targetGroup.push(skillInfo);
    } else {
      groups.unknown.push(skillInfo);
    }
  }

  for (const key of Object.keys(groups) as (keyof typeof groups)[]) {
    groups[key]!.sort((a, b) => a.name.localeCompare(b.name));
  }

  const lines: string[] = [];
  lines.push("# Skill Catalog");

  const groupOrder: (keyof typeof groups)[] = ["local", "remote", "adapted", "unknown"];
  const groupTitles: Record<keyof typeof groups, string> = {
    local: "Local",
    remote: "Remote",
    adapted: "Adapted",
    unknown: "Unknown",
  };

  for (const groupKey of groupOrder) {
    const groupSkills = groups[groupKey];
    if (!groupSkills || groupSkills.length === 0) continue;

    lines.push("");
    lines.push(`## ${groupTitles[groupKey]}`);
    lines.push("");
    lines.push("| 名称 | 来源 | 状态 | 能力 | 作用域 | Trigger | 启用状态 |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");

    for (const skill of groupSkills) {
      const cells = [
        escapeCell(skill.displayName),
        escapeCell(skill.source),
        escapeCell(skill.stage),
        escapeCell(skill.capabilities),
        escapeCell(skill.scope),
        escapeCell(skill.triggers),
        escapeCell(skill.enabled),
      ];
      lines.push(`| ${cells.join(" | ")} |`);
    }
  }

  fs.writeFileSync(catalogPath, lines.join("\n") + "\n", "utf-8");
  success("Catalog generated: " + path.resolve(catalogPath));
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|");
}

import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { parse } from "yaml";
import { loadSkillsRegistry } from "../services/registry.js";
import * as logger from "../utils/logger.js";

export function list(root: string): void {
  const registry = loadSkillsRegistry(root);
  const entries = Object.entries(registry);

  if (entries.length === 0) {
    logger.warn("No skills installed.");
    return;
  }

  const rows: { name: string; source: string; stage: string; enabled: string }[] = [];

  for (const [name, entry] of entries) {
    const manifestPath = path.join(root, entry.manifest);
    let source = "unknown";
    let stage = "unknown";

    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = parse(fs.readFileSync(manifestPath, "utf-8")) as Record<string, unknown>;
        const manifestSource = manifest.source as Record<string, unknown> | undefined;
        source = typeof manifestSource?.type === "string" ? manifestSource.type : "unknown";
        const manifestStatus = manifest.status as Record<string, unknown> | undefined;
        stage = typeof manifestStatus?.stage === "string" ? manifestStatus.stage : "unknown";
      } catch {
        source = "error";
        stage = "error";
      }
    }

    let enabled = "no";
    if (entry.enabled_global) {
      enabled = "global";
    } else if (entry.enabled_projects.length > 0) {
      enabled = entry.enabled_projects.join(",");
    }

    rows.push({ name, source, stage, enabled });
  }

  const nameWidth = Math.max(4, ...rows.map((r) => r.name.length));
  const sourceWidth = Math.max(6, ...rows.map((r) => r.source.length));
  const stageWidth = Math.max(5, ...rows.map((r) => r.stage.length));
  const enabledWidth = Math.max(7, ...rows.map((r) => r.enabled.length));

  const header = `${chalk.bold("NAME".padEnd(nameWidth))}  ${chalk.bold("SOURCE".padEnd(sourceWidth))}  ${chalk.bold("STAGE".padEnd(stageWidth))}  ${chalk.bold("ENABLED".padEnd(enabledWidth))}`;
  const separator = "-".repeat(nameWidth + sourceWidth + stageWidth + enabledWidth + 6);

  console.log(header);
  console.log(separator);

  for (const row of rows) {
    console.log(
      `${row.name.padEnd(nameWidth)}  ${row.source.padEnd(sourceWidth)}  ${row.stage.padEnd(stageWidth)}  ${row.enabled.padEnd(enabledWidth)}`
    );
  }
}

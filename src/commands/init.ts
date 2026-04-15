import fs from "node:fs";
import path from "node:path";
import { stringify } from "yaml";
import { generateSourceId } from "../core/fetcher.js";
import { vet } from "../core/vetter.js";
import { adapt } from "../core/adapter.js";
import {
  loadSkillsRegistry,
  saveSkillsRegistry,
  loadSourcesRegistry,
  saveSourcesRegistry,
} from "../services/registry.js";
import { info, warn, error, success } from "../utils/logger.js";
import type { SourcesRegistry } from "../models/registry.js";

const DIRS = [
  "registry",
  "manifests",
  "warehouse/remote",
  "warehouse/adapted",
  "warehouse/local",
  "runtime/global",
  "runtime/projects",
  "logs",
  "patches",
  "docs",
];

function parseMenuMd(content: string): SourcesRegistry {
  const lines = content.split(/\r?\n/).map((l) => l.trim());
  const sources: SourcesRegistry = {};
  let pastSeparator = false;

  for (const line of lines) {
    if (!line.startsWith("|")) continue;
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    if (cells.length === 0) continue;

    if (cells.every((c) => /^[-:]+$/.test(c))) {
      pastSeparator = true;
      continue;
    }

    if (!pastSeparator) continue;

    const [skill, repo, ref, upstreamPath] = cells;
    if (!skill || !repo || !ref) continue;

    const sourceId = generateSourceId(repo, ref);
    sources[sourceId] = {
      type: "remote",
      repo,
      ref,
      local_path: upstreamPath || `warehouse/remote/${sourceId}`,
    };
  }

  return sources;
}

export function init(root: string): void {
  for (const dir of DIRS) {
    const dirPath = path.join(root, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      info(`Created directory: ${dirPath}`);
    }
  }

  const skillsRegistry = loadSkillsRegistry(root);
  const sourcesRegistry = loadSourcesRegistry(root);

  const customDir = path.join(root, "custom");
  if (fs.existsSync(customDir) && fs.statSync(customDir).isDirectory()) {
    for (const entry of fs.readdirSync(customDir)) {
      const skillPath = path.join(customDir, entry);
      const stat = fs.statSync(skillPath);
      if (!stat.isDirectory()) continue;
      if (entry === "digital-me") continue;

      const skillMdPath = path.join(skillPath, "SKILL.md");
      if (!fs.existsSync(skillMdPath)) {
        warn(`Skipping ${entry}: no SKILL.md found`);
        continue;
      }

      const vetResult = vet(skillPath);
      if (!vetResult.passed) {
        error(`Vet failed for ${entry}: ${vetResult.errors.join(", ")}`);
        continue;
      }

      const adaptResult = adapt(skillPath, root, "local");
      if (!adaptResult.success) {
        error(`Adapt failed for ${entry}: ${adaptResult.errors.join(", ")}`);
        continue;
      }

      const name = adaptResult.name;
      if (skillsRegistry[name]) {
        warn(`Skill ${name} already in registry, skipping`);
        continue;
      }

      const sourceId = `local-${name}`;
      skillsRegistry[name] = {
        manifest: `manifests/${name}.yaml`,
        installed: true,
        enabled_global: false,
        enabled_projects: [],
        updated_at: new Date().toISOString(),
        source_id: sourceId,
      };
      sourcesRegistry[sourceId] = {
        type: "local",
        local_path: `warehouse/local/${name}`,
      };
      success(`Migrated custom skill: ${name}`);
    }
  }

  const digitalMeDir = path.join(customDir, "digital-me");
  if (fs.existsSync(digitalMeDir) && fs.statSync(digitalMeDir).isDirectory()) {
    const name = "digital-me";
    if (!skillsRegistry[name]) {
      const manifest = {
        name,
        display_name: name,
        source: { type: "local" },
        status: { stage: "adapted" },
        entry: { file: "readme.md" },
      };
      const manifestPath = path.join(root, "manifests", `${name}.yaml`);
      fs.writeFileSync(manifestPath, stringify(manifest), "utf-8");

      const destPath = path.join(root, "warehouse", "local", name);
      fs.cpSync(digitalMeDir, destPath, { recursive: true });

      const sourceId = `local-${name}`;
      skillsRegistry[name] = {
        manifest: `manifests/${name}.yaml`,
        installed: true,
        enabled_global: false,
        enabled_projects: [],
        updated_at: new Date().toISOString(),
        source_id: sourceId,
      };
      sourcesRegistry[sourceId] = {
        type: "local",
        local_path: `warehouse/local/${name}`,
      };
      success(`Migrated workspace: ${name}`);
    } else {
      warn(`Workspace ${name} already in registry, skipping`);
    }
  }

  const skillsDir = path.join(root, "skills");
  if (fs.existsSync(skillsDir) && fs.statSync(skillsDir).isDirectory()) {
    for (const entry of fs.readdirSync(skillsDir)) {
      const skillPath = path.join(skillsDir, entry);
      const stat = fs.statSync(skillPath);
      if (!stat.isDirectory()) continue;

      const skillMdPath = path.join(skillPath, "SKILL.md");
      if (!fs.existsSync(skillMdPath)) {
        warn(`Skipping ${entry}: no SKILL.md found`);
        continue;
      }

      const vetResult = vet(skillPath);
      if (!vetResult.passed) {
        error(`Vet failed for ${entry}: ${vetResult.errors.join(", ")}`);
        continue;
      }

      const adaptResult = adapt(skillPath, root, "adapted");
      if (!adaptResult.success) {
        error(`Adapt failed for ${entry}: ${adaptResult.errors.join(", ")}`);
        continue;
      }

      const name = adaptResult.name;
      if (skillsRegistry[name]) {
        warn(`Skill ${name} already in registry, skipping`);
        continue;
      }

      const sourceId = `local-${name}`;
      skillsRegistry[name] = {
        manifest: `manifests/${name}.yaml`,
        installed: true,
        enabled_global: false,
        enabled_projects: [],
        updated_at: new Date().toISOString(),
        source_id: sourceId,
      };
      sourcesRegistry[sourceId] = {
        type: "local",
        local_path: `warehouse/local/${name}`,
      };
      success(`Migrated skill: ${name}`);
    }
  }

  const localWarehouseDir = path.join(root, "warehouse", "local");
  if (fs.existsSync(localWarehouseDir) && fs.statSync(localWarehouseDir).isDirectory()) {
    for (const entry of fs.readdirSync(localWarehouseDir)) {
      const skillPath = path.join(localWarehouseDir, entry);
      const stat = fs.statSync(skillPath);
      if (!stat.isDirectory()) continue;

      const skillMdPath = path.join(skillPath, "SKILL.md");
      if (!fs.existsSync(skillMdPath)) {
        warn(`Skipping ${entry}: no SKILL.md found`);
        continue;
      }

      const vetResult = vet(skillPath);
      if (!vetResult.passed) {
        error(`Vet failed for ${entry}: ${vetResult.errors.join(", ")}`);
        continue;
      }

      const adaptResult = adapt(skillPath, root, "local");
      if (!adaptResult.success) {
        error(`Adapt failed for ${entry}: ${adaptResult.errors.join(", ")}`);
        continue;
      }

      const name = adaptResult.name;
      if (skillsRegistry[name]) {
        warn(`Skill ${name} already in registry, skipping`);
        continue;
      }

      const sourceId = `local-${name}`;
      skillsRegistry[name] = {
        manifest: `manifests/${name}.yaml`,
        installed: true,
        enabled_global: false,
        enabled_projects: [],
        updated_at: new Date().toISOString(),
        source_id: sourceId,
      };
      sourcesRegistry[sourceId] = {
        type: "local",
        local_path: `warehouse/local/${name}`,
      };
      success(`Registered local skill: ${name}`);
    }
  }

  saveSkillsRegistry(root, skillsRegistry);
  saveSourcesRegistry(root, sourcesRegistry);

  const menuPath = path.join(root, "remote", "menu.md");
  if (fs.existsSync(menuPath)) {
    const content = fs.readFileSync(menuPath, "utf-8");
    const sources = parseMenuMd(content);
    const mergedSources = { ...sourcesRegistry, ...sources };
    saveSourcesRegistry(root, mergedSources);
    info(`Parsed remote/menu.md into registry/sources.json`);
  }

  success(`Init completed for ${root}`);
}

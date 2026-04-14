import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { enableSkill } from "../../src/core/activator.js";
import { disable } from "../../src/commands/disable.js";
import { loadSkillsRegistry, saveSkillsRegistry } from "../../src/services/registry.js";

describe("disable", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hk-skills-disable-test-"));
    fs.mkdirSync(path.join(tempDir, "warehouse", "adapted", "test-skill"), { recursive: true });
    fs.writeFileSync(
      path.join(tempDir, "warehouse", "adapted", "test-skill", "SKILL.md"),
      "# Test Skill",
      "utf-8"
    );
    fs.mkdirSync(path.join(tempDir, "registry"), { recursive: true });
    saveSkillsRegistry(tempDir, {
      "test-skill": {
        manifest: "manifests/test-skill.yaml",
        installed: true,
        enabled_global: false,
        enabled_projects: [],
        updated_at: "2024-01-01T00:00:00Z",
      },
    });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("disables skill globally via activator", () => {
    enableSkill(tempDir, "test-skill", "global");

    disable(tempDir, "test-skill", { global: true });

    const linkPath = path.join(tempDir, "runtime", "global", "test-skill");
    expect(fs.existsSync(linkPath)).toBe(false);

    const registry = loadSkillsRegistry(tempDir);
    expect(registry["test-skill"]!.enabled_global).toBe(false);
  });

  it("disables skill for a specific project", () => {
    enableSkill(tempDir, "test-skill", { project: "my-app" });

    disable(tempDir, "test-skill", { project: "my-app" });

    const linkPath = path.join(tempDir, "runtime", "projects", "my-app", "test-skill");
    expect(fs.existsSync(linkPath)).toBe(false);

    const registry = loadSkillsRegistry(tempDir);
    expect(registry["test-skill"]!.enabled_projects).not.toContain("my-app");
  });
});

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { enable } from "../../src/commands/enable.js";
import { loadSkillsRegistry, saveSkillsRegistry } from "../../src/services/registry.js";

describe("enable", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hk-skills-enable-test-"));
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
        source_id: "local-test-skill",
      },
    });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("enables skill globally via activator", () => {
    enable(tempDir, "test-skill", { global: true });

    const linkPath = path.join(tempDir, "runtime", "global", "test-skill");
    expect(fs.existsSync(linkPath)).toBe(true);
    expect(fs.lstatSync(linkPath).isSymbolicLink()).toBe(true);

    const registry = loadSkillsRegistry(tempDir);
    expect(registry["test-skill"]!.enabled_global).toBe(true);
  });

  it("enables skill for a specific project", () => {
    enable(tempDir, "test-skill", { project: "my-app" });

    const linkPath = path.join(tempDir, "runtime", "projects", "my-app", "test-skill");
    expect(fs.existsSync(linkPath)).toBe(true);
    expect(fs.lstatSync(linkPath).isSymbolicLink()).toBe(true);

    const registry = loadSkillsRegistry(tempDir);
    expect(registry["test-skill"]!.enabled_projects).toContain("my-app");
  });

  it("forwards a canonical identifier for absolute project paths", () => {
    enable(tempDir, "test-skill", { project: "/tmp/my-app" });

    const rawPath = path.join(tempDir, "runtime", "projects", "/tmp/my-app", "test-skill");
    expect(fs.existsSync(rawPath)).toBe(false);

    const registry = loadSkillsRegistry(tempDir);
    const projects = registry["test-skill"]!.enabled_projects;
    expect(projects.length).toBe(1);
    expect(projects[0]).not.toBe("/tmp/my-app");

    const projectsDir = path.join(tempDir, "runtime", "projects");
    const entries = fs.readdirSync(projectsDir);
    expect(entries.length).toBe(1);
    expect(entries[0]).not.toBe("/tmp/my-app");
    expect(fs.existsSync(path.join(projectsDir, entries[0]!, "test-skill"))).toBe(true);
  });
});

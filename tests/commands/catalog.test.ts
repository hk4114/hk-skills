import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { stringify } from "yaml";
import { catalog } from "../../src/commands/catalog.js";
import { saveSkillsRegistry } from "../../src/services/registry.js";

describe("catalog", () => {
  let tempDir: string;
  let logs: string[];
  let originalLog: typeof console.log;
  let originalWarn: typeof console.warn;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hk-skills-catalog-test-"));
    fs.mkdirSync(path.join(tempDir, "registry"), { recursive: true });
    fs.mkdirSync(path.join(tempDir, "manifests"), { recursive: true });

    logs = [];
    originalLog = console.log;
    originalWarn = console.warn;
    console.log = (msg: string) => {
      logs.push(msg);
    };
    console.warn = (msg: string) => {
      logs.push(msg);
    };
  });

  afterEach(() => {
    console.log = originalLog;
    console.warn = originalWarn;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("generates grouped markdown catalog", () => {
    saveSkillsRegistry(tempDir, {
      "test-skill-local": {
        manifest: "manifests/test-skill-local.yaml",
        installed: true,
        enabled_global: true,
        enabled_projects: [],
        updated_at: "2024-01-01T00:00:00Z",
      },
      "test-skill-remote": {
        manifest: "manifests/test-skill-remote.yaml",
        installed: true,
        enabled_global: false,
        enabled_projects: ["proj-a"],
        updated_at: "2024-01-02T00:00:00Z",
      },
      "test-skill-adapted": {
        manifest: "manifests/test-skill-adapted.yaml",
        installed: true,
        enabled_global: false,
        enabled_projects: [],
        updated_at: "2024-01-03T00:00:00Z",
      },
    });

    fs.writeFileSync(
      path.join(tempDir, "manifests", "test-skill-local.yaml"),
      stringify({
        name: "test-skill-local",
        display_name: "Test Skill Local",
        source: { type: "local" },
        status: { stage: "adapted" },
        capabilities: ["cap-a", "cap-b"],
        triggers: ["trigger-a"],
        scope: { recommended: "all" },
      }),
      "utf-8"
    );

    fs.writeFileSync(
      path.join(tempDir, "manifests", "test-skill-remote.yaml"),
      stringify({
        name: "test-skill-remote",
        display_name: "Test Skill Remote",
        source: { type: "remote" },
        status: { stage: "stable" },
        capabilities: ["cap-c"],
        triggers: ["trigger-b", "trigger-c"],
        scope: { recommended: "frontend" },
      }),
      "utf-8"
    );

    fs.writeFileSync(
      path.join(tempDir, "manifests", "test-skill-adapted.yaml"),
      stringify({
        name: "test-skill-adapted",
        display_name: "Test Skill Adapted",
        source: { type: "adapted" },
        status: { stage: "beta" },
        capabilities: ["cap-d"],
        triggers: ["trigger-d"],
        scope: { recommended: "backend" },
      }),
      "utf-8"
    );

    catalog(tempDir);

    const catalogPath = path.join(tempDir, "docs", "catalog.md");
    expect(fs.existsSync(catalogPath)).toBe(true);

    const content = fs.readFileSync(catalogPath, "utf-8");
    expect(content).toContain("## Local");
    expect(content).toContain("| Test Skill Local | local |");
    expect(content).toContain("## Remote");
    expect(content).toContain("| Test Skill Remote | remote |");
    expect(content).toContain("## Adapted");
  });

  it("shows empty catalog when registry is empty", () => {
    saveSkillsRegistry(tempDir, {});
    catalog(tempDir);

    const catalogPath = path.join(tempDir, "docs", "catalog.md");
    expect(fs.existsSync(catalogPath)).toBe(true);

    const content = fs.readFileSync(catalogPath, "utf-8");
    expect(content.toLowerCase()).toContain("no skills installed");
  });

  it("handles missing manifest gracefully", () => {
    saveSkillsRegistry(tempDir, {
      "missing-skill": {
        manifest: "manifests/missing-skill.yaml",
        installed: true,
        enabled_global: false,
        enabled_projects: [],
        updated_at: "2024-01-01T00:00:00Z",
      },
    });

    catalog(tempDir);

    const catalogPath = path.join(tempDir, "docs", "catalog.md");
    expect(fs.existsSync(catalogPath)).toBe(true);

    const content = fs.readFileSync(catalogPath, "utf-8");
    expect(content).toContain("missing-skill");
    const lowerContent = content.toLowerCase();
    expect(lowerContent.includes("unknown") || lowerContent.includes("error")).toBe(true);
  });

  it("renders enabled status correctly", () => {
    saveSkillsRegistry(tempDir, {
      "test-skill-local": {
        manifest: "manifests/test-skill-local.yaml",
        installed: true,
        enabled_global: true,
        enabled_projects: [],
        updated_at: "2024-01-01T00:00:00Z",
      },
      "test-skill-remote": {
        manifest: "manifests/test-skill-remote.yaml",
        installed: true,
        enabled_global: false,
        enabled_projects: ["proj-a"],
        updated_at: "2024-01-02T00:00:00Z",
      },
      "test-skill-adapted": {
        manifest: "manifests/test-skill-adapted.yaml",
        installed: true,
        enabled_global: false,
        enabled_projects: [],
        updated_at: "2024-01-03T00:00:00Z",
      },
    });

    fs.writeFileSync(
      path.join(tempDir, "manifests", "test-skill-local.yaml"),
      stringify({
        name: "test-skill-local",
        display_name: "Test Skill Local",
        source: { type: "local" },
        status: { stage: "adapted" },
      }),
      "utf-8"
    );

    fs.writeFileSync(
      path.join(tempDir, "manifests", "test-skill-remote.yaml"),
      stringify({
        name: "test-skill-remote",
        display_name: "Test Skill Remote",
        source: { type: "remote" },
        status: { stage: "stable" },
      }),
      "utf-8"
    );

    fs.writeFileSync(
      path.join(tempDir, "manifests", "test-skill-adapted.yaml"),
      stringify({
        name: "test-skill-adapted",
        display_name: "Test Skill Adapted",
        source: { type: "adapted" },
        status: { stage: "beta" },
      }),
      "utf-8"
    );

    catalog(tempDir);

    const catalogPath = path.join(tempDir, "docs", "catalog.md");
    const content = fs.readFileSync(catalogPath, "utf-8");

    expect(content).toContain("global");
    expect(content).toContain("项目: proj-a");
    expect(content).toContain("disabled");
  });
});

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { stringify } from "yaml";
import { list } from "../../src/commands/list.js";
import { saveSkillsRegistry } from "../../src/services/registry.js";

describe("list", () => {
  let tempDir: string;
  let logs: string[];
  let originalLog: typeof console.log;
  let originalWarn: typeof console.warn;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hk-skills-list-test-"));
    fs.mkdirSync(path.join(tempDir, "registry"), { recursive: true });
    fs.mkdirSync(path.join(tempDir, "manifests"), { recursive: true });

    saveSkillsRegistry(tempDir, {
      "test-skill": {
        manifest: "manifests/test-skill.yaml",
        installed: true,
        enabled_global: true,
        enabled_projects: ["proj-a"],
        updated_at: "2024-01-01T00:00:00Z",
      },
      "another-skill": {
        manifest: "manifests/another-skill.yaml",
        installed: true,
        enabled_global: false,
        enabled_projects: ["proj-b", "proj-c"],
        updated_at: "2024-01-02T00:00:00Z",
      },
      "disabled-skill": {
        manifest: "manifests/disabled-skill.yaml",
        installed: true,
        enabled_global: false,
        enabled_projects: [],
        updated_at: "2024-01-03T00:00:00Z",
      },
    });

    fs.writeFileSync(
      path.join(tempDir, "manifests", "test-skill.yaml"),
      stringify({
        name: "test-skill",
        source: { type: "remote" },
        status: { stage: "adapted" },
      }),
      "utf-8"
    );
    fs.writeFileSync(
      path.join(tempDir, "manifests", "another-skill.yaml"),
      stringify({
        name: "another-skill",
        source: { type: "local" },
        status: { stage: "adapted" },
      }),
      "utf-8"
    );
    fs.writeFileSync(
      path.join(tempDir, "manifests", "disabled-skill.yaml"),
      stringify({
        name: "disabled-skill",
        source: { type: "adapted" },
        status: { stage: "adapted" },
      }),
      "utf-8"
    );

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

  it("prints formatted table with NAME, SOURCE, STAGE, ENABLED columns", () => {
    list(tempDir);

    const header = logs.find((l) => l.includes("NAME") && l.includes("SOURCE") && l.includes("STAGE") && l.includes("ENABLED"));
    expect(header).toBeDefined();

    const testSkillRow = logs.find((l) => l.includes("test-skill") && l.includes("remote"));
    expect(testSkillRow).toBeDefined();
    expect(testSkillRow).toContain("global");

    const anotherSkillRow = logs.find((l) => l.includes("another-skill") && l.includes("local"));
    expect(anotherSkillRow).toBeDefined();
    expect(anotherSkillRow).toContain("proj-b,proj-c");

    const disabledSkillRow = logs.find((l) => l.includes("disabled-skill") && l.includes("adapted"));
    expect(disabledSkillRow).toBeDefined();
    expect(disabledSkillRow).toContain("no");
  });

  it("shows no skills message when registry is empty", () => {
    saveSkillsRegistry(tempDir, {});
    list(tempDir);

    expect(logs.some((l) => l.includes("No skills installed"))).toBe(true);
  });
});

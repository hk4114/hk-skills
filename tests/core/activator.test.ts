import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { enableSkill, disableSkill } from "../../src/core/activator.js";
import {
  loadSkillsRegistry,
  saveSkillsRegistry,
} from "../../src/services/registry.js";
import type { SkillsRegistry, RegistryEntry } from "../../src/models/registry.js";

function createSkillEntry(name: string): RegistryEntry {
  return {
    manifest: `manifests/${name}.yaml`,
    installed: true,
    enabled_global: false,
    enabled_projects: [],
    updated_at: "2024-01-01T00:00:00Z",
    source_id: `local-${name}`,
  };
}

function getEntry(registry: SkillsRegistry, name: string): RegistryEntry {
  const entry = registry[name];
  if (!entry) {
    throw new Error(`Missing registry entry for ${name}`);
  }
  return entry;
}

describe("activator", () => {
  let tempDir: string;
  const originalCwd = process.cwd();

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hk-skills-activator-"));
    process.chdir(tempDir);
    fs.mkdirSync(path.join(tempDir, "warehouse", "adapted", "test-skill"), {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(tempDir, "warehouse", "adapted", "test-skill", "SKILL.md"),
      "---\nname: test-skill\n---\n# Test Skill",
      "utf-8"
    );
    saveSkillsRegistry(tempDir, {
      "test-skill": createSkillEntry("test-skill"),
    });
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe("enableSkill", () => {
    it("enables globally creates symlink and updates registry", () => {
      enableSkill(tempDir, "test-skill", "global");

      const linkPath = path.join(tempDir, "runtime", "global", "test-skill");
      expect(fs.existsSync(linkPath)).toBe(true);
      expect(fs.lstatSync(linkPath).isSymbolicLink()).toBe(true);
      expect(fs.readlinkSync(linkPath)).toBe(
        path.join(tempDir, "warehouse", "adapted", "test-skill")
      );

      const registry = loadSkillsRegistry(tempDir);
      expect(getEntry(registry, "test-skill").enabled_global).toBe(true);
    });

    it("enables for project creates symlink and updates registry", () => {
      enableSkill(tempDir, "test-skill", { project: "my-app" });

      const linkPath = path.join(
        tempDir,
        "runtime",
        "projects",
        "my-app",
        "test-skill"
      );
      expect(fs.existsSync(linkPath)).toBe(true);
      expect(fs.lstatSync(linkPath).isSymbolicLink()).toBe(true);

      const agentsLinkPath = path.join(tempDir, "my-app", ".agents", "skills", "test-skill");
      expect(fs.existsSync(agentsLinkPath)).toBe(true);
      expect(fs.lstatSync(agentsLinkPath).isSymbolicLink()).toBe(true);
      expect(fs.readlinkSync(agentsLinkPath)).toBe(
        path.join(tempDir, "warehouse", "adapted", "test-skill")
      );

      const registry = loadSkillsRegistry(tempDir);
      expect(getEntry(registry, "test-skill").enabled_projects).toContain("my-app");
    });

    it("is idempotent when already enabled", () => {
      enableSkill(tempDir, "test-skill", "global");
      const firstUpdatedAt = getEntry(loadSkillsRegistry(tempDir), "test-skill")
        .updated_at;

      const start = Date.now();
      while (Date.now() - start < 10) {
      }

      enableSkill(tempDir, "test-skill", "global");
      const registry = loadSkillsRegistry(tempDir);
      expect(getEntry(registry, "test-skill").enabled_global).toBe(true);
      expect(getEntry(registry, "test-skill").updated_at).toBe(firstUpdatedAt);
    });

    it("is idempotent for project scope when symlinks already exist", () => {
      enableSkill(tempDir, "test-skill", { project: "my-app" });
      const firstUpdatedAt = getEntry(loadSkillsRegistry(tempDir), "test-skill")
        .updated_at;

      const start = Date.now();
      while (Date.now() - start < 10) {
      }

      enableSkill(tempDir, "test-skill", { project: "my-app" });
      const registry = loadSkillsRegistry(tempDir);
      expect(getEntry(registry, "test-skill").enabled_projects).toContain("my-app");
      expect(getEntry(registry, "test-skill").updated_at).toBe(firstUpdatedAt);
    });

    it("throws when project agents symlink points to wrong target", () => {
      fs.mkdirSync(path.join(tempDir, "my-app", ".agents", "skills"), { recursive: true });
      fs.symlinkSync(
        path.join(tempDir, "warehouse", "adapted", "other-skill"),
        path.join(tempDir, "my-app", ".agents", "skills", "test-skill")
      );
      expect(() => enableSkill(tempDir, "test-skill", { project: "my-app" })).toThrow(
        'already exists'
      );
    });

    it("throws when skill is not installed", () => {
      saveSkillsRegistry(tempDir, {});
      expect(() => enableSkill(tempDir, "test-skill", "global")).toThrow(
        'Skill "test-skill" is not installed'
      );
    });

    it("throws when skill source does not exist", () => {
      fs.rmSync(path.join(tempDir, "warehouse", "adapted", "test-skill"), {
        recursive: true,
        force: true,
      });
      expect(() => enableSkill(tempDir, "test-skill", "global")).toThrow(
        "Skill source not found"
      );
    });

    it("falls back to local source when adapted is missing", () => {
      fs.rmSync(path.join(tempDir, "warehouse", "adapted", "test-skill"), {
        recursive: true,
        force: true,
      });
      fs.mkdirSync(path.join(tempDir, "warehouse", "local", "test-skill"), {
        recursive: true,
      });
      fs.writeFileSync(
        path.join(tempDir, "warehouse", "local", "test-skill", "SKILL.md"),
        "---\nname: test-skill\n---\n# Local Test Skill",
        "utf-8"
      );

      enableSkill(tempDir, "test-skill", "global");
      const linkPath = path.join(tempDir, "runtime", "global", "test-skill");
      expect(fs.readlinkSync(linkPath)).toBe(
        path.join(tempDir, "warehouse", "local", "test-skill")
      );
    });

    it("prefers adapted over local source", () => {
      fs.mkdirSync(path.join(tempDir, "warehouse", "local", "test-skill"), {
        recursive: true,
      });
      fs.writeFileSync(
        path.join(tempDir, "warehouse", "local", "test-skill", "SKILL.md"),
        "---\nname: test-skill\n---\n# Local Test Skill",
        "utf-8"
      );

      enableSkill(tempDir, "test-skill", "global");
      const linkPath = path.join(tempDir, "runtime", "global", "test-skill");
      expect(fs.readlinkSync(linkPath)).toBe(
        path.join(tempDir, "warehouse", "adapted", "test-skill")
      );
    });

    it("encodes project path with dot segments for runtime directory", () => {
      enableSkill(tempDir, "test-skill", { project: "./my-app/" });

      const badPath = path.join(tempDir, "runtime", "projects", "./my-app/", "test-skill");
      expect(fs.existsSync(badPath)).toBe(false);

      const projectsDir = path.join(tempDir, "runtime", "projects");
      const entries = fs.readdirSync(projectsDir);
      expect(entries.length).toBe(1);
      expect(entries[0]).not.toBe("./my-app/");

      const linkPath = path.join(projectsDir, entries[0]!, "test-skill");
      expect(fs.existsSync(linkPath)).toBe(true);
      expect(fs.lstatSync(linkPath).isSymbolicLink()).toBe(true);

      const agentsLinkPath = path.join(tempDir, "my-app", ".agents", "skills", "test-skill");
      expect(fs.existsSync(agentsLinkPath)).toBe(true);
      expect(fs.lstatSync(agentsLinkPath).isSymbolicLink()).toBe(true);
    });

    it("creates distinct runtime directories for same basename in different parent paths", () => {
      const projectA = path.join(tempDir, "work", "a", "client");
      const projectB = path.join(tempDir, "work", "b", "client");
      enableSkill(tempDir, "test-skill", { project: projectA });
      enableSkill(tempDir, "test-skill", { project: projectB });

      const projectsDir = path.join(tempDir, "runtime", "projects");
      const entries = fs.readdirSync(projectsDir);
      expect(entries.length).toBe(2);

      const registry = loadSkillsRegistry(tempDir);
      expect(getEntry(registry, "test-skill").enabled_projects.length).toBe(2);

      const agentsLinkA = path.join(projectA, ".agents", "skills", "test-skill");
      const agentsLinkB = path.join(projectB, ".agents", "skills", "test-skill");
      expect(fs.existsSync(agentsLinkA)).toBe(true);
      expect(fs.lstatSync(agentsLinkA).isSymbolicLink()).toBe(true);
      expect(fs.existsSync(agentsLinkB)).toBe(true);
      expect(fs.lstatSync(agentsLinkB).isSymbolicLink()).toBe(true);
    });
  });

  describe("disableSkill", () => {
    it("disables globally removes symlink and updates registry", () => {
      enableSkill(tempDir, "test-skill", "global");
      disableSkill(tempDir, "test-skill", "global");

      const linkPath = path.join(tempDir, "runtime", "global", "test-skill");
      expect(fs.existsSync(linkPath)).toBe(false);

      const registry = loadSkillsRegistry(tempDir);
      expect(getEntry(registry, "test-skill").enabled_global).toBe(false);
    });

    it("disables for project removes symlink and updates registry", () => {
      enableSkill(tempDir, "test-skill", { project: "my-app" });
      disableSkill(tempDir, "test-skill", { project: "my-app" });

      const linkPath = path.join(
        tempDir,
        "runtime",
        "projects",
        "my-app",
        "test-skill"
      );
      expect(fs.existsSync(linkPath)).toBe(false);

      const agentsLinkPath = path.join(tempDir, "my-app", ".agents", "skills", "test-skill");
      expect(fs.existsSync(agentsLinkPath)).toBe(false);

      const registry = loadSkillsRegistry(tempDir);
      expect(getEntry(registry, "test-skill").enabled_projects).not.toContain("my-app");
    });

    it("throws when skill is not enabled for the given scope", () => {
      expect(() => disableSkill(tempDir, "test-skill", "global")).toThrow(
        'Skill "test-skill" is not enabled for the given scope'
      );
    });

    it("throws when project agents path exists but is not a symlink", () => {
      enableSkill(tempDir, "test-skill", { project: "my-app" });
      fs.unlinkSync(path.join(tempDir, "my-app", ".agents", "skills", "test-skill"));
      fs.mkdirSync(path.join(tempDir, "my-app", ".agents", "skills", "test-skill"), { recursive: true });

      expect(() => disableSkill(tempDir, "test-skill", { project: "my-app" })).toThrow(
        'not a symbolic link'
      );
    });
  });
});

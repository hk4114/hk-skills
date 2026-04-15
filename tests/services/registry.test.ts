import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  loadSkillsRegistry,
  saveSkillsRegistry,
  loadSourcesRegistry,
  saveSourcesRegistry,
  loadProjectsRegistry,
  saveProjectsRegistry,
} from "../../src/services/registry.js";

describe("registry service", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hk-skills-registry-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe("skills registry", () => {
    it("should roundtrip save and load", () => {
      const data = {
        "test-skill": {
          manifest: "test-manifest.json",
          installed: true,
          enabled_global: false,
          enabled_projects: ["proj-a"],
          updated_at: "2024-01-01T00:00:00Z",
          source_id: "test-source",
        },
      };
      saveSkillsRegistry(tempDir, data);
      const loaded = loadSkillsRegistry(tempDir);
      expect(loaded).toEqual(data);
    });

    it("should roundtrip with source_id and subpath", () => {
      const data = {
        "test-skill": {
          manifest: "test-manifest.json",
          installed: true,
          enabled_global: false,
          enabled_projects: ["proj-a"],
          updated_at: "2024-01-01T00:00:00Z",
          source_id: "test-source",
          subpath: "skills/test-skill",
        },
      };
      saveSkillsRegistry(tempDir, data);
      const loaded = loadSkillsRegistry(tempDir);
      expect(loaded).toEqual(data);
    });

    it("should return empty object when file is missing", () => {
      const loaded = loadSkillsRegistry(tempDir);
      expect(loaded).toEqual({});
    });
  });

  describe("sources registry", () => {
    it("should roundtrip save and load with SourceRegistryEntry objects keyed by source_id", () => {
      const data = {
        "test-source": {
          type: "remote" as const,
          repo: "https://github.com/test/repo",
          ref: "main",
          commit: "abc123",
          local_path: "warehouse/remote/test-source",
        },
      };
      saveSourcesRegistry(tempDir, data);
      const loaded = loadSourcesRegistry(tempDir);
      expect(loaded).toEqual(data);
    });

    it("should roundtrip local source entries", () => {
      const data = {
        "local-source": {
          type: "local" as const,
          local_path: "/home/user/skills",
        },
      };
      saveSourcesRegistry(tempDir, data);
      const loaded = loadSourcesRegistry(tempDir);
      expect(loaded).toEqual(data);
    });

    it("should return empty object when file is missing", () => {
      const loaded = loadSourcesRegistry(tempDir);
      expect(loaded).toEqual({});
    });
  });

  describe("projects registry", () => {
    it("should roundtrip save and load", () => {
      const data = {
        "proj-a": {
          path: "/home/user/proj-a",
          skills: ["skill-1", "skill-2"],
        },
      };
      saveProjectsRegistry(tempDir, data);
      const loaded = loadProjectsRegistry(tempDir);
      expect(loaded).toEqual(data);
    });

    it("should return empty object when file is missing", () => {
      const loaded = loadProjectsRegistry(tempDir);
      expect(loaded).toEqual({});
    });
  });

  describe("atomic write", () => {
    it("should leave original file untouched if write fails", () => {
      const initialData = { "skill-a": { manifest: "a.json", installed: true, enabled_global: true, enabled_projects: [], updated_at: "2024-01-01T00:00:00Z", source_id: "source-a" } };
      saveSkillsRegistry(tempDir, initialData);

      const originalWriteFileSync = fs.writeFileSync;
      fs.writeFileSync = () => {
        throw new Error("disk full");
      };

      try {
        expect(() => saveSkillsRegistry(tempDir, { "skill-b": { manifest: "b.json", installed: false, enabled_global: false, enabled_projects: [], updated_at: "2024-02-01T00:00:00Z", source_id: "source-b" } })).toThrow();
        const loaded = loadSkillsRegistry(tempDir);
        expect(loaded).toEqual(initialData);
      } finally {
        fs.writeFileSync = originalWriteFileSync;
      }
    });
  });

  describe("invalid data", () => {
    it("should throw for invalid JSON", () => {
      const registryDir = path.join(tempDir, "registry");
      fs.mkdirSync(registryDir, { recursive: true });
      fs.writeFileSync(path.join(registryDir, "skills.json"), "not json", "utf-8");
      expect(() => loadSkillsRegistry(tempDir)).toThrow("Invalid JSON");
    });

    it("should throw for schema validation failure", () => {
      const registryDir = path.join(tempDir, "registry");
      fs.mkdirSync(registryDir, { recursive: true });
      fs.writeFileSync(
        path.join(registryDir, "skills.json"),
        JSON.stringify({ "bad-skill": { manifest: 123 } }),
        "utf-8"
      );
      expect(() => loadSkillsRegistry(tempDir)).toThrow("Schema validation failed");
    });
  });
});

import { describe, it, expect } from "bun:test";
import {
  SkillsRegistrySchema,
  RegistryEntrySchema,
  SourceRegistryEntrySchema,
  SourcesRegistrySchema,
} from "../../src/models/registry.js";

describe("SkillsRegistrySchema", () => {
  it("validates a valid skills registry", () => {
    const registry = {
      "repo-analyzer": {
        manifest: "manifests/repo-analyzer.yaml",
        installed: true,
        enabled_global: false,
        enabled_projects: ["my-app"],
        updated_at: "2026-04-14T10:00:00Z",
        source_id: "default",
      },
    };

    const result = SkillsRegistrySchema.safeParse(registry);
    expect(result.success).toBe(true);
  });

  it("fails when installed is missing", () => {
    const registry = {
      "repo-analyzer": {
        manifest: "manifests/repo-analyzer.yaml",
        enabled_global: false,
        enabled_projects: ["my-app"],
        updated_at: "2026-04-14T10:00:00Z",
        source_id: "default",
      },
    };

    const result = SkillsRegistrySchema.safeParse(registry);
    expect(result.success).toBe(false);
  });

  it("validates an empty registry", () => {
    const registry = {};

    const result = SkillsRegistrySchema.safeParse(registry);
    expect(result.success).toBe(true);
  });
});

describe("RegistryEntrySchema", () => {
  it("validates a valid entry with source_id and subpath", () => {
    const entry = {
      manifest: "manifests/repo-analyzer.yaml",
      installed: true,
      enabled_global: false,
      enabled_projects: ["my-app"],
      updated_at: "2026-04-14T10:00:00Z",
      source_id: "default",
      subpath: "skills/repo-analyzer",
    };

    const result = RegistryEntrySchema.safeParse(entry);
    expect(result.success).toBe(true);
  });

  it("validates a valid entry with source_id only", () => {
    const entry = {
      manifest: "manifests/repo-analyzer.yaml",
      installed: true,
      enabled_global: false,
      enabled_projects: ["my-app"],
      updated_at: "2026-04-14T10:00:00Z",
      source_id: "default",
    };

    const result = RegistryEntrySchema.safeParse(entry);
    expect(result.success).toBe(true);
  });

  it("fails when source_id is missing", () => {
    const entry = {
      manifest: "manifests/repo-analyzer.yaml",
      installed: true,
      enabled_global: false,
      enabled_projects: ["my-app"],
      updated_at: "2026-04-14T10:00:00Z",
    };

    const result = RegistryEntrySchema.safeParse(entry);
    expect(result.success).toBe(false);
  });
});

describe("SourceRegistryEntrySchema", () => {
  it("validates a remote source entry", () => {
    const entry = {
      type: "remote",
      repo: "https://github.com/user/repo",
      ref: "main",
      commit: "abc123",
      local_path: "warehouse/remote/repo",
    };

    const result = SourceRegistryEntrySchema.safeParse(entry);
    expect(result.success).toBe(true);
  });

  it("validates a local source entry", () => {
    const entry = {
      type: "local",
      local_path: "/path/to/local/skill",
    };

    const result = SourceRegistryEntrySchema.safeParse(entry);
    expect(result.success).toBe(true);
  });

  it("fails when type is invalid", () => {
    const entry = {
      type: "invalid",
      local_path: "/path/to/local/skill",
    };

    const result = SourceRegistryEntrySchema.safeParse(entry);
    expect(result.success).toBe(false);
  });

  it("fails when local_path is missing", () => {
    const entry = {
      type: "remote",
      repo: "https://github.com/user/repo",
    };

    const result = SourceRegistryEntrySchema.safeParse(entry);
    expect(result.success).toBe(false);
  });
});

describe("SourcesRegistrySchema", () => {
  it("validates a registry keyed by source_id", () => {
    const registry = {
      "default": {
        type: "remote",
        repo: "https://github.com/user/repo",
        ref: "main",
        commit: "abc123",
        local_path: "warehouse/remote/repo",
      },
      "local-source": {
        type: "local",
        local_path: "/path/to/local/skill",
      },
    };

    const result = SourcesRegistrySchema.safeParse(registry);
    expect(result.success).toBe(true);
  });

  it("validates an empty registry", () => {
    const registry = {};

    const result = SourcesRegistrySchema.safeParse(registry);
    expect(result.success).toBe(true);
  });
});

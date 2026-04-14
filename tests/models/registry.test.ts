import { describe, it, expect } from "bun:test";
import {
  SkillsRegistrySchema,
  RegistryEntrySchema,
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
  it("validates a valid entry", () => {
    const entry = {
      manifest: "manifests/repo-analyzer.yaml",
      installed: true,
      enabled_global: false,
      enabled_projects: ["my-app"],
      updated_at: "2026-04-14T10:00:00Z",
    };

    const result = RegistryEntrySchema.safeParse(entry);
    expect(result.success).toBe(true);
  });
});

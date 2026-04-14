import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { init } from "../../src/commands/init.js";
import { loadSkillsRegistry } from "../../src/services/registry.js";

describe("migration", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "hk-skills-migration-test-")
    );

    const customSkillDir = path.join(tempDir, "custom", "my-skill");
    fs.mkdirSync(customSkillDir, { recursive: true });
    fs.writeFileSync(
      path.join(customSkillDir, "SKILL.md"),
      `---\nname: my-skill\n---\n\n# my-skill\n`,
      "utf-8"
    );

    const digitalMeDir = path.join(tempDir, "custom", "digital-me");
    fs.mkdirSync(digitalMeDir, { recursive: true });
    fs.writeFileSync(
      path.join(digitalMeDir, "readme.md"),
      "# digital-me\n",
      "utf-8"
    );

    const oldSkillDir = path.join(tempDir, "skills", "old-skill");
    fs.mkdirSync(oldSkillDir, { recursive: true });
    fs.writeFileSync(
      path.join(oldSkillDir, "SKILL.md"),
      `---\nname: old-skill\n---\n\n# old-skill\n`,
      "utf-8"
    );

    const remoteDir = path.join(tempDir, "remote");
    fs.mkdirSync(remoteDir, { recursive: true });
    fs.writeFileSync(
      path.join(remoteDir, "menu.md"),
      `# Remote Skill Sources\n\n| Skill | Repo | Ref | Upstream Path | Staged Path | URL |\n| --- | --- | --- | --- | --- | --- |\n`,
      "utf-8"
    );
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("migrates legacy structure and is idempotent", () => {
    init(tempDir);

    const registry = loadSkillsRegistry(tempDir);
    expect(Object.keys(registry).length).toBe(3);
    expect(registry["my-skill"]).toBeDefined();
    expect(registry["digital-me"]).toBeDefined();
    expect(registry["old-skill"]).toBeDefined();

    const manifestFiles = fs.readdirSync(path.join(tempDir, "manifests"));
    expect(manifestFiles.length).toBe(3);
    expect(manifestFiles).toContain("my-skill.yaml");
    expect(manifestFiles).toContain("digital-me.yaml");
    expect(manifestFiles).toContain("old-skill.yaml");

    expect(
      fs.existsSync(path.join(tempDir, "warehouse", "adapted", "my-skill", "SKILL.md"))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(tempDir, "warehouse", "adapted", "old-skill", "SKILL.md"))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(tempDir, "warehouse", "local", "digital-me", "readme.md"))
    ).toBe(true);

    init(tempDir);

    const registryAfterSecondInit = loadSkillsRegistry(tempDir);
    const allKeys = Object.keys(registryAfterSecondInit);
    const uniqueKeys = [...new Set(allKeys)];
    expect(allKeys.length).toBe(uniqueKeys.length);
    expect(allKeys.length).toBe(3);
  });
});

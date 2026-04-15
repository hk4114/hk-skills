import { describe, it, expect, beforeEach, afterEach, spyOn } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { parse } from "yaml";
import { init } from "../../src/commands/init.js";
import { install } from "../../src/commands/install.js";
import { update } from "../../src/commands/update.js";
import { removeSkill } from "../../src/commands/remove.js";
import { enableSkill } from "../../src/core/activator.js";
import { loadSkillsRegistry, loadSourcesRegistry } from "../../src/services/registry.js";
import * as fetcher from "../../src/core/fetcher.js";

describe("shared-source-lifecycle", () => {
  let tempDir: string;
  let fetchRemoteSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "hk-skills-shared-source-test-")
    );
  });

  afterEach(() => {
    if (fetchRemoteSpy) fetchRemoteSpy.mockRestore();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("installs two skills from same repo, updates one, removes one, keeps source for the other", async () => {
    init(tempDir);

    const repoUrl = "https://github.com/user/mono-repo";
    const source_id = "github.com_user_mono-repo@main";
    let fetchCount = 0;

    fetchRemoteSpy = spyOn(fetcher, "fetchRemote").mockImplementation(async (root, url, ref) => {
      const targetPath = path.join(root, "warehouse", "remote", source_id);
      fs.mkdirSync(path.join(targetPath, "packages", "skill-a"), { recursive: true });
      fs.writeFileSync(
        path.join(targetPath, "packages", "skill-a", "SKILL.md"),
        `---\nname: skill-a\n---\n\n# skill-a\n`,
        "utf-8"
      );
      fs.mkdirSync(path.join(targetPath, "packages", "skill-b"), { recursive: true });
      fs.writeFileSync(
        path.join(targetPath, "packages", "skill-b", "SKILL.md"),
        `---\nname: skill-b\n---\n\n# skill-b\n`,
        "utf-8"
      );
      const commit = fetchCount < 2 ? "abc123" : "def456";
      fetchCount++;
      return { source_id, name: "mono-repo", repoUrl: url, ref: ref ?? "main", commit };
    });

    await install(tempDir, repoUrl, { subpath: "packages/skill-a" });
    await install(tempDir, repoUrl, { subpath: "packages/skill-b" });

    const registryAfterInstall = loadSkillsRegistry(tempDir);
    expect(registryAfterInstall["skill-a"]).toBeDefined();
    expect(registryAfterInstall["skill-b"]).toBeDefined();
    expect(registryAfterInstall["skill-a"]!.source_id).toBe(source_id);
    expect(registryAfterInstall["skill-b"]!.source_id).toBe(source_id);

    const sourcesAfterInstall = loadSourcesRegistry(tempDir);
    expect(Object.keys(sourcesAfterInstall).length).toBe(1);
    expect(sourcesAfterInstall[source_id]).toBeDefined();
    expect(sourcesAfterInstall[source_id]!.type).toBe("remote");
    expect(sourcesAfterInstall[source_id]!.repo).toBe(repoUrl);
    expect(sourcesAfterInstall[source_id]!.commit).toBe("abc123");

    enableSkill(tempDir, "skill-a", "global");
    enableSkill(tempDir, "skill-b", "global");

    const linkPathA = path.join(tempDir, "runtime", "global", "skill-a");
    const linkPathB = path.join(tempDir, "runtime", "global", "skill-b");
    expect(fs.existsSync(linkPathA)).toBe(true);
    expect(fs.existsSync(linkPathB)).toBe(true);

    await update(tempDir, "skill-a", {});

    const manifestPathA = path.join(tempDir, "manifests", "skill-a.yaml");
    const manifestA = parse(fs.readFileSync(manifestPathA, "utf-8")) as Record<string, unknown>;
    expect((manifestA.source as Record<string, string>).commit).toBe("def456");

    const sourcesAfterUpdate = loadSourcesRegistry(tempDir);
    expect(sourcesAfterUpdate[source_id]!.commit).toBe("def456");

    expect(fs.existsSync(linkPathA)).toBe(true);
    expect(fs.lstatSync(linkPathA).isSymbolicLink()).toBe(true);
    expect(fs.existsSync(linkPathB)).toBe(true);
    expect(fs.lstatSync(linkPathB).isSymbolicLink()).toBe(true);

    await removeSkill(tempDir, "skill-a", { yes: true });

    const registryAfterRemove = loadSkillsRegistry(tempDir);
    expect(registryAfterRemove["skill-a"]).toBeUndefined();
    expect(registryAfterRemove["skill-b"]).toBeDefined();
    expect(registryAfterRemove["skill-b"]!.installed).toBe(true);

    const sourcesAfterRemove = loadSourcesRegistry(tempDir);
    expect(sourcesAfterRemove[source_id]).toBeDefined();
    expect(sourcesAfterRemove[source_id]!.type).toBe("remote");

    const remotePath = path.join(tempDir, "warehouse", "remote", source_id);
    expect(fs.existsSync(remotePath)).toBe(true);
    expect(fs.existsSync(path.join(remotePath, "packages", "skill-b", "SKILL.md"))).toBe(true);

    expect(fs.existsSync(linkPathA)).toBe(false);
    expect(fs.existsSync(linkPathB)).toBe(true);
    expect(fs.lstatSync(linkPathB).isSymbolicLink()).toBe(true);
  });
});

import { describe, it, expect, beforeEach, afterEach, spyOn } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { Command } from "commander";
import { install } from "../../src/commands/install.js";
import {
  loadSkillsRegistry,
  saveSkillsRegistry,
  loadSourcesRegistry,
} from "../../src/services/registry.js";
import * as fetcher from "../../src/core/fetcher.js";
import * as vetter from "../../src/core/vetter.js";
import { getWarehousePath } from "../../src/utils/paths.js";

function createTempRoot(): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hk-skills-install-test-"));
  fs.mkdirSync(path.join(tempDir, "registry"), { recursive: true });
  fs.mkdirSync(path.join(tempDir, "manifests"), { recursive: true });
  fs.mkdirSync(path.join(tempDir, "warehouse", "remote"), { recursive: true });
  fs.mkdirSync(path.join(tempDir, "warehouse", "local"), { recursive: true });
  fs.mkdirSync(path.join(tempDir, "warehouse", "adapted"), { recursive: true });
  saveSkillsRegistry(tempDir, {});
  return tempDir;
}

describe("install", () => {
  let tempDir: string;
  let fetchRemoteSpy: ReturnType<typeof spyOn>;
  let fetchLocalSpy: ReturnType<typeof spyOn>;
  let vetSpy: ReturnType<typeof spyOn>;
  let exitSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    tempDir = createTempRoot();
    fetchRemoteSpy = spyOn(fetcher, "fetchRemote").mockImplementation(async (root, repoUrl) => {
      const name = "test-remote-skill";
      const source_id = "github.com_example_test-remote-skill@main";
      const targetPath = path.join(getWarehousePath(root, "remote"), source_id);
      fs.mkdirSync(targetPath, { recursive: true });
      fs.writeFileSync(
        path.join(targetPath, "SKILL.md"),
        `---\nname: ${name}\n---\n\n# ${name}\n`,
        "utf-8"
      );
      return { source_id, name, repoUrl, ref: "main", commit: "abc123" };
    });
    fetchLocalSpy = spyOn(fetcher, "fetchLocal").mockImplementation(async (root, localPath) => {
      const name = path.basename(localPath);
      const targetPath = path.join(getWarehousePath(root, "local"), name);
      fs.mkdirSync(targetPath, { recursive: true });
      fs.writeFileSync(
        path.join(targetPath, "SKILL.md"),
        `---\nname: ${name}\n---\n\n# ${name}\n`,
        "utf-8"
      );
      return name;
    });
    vetSpy = spyOn(vetter, "vet").mockRestore();
    exitSpy = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
  });

  afterEach(() => {
    fetchRemoteSpy.mockRestore();
    fetchLocalSpy.mockRestore();
    if (vetSpy) vetSpy.mockRestore();
    if (exitSpy) exitSpy.mockRestore();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("installs from remote URL and registers skill with source_id", async () => {
    vetSpy.mockRestore();
    exitSpy.mockRestore();

    await install(tempDir, "https://github.com/example/test-remote-skill.git");

    expect(fetchRemoteSpy).toHaveBeenCalledWith(tempDir, "https://github.com/example/test-remote-skill.git");

    const registry = loadSkillsRegistry(tempDir);
    expect(registry["test-remote-skill"]).toBeDefined();
    expect(registry["test-remote-skill"]!.installed).toBe(true);
    expect(registry["test-remote-skill"]!.manifest).toBe("manifests/test-remote-skill.yaml");
    expect(registry["test-remote-skill"]!.source_id).toBe("github.com_example_test-remote-skill@main");

    const sources = loadSourcesRegistry(tempDir);
    expect(sources["github.com_example_test-remote-skill@main"]).toEqual({
      type: "remote",
      repo: "https://github.com/example/test-remote-skill.git",
      ref: "main",
      commit: "abc123",
      local_path: "warehouse/remote/github.com_example_test-remote-skill@main",
    });

    const manifestPath = path.join(tempDir, "manifests", "test-remote-skill.yaml");
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    expect(manifestContent).toContain("commit: abc123");
  });

  it("installs from local path and registers skill with synthetic source_id", async () => {
    const localSkillPath = path.join(tempDir, "my-local-skill");
    fs.mkdirSync(localSkillPath, { recursive: true });
    fs.writeFileSync(
      path.join(localSkillPath, "SKILL.md"),
      `---\nname: my-local-skill\n---\n\n# my-local-skill\n`,
      "utf-8"
    );
    vetSpy.mockRestore();
    exitSpy.mockRestore();

    await install(tempDir, localSkillPath, { local: true });

    expect(fetchLocalSpy).toHaveBeenCalledWith(tempDir, localSkillPath);

    const registry = loadSkillsRegistry(tempDir);
    expect(registry["my-local-skill"]).toBeDefined();
    expect(registry["my-local-skill"]!.installed).toBe(true);
    expect(registry["my-local-skill"]!.source_id).toBe("local-my-local-skill");

    const sources = loadSourcesRegistry(tempDir);
    expect(sources["local-my-local-skill"]).toEqual({
      type: "local",
      local_path: "warehouse/local/my-local-skill",
    });
  });

  it("rolls back fetched directory when vet fails", async () => {
    vetSpy = spyOn(vetter, "vet").mockReturnValue({
      passed: false,
      warnings: [],
      errors: ["Missing SKILL.md"],
    });

    const fetchedPath = path.join(getWarehousePath(tempDir, "remote"), "github.com_example_test-remote-skill@main");

    await expect(
      install(tempDir, "https://github.com/example/test-remote-skill.git")
    ).rejects.toThrow("process.exit called");

    expect(fs.existsSync(fetchedPath)).toBe(false);
  });

  it("skips registration if skill already exists in registry", async () => {
    vetSpy.mockRestore();
    exitSpy.mockRestore();

    saveSkillsRegistry(tempDir, {
      "test-remote-skill": {
        manifest: "manifests/test-remote-skill.yaml",
        installed: true,
        enabled_global: false,
        enabled_projects: [],
        updated_at: "2024-01-01T00:00:00Z",
        source_id: "github.com_example_test-remote-skill@main",
      },
    });

    await install(tempDir, "https://github.com/example/test-remote-skill.git");

    const registry = loadSkillsRegistry(tempDir);
    expect(registry["test-remote-skill"]!.updated_at).toBe("2024-01-01T00:00:00Z");
  });

  it("vets and adapts subpath directory when subpath option is provided", async () => {
    vetSpy.mockRestore();
    exitSpy.mockRestore();
    fetchRemoteSpy.mockRestore();

    const source_id = "github.com_example_test-remote-skill@main";
    const subpath = "packages/foo";

    fetchRemoteSpy = spyOn(fetcher, "fetchRemote").mockImplementation(async (root, repoUrl) => {
      const name = "test-remote-skill";
      const targetPath = path.join(getWarehousePath(root, "remote"), source_id);
      fs.mkdirSync(path.join(targetPath, subpath), { recursive: true });
      fs.writeFileSync(
        path.join(targetPath, subpath, "SKILL.md"),
        `---\nname: ${name}\n---\n\n# ${name}\n`,
        "utf-8"
      );
      return { source_id, name, repoUrl, ref: "main", commit: "abc123" };
    });

    const vetCalls: string[] = [];
    spyOn(vetter, "vet").mockImplementation((targetPath: string) => {
      vetCalls.push(targetPath);
      return { passed: true, warnings: [], errors: [] };
    });

    await install(tempDir, "https://github.com/example/test-remote-skill.git", { subpath });

    expect(fetchRemoteSpy).toHaveBeenCalledWith(tempDir, "https://github.com/example/test-remote-skill.git");

    const expectedSubpath = path.join(getWarehousePath(tempDir, "remote"), source_id, subpath);
    expect(vetCalls).toContain(expectedSubpath);

    const registry = loadSkillsRegistry(tempDir);
    expect(registry["test-remote-skill"]).toBeDefined();
    expect(registry["test-remote-skill"]!.source_id).toBe(source_id);
    expect(registry["test-remote-skill"]!.subpath).toBe(subpath);

    const sources = loadSourcesRegistry(tempDir);
    expect(sources[source_id]).toBeDefined();
    expect(sources[source_id]!.local_path).toBe(`warehouse/remote/${source_id}`);
  });

  it("parses --subpath CLI option and forwards it to install", async () => {
    const installSpy = spyOn(await import("../../src/commands/install.js"), "install").mockImplementation(async () => {});

    const program = new Command();
    program
      .command("install <source>")
      .option("--local", "Treat source as a local path")
      .option("--subpath <path>", "Subpath within the repository")
      .action(async (source: string, options: { local?: boolean; subpath?: string }) => {
        await install(tempDir, source, options);
      });

    await program.parseAsync(["node", "script", "install", "https://github.com/example/repo", "--subpath", "packages/foo"]);

    expect(installSpy).toHaveBeenCalledWith(tempDir, "https://github.com/example/repo", { subpath: "packages/foo" });

    installSpy.mockRestore();
  });

  it("parses --subpath with --local CLI option", async () => {
    const installSpy = spyOn(await import("../../src/commands/install.js"), "install").mockImplementation(async () => {});

    const program = new Command();
    program
      .command("install <source>")
      .option("--local", "Treat source as a local path")
      .option("--subpath <path>", "Subpath within the repository")
      .action(async (source: string, options: { local?: boolean; subpath?: string }) => {
        await install(tempDir, source, options);
      });

    await program.parseAsync(["node", "script", "install", "./my-skill", "--local", "--subpath", "packages/bar"]);

    expect(installSpy).toHaveBeenCalledWith(tempDir, "./my-skill", { local: true, subpath: "packages/bar" });

    installSpy.mockRestore();
  });
});

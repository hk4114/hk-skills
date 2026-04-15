import { describe, it, expect, beforeEach, afterEach, spyOn } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { install } from "../../src/commands/install.js";
import {
  loadSkillsRegistry,
  saveSkillsRegistry,
} from "../../src/services/registry.js";
import { getWarehousePath } from "../../src/utils/paths.js";
import * as fetcher from "../../src/core/fetcher.js";
import * as vetter from "../../src/core/vetter.js";
import * as selectSkill from "../../src/utils/select-skill.js";

function createTempRoot(): string {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "hk-skills-install-discovery-test-")
  );
  fs.mkdirSync(path.join(tempDir, "registry"), { recursive: true });
  fs.mkdirSync(path.join(tempDir, "manifests"), { recursive: true });
  fs.mkdirSync(path.join(tempDir, "warehouse", "remote"), { recursive: true });
  fs.mkdirSync(path.join(tempDir, "warehouse", "local"), { recursive: true });
  fs.mkdirSync(path.join(tempDir, "warehouse", "adapted"), { recursive: true });
  saveSkillsRegistry(tempDir, {});
  return tempDir;
}

describe("install autodiscovery", () => {
  let tempDir: string;
  let fetchRemoteSpy: ReturnType<typeof spyOn>;
  let vetSpy: ReturnType<typeof spyOn>;
  let exitSpy: ReturnType<typeof spyOn>;
  let errorSpy: ReturnType<typeof spyOn>;
  let promptSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    tempDir = createTempRoot();
    vetSpy = spyOn(vetter, "vet").mockReturnValue({
      passed: true,
      warnings: [],
      errors: [],
    });
    exitSpy = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    errorSpy = spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    if (fetchRemoteSpy) fetchRemoteSpy.mockRestore();
    if (vetSpy) vetSpy.mockRestore();
    if (exitSpy) exitSpy.mockRestore();
    if (errorSpy) errorSpy.mockRestore();
    if (promptSpy) promptSpy.mockRestore();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("fails when no SKILL.md candidates are found", async () => {
    const repoUrl = "https://github.com/user/zero-candidates";
    const source_id = "github.com_user_zero-candidates@main";

    fetchRemoteSpy = spyOn(fetcher, "fetchRemote").mockImplementation(
      async (root, url) => {
        const targetPath = path.join(
          getWarehousePath(root, "remote"),
          source_id
        );
        fs.mkdirSync(path.join(targetPath, "src"), { recursive: true });
        fs.writeFileSync(
          path.join(targetPath, "src", "index.ts"),
          "// no skill here",
          "utf-8"
        );
        fs.writeFileSync(
          path.join(targetPath, "README.md"),
          "# No skills",
          "utf-8"
        );
        return {
          source_id,
          name: "zero-candidates",
          repoUrl: url,
          ref: "main",
          commit: "abc123",
        };
      }
    );

    await expect(install(tempDir, repoUrl)).rejects.toThrow(
      "process.exit called"
    );

    expect(errorSpy).toHaveBeenCalled();
    const errorMessage = String(errorSpy.mock.calls[0][0]);
    expect(errorMessage).toContain("SKILL.md");
  });

  it("installs single discovered candidate and registers with subpath", async () => {
    const repoUrl = "https://github.com/user/single-candidate";
    const source_id = "github.com_user_single-candidate@main";

    fetchRemoteSpy = spyOn(fetcher, "fetchRemote").mockImplementation(
      async (root, url) => {
        const targetPath = path.join(
          getWarehousePath(root, "remote"),
          source_id
        );
        fs.mkdirSync(path.join(targetPath, "packages", "skill-a"), {
          recursive: true,
        });
        fs.writeFileSync(
          path.join(targetPath, "packages", "skill-a", "SKILL.md"),
          `---\nname: skill-a\n---\n\n# skill-a\n`,
          "utf-8"
        );
        return {
          source_id,
          name: "single-candidate",
          repoUrl: url,
          ref: "main",
          commit: "abc123",
        };
      }
    );

    await install(tempDir, repoUrl);

    const registry = loadSkillsRegistry(tempDir);
    expect(registry["skill-a"]).toBeDefined();
    expect(registry["skill-a"]!.installed).toBe(true);
    expect(registry["skill-a"]!.source_id).toBe(source_id);
    expect(registry["skill-a"]!.subpath).toBe("packages/skill-a");

    const expectedAdaptPath = path.join(
      getWarehousePath(tempDir, "remote"),
      source_id,
      "packages",
      "skill-a"
    );
    expect(vetSpy).toHaveBeenCalledWith(expectedAdaptPath);
  });

  it("fails in non-interactive mode when multiple candidates are found", async () => {
    const repoUrl = "https://github.com/user/many-candidates";
    const source_id = "github.com_user_many-candidates@main";

    fetchRemoteSpy = spyOn(fetcher, "fetchRemote").mockImplementation(
      async (root, url) => {
        const targetPath = path.join(
          getWarehousePath(root, "remote"),
          source_id
        );

        fs.mkdirSync(path.join(targetPath, "packages", "skill-a"), {
          recursive: true,
        });
        fs.writeFileSync(
          path.join(targetPath, "packages", "skill-a", "SKILL.md"),
          `---\nname: skill-a\n---\n\n# skill-a\n`,
          "utf-8"
        );

        fs.mkdirSync(path.join(targetPath, "packages", "skill-b"), {
          recursive: true,
        });
        fs.writeFileSync(
          path.join(targetPath, "packages", "skill-b", "SKILL.md"),
          `---\nname: skill-b\n---\n\n# skill-b\n`,
          "utf-8"
        );

        return {
          source_id,
          name: "many-candidates",
          repoUrl: url,
          ref: "main",
          commit: "abc123",
        };
      }
    );

    await expect(install(tempDir, repoUrl)).rejects.toThrow(
      "process.exit called"
    );

    expect(errorSpy).toHaveBeenCalled();
    const errorMessage = String(errorSpy.mock.calls[0][0]);
    expect(errorMessage).toContain("skill-a");
    expect(errorMessage).toContain("skill-b");
  });

  it("includes root SKILL.md alongside nested candidates", async () => {
    const repoUrl = "https://github.com/user/root-plus-nested";
    const source_id = "github.com_user_root-plus-nested@main";

    fetchRemoteSpy = spyOn(fetcher, "fetchRemote").mockImplementation(
      async (root, url) => {
        const targetPath = path.join(
          getWarehousePath(root, "remote"),
          source_id
        );
        fs.mkdirSync(targetPath, { recursive: true });

        fs.writeFileSync(
          path.join(targetPath, "SKILL.md"),
          `---\nname: root-skill\n---\n\n# root-skill\n`,
          "utf-8"
        );

        fs.mkdirSync(path.join(targetPath, "packages", "skill-a"), {
          recursive: true,
        });
        fs.writeFileSync(
          path.join(targetPath, "packages", "skill-a", "SKILL.md"),
          `---\nname: skill-a\n---\n\n# skill-a\n`,
          "utf-8"
        );

        fs.mkdirSync(path.join(targetPath, "packages", "skill-b"), {
          recursive: true,
        });
        fs.writeFileSync(
          path.join(targetPath, "packages", "skill-b", "SKILL.md"),
          `---\nname: skill-b\n---\n\n# skill-b\n`,
          "utf-8"
        );

        return {
          source_id,
          name: "root-plus-nested",
          repoUrl: url,
          ref: "main",
          commit: "abc123",
        };
      }
    );

    await expect(install(tempDir, repoUrl)).rejects.toThrow(
      "process.exit called"
    );

    expect(errorSpy).toHaveBeenCalled();
    const errorMessage = String(errorSpy.mock.calls[0][0]);
    expect(errorMessage).toContain("root-skill");
    expect(errorMessage).toContain("skill-a");
    expect(errorMessage).toContain("skill-b");
  });

  it("cleans up fetched directory when vet fails after discovery", async () => {
    const repoUrl = "https://github.com/user/vet-fail";
    const source_id = "github.com_user_vet-fail@main";

    fetchRemoteSpy = spyOn(fetcher, "fetchRemote").mockImplementation(
      async (root, url) => {
        const targetPath = path.join(
          getWarehousePath(root, "remote"),
          source_id
        );
        fs.mkdirSync(path.join(targetPath, "packages", "skill-a"), {
          recursive: true,
        });
        fs.writeFileSync(
          path.join(targetPath, "packages", "skill-a", "SKILL.md"),
          `---\nname: skill-a\n---\n\n# skill-a\n`,
          "utf-8"
        );
        return {
          source_id,
          name: "vet-fail",
          repoUrl: url,
          ref: "main",
          commit: "abc123",
        };
      }
    );

    vetSpy.mockRestore();
    vetSpy = spyOn(vetter, "vet").mockReturnValue({
      passed: false,
      errors: ["fail"],
      warnings: [],
    });

    await expect(install(tempDir, repoUrl)).rejects.toThrow(
      "process.exit called"
    );

    const fetchedPath = path.join(
      getWarehousePath(tempDir, "remote"),
      source_id
    );
    expect(fs.existsSync(fetchedPath)).toBe(false);
  });

  it("cleans up fetched directory when prompt is cancelled", async () => {
    const repoUrl = "https://github.com/user/prompt-cancel";
    const source_id = "github.com_user_prompt-cancel@main";

    const originalIsTTY = process.stdin.isTTY;
    (process.stdin as any).isTTY = true;

    fetchRemoteSpy = spyOn(fetcher, "fetchRemote").mockImplementation(
      async (root, url) => {
        const targetPath = path.join(
          getWarehousePath(root, "remote"),
          source_id
        );

        fs.mkdirSync(path.join(targetPath, "packages", "skill-a"), {
          recursive: true,
        });
        fs.writeFileSync(
          path.join(targetPath, "packages", "skill-a", "SKILL.md"),
          `---\nname: skill-a\n---\n\n# skill-a\n`,
          "utf-8"
        );

        fs.mkdirSync(path.join(targetPath, "packages", "skill-b"), {
          recursive: true,
        });
        fs.writeFileSync(
          path.join(targetPath, "packages", "skill-b", "SKILL.md"),
          `---\nname: skill-b\n---\n\n# skill-b\n`,
          "utf-8"
        );

        return {
          source_id,
          name: "prompt-cancel",
          repoUrl: url,
          ref: "main",
          commit: "abc123",
        };
      }
    );

    promptSpy = spyOn(selectSkill, "promptSelectSkill").mockImplementation(
      () => Promise.resolve(null)
    );

    try {
      await expect(install(tempDir, repoUrl)).rejects.toThrow(
        "process.exit called"
      );

      const fetchedPath = path.join(
        getWarehousePath(tempDir, "remote"),
        source_id
      );
      expect(fs.existsSync(fetchedPath)).toBe(false);
    } finally {
      (process.stdin as any).isTTY = originalIsTTY;
    }
  });
});

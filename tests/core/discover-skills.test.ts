import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { discoverSkills } from "../../src/core/discover-skills";

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "discover-skills-test-"));
}

function writeSkill(dir: string, name: string): void {
  fs.writeFileSync(
    path.join(dir, "SKILL.md"),
    `---\nname: "${name}"\n---\n# ${name}\n`
  );
}

describe("discoverSkills", () => {
  it("returns an empty array for an empty repo (zero matches)", () => {
    const repo = makeTempDir();

    const result = discoverSkills(repo);
    expect(result).toEqual([]);

    fs.rmSync(repo, { recursive: true, force: true });
  });

  it("returns a single match with correct subpath and name", () => {
    const repo = makeTempDir();
    const skillDir = path.join(repo, "packages", "skill-a");
    fs.mkdirSync(skillDir, { recursive: true });
    writeSkill(skillDir, "skill-a");

    const result = discoverSkills(repo);
    expect(result).toEqual([{ subpath: "packages/skill-a", name: "skill-a" }]);

    fs.rmSync(repo, { recursive: true, force: true });
  });

  it("returns many matches sorted deterministically by subpath", () => {
    const repo = makeTempDir();
    const dirs = [
      path.join(repo, "packages", "skill-b"),
      path.join(repo, "packages", "skill-a"),
      path.join(repo, "skills", "alpha"),
    ];
    dirs.forEach((dir, i) => {
      fs.mkdirSync(dir, { recursive: true });
      writeSkill(dir, `skill-${i}`);
    });

    const nestedDir = path.join(repo, "packages", "skill-a", "nested");
    fs.mkdirSync(nestedDir, { recursive: true });
    writeSkill(nestedDir, "nested-skill");

    const result = discoverSkills(repo);
    expect(result).toEqual([
      { subpath: "packages/skill-a", name: "skill-1" },
      { subpath: "packages/skill-a/nested", name: "nested-skill" },
      { subpath: "packages/skill-b", name: "skill-0" },
      { subpath: "skills/alpha", name: "skill-2" },
    ]);

    fs.rmSync(repo, { recursive: true, force: true });
  });

  it("does not discover SKILL.md beyond depth 5", () => {
    const repo = makeTempDir();
    const deepDir = path.join(repo, "a", "b", "c", "d", "e");
    fs.mkdirSync(deepDir, { recursive: true });
    writeSkill(deepDir, "deep-skill");

    const tooDeepDir = path.join(repo, "a", "b", "c", "d", "e", "f");
    fs.mkdirSync(tooDeepDir, { recursive: true });
    writeSkill(tooDeepDir, "too-deep");

    const result = discoverSkills(repo);
    expect(result).toEqual([{ subpath: "a/b/c/d/e", name: "deep-skill" }]);

    fs.rmSync(repo, { recursive: true, force: true });
  });

  it("skips excluded directories", () => {
    const repo = makeTempDir();
    const excluded = [
      ".git",
      "node_modules",
      "dist",
      "build",
      "coverage",
      "test",
      "tests",
      ".github",
    ];

    excluded.forEach((dirName) => {
      const excludedDir = path.join(repo, dirName, "hidden-skill");
      fs.mkdirSync(excludedDir, { recursive: true });
      writeSkill(excludedDir, dirName);
    });

    const validDir = path.join(repo, "valid-skill");
    fs.mkdirSync(validDir, { recursive: true });
    writeSkill(validDir, "valid-skill");

    const result = discoverSkills(repo);
    expect(result).toEqual([{ subpath: "valid-skill", name: "valid-skill" }]);

    fs.rmSync(repo, { recursive: true, force: true });
  });

  it("treats root-level SKILL.md as subpath empty string", () => {
    const repo = makeTempDir();
    writeSkill(repo, "root-skill");

    const result = discoverSkills(repo);
    expect(result).toEqual([{ subpath: "", name: "root-skill" }]);

    fs.rmSync(repo, { recursive: true, force: true });
  });

  it("does not follow symlinks that escape the repo", () => {
    const repo = makeTempDir();
    const outsideDir = makeTempDir();
    const outsideSkillDir = path.join(outsideDir, "escaped-skill");
    fs.mkdirSync(outsideSkillDir, { recursive: true });
    writeSkill(outsideSkillDir, "escaped-skill");

    const symlinkDir = path.join(repo, "symlink-skill");
    fs.symlinkSync(outsideSkillDir, symlinkDir, "dir");

    const result = discoverSkills(repo);
    expect(result).toEqual([]);

    fs.rmSync(repo, { recursive: true, force: true });
    fs.rmSync(outsideDir, { recursive: true, force: true });
  });

  it("normalizes subpaths without leading, trailing slashes or SKILL.md", () => {
    const repo = makeTempDir();
    const skillDir = path.join(repo, "tools", "my-tool");
    fs.mkdirSync(skillDir, { recursive: true });
    writeSkill(skillDir, "my-tool");

    const result = discoverSkills(repo);
    expect(result.length).toBe(1);
    expect(result[0]!.subpath.startsWith("/")).toBe(false);
    expect(result[0]!.subpath.endsWith("/")).toBe(false);
    expect(result[0]!.subpath.includes("SKILL.md")).toBe(false);
    expect(result[0]!.subpath).toBe("tools/my-tool");

    fs.rmSync(repo, { recursive: true, force: true });
  });
});

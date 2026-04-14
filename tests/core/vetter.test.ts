import { describe, it, expect } from "bun:test";
import fs from "fs";
import os from "os";
import path from "path";
import { vet } from "../../src/core/vetter";

describe("vet", () => {
  function makeTempDir(): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), "vetter-test-"));
  }

  it("passes for a valid skill directory", () => {
    const dir = makeTempDir();
    fs.writeFileSync(
      path.join(dir, "SKILL.md"),
      `---\nname: test-skill\n---\n# Test Skill\n`
    );

    const result = vet(dir);
    expect(result.passed).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);

    fs.rmSync(dir, { recursive: true });
  });

  it("fails when the path does not exist", () => {
    const result = vet("/nonexistent/path/that/does/not/exist");
    expect(result.passed).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain("Path does not exist");
  });

  it("fails when SKILL.md is missing", () => {
    const dir = makeTempDir();

    const result = vet(dir);
    expect(result.passed).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain("SKILL.md is missing");

    fs.rmSync(dir, { recursive: true });
  });

  it("fails when SKILL.md has no frontmatter", () => {
    const dir = makeTempDir();
    fs.writeFileSync(
      path.join(dir, "SKILL.md"),
      `# Test Skill\nNo frontmatter here.\n`
    );

    const result = vet(dir);
    expect(result.passed).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain("unparseable or missing YAML frontmatter");

    fs.rmSync(dir, { recursive: true });
  });

  it("fails when frontmatter has an empty name", () => {
    const dir = makeTempDir();
    fs.writeFileSync(
      path.join(dir, "SKILL.md"),
      `---\nname: ""\n---\n# Test Skill\n`
    );

    const result = vet(dir);
    expect(result.passed).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain("non-empty 'name' field");

    fs.rmSync(dir, { recursive: true });
  });
});

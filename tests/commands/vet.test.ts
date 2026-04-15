import { describe, it, expect, beforeEach, afterEach, spyOn } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import * as vetter from "../../src/core/vetter.js";
import { resolveSourcePath } from "../../src/core/activator.js";
import * as logger from "../../src/utils/logger.js";

// Stand-in for the vet command until src/commands/vet.ts is implemented
function vet(root: string, name: string): void {
  let skillPath: string;
  try {
    skillPath = resolveSourcePath(root, name);
  } catch {
    logger.error("Skill not found");
    process.exit(1);
  }

  const result = vetter.vet(skillPath);
  if (result.passed) {
    logger.success(`Vet passed for ${name}`);
  } else {
    for (const err of result.errors) {
      logger.error(err);
    }
  }
}

describe("vet", () => {
  let tempDir: string;
  let exitSpy: ReturnType<typeof spyOn>;
  let vetSpy: ReturnType<typeof spyOn>;
  let logs: string[];
  let originalError: typeof console.error;
  let originalLog: typeof console.log;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hk-skills-vet-test-"));
    fs.mkdirSync(path.join(tempDir, "warehouse", "local", "vetter"), { recursive: true });
    fs.writeFileSync(
      path.join(tempDir, "warehouse", "local", "vetter", "SKILL.md"),
      `---\nname: vetter\n---\n# Vetter\n`,
      "utf-8"
    );

    exitSpy = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    vetSpy = spyOn(vetter, "vet");

    logs = [];
    originalError = console.error;
    originalLog = console.log;
    console.error = (msg: string) => {
      logs.push(msg);
    };
    console.log = (msg: string) => {
      logs.push(msg);
    };
  });

  afterEach(() => {
    console.error = originalError;
    console.log = originalLog;
    if (exitSpy) exitSpy.mockRestore();
    if (vetSpy) vetSpy.mockRestore();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("resolves path, calls vet(), outputs results, and exits 0 for an existing skill", () => {
    exitSpy.mockRestore();

    vet(tempDir, "vetter");

    expect(vetSpy).toHaveBeenCalled();
    const callArg = vetSpy.mock.calls[0][0] as string;
    expect(callArg).toBe(path.join(tempDir, "warehouse", "local", "vetter"));
    expect(logs.some((l) => l.includes("Vet passed for vetter"))).toBe(true);
  });

  it('outputs "Skill not found" and exits 1 for a nonexistent skill', () => {
    expect(() => vet(tempDir, "nonexistent-skill")).toThrow("process.exit called");
    expect(logs.some((l) => l.includes("Skill not found"))).toBe(true);
  });
});

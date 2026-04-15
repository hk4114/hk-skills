import fs from "node:fs";
import path from "node:path";
import { vet as vetSkill } from "../core/vetter.js";
import { error, warn, success } from "../utils/logger.js";
import { getWarehousePath } from "../utils/paths.js";

export function vet(root: string, name: string): void {
  let skillPath: string | undefined;

  const adaptedPath = path.join(getWarehousePath(root, "adapted"), name);
  if (fs.existsSync(adaptedPath)) {
    skillPath = adaptedPath;
  } else {
    const localPath = path.join(getWarehousePath(root, "local"), name);
    if (fs.existsSync(localPath)) {
      skillPath = localPath;
    } else {
      const remotePath = path.join(getWarehousePath(root, "remote"), name);
      if (fs.existsSync(remotePath)) {
        skillPath = remotePath;
      }
    }
  }

  if (!skillPath) {
    error(`Skill not found: ${name}`);
    process.exit(1);
  }

  const result = vetSkill(skillPath);

  for (const w of result.warnings) {
    warn(w);
  }

  if (!result.passed) {
    for (const err of result.errors) {
      error(err);
    }
    process.exit(1);
  }

  success(`Vet passed for ${name}`);
}

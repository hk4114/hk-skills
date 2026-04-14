import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

export function getRootPath(): string {
  let dir = process.cwd();
  while (dir !== "/") {
    if (existsSync(resolve(dir, "package.json"))) {
      return dir;
    }
    dir = dirname(dir);
  }
  throw new Error("Could not find repo root (no package.json found)");
}

export function getWarehousePath(
  root: string,
  type: "remote" | "adapted" | "local"
): string {
  return resolve(root, "warehouse", type);
}

export function getManifestPath(root: string, name: string): string {
  return resolve(root, "manifests", `${name}.yaml`);
}

export function getRuntimePath(
  root: string,
  scope: "global" | { project: string }
): string {
  if (scope === "global") {
    return resolve(root, "runtime", "global");
  }
  return resolve(root, "runtime", "projects", scope.project);
}

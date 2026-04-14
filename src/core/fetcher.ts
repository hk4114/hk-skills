import { existsSync, mkdirSync, cpSync, rmSync } from "node:fs";
import { resolve, basename } from "node:path";
import { execSync } from "node:child_process";
import { getWarehousePath } from "../utils/paths";

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export async function fetchRemote(
  root: string,
  repoUrl: string
): Promise<string> {
  const url = new URL(repoUrl);
  const name = basename(url.pathname);
  if (!name) {
    throw new Error("Could not derive skill name from repo URL");
  }

  const warehouseDir = getWarehousePath(root, "remote");
  ensureDir(warehouseDir);

  const targetPath = resolve(warehouseDir, name);

  if (existsSync(targetPath)) {
    execSync(`git -C "${targetPath}" pull`, { stdio: "ignore" });
  } else {
    execSync(`git clone "${repoUrl}" "${targetPath}"`, { stdio: "ignore" });
  }

  return name;
}

export async function fetchLocal(
  root: string,
  localPath: string
): Promise<string> {
  const name = basename(localPath);
  if (!name) {
    throw new Error("Could not derive skill name from local path");
  }

  const warehouseDir = getWarehousePath(root, "local");
  ensureDir(warehouseDir);

  const targetPath = resolve(warehouseDir, name);

  if (existsSync(targetPath)) {
    rmSync(targetPath, { recursive: true, force: true });
  }

  cpSync(localPath, targetPath, { recursive: true });

  return name;
}

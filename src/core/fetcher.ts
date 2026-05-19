import { existsSync, mkdirSync, cpSync, rmSync, writeFileSync, readFileSync, readdirSync, statSync, renameSync, rmdirSync } from "node:fs";
import { resolve, basename } from "node:path";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { getWarehousePath } from "../utils/paths";
import { warn } from "../utils/logger.js";

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export interface FetchRemoteResult {
  source_id: string;
  name: string;
  repoUrl: string;
  ref: string;
  commit: string;
}

export function generateSourceId(repoUrl: string, ref: string): string {
  let clean = repoUrl.trim();
  clean = clean.replace(/^\w+:\/\//, "");
  clean = clean.replace(/\.git$/, "");
  if (ref && ref.length > 0) {
    clean = `${clean}@${ref}`;
  }
  clean = clean.replace(/\//g, "_");
  return clean;
}

function stripSingleRootDir(targetPath: string): void {
  const entries = readdirSync(targetPath);
  if (entries.length === 1) {
    const single = resolve(targetPath, entries[0]!);
    if (statSync(single).isDirectory()) {
      const hasSkillMd = existsSync(resolve(single, "SKILL.md"));
      if (hasSkillMd) {
        const tempPath = `${targetPath}.tmp`;
        renameSync(single, tempPath);
        rmSync(targetPath, { recursive: true, force: true });
        renameSync(tempPath, targetPath);
        return;
      }
    }
  }
}

async function fetchArchive(
  root: string,
  archiveUrl: string
): Promise<FetchRemoteResult> {
  const url = new URL(archiveUrl);
  const name = basename(url.pathname).replace(/\.zip$/i, "");
  if (!name) {
    throw new Error("Could not derive skill name from archive URL");
  }

  const source_id = generateSourceId(archiveUrl, "");
  const warehouseDir = getWarehousePath(root, "remote");
  ensureDir(warehouseDir);

  const targetPath = resolve(warehouseDir, source_id);

  const response = await fetch(archiveUrl);
  if (!response.ok) {
    throw new Error(`Failed to download archive: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const commit = createHash("sha256").update(buffer).digest("hex");

  const tempZipPath = resolve(warehouseDir, `.${source_id}.zip`);
  writeFileSync(tempZipPath, buffer);

  try {
    if (existsSync(targetPath)) {
      rmSync(targetPath, { recursive: true, force: true });
    }
    ensureDir(targetPath);
    execSync(`unzip -o "${tempZipPath}" -d "${targetPath}"`, { stdio: "ignore" });
    stripSingleRootDir(targetPath);
  } catch (err) {
    throw new Error(`Failed to extract archive: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    try {
      rmSync(tempZipPath, { force: true });
    } catch {
      // ignore cleanup error
    }
  }

  return { source_id, name, repoUrl: archiveUrl, ref: "", commit };
}

export async function fetchRemote(
  root: string,
  repoUrl: string,
  ref: string = "main"
): Promise<FetchRemoteResult> {
  if (/\.zip$/i.test(repoUrl)) {
    return fetchArchive(root, repoUrl);
  }

  const url = new URL(repoUrl);
  const name = basename(url.pathname);
  if (!name) {
    throw new Error("Could not derive skill name from repo URL");
  }

  const source_id = generateSourceId(repoUrl, ref);
  const warehouseDir = getWarehousePath(root, "remote");
  ensureDir(warehouseDir);

  const targetPath = resolve(warehouseDir, source_id);

  if (existsSync(targetPath)) {
    try {
      execSync(`git -C "${targetPath}" pull origin "${ref}"`, { stdio: "ignore" });
    } catch {
      if (ref === "main") {
        execSync(`git -C "${targetPath}" pull`, { stdio: "ignore" });
      } else {
        throw new Error(`Failed to pull ${repoUrl} at branch "${ref}"`);
      }
    }
  } else {
    try {
      execSync(`git clone --branch "${ref}" "${repoUrl}" "${targetPath}"`, { stdio: "ignore" });
    } catch {
      if (ref === "main") {
        execSync(`git clone "${repoUrl}" "${targetPath}"`, { stdio: "ignore" });
      } else {
        throw new Error(`Failed to clone ${repoUrl} at branch "${ref}"`);
      }
    }
  }

  const commit = execSync(`git -C "${targetPath}" rev-parse HEAD`, {
    encoding: "utf-8",
  }).trim();

  let detectedRef = ref;
  try {
    const branch = execSync(`git -C "${targetPath}" rev-parse --abbrev-ref HEAD`, {
      encoding: "utf-8",
    }).trim();
    if (branch && branch !== "HEAD") {
      detectedRef = branch;
    }
  } catch (err) {
    warn(`Failed to determine branch for ${targetPath}: ${err instanceof Error ? err.message : String(err)}`);
  }

  return { source_id, name, repoUrl, ref: detectedRef, commit };
}

export async function fetchLocal(
  root: string,
  localPath: string
): Promise<string> {
  const resolvedPath = resolve(localPath);
  const name = basename(resolvedPath);
  if (!name) {
    throw new Error("Could not derive skill name from local path");
  }

  const warehouseDir = getWarehousePath(root, "local");
  ensureDir(warehouseDir);

  const targetPath = resolve(warehouseDir, name);

  // If the source is already in warehouse/local, use it in place
  if (resolvedPath === targetPath) {
    return name;
  }

  if (existsSync(targetPath)) {
    rmSync(targetPath, { recursive: true, force: true });
  }

  cpSync(resolvedPath, targetPath, { recursive: true });

  return name;
}

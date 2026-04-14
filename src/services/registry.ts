import fs from "node:fs";
import path from "node:path";
import {
  SkillsRegistrySchema,
  SourcesRegistrySchema,
  ProjectsRegistrySchema,
  type SkillsRegistry,
  type SourcesRegistry,
  type ProjectsRegistry,
} from "../models/registry.js";

const REGISTRY_DIR = "registry";

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function atomicWrite(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempPath, filePath);
}

function loadJson<T>(filePath: string, schema: import("zod").ZodSchema<T>): T {
  if (!fs.existsSync(filePath)) {
    return {} as T;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in ${filePath}: ${e instanceof Error ? e.message : String(e)}`);
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Schema validation failed for ${filePath}: ${result.error.message}`);
  }
  return result.data;
}

export function loadSkillsRegistry(root: string): SkillsRegistry {
  const filePath = path.join(root, REGISTRY_DIR, "skills.json");
  return loadJson(filePath, SkillsRegistrySchema);
}

export function saveSkillsRegistry(root: string, data: SkillsRegistry): void {
  const filePath = path.join(root, REGISTRY_DIR, "skills.json");
  const validated = SkillsRegistrySchema.parse(data);
  atomicWrite(filePath, validated);
}

export function loadSourcesRegistry(root: string): SourcesRegistry {
  const filePath = path.join(root, REGISTRY_DIR, "sources.json");
  return loadJson(filePath, SourcesRegistrySchema);
}

export function saveSourcesRegistry(root: string, data: SourcesRegistry): void {
  const filePath = path.join(root, REGISTRY_DIR, "sources.json");
  const validated = SourcesRegistrySchema.parse(data);
  atomicWrite(filePath, validated);
}

export function loadProjectsRegistry(root: string): ProjectsRegistry {
  const filePath = path.join(root, REGISTRY_DIR, "projects.json");
  return loadJson(filePath, ProjectsRegistrySchema);
}

export function saveProjectsRegistry(root: string, data: ProjectsRegistry): void {
  const filePath = path.join(root, REGISTRY_DIR, "projects.json");
  const validated = ProjectsRegistrySchema.parse(data);
  atomicWrite(filePath, validated);
}

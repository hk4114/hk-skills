import fs from "fs";
import path from "path";
import { parseSkillMd } from "../utils/parse-skill-md";

export interface VetResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
}

export function vet(skillPath: string): VetResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!fs.existsSync(skillPath)) {
    errors.push(`Path does not exist: ${skillPath}`);
    return { passed: false, warnings, errors };
  }

  const stat = fs.statSync(skillPath);
  if (!stat.isDirectory()) {
    errors.push(`Path is not a directory: ${skillPath}`);
    return { passed: false, warnings, errors };
  }

  const skillMdPath = path.join(skillPath, "SKILL.md");
  if (!fs.existsSync(skillMdPath)) {
    errors.push(`SKILL.md is missing in directory: ${skillPath}`);
    return { passed: false, warnings, errors };
  }

  const content = fs.readFileSync(skillMdPath, "utf-8");
  const parsed = parseSkillMd(content);

  if (parsed.frontmatter === null) {
    errors.push(`SKILL.md has unparseable or missing YAML frontmatter`);
    return { passed: false, warnings, errors };
  }

  const name = parsed.frontmatter.name;
  if (typeof name !== "string" || name.length === 0) {
    errors.push(`SKILL.md frontmatter must have a non-empty 'name' field`);
    return { passed: false, warnings, errors };
  }

  return { passed: true, warnings, errors };
}

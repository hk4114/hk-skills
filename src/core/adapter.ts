import { readFileSync, writeFileSync, mkdirSync, cpSync } from "node:fs";
import { resolve, basename } from "node:path";
import { stringify } from "yaml";
import { parseSkillMd } from "../utils/parse-skill-md.js";
import { getManifestPath, getWarehousePath } from "../utils/paths.js";

export interface AdaptResult {
  success: boolean;
  name: string;
  errors: string[];
}

export function adapt(
  inputPath: string,
  root: string,
  sourceType: "local" | "remote" | "adapted"
): AdaptResult {
  const errors: string[] = [];

  const skillMdPath = resolve(inputPath, "SKILL.md");
  let content: string;
  try {
    content = readFileSync(skillMdPath, "utf-8");
  } catch {
    errors.push(`Failed to read SKILL.md at ${skillMdPath}`);
    return {
      success: false,
      name: basename(inputPath),
      errors,
    };
  }

  const parsed = parseSkillMd(content);
  const frontmatter = parsed.frontmatter ?? {};

  const name =
    typeof frontmatter.name === "string" && frontmatter.name.length > 0
      ? frontmatter.name
      : basename(inputPath);

  const displayName =
    typeof frontmatter.display_name === "string" &&
    frontmatter.display_name.length > 0
      ? frontmatter.display_name
      : name;

  const manifest: Record<string, unknown> = {
    name,
    display_name: displayName,
    source: {
      type: sourceType,
      ...(sourceType === "remote" &&
        typeof frontmatter.repo === "string" && {
          repo: frontmatter.repo,
        }),
    },
    status: {
      stage: "adapted",
    },
    entry: {
      file: "SKILL.md",
    },
  };

  const manifestPath = getManifestPath(root, name);
  try {
    mkdirSync(resolve(manifestPath, ".."), { recursive: true });
    writeFileSync(manifestPath, stringify(manifest), "utf-8");
  } catch (err) {
    errors.push(
      `Failed to write manifest: ${err instanceof Error ? err.message : String(err)}`
    );
    return { success: false, name, errors };
  }

  const destPath = resolve(getWarehousePath(root, "adapted"), name);
  try {
    mkdirSync(resolve(destPath, ".."), { recursive: true });
    cpSync(inputPath, destPath, { recursive: true });
  } catch (err) {
    errors.push(
      `Failed to copy skill directory: ${err instanceof Error ? err.message : String(err)}`
    );
    return { success: false, name, errors };
  }

  return { success: true, name, errors };
}

import { parse } from "yaml";

export function parseSkillMd(content: string): {
  frontmatter: Record<string, unknown> | null;
  content: string;
} {
  const trimmed = content.trimStart();
  if (!trimmed.startsWith("---")) {
    return { frontmatter: null, content };
  }

  const endIndex = trimmed.indexOf("\n---", 3);
  if (endIndex === -1) {
    return { frontmatter: null, content };
  }

  const yamlBlock = trimmed.slice(3, endIndex).trim();
  const remaining = trimmed.slice(endIndex + 4).replace(/^\r?\n/, "");

  if (yamlBlock.length === 0) {
    return { frontmatter: {}, content: remaining };
  }

  try {
    const frontmatter = parse(yamlBlock) as Record<string, unknown>;
    return {
      frontmatter: frontmatter ?? {},
      content: remaining,
    };
  } catch {
    return { frontmatter: null, content };
  }
}

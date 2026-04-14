import { describe, it, expect } from "bun:test";
import { parseSkillMd } from "../../src/utils/parse-skill-md";

describe("parseSkillMd", () => {
  it("parses valid frontmatter and returns remaining content", () => {
    const input = `---
name: test-skill
tags:
  - cli
  - dev
---
# Hello
This is content.
`;
    const result = parseSkillMd(input);
    expect(result.frontmatter).toEqual({
      name: "test-skill",
      tags: ["cli", "dev"],
    });
    expect(result.content.trim()).toBe("# Hello\nThis is content.");
  });

  it("returns null frontmatter when no frontmatter block exists", () => {
    const input = "# Just markdown\nNo frontmatter here.";
    const result = parseSkillMd(input);
    expect(result.frontmatter).toBeNull();
    expect(result.content).toBe(input);
  });

  it("returns empty object for empty frontmatter", () => {
    const input = `---
---
Some content after.`;
    const result = parseSkillMd(input);
    expect(result.frontmatter).toEqual({});
    expect(result.content.trim()).toBe("Some content after.");
  });

  it("handles content with leading whitespace before frontmatter", () => {
    const input = `   
---
key: value
---
Body`;
    const result = parseSkillMd(input);
    expect(result.frontmatter).toEqual({ key: "value" });
    expect(result.content.trim()).toBe("Body");
  });
});

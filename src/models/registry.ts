import { z } from "zod";

export const RegistryEntrySchema = z.object({
  manifest: z.string(),
  installed: z.boolean(),
  enabled_global: z.boolean(),
  enabled_projects: z.array(z.string()),
  updated_at: z.string(),
  source_id: z.string(),
  subpath: z.string().optional(),
});

export type RegistryEntry = z.infer<typeof RegistryEntrySchema>;

export const SkillsRegistrySchema = z.record(z.string(), RegistryEntrySchema);

export type SkillsRegistry = z.infer<typeof SkillsRegistrySchema>;

export const SourceRegistryEntrySchema = z.object({
  type: z.enum(["remote", "local"]),
  repo: z.string().optional(),
  ref: z.string().optional(),
  commit: z.string().optional(),
  local_path: z.string(),
});

export type SourceRegistryEntry = z.infer<typeof SourceRegistryEntrySchema>;

export const SourcesRegistrySchema = z.record(z.string(), SourceRegistryEntrySchema);

export type SourcesRegistry = z.infer<typeof SourcesRegistrySchema>;

export const ProjectEntrySchema = z.object({
  path: z.string(),
  skills: z.array(z.string()),
});

export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;

export const ProjectsRegistrySchema = z.record(z.string(), ProjectEntrySchema);

export type ProjectsRegistry = z.infer<typeof ProjectsRegistrySchema>;

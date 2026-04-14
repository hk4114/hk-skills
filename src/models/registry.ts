import { z } from "zod";

export const RegistryEntrySchema = z.object({
  manifest: z.string(),
  installed: z.boolean(),
  enabled_global: z.boolean(),
  enabled_projects: z.array(z.string()),
  updated_at: z.string(),
});

export type RegistryEntry = z.infer<typeof RegistryEntrySchema>;

export const SkillsRegistrySchema = z.record(z.string(), RegistryEntrySchema);

export type SkillsRegistry = z.infer<typeof SkillsRegistrySchema>;

export const SourceEntrySchema = z.object({
  repo: z.string(),
  ref: z.string(),
  path: z.string().optional(),
});

export type SourceEntry = z.infer<typeof SourceEntrySchema>;

export const SourcesRegistrySchema = z.record(z.string(), z.array(SourceEntrySchema));

export type SourcesRegistry = z.infer<typeof SourcesRegistrySchema>;

export const ProjectEntrySchema = z.object({
  path: z.string(),
  skills: z.array(z.string()),
});

export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;

export const ProjectsRegistrySchema = z.record(z.string(), ProjectEntrySchema);

export type ProjectsRegistry = z.infer<typeof ProjectsRegistrySchema>;

import { enableSkill } from "../core/activator.js";
import { success, error } from "../utils/logger.js";

export function enable(root: string, name: string, options: { global?: boolean; project?: string }): void {
  const scope: "global" | { project: string } = options.project ? { project: options.project } : "global";

  try {
    enableSkill(root, name, scope);
    success(`Enabled skill: ${name} (${scope === "global" ? "global" : `project: ${scope.project}`})`);
  } catch (err) {
    error(`Enable failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

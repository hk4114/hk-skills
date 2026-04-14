import { disableSkill } from "../core/activator.js";
import { success, error } from "../utils/logger.js";

export function disable(root: string, name: string, options: { global?: boolean; project?: string }): void {
  const scope: "global" | { project: string } = options.project ? { project: options.project } : "global";

  try {
    disableSkill(root, name, scope);
    success(`Disabled skill: ${name} (${scope === "global" ? "global" : `project: ${scope.project}`})`);
  } catch (err) {
    error(`Disable failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

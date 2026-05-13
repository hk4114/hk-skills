import type { TuiPlugin } from "@opencode-ai/plugin/tui";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

export const id = "last-response";

const tui: TuiPlugin = async (api) => {
  api.command.register(() => [
    {
      title: "Export last response",
      value: "lastmd",
      description: "Export the last assistant response to a markdown file",
      category: "Session",
      slash: {
        name: "lastmd",
        aliases: ["last"],
      },
      onSelect: () => {
        const route = api.route.current;

        if (route.name !== "session") {
          api.ui.toast({
            message: "Not in a session",
            variant: "error",
            duration: 3000,
          });
          return;
        }

        const sessionID = route.params.sessionID;
        const messages = api.state.session.messages(sessionID);
        const lastAssistantMsg = [...messages]
          .reverse()
          .find((m) => m.role === "assistant");

        if (!lastAssistantMsg) {
          api.ui.toast({
            message: "No assistant response found",
            variant: "error",
            duration: 3000,
          });
          return;
        }

        const parts = api.state.part(lastAssistantMsg.id);
        const textParts = parts.filter((p) => p.type === "text");
        const content = textParts.map((p) => p.text).join("\n\n");

        if (!content.trim()) {
          api.ui.toast({
            message: "Last response is empty",
            variant: "warning",
            duration: 3000,
          });
          return;
        }

        const dir = api.state.path.directory || process.cwd();
        const fileName = `last-response-${Date.now()}.md`;
        const filePath = join(dir, fileName);

        try {
          writeFileSync(filePath, content, "utf-8");
          api.ui.toast({
            message: `Exported to ${fileName}`,
            variant: "success",
            duration: 3000,
          });
        } catch (err) {
          api.ui.toast({
            message: `Failed to save: ${err instanceof Error ? err.message : String(err)}`,
            variant: "error",
            duration: 5000,
          });
        }
      },
    },
  ]);
};

export default { id, tui };

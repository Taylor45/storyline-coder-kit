import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { mcpCourseModules } from "../course";

export default defineTool({
  name: "get_module",
  title: "Get a module",
  description: "Return the full content of a single course module by id.",
  inputSchema: { module_id: z.number().int().describe("Module id (1-7).") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ module_id }) => {
    const mod = mcpCourseModules.find((m) => m.id === module_id);
    if (!mod) {
      return { content: [{ type: "text", text: `No module with id ${module_id}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(mod, null, 2) }],
      structuredContent: { module: mod },
    };
  },
});

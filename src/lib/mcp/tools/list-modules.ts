import { defineTool } from "@lovable.dev/mcp-js";
import { mcpCourseModules } from "../course";

export default defineTool({
  name: "list_modules",
  title: "List course modules",
  description: "Return the outline of every module in the course (id, title, subtitle).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const outline = mcpCourseModules.map((m) => ({ id: m.id, title: m.title, subtitle: m.subtitle }));
    return {
      content: [{ type: "text", text: JSON.stringify(outline, null, 2) }],
      structuredContent: { modules: outline },
    };
  },
});

import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase-client";
import { mcpCourseModules } from "../course";

export default defineTool({
  name: "mark_module_complete",
  title: "Mark a module complete",
  description:
    "Mark one module as completed for the signed-in user. Optionally record their quiz score.",
  inputSchema: {
    module_id: z.number().int().describe("Module id to mark complete."),
    quiz_score: z.number().int().optional().describe("Number of quiz answers correct."),
    quiz_total: z.number().int().optional().describe("Total quiz questions."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ module_id, quiz_score, quiz_total }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!mcpCourseModules.some((m) => m.id === module_id)) {
      return { content: [{ type: "text", text: `Unknown module id ${module_id}` }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("course_progress")
      .upsert(
        {
          user_id: ctx.getUserId(),
          module_id,
          completed: true,
          quiz_score: quiz_score ?? null,
          quiz_total: quiz_total ?? null,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,module_id" },
      )
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Marked module ${module_id} complete.` }],
      structuredContent: { row: data },
    };
  },
});

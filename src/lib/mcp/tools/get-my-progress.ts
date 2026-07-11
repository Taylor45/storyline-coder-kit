import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase-client";
import { TOTAL_MODULES } from "../course";

export default defineTool({
  name: "get_my_progress",
  title: "Get my course progress",
  description: "Return the signed-in user's completed modules and overall progress.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("course_progress")
      .select("module_id, completed, quiz_score, quiz_total, completed_at")
      .eq("user_id", ctx.getUserId())
      .order("module_id");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const rows = data ?? [];
    const completed = rows.filter((r) => r.completed).map((r) => r.module_id);
    const summary = {
      user_id: ctx.getUserId(),
      total_modules: TOTAL_MODULES,
      completed_count: completed.length,
      completed_modules: completed,
      all_completed: completed.length === TOTAL_MODULES,
      progress: rows,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});

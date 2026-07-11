import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase-client";
import { TOTAL_MODULES } from "../course";

export default defineTool({
  name: "get_my_certificate",
  title: "Get my completion certificate",
  description:
    "Return the signed-in user's certificate metadata (name, status, issued date). Only issued when every module is complete.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const sb = supabaseForUser(ctx);
    const [{ data: progress, error: pErr }, { data: profile, error: prErr }] = await Promise.all([
      sb.from("course_progress").select("module_id, completed, completed_at").eq("user_id", ctx.getUserId()),
      sb.from("profiles").select("display_name").eq("id", ctx.getUserId()).maybeSingle(),
    ]);
    if (pErr) return { content: [{ type: "text", text: pErr.message }], isError: true };
    if (prErr) return { content: [{ type: "text", text: prErr.message }], isError: true };

    const completedRows = (progress ?? []).filter((r) => r.completed);
    const allDone = completedRows.length === TOTAL_MODULES;
    if (!allDone) {
      const out = {
        status: "in_progress" as const,
        completed_count: completedRows.length,
        total_modules: TOTAL_MODULES,
        message: `Certificate is issued once all ${TOTAL_MODULES} modules are complete.`,
      };
      return { content: [{ type: "text", text: JSON.stringify(out, null, 2) }], structuredContent: out };
    }
    const issuedAt = completedRows
      .map((r) => r.completed_at)
      .filter((v): v is string => !!v)
      .sort()
      .at(-1);
    const cert = {
      status: "issued" as const,
      recipient: profile?.display_name ?? ctx.getUserEmail() ?? "Learner",
      course: "Coding Basics for Instructional Designers",
      issued_at: issuedAt,
    };
    return { content: [{ type: "text", text: JSON.stringify(cert, null, 2) }], structuredContent: cert };
  },
});

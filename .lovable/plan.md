
# Add OAuth-protected MCP server to the course app

You picked "Protected with OAuth". This app doesn't have user accounts today, so we need to add auth before MCP. Here's the full sequence.

## 1. Enable Lovable Cloud + user accounts

- Enable Lovable Cloud (Supabase-backed) on the project.
- Add email/password + Google sign-in (the standard defaults).
- Add a `profiles` table linked to `auth.users` and a `course_progress` table (per-user: completed modules, quiz scores, certificate issued date). RLS scoped to `auth.uid()`.
- Wire the existing course UI (Index page, sidebar, knowledge checks, certificate) to persist progress per user instead of local state.
- Add a top-right sign-in/sign-out affordance in the existing layout.

## 2. Managed OAuth authorization server

- Call `supabase--configure_oauth_server` to turn on OAuth 2.1 + dynamic client registration so ChatGPT / Claude / Cursor can self-register.
- Add the consent route at `/.lovable/oauth/consent` using the app's Supabase client — approve/deny, redirect back to the OAuth client.
- Make sure the login/signup and Google flows preserve the full consent URL so users return to the same authorization after signing in.

## 3. MCP server (this app as a resource server)

Using `@lovable.dev/mcp-js` + the Supabase Vite plugin:

- `src/lib/mcp/index.ts` — `defineMcp` with OAuth verifier bound to the direct `supabase.co` issuer.
- `src/lib/mcp/tools/` — one file per tool, each forwarding the caller's bearer token so RLS runs as that user:
  - `list_modules` — course outline (public content).
  - `get_module` — full content of one module.
  - `get_my_progress` — signed-in user's completed modules and quiz scores.
  - `mark_module_complete` — mark a module done (destructive hint, needs approval).
  - `submit_quiz_answer` — record a knowledge-check answer.
  - `get_my_certificate` — return certificate metadata (name, date, status) once all modules are done.
- Add `mcpPlugin()` to `vite.config.ts` — it generates `supabase/functions/mcp/index.ts` at build time.
- Add a simple favicon so the connector shows a proper icon.

## 4. Verify + deploy

- Run the MCP manifest extractor after the entry is written.
- Deploy the `mcp` edge function.
- Confirm: signed-out users see a friendly login prompt on the consent route; signed-in users can approve; MCP clients can list and call tools.

## Technical notes

- Issuer: `https://${VITE_SUPABASE_PROJECT_ID}.supabase.co/auth/v1` (never the `.lovable.cloud` proxy).
- Tools that read/write user data build a per-request Supabase client with `Authorization: Bearer ${ctx.getToken()}`; never service-role.
- Course content (module titles, sections) stays hardcoded in `src/data/courseData.ts`; only progress is in the DB.
- No changes to the visual design system, sidebar layout, or existing UI beyond the added auth entry point.

## What you'll do after I ship it

- Sign in once in the app.
- In ChatGPT/Claude/Cursor, add the MCP server URL Lovable shows in More → Agent integrations.
- Approve the consent screen — the assistant can then read your course progress and mark modules complete on your behalf.

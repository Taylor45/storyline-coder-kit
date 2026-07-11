import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listModules from "./tools/list-modules";
import getModule from "./tools/get-module";
import getMyProgress from "./tools/get-my-progress";
import markModuleComplete from "./tools/mark-module-complete";
import getMyCertificate from "./tools/get-my-certificate";

// Issuer must be the direct supabase.co host, built from the project ref that
// Vite inlines at build time. Never derive from SUPABASE_URL (may be a proxy).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "coding-basics-mcp",
  title: "Coding Basics for Instructional Designers",
  version: "0.1.0",
  instructions:
    "Tools for the 'Coding Basics for Instructional Designers' course. " +
    "Use list_modules and get_module to read course content (public). " +
    "Use get_my_progress, mark_module_complete, and get_my_certificate to read or update the signed-in user's own progress.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listModules, getModule, getMyProgress, markModuleComplete, getMyCertificate],
});

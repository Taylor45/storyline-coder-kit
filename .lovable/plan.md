

## Plan: Update Sidebar and Introduction Page UX

Based on the reference screenshot, here are the changes needed:

### 1. Sidebar Header Redesign
- Replace the sparkles/decorative lines with a **code icon `</>`** centered at the top
- Change text to **"CODING BASICS"** (large), **"FOR"** (small), **"INSTRUCTIONAL DESIGNERS"** (medium) — all centered, uppercase
- Remove the "For Instructional Design" subtitle line and decorative dividers

### 2. Introduction Page Updates
- Change title from "JavaScript for Instructional Design" to **"Coding Basics for Instructional Designers"**
- Change "Course Highlights" label text to **"Course Highlights"** (already matches)
- Restyle the 3 highlight cards: change from white/glass cards to **solid blue gradient rounded-pill cards** with white text (matching the reference's pill-shaped blue cards)
- Update learning objectives header to **"By the end of this course you should be able to:"** (bold)
- Swap the green `CheckCircle` icons to **blue/teal double-check shield icons** (matching the reference)
- Restyle the Prerequisites card to a **light gray background** (subtle, flat) instead of the current white/glass style

### Files to Edit
- **`src/components/CourseSidebar.tsx`** — Sidebar header redesign
- **`src/components/WelcomePage.tsx`** — Introduction page content and card styling updates


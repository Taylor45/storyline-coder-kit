import { courseModules } from "@/data/courseData";
import { Check, Award, Lock, LogOut, Database, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

interface CourseSidebarProps {
  currentModule: number;
  completedModules: number[];
  onSelectModule: (id: number) => void;
  allCompleted: boolean;
  isCompletionView?: boolean;
  isIntroView?: boolean;
  onSelectCompletion?: () => void;
  onSelectIntro?: () => void;
  onHome?: () => void;
  isAdmin?: boolean;
  viewMode?: "student" | "admin";
  onToggleViewMode?: () => void;
  onClose?: () => void;
}

const getModuleSubtitle = (id: number, defaultSub: string) => {
  switch (id) {
    case 1:
      return "Understand the foundations of the interactivity";
    case 2:
      return "Structure your educational content with HTML &...";
    case 3:
      return "Create beautiful, accessible learning";
    case 4:
      return "Extend Storyline's built-in functionality...";
    case 5:
      return "Dynamic content, branching scenario..";
    case 6:
      return "Connect Storyline courses to external";
    case 7:
      return "Practice with hands-on Storyline challenges";
    default:
      return defaultSub;
  }
};

const CourseSidebar = ({
  currentModule,
  completedModules,
  onSelectModule,
  allCompleted,
  isCompletionView,
  isIntroView,
  onSelectCompletion,
  onSelectIntro,
  onHome,
  isAdmin,
  viewMode,
  onToggleViewMode,
  onClose,
}: CourseSidebarProps) => {
  const totalModules = courseModules.length;
  const progress = Math.round((completedModules.length / totalModules) * 100);

  return (
    <aside className="w-full h-full flex flex-col bg-[#111827] text-white border-r border-sidebar-border shrink-0 overflow-hidden font-sans">
      {/* Header */}
      <div className="px-4 py-3 xl:py-4 bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(0,0%,5%)] relative overflow-hidden shrink-0 border-b border-white/10">
        <div className="relative z-10 flex flex-col items-center w-full pr-10 lg:pr-0">
          {/* Top </ > divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 w-full mb-1.5"
          >
            <div className="flex-1 h-[1.5px] bg-white/40" />
            <span className="text-white font-mono font-bold text-xs tracking-widest px-1">&lt;/&gt;</span>
            <div className="flex-1 h-[1.5px] bg-white/40" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs sm:text-sm xl:text-base font-black tracking-wide uppercase text-white text-center leading-none"
          >
            Coding Basics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/80 text-center my-0.5"
          >
            For
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] xl:text-xs font-black tracking-wider uppercase text-white text-center leading-tight"
          >
            Instructional Design
          </motion.p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-3.5 py-2 bg-[#18202c] border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between text-[11px] text-white/80 font-medium mb-1">
          <span>Progress</span>
          <span className="text-[10px] text-white/60">{completedModules.length} of {totalModules} complete</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#0070f3] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Module List */}
      <nav className="flex-1 py-0.5 min-h-0 flex flex-col overflow-y-auto bg-[#131b2a] divide-y divide-white/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              onToggleViewMode?.();
              onClose?.();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 xl:py-2 text-left bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 transition-colors cursor-pointer shrink-0 font-bold"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-600 text-white shrink-0">
              <Database className="w-3 h-3" />
            </div>
            <p className="text-[11px] xl:text-[12px] truncate">
              {viewMode === "admin" ? "Switch to Course View" : "Instructor Console"}
            </p>
          </button>
        )}

        {/* Introduction */}
        <button
          type="button"
          onClick={() => {
            onSelectIntro?.();
            onClose?.();
          }}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-1.5 xl:py-2 text-left transition-all cursor-pointer shrink-0",
            isIntroView
              ? "bg-[#1c2e4a] border-l-2 border-blue-500"
              : "hover:bg-white/5"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center w-6 h-6 xl:w-6.5 xl:h-6.5 rounded-md shrink-0",
              isIntroView ? "bg-[#1d4ed8] text-white" : "bg-[#243247] text-white/90"
            )}
          >
            <Star className="w-3 h-3 fill-current" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn("text-[12px] xl:text-[13px] font-bold text-white leading-tight truncate", isIntroView && "text-blue-300")}>
              Introduction
            </p>
            <p className="text-[10px] xl:text-[11px] text-white/60 truncate leading-tight mt-0.5">
              Course Overview
            </p>
          </div>
        </button>

        {/* Modules */}
        {courseModules.map((mod) => {
          const isCompleted = completedModules.includes(mod.id);
          const isCurrent = currentModule === mod.id && !isCompletionView && !isIntroView;
          const isLocked = !isCompleted && !isCurrent;
          const isClickable = isCompleted || isCurrent;

          return (
            <button
              type="button"
              key={mod.id}
              onClick={() => {
                if (isClickable) {
                  onSelectModule(mod.id);
                  onClose?.();
                }
              }}
              disabled={!isClickable}
              aria-disabled={!isClickable}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-1.5 xl:py-2 text-left transition-all shrink-0",
                isCurrent
                  ? "bg-[#1c2e4a] border-l-2 border-blue-500"
                  : isLocked
                  ? "opacity-80 hover:bg-white/5 cursor-not-allowed"
                  : "hover:bg-white/5 cursor-pointer"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 xl:w-6.5 xl:h-6.5 rounded-md shrink-0 text-[11px] font-bold",
                  isCompleted
                    ? "bg-[#9da5a5] text-white"
                    : isCurrent
                    ? "bg-[#0070f3] text-white"
                    : "bg-[#1d4ed8] text-white"
                )}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 stroke-[2.5]" />
                ) : isLocked ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  mod.id
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn("text-[12px] xl:text-[13px] font-bold text-white leading-tight truncate", isCurrent && "text-blue-300")}>
                  {mod.title}
                </p>
                <p className="text-[10px] xl:text-[11px] text-white/60 truncate leading-tight mt-0.5">
                  {getModuleSubtitle(mod.id, mod.subtitle)}
                </p>
              </div>
            </button>
          );
        })}

        {/* Completion tab */}
        <button
          type="button"
          onClick={() => {
            if (allCompleted) {
              onSelectCompletion?.();
              onClose?.();
            }
          }}
          disabled={!allCompleted}
          aria-disabled={!allCompleted}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-1.5 xl:py-2 text-left transition-all shrink-0",
            !allCompleted
              ? "opacity-80 cursor-not-allowed"
              : isCompletionView
              ? "bg-[#1c2e4a] border-l-2 border-blue-500"
              : "hover:bg-white/5 cursor-pointer"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center w-6 h-6 xl:w-6.5 xl:h-6.5 rounded-md shrink-0",
              allCompleted
                ? "bg-[#9da5a5] text-white"
                : "bg-[#1d4ed8] text-white"
            )}
          >
            {allCompleted ? <Award className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn("text-[12px] xl:text-[13px] font-bold text-white leading-tight truncate", isCompletionView && "text-blue-300")}>
              Completion
            </p>
            <p className="text-[10px] xl:text-[11px] text-white/60 truncate leading-tight mt-0.5">
              Complete all the modules to earn a certificate
            </p>
          </div>
        </button>
      </nav>

      {/* Footer */}
      <div className="px-3 py-1.5 xl:py-2 border-t border-sidebar-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(0,0%,5%)] flex items-center justify-end gap-1.5 shrink-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <ThemeToggle className="w-7 h-7 text-white/80 hover:text-white hover:bg-white/10" />
          {onHome && (
            <button
              id="sidebar-home-button"
              onClick={() => {
                onHome();
                onClose?.();
              }}
              className="w-7 h-7 rounded-md bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0 text-white"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CourseSidebar;
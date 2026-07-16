import { courseModules } from "@/data/courseData";
import { Check, Award, Lock, Target, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
}

const CourseSidebar = ({ currentModule, completedModules, onSelectModule, allCompleted, isCompletionView, isIntroView, onSelectCompletion, onSelectIntro, onHome }: CourseSidebarProps) => {
  const totalModules = courseModules.length;
  const progress = Math.round(completedModules.length / totalModules * 100);

  return (
    <aside className="w-full h-full flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-sidebar-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(220,80%,15%)] relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />
        <div className="relative z-10 flex flex-col items-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex items-center gap-2 w-full mb-1.5"
          >
            <div className="flex-1 h-[1px] bg-white/40" />
            <span className="text-white font-mono font-bold text-base">&lt;/&gt;</span>
            <div className="flex-1 h-[1px] bg-white/40" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="text-sm font-extrabold tracking-wide uppercase text-white text-center leading-tight"
          >
            Coding Basics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
            className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/80 text-center mt-0.5"
          >
            For Instructional Designers
          </motion.p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-2 border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-sidebar-foreground/70">Progress</span>
          <span className="font-semibold text-primary-foreground">{progress}% · {completedModules.length}/{totalModules}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6),0_0_16px_rgba(100,180,255,0.4)]"
            style={{ width: `${progress}%`, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>
      </div>

      {/* Module List */}
      <nav className="flex-1 py-1 min-h-0 flex flex-col">
        <button
          type="button"
          onClick={() => onSelectIntro?.()}
          className={cn(
            "w-full flex items-center gap-2.5 px-4 py-1.5 text-left transition-colors border-b border-sidebar-border hover:bg-sidebar-accent/60 cursor-pointer shrink-0",
            isIntroView ?
            "bg-sidebar-accent text-sidebar-accent-foreground" :
            "text-sidebar-foreground/80"
          )}>
          <div className={cn(
            "flex items-center justify-center w-6 h-6 rounded-md shrink-0",
            isIntroView ? "bg-gradient-to-br from-[#00BBFF] to-[#1B68B1] text-white" : "bg-sidebar-primary text-sidebar-foreground/50"
          )}>
            <Target className="w-3 h-3" />
          </div>
          <p className={cn("text-[13px] font-medium truncate", isIntroView && "text-sidebar-primary-foreground")}>
            Introduction
          </p>
        </button>

        {courseModules.map((mod) => {
          const isCompleted = completedModules.includes(mod.id);
          const isCurrent = currentModule === mod.id && !isCompletionView && !isIntroView;
          const isLocked = !isCompleted && !isCurrent;
          const isClickable = isCompleted || isCurrent;

          return (
            <button
              type="button"
              key={mod.id}
              onClick={() => isClickable && onSelectModule(mod.id)}
              disabled={!isClickable}
              aria-disabled={!isClickable}
              className={cn(
                "w-full flex items-center gap-2.5 px-4 py-1.5 text-left transition-colors shrink-0",
                isCurrent ?
                "bg-sidebar-accent text-sidebar-accent-foreground" :
                isLocked ?
                "opacity-60 cursor-not-allowed" :
                "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 cursor-pointer"
              )}>
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-md shrink-0 text-[11px] font-bold",
                  isCompleted ?
                  "bg-success text-success-foreground" :
                  isCurrent ?
                  "bg-sidebar-primary text-sidebar-primary-foreground" :
                  "bg-sidebar-primary text-sidebar-foreground/50"
                )}>
                {isCompleted ? <Check className="w-3 h-3" /> : isLocked ? <Lock className="w-3 h-3" /> : mod.id}
              </div>
              <p
                className={cn(
                  "text-[13px] font-medium truncate",
                  isCurrent && "text-sidebar-primary-foreground"
                )}>
                {mod.title}
              </p>
            </button>);
        })}

        {/* Completion tab */}
        <button
          type="button"
          onClick={() => allCompleted && onSelectCompletion?.()}
          disabled={!allCompleted}
          aria-disabled={!allCompleted}
          className={cn(
            "w-full flex items-center gap-2.5 px-4 py-1.5 text-left transition-colors border-t border-sidebar-border mt-auto shrink-0",
            !allCompleted ?
            "opacity-50 cursor-not-allowed" :
            isCompletionView ?
            "bg-sidebar-accent text-sidebar-accent-foreground" :
            "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 cursor-pointer"
          )}>
          <div className={cn(
            "flex items-center justify-center w-6 h-6 rounded-md shrink-0",
            allCompleted ? "bg-success text-success-foreground" : "bg-sidebar-primary text-sidebar-foreground/50"
          )}>
            {allCompleted ? <Award className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          </div>
          <p className={cn("text-[13px] font-medium truncate", isCompletionView && "text-sidebar-primary-foreground")}>
            Completion
          </p>
        </button>
      </nav>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-sidebar-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(0,0%,5%)] flex items-center justify-between shrink-0">
        <p className="text-[10px] text-white/70 truncate">
          Designed for IDs
        </p>
        {onHome && (
          <button
            onClick={onHome}
            className="w-7 h-7 rounded-md bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0"
            title="Back to Login"
          >
            <Home className="w-3.5 h-3.5 text-white" />
          </button>
        )}
      </div>
    </aside>);

};

export default CourseSidebar;
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
    <aside className="w-72 min-h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(220,80%,15%)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-3"
          >
            <span className="text-white font-mono font-bold text-lg">&lt;/&gt;</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="text-lg font-extrabold tracking-wide uppercase text-white text-center drop-shadow-[0_0_10px_rgba(100,180,255,0.4)]"
          >
            Coding Basics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
            className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/50 text-center mt-0.5"
          >
            For
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
            className="text-xs font-bold tracking-[0.15em] uppercase text-white/80 text-center mt-0.5"
          >
            Instructional Designers
          </motion.p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 py-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-sidebar-foreground/70">Progress</span>
          <span className="font-semibold text-primary-foreground">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6),0_0_16px_rgba(100,180,255,0.4)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
            style={{ width: `${progress}%`, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          
        </div>
        <p className="text-[11px] text-sidebar-foreground/50 mt-2">
          {completedModules.length} of {totalModules} modules complete
        </p>
      </div>

      {/* Module List */}
      <nav className="flex-1 py-3">
        {/* Introduction item */}
        <div
          className={cn(
            "w-full flex items-start gap-3 px-5 py-2.5 text-left transition-colors mb-1 border-b border-sidebar-border pb-3",
            isIntroView ?
            "bg-sidebar-accent text-sidebar-accent-foreground" :
            "text-sidebar-foreground/80"
          )}>
          
          <div className={cn(
            "mt-0.5 flex items-center justify-center w-7 h-7 rounded-md shrink-0",
            isIntroView ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-sidebar-accent text-sidebar-foreground/50"
          )}>
            <Target className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className={cn("text-sm font-medium truncate", isIntroView && "text-sidebar-primary-foreground")}>
              Introduction
            </p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">
              Course Overview
            </p>
          </div>
        </div>

        {courseModules.map((mod) => {
          const isCompleted = completedModules.includes(mod.id);
          const isCurrent = currentModule === mod.id && !isCompletionView && !isIntroView;
          const isLocked = !isCompleted && !isCurrent;

          return (
            <div
              key={mod.id}
              className={cn(
                "w-full flex items-start gap-3 px-5 py-3 text-left transition-colors",
                isCurrent ?
                "bg-sidebar-accent text-sidebar-accent-foreground" :
                isLocked ?
                "opacity-60" :
                "text-sidebar-foreground/80"
              )}>
              
              <div
                className={cn(
                  "mt-0.5 flex items-center justify-center w-7 h-7 rounded-md shrink-0 text-xs font-bold",
                  isCompleted ?
                  "bg-success text-success-foreground" :
                  isCurrent ?
                  "bg-sidebar-primary text-sidebar-primary-foreground" :
                  "bg-sidebar-accent text-sidebar-foreground/50"
                )}>
                
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : isLocked ? <Lock className="w-3.5 h-3.5" /> : mod.id}
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    isCurrent && "text-sidebar-primary-foreground"
                  )}>
                  
                  {mod.title}
                </p>
                <p className="text-[11px] text-sidebar-foreground/50 truncate">
                  {mod.subtitle}
                </p>
              </div>
            </div>);

        })}

        {/* Completion tab */}
        <div
          className={cn(
            "w-full flex items-start gap-3 px-5 py-3 text-left transition-colors mt-2 border-t border-sidebar-border pt-4",
            !allCompleted ?
            "opacity-50" :
            isCompletionView ?
            "bg-sidebar-accent text-sidebar-accent-foreground" :
            "text-sidebar-foreground/80"
          )}>
          
          <div className={cn(
            "mt-0.5 flex items-center justify-center w-7 h-7 rounded-md shrink-0",
            allCompleted ? "bg-success text-success-foreground" : "bg-sidebar-accent text-sidebar-foreground/50"
          )}>
            {allCompleted ? <Award className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          </div>
          <div className="min-w-0">
            <p className={cn("text-sm font-medium truncate", isCompletionView && "text-sidebar-primary-foreground")}>
              Completion
            </p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">
              {allCompleted ? "Certificate & Results" : "Complete all modules to unlock"}
            </p>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(0,0%,5%)] flex items-center justify-between">
        <p className="text-[10px] text-white/70">
          Designed for Instructional Designers
        </p>
        {onHome && (
          <button
            onClick={onHome}
            className="w-8 h-8 rounded-md bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
            title="Back to Login"
          >
            <Home className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </aside>);

};

export default CourseSidebar;
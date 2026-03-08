import { courseModules } from "@/data/courseData";
import { Check, Award, Lock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  currentModule: number;
  completedModules: number[];
  onSelectModule: (id: number) => void;
  allCompleted: boolean;
  isCompletionView?: boolean;
  isIntroView?: boolean;
  onSelectCompletion?: () => void;
  onSelectIntro?: () => void;
}

const CourseSidebar = ({ currentModule, completedModules, onSelectModule, allCompleted, isCompletionView, isIntroView, onSelectCompletion, onSelectIntro }: CourseSidebarProps) => {
  const totalModules = courseModules.length;
  const progress = Math.round((completedModules.length / totalModules) * 100);

  return (
    <aside className="w-72 min-h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0 max-h-screen overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-sidebar-border">
        <h1 className="text-base font-bold tracking-tight text-sidebar-primary-foreground text-center">
          JavaScript Coding Basics
        </h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1 text-center">For Instructional Design</p>
      </div>

      {/* Progress */}
      <div className="px-5 py-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-sidebar-foreground/70">Progress</span>
          <span className="font-semibold text-sidebar-primary">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-sidebar-accent overflow-hidden">
          <div
            className="h-full rounded-full progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-sidebar-foreground/50 mt-2">
          {completedModules.length} of {totalModules} modules complete
        </p>
      </div>

      {/* Module List */}
      <nav className="flex-1 overflow-y-auto py-3">
        {/* Introduction item */}
        <button
          onClick={() => onSelectIntro?.()}
          className={cn(
            "w-full flex items-start gap-3 px-5 py-3 text-left transition-colors mb-1 border-b border-sidebar-border pb-4",
            isIntroView
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
          )}
        >
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
              Learning Objectives
            </p>
          </div>
        </button>

        {courseModules.map((mod) => {
          const isCompleted = completedModules.includes(mod.id);
          const isCurrent = currentModule === mod.id && !isCompletionView;

          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={cn(
                "w-full flex items-start gap-3 px-5 py-3 text-left transition-colors",
                isCurrent
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex items-center justify-center w-7 h-7 rounded-md shrink-0 text-xs font-bold",
                  isCompleted
                    ? "bg-success text-success-foreground"
                    : isCurrent
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "bg-sidebar-accent text-sidebar-foreground/50"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : mod.id}
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    isCurrent && "text-sidebar-primary-foreground"
                  )}
                >
                  {mod.title}
                </p>
                <p className="text-[11px] text-sidebar-foreground/50 truncate">
                  {mod.subtitle}
                </p>
              </div>
            </button>
          );
        })}

        {/* Completion tab - always visible, locked when not all complete */}
        <button
          onClick={() => allCompleted && onSelectCompletion?.()}
          disabled={!allCompleted}
          className={cn(
            "w-full flex items-start gap-3 px-5 py-3 text-left transition-colors mt-2 border-t border-sidebar-border pt-4",
            !allCompleted
              ? "opacity-50 cursor-not-allowed"
              : isCompletionView
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
          )}
        >
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
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border text-center">
        <p className="text-[10px] text-sidebar-foreground/40">
          Designed for Instructional Designers
        </p>
      </div>
    </aside>
  );
};

export default CourseSidebar;

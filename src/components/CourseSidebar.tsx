import { courseModules } from "@/data/courseData";
import { Check, Award, Lock, Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  currentModule: number;
  completedModules: number[];
  onSelectModule: (id: number) => void;
  allCompleted: boolean;
  isCompletionView?: boolean;
  isIntroView?: boolean;
  isWelcomeView?: boolean;
  onSelectCompletion?: () => void;
  onSelectIntro?: () => void;
  onSelectWelcome?: () => void;
}

const CourseSidebar = ({ currentModule, completedModules, onSelectModule, allCompleted, isCompletionView, isIntroView, isWelcomeView, onSelectCompletion, onSelectIntro, onSelectWelcome }: CourseSidebarProps) => {
  const totalModules = courseModules.length;
  const progress = Math.round((completedModules.length / totalModules) * 100);

  return (
    <aside className="w-72 min-h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0">
      {/* Header */}
      <div className="p-5 border-b border-sidebar-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(0,0%,5%)] rounded-b-none">
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
      <nav className="flex-1 py-3">
        {/* Welcome item */}
        <div
          className={cn(
            "w-full flex items-start gap-3 px-5 py-2.5 text-left transition-colors",
            isWelcomeView
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/80"
          )}
        >
          <div className={cn(
            "mt-0.5 flex items-center justify-center w-7 h-7 rounded-md shrink-0",
            isWelcomeView ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-sidebar-accent text-sidebar-foreground/50"
          )}>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className={cn("text-sm font-medium truncate", isWelcomeView && "text-sidebar-primary-foreground")}>
              Welcome
            </p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">
              Course Overview
            </p>
          </div>
        </div>

        {/* Introduction item */}
        <div
          className={cn(
            "w-full flex items-start gap-3 px-5 py-2.5 text-left transition-colors mb-1 border-b border-sidebar-border pb-3",
            isIntroView
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/80"
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
        </div>

        {courseModules.map((mod) => {
          const isCompleted = completedModules.includes(mod.id);
          const isCurrent = currentModule === mod.id && !isCompletionView && !isIntroView && !isWelcomeView;
          const isLocked = !isCompleted && !isCurrent;

          return (
            <div
              key={mod.id}
              className={cn(
                "w-full flex items-start gap-3 px-5 py-3 text-left transition-colors",
                isCurrent
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : isLocked
                  ? "opacity-60"
                  : "text-sidebar-foreground/80"
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
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : isLocked ? <Lock className="w-3.5 h-3.5" /> : mod.id}
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
            </div>
          );
        })}

        {/* Completion tab */}
        <div
          className={cn(
            "w-full flex items-start gap-3 px-5 py-3 text-left transition-colors mt-2 border-t border-sidebar-border pt-4",
            !allCompleted
              ? "opacity-50"
              : isCompletionView
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/80"
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
        </div>
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

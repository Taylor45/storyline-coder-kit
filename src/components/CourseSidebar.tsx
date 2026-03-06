import { courseModules } from "@/data/courseData";
import { Check, Lock, X, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  currentModule: number;
  completedModules: number[];
  onSelectModule: (id: number) => void;
  allCompleted?: boolean;
}

const CourseSidebar = ({ currentModule, completedModules, onSelectModule, allCompleted }: CourseSidebarProps) => {
  const totalModules = courseModules.length;
  const progress = Math.round((completedModules.length / totalModules) * 100);

  const isModuleUnlocked = (moduleId: number) => {
    if (moduleId === 1) return true;
    return completedModules.includes(moduleId - 1);
  };

  return (
    <aside className="w-80 min-h-screen flex flex-col bg-sidebar text-sidebar-foreground shrink-0">
      {/* Close button */}
      <div className="flex justify-end p-3">
        <div className="w-7 h-7 rounded bg-sidebar-accent/50 flex items-center justify-center">
          <X className="w-4 h-4 text-sidebar-foreground" />
        </div>
      </div>

      {/* Title */}
      <div className="px-6 pb-6 text-center">
        <h1 className="text-xl font-bold text-sidebar-foreground leading-tight">
          JavaScript for<br />Instructional Designers
        </h1>
      </div>

      {/* Progress */}
      <div className="mx-5 mb-6 rounded-lg bg-sidebar-primary p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-sidebar-foreground">Your progress</span>
          <span className="font-bold text-sidebar-foreground">{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-sidebar-foreground/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-sidebar-foreground transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Module List */}
      <nav className="flex-1 overflow-y-auto px-5 space-y-3 pb-4">
        {courseModules.map((mod) => {
          const isCompleted = completedModules.includes(mod.id);
          const isCurrent = currentModule === mod.id;
          const unlocked = isModuleUnlocked(mod.id);

          return (
            <button
              key={mod.id}
              onClick={() => unlocked && onSelectModule(mod.id)}
              disabled={!unlocked}
              className={cn(
                "w-full flex items-center gap-4 py-3 transition-all",
                unlocked ? "cursor-pointer" : "cursor-not-allowed opacity-70"
              )}
            >
              {/* Lock/Check icon */}
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  isCompleted
                    ? "bg-success"
                    : "bg-sidebar-primary"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-success-foreground" />
                ) : (
                  <Lock className="w-5 h-5 text-sidebar-primary-foreground" />
                )}
              </div>

              {/* Module label */}
              <div
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-left text-sm font-semibold transition-all",
                  isCurrent
                    ? "bg-sidebar-foreground text-sidebar-primary shadow-lg"
                    : "bg-sidebar-foreground/90 text-sidebar-primary"
                )}
              >
                {mod.title}
              </div>
            </button>
          );
        })}

        {/* Completion button */}
        <button
          onClick={() => allCompleted && onSelectModule(courseModules.length)}
          disabled={!allCompleted}
          className={cn(
            "w-full flex items-center gap-4 py-3 transition-all",
            allCompleted ? "cursor-pointer" : "cursor-not-allowed opacity-70"
          )}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              allCompleted ? "bg-success" : "bg-sidebar-primary"
            )}
          >
            {allCompleted ? (
              <Award className="w-5 h-5 text-success-foreground" />
            ) : (
              <Lock className="w-5 h-5 text-sidebar-primary-foreground" />
            )}
          </div>
          <div
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-left text-sm font-semibold",
              "bg-sidebar-foreground/90 text-sidebar-primary"
            )}
          >
            Completion
          </div>
        </button>
      </nav>
    </aside>
  );
};

export default CourseSidebar;

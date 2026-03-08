import { CourseModule } from "@/data/courseData";
import { ChevronLeft, ChevronRight, BookOpen, Code, Wrench, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import KnowledgeCheck from "./KnowledgeCheck";
import LiveCodeLab from "./LiveCodeLab";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "./ui/alert-dialog";

import { cn } from "@/lib/utils";

interface ModuleContentProps {
  module: CourseModule;
  onComplete: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish?: () => void;
  isFirst: boolean;
  isLast: boolean;
  isCompleted: boolean;
  allCompleted?: boolean;
  userName?: string;
}

type Tab = "lesson" | "quiz" | "project" | "codelab";

const ModuleContent = ({
  module,
  onComplete,
  onPrev,
  onNext,
  onFinish,
  isFirst,
  isLast,
  isCompleted,
  allCompleted,
  userName,
}: ModuleContentProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("lesson");
  const [showQuizAlert, setShowQuizAlert] = useState(false);
  const Icon = module.icon;

  const tabs: { id: Tab; label: string; shortLabel: string; icon: typeof BookOpen; show: boolean }[] = [
    { id: "lesson", label: "Lesson", shortLabel: "Lesson", icon: BookOpen, show: true },
    { id: "codelab", label: "Code Lab", shortLabel: "Lab", icon: FlaskConical, show: module.id === 7 },
    { id: "quiz", label: "Knowledge Check", shortLabel: "Quiz", icon: Code, show: !!module.quiz },
    { id: "project", label: "Mini Project", shortLabel: "Project", icon: Wrench, show: !!module.miniProject },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Module {module.id}</p>
            <h2 className="text-sm font-semibold leading-tight truncate">{module.title}</h2>
          </div>
        </div>
        {isCompleted && (
          <span className="ml-auto text-xs bg-success/10 text-success px-3 py-1 rounded-full font-medium shrink-0">
            Completed
          </span>
        )}
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card px-4 md:px-6">
        <div className="flex gap-0">
          {tabs
            .filter((t) => t.show)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 md:px-4 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 md:gap-2",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <AnimatePresence mode="wait">
            {activeTab === "lesson" && (
              <motion.div
                key="lesson"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="mb-6 md:mb-8">
                  <h1 className="text-xl md:text-2xl font-bold mb-2">{module.title}</h1>
                  <p className="text-sm md:text-base text-muted-foreground">{module.subtitle}</p>
                </div>

                <div className="space-y-8 md:space-y-10">
                  {module.sections.map((section, i) => (
                    <section key={i}>
                      <h3 className="text-base md:text-lg font-semibold mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        {section.title}
                      </h3>
                      <div className="text-sm text-foreground/85 leading-relaxed space-y-3">
                        {section.content.split("\n\n").map((para, pi) => (
                          <p key={pi}>
                            {para.split(/(\*\*[^*]+\*\*)/g).map((part, parti) => {
                              if (part.startsWith("**") && part.endsWith("**")) {
                                return (
                                  <strong key={parti} className="font-semibold text-foreground">
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              if (part.includes("`")) {
                                return part.split(/(`[^`]+`)/g).map((seg, si) => {
                                  if (seg.startsWith("`") && seg.endsWith("`")) {
                                    return (
                                      <code
                                        key={si}
                                        className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary"
                                      >
                                        {seg.slice(1, -1)}
                                      </code>
                                    );
                                  }
                                  return seg;
                                });
                              }
                              return part;
                            })}
                          </p>
                        ))}
                      </div>
                      {section.codeExample && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Code className="w-3.5 h-3.5" />
                            {section.codeLanguage?.toUpperCase() || "CODE"}
                          </div>
                          <pre className="course-code-block text-xs leading-relaxed overflow-x-auto">
                            <code>{section.codeExample}</code>
                          </pre>
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "quiz" && module.quiz && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <KnowledgeCheck
                  questions={module.quiz}
                  onPass={() => {
                    onComplete();
                    setActiveTab("lesson");
                  }}
                />
              </motion.div>
            )}

            {activeTab === "codelab" && module.id === 7 && (
              <motion.div
                key="codelab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <LiveCodeLab />
              </motion.div>
            )}

            {activeTab === "project" && module.miniProject && (
              <motion.div
                key="project"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{module.miniProject.title}</h3>
                      <p className="text-sm text-muted-foreground">Hands-on Practice</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/85 mb-5">{module.miniProject.description}</p>
                  <div className="space-y-3">
                    {module.miniProject.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-foreground/80">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom nav */}
      <footer className="h-14 md:h-16 border-t border-border bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={cn(
            "flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all",
            isFirst
              ? "text-muted-foreground/40 cursor-not-allowed"
              : "text-foreground hover:bg-muted"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        {!isCompleted && (
          <button
            onClick={onComplete}
            className="px-3 md:px-5 py-2 rounded-lg bg-success text-success-foreground text-xs md:text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Mark Complete
          </button>
        )}

        <button
          onClick={isLast ? onFinish : onNext}
          className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all bg-primary text-primary-foreground hover:opacity-90"
        >
          {isLast ? "Finish" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};

export default ModuleContent;

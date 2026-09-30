import { CourseModule } from "@/data/courseData";
import { ChevronLeft, ChevronRight, BookOpen, Code, Wrench, FlaskConical, UserCircle, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import KnowledgeCheck from "./KnowledgeCheck";
import LiveCodeLab from "./LiveCodeLab";

import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  section: { title: string; content: string; codeExample?: string; codeLanguage?: string };
  defaultOpen: boolean;
}

const CollapsibleSection = ({ section, defaultOpen }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <section className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-base md:text-lg font-semibold flex items-center gap-2 px-4 py-3 bg-card hover:bg-muted/50 transition-colors"
      >
        <ChevronRight className={cn("w-5 h-5 text-foreground shrink-0 transition-transform duration-200", isOpen && "rotate-90")} />
        {section.title}
      </button>
      <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
        <div className="px-4 pb-4 pt-2">
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
                          <code key={si} className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary">
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
        </div>
        </motion.div>
      )}
      </AnimatePresence>
    </section>
  );
};

interface ModuleContentProps {
  module: CourseModule;
  onComplete: (score?: number, total?: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish?: () => void;
  isFirst: boolean;
  isLast: boolean;
  isCompleted: boolean;
  allCompleted?: boolean;
  userName?: string;
  onMenuOpen?: () => void;
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
  onMenuOpen,
}: ModuleContentProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("lesson");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const Icon = module.icon;

  useEffect(() => {
    setActiveTab("lesson");
    setQuizCompleted(false);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [module.id]);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const visibleTabs = [
    { id: "lesson" as Tab, show: true },
    { id: "codelab" as Tab, show: module.id === 7 },
    { id: "quiz" as Tab, show: !!module.quiz },
    { id: "project" as Tab, show: !!module.miniProject },
  ].filter((t) => t.show).map((t) => t.id);

  const currentTabIndex = visibleTabs.indexOf(activeTab);
  const isLastTab = currentTabIndex >= visibleTabs.length - 1;

  const nextDisabled = activeTab === "quiz" && !quizCompleted;

  const handleNext = () => {
    if (nextDisabled) return;
    if (!isLastTab) {
      setActiveTab(visibleTabs[currentTabIndex + 1]);
    } else if (isLast) {
      onComplete();
      onFinish?.();
    } else {
      onComplete();
      onNext();
    }
  };

  const isFirstTab = currentTabIndex <= 0;

  const handlePrev = () => {
    if (!isFirstTab) {
      setActiveTab(visibleTabs[currentTabIndex - 1]);
    } else {
      onPrev();
    }
  };

  const tabs: { id: Tab; label: string; shortLabel: string; icon: typeof BookOpen; show: boolean }[] = [
    { id: "lesson", label: "Lesson", shortLabel: "Lesson", icon: BookOpen, show: true },
    { id: "codelab", label: "Code Lab", shortLabel: "Lab", icon: FlaskConical, show: module.id === 7 },
    { id: "quiz", label: "Knowledge Check", shortLabel: "Quiz", icon: Code, show: !!module.quiz },
    { id: "project", label: "Mini Project", shortLabel: "Project", icon: Wrench, show: !!module.miniProject },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <header className="h-14 border-b border-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(0,0%,5%)] flex items-center justify-between px-3 sm:px-4 md:px-6 shrink-0 shadow-[0_4px_15px_rgba(0,100,255,0.3)]">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {onMenuOpen && (
            <button
              onClick={onMenuOpen}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 text-white shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 min-h-[38px]"
              aria-label="Open course navigation menu"
              id="mobile-nav-hamburger"
            >
              <Menu className="w-5 h-5 text-white" />
              <span className="text-[11px] font-bold tracking-wide uppercase sm:hidden">Menu</span>
            </button>
          )}
          <div className="hidden lg:flex w-8 h-8 rounded-md bg-white/20 items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs text-white/75 font-medium leading-none mb-0.5">Module {module.id}</p>
            <h2 className="text-xs sm:text-sm font-semibold leading-tight truncate text-white">{module.title}</h2>
          </div>
        </div>
        {userName && (
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="text-xs text-white/80 hidden md:inline max-w-[140px] truncate">{userName}</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card px-2 sm:px-4 md:px-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center min-w-full sm:min-w-0 gap-1 sm:gap-2 py-0">
          <div className="flex items-center gap-0.5 sm:gap-1 flex-1 sm:flex-initial">
            {tabs
              .filter((t) => t.show)
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 sm:flex-initial px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              ))}
          </div>
          {isCompleted && (
            <span className="ml-auto text-[10px] sm:text-xs bg-success/15 text-success dark:text-emerald-400 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-semibold shrink-0 whitespace-nowrap">
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-6 md:py-8">
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

                {module.flashCards && module.flashCards.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                      Key Concepts
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {module.flashCards.map((card, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-border backdrop-blur-sm px-4 py-2.5 flex items-center gap-3 shadow-md bg-sidebar-primary"
                        >
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-lg border-primary-foreground bg-secondary text-primary">
                            {card.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-destructive-foreground">{card.title}</h3>
                            <p className="text-[11px] text-primary-foreground">{card.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4 md:space-y-5">
                  {module.sections.map((section, i) => (
                    <CollapsibleSection key={i} section={section} defaultOpen={i === 0} />
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
                    setActiveTab("lesson");
                  }}
                  onAttempt={(score, total) => {
                    setQuizCompleted(true);
                    onComplete(score, total);
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
      <footer className="h-16 md:h-18 border-t border-border bg-card/95 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 md:px-8 shrink-0 shadow-xs">
        <button
          onClick={handlePrev}
          disabled={isFirst && isFirstTab}
          className={cn(
            "group flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all select-none",
            isFirst && isFirstTab
              ? "opacity-35 cursor-not-allowed border border-border/40 text-muted-foreground bg-transparent"
              : "border border-border/80 dark:border-border/70 bg-card hover:bg-muted/80 text-foreground hover:border-foreground/20 active:scale-[0.98] shadow-xs cursor-pointer"
          )}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform",
              !(isFirst && isFirstTab) && "group-hover:-translate-x-0.5"
            )}
          />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          disabled={nextDisabled}
          title={nextDisabled ? "Pass the Knowledge Check to unlock Next" : undefined}
          className={cn(
            "group flex items-center gap-2 px-5 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all select-none",
            nextDisabled
              ? "bg-muted text-muted-foreground/60 border border-border/50 cursor-not-allowed opacity-60"
              : isLast && isLastTab
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-[0.98] cursor-pointer"
              : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
          )}
        >
          <span>{isLast && isLastTab ? "Complete Course" : "Next"}</span>
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform",
              !nextDisabled && "group-hover:translate-x-0.5"
            )}
          />
        </button>
      </footer>
      <div className="h-10 border-t border-border bg-card flex items-center justify-center shrink-0">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Bruce Mabasa. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ModuleContent;

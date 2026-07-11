import { useState, useCallback, useEffect } from "react";
import CourseSidebar from "@/components/CourseSidebar";
import ModuleContent from "@/components/ModuleContent";
import WelcomeScreen from "@/components/WelcomeScreen";
import CompletionPage from "@/components/CompletionPage";
import WelcomePage from "@/components/WelcomePage";
import { courseModules } from "@/data/courseData";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const DESKTOP_BREAKPOINT = 1024;

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= DESKTOP_BREAKPOINT : true
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const onChange = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

const Index = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const module = courseModules.find((m) => m.id === currentModule)!;

  const handleStart = (name: string, surname: string) => {
    setUserName(`${name} ${surname}`);
  };

  const handleComplete = useCallback(() => {
    setCompletedModules((prev) =>
      prev.includes(currentModule) ? prev : [...prev, currentModule]
    );
  }, [currentModule]);

  const handlePrev = () => {
    if (currentModule === 1) {
      handleSelectIntro();
    } else if (currentModule > 1) {
      setShowCompletion(false);
      setCurrentModule(currentModule - 1);
    }
  };

  const handleNext = () => {
    if (currentModule < courseModules.length) {
      setShowCompletion(false);
      setCurrentModule(currentModule + 1);
    }
  };

  const handleSelectModule = (id: number) => {
    setShowCompletion(false);
    setShowIntro(false);
    setCurrentModule(id);
    setSidebarOpen(false);
  };

  const handleSelectCompletion = () => {
    setShowCompletion(true);
    setShowIntro(false);
    setSidebarOpen(false);
  };

  const handleSelectIntro = () => {
    setShowIntro(true);
    setShowCompletion(false);
    setSidebarOpen(false);
  };

  if (!userName) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  const allCompleted = completedModules.length === courseModules.length;

  const sidebarContent = (
    <CourseSidebar
      currentModule={currentModule}
      completedModules={completedModules}
      onSelectModule={handleSelectModule}
      allCompleted={allCompleted}
      isCompletionView={showCompletion}
      isIntroView={showIntro}
      onSelectCompletion={handleSelectCompletion}
      onSelectIntro={handleSelectIntro}
      onHome={() => setUserName(null)}
    />
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop sidebar - visible at lg (1024px+) */}
      {isDesktop && (
        <div className="shrink-0 w-72 overflow-hidden">
          <div className="w-72 h-screen sticky top-0">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Mobile/Tablet sidebar via Sheet - below lg */}
      {!isDesktop && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72 sm:w-80">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar with menu toggle for mobile/tablet */}
        {!isDesktop && (
          <div className="h-12 border-b border-border bg-card flex items-center px-4 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <span className="ml-3 text-sm font-semibold truncate">
              Coding Basics for ID
            </span>
          </div>
        )}

        {showCompletion && allCompleted ? (
          <CompletionPage userName={userName} />
        ) : showIntro ? (
          <WelcomePage onGetStarted={() => handleSelectModule(1)} userName={userName} />
        ) : (
          <ModuleContent
            key={currentModule}
            module={module}
            onComplete={handleComplete}
            onPrev={handlePrev}
            onNext={handleNext}
            onFinish={handleSelectCompletion}
            isFirst={false}
            isLast={currentModule === courseModules.length}
            isCompleted={completedModules.includes(currentModule)}
            allCompleted={allCompleted}
            userName={userName}
          />
        )}
      </div>
    </div>
  );
};

export default Index;

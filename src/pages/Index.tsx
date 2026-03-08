import { useState, useCallback } from "react";
import CourseSidebar from "@/components/CourseSidebar";
import ModuleContent from "@/components/ModuleContent";
import WelcomeScreen from "@/components/WelcomeScreen";
import CompletionPage from "@/components/CompletionPage";
import WelcomePage from "@/components/WelcomePage";
import { courseModules } from "@/data/courseData";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

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
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="shrink-0 flex">
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              desktopSidebarOpen ? "w-72" : "w-0"
            }`}
          >
            <div className="w-72 min-h-screen">
              {sidebarContent}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="w-5 h-10 rounded-r-md bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(220,80%,15%)] border border-l-0 border-white/10 flex items-center justify-center shadow-sm transition-all duration-200 hover:w-7"
              title={desktopSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {desktopSidebarOpen ? (
                <ChevronLeft className="w-3.5 h-3.5 text-white/80" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-white/80" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mobile sidebar via Sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar with sidebar toggle */}
        {isMobile && (
          <div className="h-12 border-b border-border bg-card flex items-center px-4 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <span className="ml-3 text-sm font-semibold truncate">
              JS Coding Basics for ID
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
        <footer className="h-10 border-t border-border bg-card flex items-center justify-center shrink-0">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Bruce Mabasa. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

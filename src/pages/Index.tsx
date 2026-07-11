import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Session, User } from "@supabase/supabase-js";
import CourseSidebar from "@/components/CourseSidebar";
import ModuleContent from "@/components/ModuleContent";
import CompletionPage from "@/components/CompletionPage";
import WelcomePage from "@/components/WelcomePage";
import { courseModules } from "@/data/courseData";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("Learner");
  const [authChecked, setAuthChecked] = useState(false);

  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const module = courseModules.find((m) => m.id === currentModule)!;

  // Watch auth state, redirect to /auth when signed out.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setAuthChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authChecked && !session) {
      navigate("/auth", { replace: true });
    }
  }, [authChecked, session, navigate]);

  // Load profile + progress once signed in.
  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      const [{ data: profile }, { data: progress }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
        supabase
          .from("course_progress")
          .select("module_id, completed")
          .eq("user_id", user.id),
      ]);
      if (!active) return;
      setUserName(profile?.display_name ?? user.email?.split("@")[0] ?? "Learner");
      setCompletedModules(
        (progress ?? []).filter((r) => r.completed).map((r) => r.module_id)
      );
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const handleComplete = useCallback(async () => {
    if (!user) return;
    setCompletedModules((prev) =>
      prev.includes(currentModule) ? prev : [...prev, currentModule]
    );
    await supabase.from("course_progress").upsert(
      {
        user_id: user.id,
        module_id: currentModule,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,module_id" }
    );
  }, [currentModule, user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const handleSelectIntro = () => {
    setShowIntro(true);
    setShowCompletion(false);
    setSidebarOpen(false);
  };

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

  if (!authChecked || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
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
      onHome={handleSelectIntro}
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
        {/* Top bar */}
        <div className="h-12 border-b border-border bg-card flex items-center px-4 shrink-0">
          {!isDesktop && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          )}
          {!isDesktop && (
            <span className="ml-3 text-sm font-semibold truncate">
              Coding Basics for ID
            </span>
          )}
          <div className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-muted-foreground hidden sm:inline">{userName}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-1"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>

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

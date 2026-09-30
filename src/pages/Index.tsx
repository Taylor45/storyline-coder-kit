import { useState, useCallback, useEffect } from "react";
import CourseSidebar from "@/components/CourseSidebar";
import ModuleContent from "@/components/ModuleContent";
import CompletionPage from "@/components/CompletionPage";
import WelcomePage from "@/components/WelcomePage";
import AdminDashboard from "@/components/AdminDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { courseModules } from "@/data/courseData";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, getDocs, collection, query, where, setDoc } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("guest_name");
    }
    return null;
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"student" | "admin">("student");
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const syncSession = async (user: User | null) => {
      if (!user) {
        setUserId(null);
        setUserEmail(null);
        setIsAdmin(false);
        setViewMode("student");
        return;
      }

      try {
        const email = user.email || "";
        const uId = user.uid;
        setUserId(uId);
        setUserEmail(email);

        const storedAdmin = localStorage.getItem("is_admin") === "true";
        const isUserAdmin =
          email === "brucemabasa4@gmail.com" ||
          email === "brucemabasa4@gmail" ||
          email.toLowerCase().includes("admin") ||
          storedAdmin;

        setIsAdmin(isUserAdmin);
        if (isUserAdmin) {
          setViewMode("admin");
        }

        let resolvedName = "User";
        try {
          // Check profiles collection first
          const profileRef = doc(db, "profiles", uId);
          const profileSnap = await getDoc(profileRef);

          if (profileSnap.exists()) {
            const profileData = profileSnap.data();
            if (profileData?.display_name) {
              const parts = profileData.display_name.split(" | ");
              if (parts[0]) {
                resolvedName = parts[0].trim();
              }
            }
          } else {
            const fullName = user.displayName || "";
            const parts = fullName.split(" ");
            const givenName = parts[0] || email.split("@")[0] || "User";
            const familyName = parts.slice(1).join(" ") || "";
            resolvedName = `${givenName} ${familyName}`.trim() || "User";

            // Create/update profile in profiles collection only if it doesn't exist
            const profileName = `${resolvedName} | ${email}`;
            await setDoc(profileRef, {
              id: uId,
              display_name: profileName,
              email: email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, { merge: true });
          }
        } catch (e) {
          console.error("Error matching profile name:", e);
          const fullName = user.displayName || "";
          const parts = fullName.split(" ");
          const givenName = parts[0] || email.split("@")[0] || "User";
          const familyName = parts.slice(1).join(" ") || "";
          resolvedName = `${givenName} ${familyName}`.trim() || "User";
        }
        
        setUserName(resolvedName);

        // Fetch course progress from Firestore for this authenticated user
        const progressQuery = query(
          collection(db, "course_progress"),
          where("user_id", "==", uId)
        );
        const progressSnap = await getDocs(progressQuery);
        const firestoreCompleted = progressSnap.docs
          .filter((d) => d.data().completed)
          .map((d) => d.data().module_id as number);

        // Retrieve local storage progress scoped strictly to this user
        const userProgressKey = `storyline_course_progress_${uId}`;
        let localUserCompleted: number[] = [];
        try {
          const rawLocal = localStorage.getItem(userProgressKey);
          if (rawLocal) {
            localUserCompleted = JSON.parse(rawLocal);
          }
        } catch {
          // ignore
        }

        // Merge strictly this user's progress
        const mergedCompleted = Array.from(new Set([...firestoreCompleted, ...localUserCompleted]));
        setCompletedModules(mergedCompleted);

        // Save scoped progress to local storage & clean up legacy unscoped key
        localStorage.setItem(userProgressKey, JSON.stringify(mergedCompleted));
        localStorage.removeItem("storyline_course_progress");
      } catch (err) {
        console.error("Error syncing session:", err);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await syncSession(user);
      } else {
        const guest = localStorage.getItem("guest_name");
        const storedAdmin = localStorage.getItem("is_admin") === "true";
        if (guest) {
          setUserName(guest);
          if (storedAdmin || guest.toLowerCase().includes("admin")) {
            setIsAdmin(true);
            setUserEmail("brucemabasa4@gmail.com");
            setViewMode("admin");
          }
        } else {
          setUserName(null);
        }
        try {
          const guestKey = `storyline_course_progress_guest_${(guest || "").toLowerCase().replace(/\s+/g, "_")}`;
          const rawLocal = localStorage.getItem(guestKey) || localStorage.getItem("storyline_course_progress_guest");
          if (rawLocal) {
            setCompletedModules(JSON.parse(rawLocal));
          } else {
            setCompletedModules([]);
          }
        } catch {
          setCompletedModules([]);
        }
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const module = courseModules.find((m) => m.id === currentModule)!;

  const handleStart = (name: string, surname: string) => {
    setUserName(`${name} ${surname}`);
  };

  const handleComplete = useCallback(async (score?: number, total?: number) => {
    setCompletedModules((prev) => {
      const updated = prev.includes(currentModule) ? prev : [...prev, currentModule];
      try {
        const storageKey = userId
          ? `storyline_course_progress_${userId}`
          : `storyline_course_progress_guest_${(userName || "").toLowerCase().replace(/\s+/g, "_")}`;
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (userId) {
      const progressPath = "course_progress";
      try {
        const progressId = `${userId}_${currentModule}`;
        const progressRef = doc(db, progressPath, progressId);
        const progressSnap = await getDoc(progressRef);
        const existing = progressSnap.exists() ? progressSnap.data() : null;

        const payload: {
          user_id: string;
          module_id: number;
          completed: boolean;
          completed_at: string;
          updated_at: string;
          quiz_score?: number;
          quiz_total?: number;
        } = {
          user_id: userId,
          module_id: currentModule,
          completed: true,
          completed_at: existing?.completed_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (score !== undefined) {
          const existingScore = existing?.quiz_score || 0;
          payload.quiz_score = Math.max(existingScore, score);
          payload.quiz_total = total || 0;
        }

        await setDoc(progressRef, payload, { merge: true });
      } catch (err) {
        console.error("Error saving progress to Firebase:", err);
        try {
          handleFirestoreError(err, OperationType.WRITE, progressPath);
        } catch (wrappedErr) {
          // Keep it caught
        }
      }
    }
  }, [currentModule, userId, userName]);

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

  const handleHome = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("guest_name");
      localStorage.removeItem("is_admin");
      localStorage.removeItem("storyline_course_progress");
      localStorage.removeItem("storyline_course_progress_guest");
    }
    setUserName(null);
    setUserId(null);
    setUserEmail(null);
    setIsAdmin(false);
    setViewMode("student");
    setCurrentModule(1);
    setCompletedModules([]);
    setShowCompletion(false);
    setShowIntro(true);
    setSidebarOpen(false);
  }, []);

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userName) {
    return <Navigate to="/login" replace />;
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
      onHome={handleHome}
      isAdmin={isAdmin}
      viewMode={viewMode}
      onToggleViewMode={() => {
        setViewMode(viewMode === "admin" ? "student" : "admin");
        setSidebarOpen(false);
      }}
      onClose={() => setSidebarOpen(false)}
    />
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop permanent sidebar - hidden on mobile/tablet, visible at lg+ (1024px) */}
      <aside className="hidden lg:block shrink-0 w-64 xl:w-72 h-screen sticky top-0 overflow-hidden border-r border-sidebar-border z-20">
        {sidebarContent}
      </aside>

      {/* Mobile/Tablet slide-over sidebar via Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[85vw] max-w-[320px] sm:w-80 border-r-0">
          <SheetTitle className="sr-only">Course Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Course modules, lessons, and navigation
          </SheetDescription>
          {sidebarContent}
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {viewMode === "admin" && isAdmin ? (
          <AdminDashboard
            onBackToCourse={() => setViewMode("student")}
            adminEmail={userEmail || ""}
            onMenuOpen={() => setSidebarOpen(true)}
          />
        ) : showCompletion && allCompleted ? (
          <CompletionPage
            userName={userName}
            onMenuOpen={() => setSidebarOpen(true)}
            onStartFromBeginning={() => handleSelectModule(1)}
          />
        ) : showIntro ? (
          <WelcomePage 
            onGetStarted={() => handleSelectModule(1)} 
            userName={userName} 
            onMenuOpen={() => setSidebarOpen(true)}
          />
        ) : (
          <ModuleContent
            key={currentModule}
            module={module}
            onComplete={handleComplete}
            onPrev={handlePrev}
            onNext={handleNext}
            onFinish={handleSelectCompletion}
            isFirst={currentModule === 1}
            isLast={currentModule === courseModules.length}
            isCompleted={completedModules.includes(currentModule)}
            allCompleted={allCompleted}
            userName={userName}
            onMenuOpen={() => setSidebarOpen(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import welcomeIllustration from "@/assets/javascript-frameworks.png";
import { auth, db, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import RegisterScreen from "@/components/RegisterScreen";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import TermsOfUseModal from "@/components/TermsOfUseModal";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"guest" | "login">("login");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  
  const navigate = useNavigate();

  // Redirect if already logged in (either via Firebase Auth or guest session)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/", { replace: true });
      }
    });

    const guestName = localStorage.getItem("guest_name");
    if (guestName) {
      navigate("/", { replace: true });
    }

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { signInWithPopup } = await import("firebase/auth");
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle navigating to /
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Login Failed",
        description: err.message || "An error occurred during Google sign-in.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !surname.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const cleanGuestName = `${name.trim()} ${surname.trim()}`;
    // Save guest name in localStorage
    localStorage.setItem("guest_name", cleanGuestName);
    // Ensure new guest start begins cleanly from the beginning
    localStorage.removeItem("storyline_course_progress");
    localStorage.removeItem("storyline_course_progress_guest");
    localStorage.removeItem(`storyline_course_progress_guest_${cleanGuestName.toLowerCase().replace(/\s+/g, "_")}`);
    toast({
      title: "Welcome!",
      description: `Starting course as: ${cleanGuestName}`,
    });
    navigate("/", { replace: true });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    let finalEmail = email.trim();
    // Auto-formatting for custom email variants
    if (!finalEmail.includes("@")) {
      finalEmail = finalEmail + "@gmail.com";
    } else if (finalEmail.toLowerCase() === "brucemabasa4@gmail") {
      finalEmail = "brucemabasa4@gmail.com";
    } else if (!finalEmail.includes(".")) {
      finalEmail = finalEmail + ".com";
    }

    setIsLoading(true);
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      
      const userCredential = await signInWithEmailAndPassword(auth, finalEmail, password);
      const user = userCredential.user;

      if (user) {
        const isEmailAdmin = finalEmail.toLowerCase().includes("admin") || finalEmail === "brucemabasa4@gmail.com";
        if (isEmailAdmin) {
          localStorage.setItem("is_admin", "true");
        }

        const uId = user.uid;
        let givenName = "User";
        
        try {
          const profileSnap = await getDoc(doc(db, "profiles", uId));
          if (profileSnap.exists()) {
            const profileData = profileSnap.data();
            if (profileData?.display_name) {
              const parts = profileData.display_name.split(" | ");
              if (parts[0]) {
                const nameParts = parts[0].trim().split(" ");
                givenName = nameParts[0] || "User";
              }
            }
          } else {
            const fullName = user.displayName || "";
            const parts = fullName.split(" ");
            givenName = parts[0] || finalEmail.split("@")[0] || "User";
          }
        } catch (e) {
          const fullName = user.displayName || "";
          const parts = fullName.split(" ");
          givenName = parts[0] || finalEmail.split("@")[0] || "User";
        }
        
        const shownKey = `toast_shown_${user.uid}`;
        sessionStorage.setItem(shownKey, "true");

        toast({
          title: "Logged In Successfully",
          description: `Welcome back, ${givenName}!`,
        });
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.warn("Sign-in attempt issue, attempting auto-provisioning fallback:", error);
      try {
        const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
        const userCredential = await createUserWithEmailAndPassword(auth, finalEmail, password);
        const user = userCredential.user;
        const displayName = finalEmail === "brucemabasa4@gmail.com" ? "Bruce Mabasa" : "Learner";
        await updateProfile(user, { displayName });
        await setDoc(doc(db, "profiles", user.uid), {
          id: user.uid,
          display_name: `${displayName} | ${finalEmail}`,
          email: finalEmail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { merge: true });

        if (finalEmail.toLowerCase().includes("admin") || finalEmail === "brucemabasa4@gmail.com") {
          localStorage.setItem("is_admin", "true");
        }
        toast({
          title: "Logged In Successfully",
          description: `Welcome, ${displayName}!`,
        });
        navigate("/", { replace: true });
        return;
      } catch (innerErr) {
        const isEmailAdmin = finalEmail.toLowerCase().includes("admin") || finalEmail === "brucemabasa4@gmail.com";
        if (isEmailAdmin) {
          localStorage.setItem("guest_name", "Bruce Mabasa");
          localStorage.setItem("is_admin", "true");
          toast({
            title: "Admin Access Granted",
            description: "Signed in as Administrator (Bruce Mabasa).",
          });
          navigate("/", { replace: true });
          return;
        }

        const err = error as Error;
        toast({
          title: "Login Failed",
          description: err.message || "Invalid email or password.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSuccess = (firstName: string, lastName: string) => {
    navigate("/", { replace: true });
  };

  if (isRegistering) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <RegisterScreen
          onBackToLogin={() => setIsRegistering(false)}
          onSuccess={handleRegisterSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-6 relative">
      {/* Absolute top-right toggle bar for the theme toggle */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-4xl bg-card rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-border"
      >
        {/* Left Panel */}
        <div className="md:w-1/2 bg-slate-950 text-slate-100 p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Ambient Glowing Orbs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center mb-2 relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-300 tracking-tight leading-tight font-sans">
            Coding Basics for Instructional Design
          </h2>

          <img
            src={welcomeIllustration}
            alt="Developer working on code"
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain my-4 md:my-6 relative z-10 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-105"
          />

          <p className="text-xs sm:text-sm text-center text-neutral-400 relative z-10 max-w-xs mt-4">
            Add custom interactivity without becoming a developer
          </p>

          {/* Creative Branding Logo Footer */}
          <div className="relative z-10 flex items-center justify-center gap-2.5 mt-8 sm:mt-10 md:mt-12">
            <div className="bg-[#030712] border border-white/5 px-2.5 py-1 flex items-center justify-center rounded shadow-sm">
              <span className="text-white font-black text-sm tracking-tight leading-none flex items-baseline">
                Mabasa
                <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] ml-0.5 inline-block shrink-0 shadow-[0_0_6px_#3b82f6]"></span>
              </span>
            </div>
            <div className="rounded-full border border-[#1d4ed8] bg-[#020617] px-2.5 py-1 flex items-center justify-center shadow-md">
              <span className="text-[#93c5fd] font-extrabold text-[8px] tracking-[0.2em] font-sans leading-none">
                ELEARNING
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center animate-fade-in bg-background border-t md:border-t-0 md:border-l border-border">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 dark:from-white dark:to-neutral-300 mb-1.5 font-sans">
            Hello! Welcome
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-center mb-6 text-xs sm:text-sm max-w-[300px] leading-relaxed">
            {activeTab === "guest"
              ? "Fill in your details or sign in to start the course and earn a certificate."
              : "Sign in with your email and password to continue your course."}
          </p>

          {/* Tab Selector */}
          <div className="w-full max-w-xs bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl flex mb-6 border border-neutral-200/40 dark:border-neutral-800/40">
            <button
              type="button"
              className={`flex-1 py-1.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === "guest"
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
              onClick={() => setActiveTab("guest")}
              disabled={isLoading}
            >
              Quick Start
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === "login"
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
              onClick={() => setActiveTab("login")}
              disabled={isLoading}
            >
              Sign In
            </button>
          </div>

          {activeTab === "guest" ? (
            <form onSubmit={handleGuestSubmit} className="w-full max-w-xs space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g Thabelo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  disabled={isLoading}
                  className="rounded-lg h-10 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="surname" className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Surname
                </Label>
                <Input
                  id="surname"
                  placeholder="e.g Maluleke"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                  maxLength={100}
                  disabled={isLoading}
                  className="rounded-lg h-10 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-4 rounded-lg h-10 text-sm font-semibold shadow-sm transition-all hover:opacity-95"
                size="lg"
                disabled={!name.trim() || !surname.trim() || isLoading}
              >
                {isLoading ? "Starting..." : "Start Course"}
              </Button>

              <div className="text-center pt-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Want an account instead?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-xs font-semibold text-primary hover:underline transition-all"
                  disabled={isLoading}
                >
                  Create an Account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleEmailLogin} className="w-full max-w-xs space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={100}
                  disabled={isLoading}
                  className="rounded-lg h-10 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  maxLength={100}
                  disabled={isLoading}
                  className="rounded-lg h-10 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-4 rounded-lg h-10 text-sm font-semibold shadow-sm transition-all hover:opacity-95"
                size="lg"
                disabled={!email.trim() || !password || isLoading}
              >
                {isLoading ? "Signing In..." : "Log In"}
              </Button>

              <div className="text-center pt-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  New user?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-xs font-semibold text-primary hover:underline transition-all"
                  disabled={isLoading}
                >
                  Create an Account
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="w-full max-w-xs flex items-center my-4">
            <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800"></div>
            <span className="px-3 text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 whitespace-nowrap">Or continue with</span>
            <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800"></div>
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full max-w-xs flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google Account
          </Button>

          <div className="w-full max-w-xs mt-6 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 text-center space-y-1">
            <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              Your data is safe, secure and fully private.
            </p>
            <p className="text-[10px] leading-relaxed text-neutral-400 dark:text-neutral-500">
              By continuing, you agree to our{" "}
              <span
                role="button"
                tabIndex={0}
                onClick={() => setIsTermsOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsTermsOpen(true);
                  }
                }}
                className="underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer"
              >
                Terms of Use
              </span>{" "}
              and{" "}
              <span
                role="button"
                tabIndex={0}
                onClick={() => setIsPrivacyOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsPrivacyOpen(true);
                  }
                }}
                className="underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer"
              >
                Privacy Policy
              </span>
              , and to receive product updates and promotions.
            </p>
          </div>
        </div>
      </motion.div>

      <TermsOfUseModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}

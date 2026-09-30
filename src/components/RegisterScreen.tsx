import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import welcomeIllustration from "@/assets/javascript-frameworks.png";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";

interface RegisterScreenProps {
  onBackToLogin: () => void;
  onSuccess: (name: string, surname: string) => void;
}

const RegisterScreen = ({ onBackToLogin, onSuccess }: RegisterScreenProps) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };

  const strengthCount = Object.values(passwordChecks).filter(Boolean).length;
  const isPasswordSecure = strengthCount === 3;

  const getStrengthLabel = () => {
    if (password.length === 0) return "";
    if (strengthCount === 1) return "Weak";
    if (strengthCount === 2) return "Medium";
    if (strengthCount === 3) return "Strong";
    return "";
  };

  const getStrengthColor = () => {
    if (strengthCount === 1) return "bg-destructive";
    if (strengthCount === 2) return "bg-amber-500";
    if (strengthCount === 3) return "bg-green-500";
    return "bg-muted";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !surname.trim() || !email.trim() || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordSecure) {
      toast({
        title: "Weak Password",
        description: "Please ensure your password is at least 8 characters, and contains both numbers and symbols.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let finalEmail = email.trim();
      // Auto-format email variations
      if (!finalEmail.includes("@")) {
        finalEmail = finalEmail + "@gmail.com";
      } else if (finalEmail.toLowerCase() === "brucemabasa4@gmail") {
        finalEmail = "brucemabasa4@gmail.com";
      } else if (!finalEmail.includes(".")) {
        finalEmail = finalEmail + ".com";
      }

      const userCredential = await createUserWithEmailAndPassword(auth, finalEmail, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: `${name.trim()} ${surname.trim()}` });

      // Create profile in profiles collection
      const profileName = `${name.trim()} ${surname.trim()} | ${finalEmail}`;
      await setDoc(doc(db, "profiles", user.uid), {
        id: user.uid,
        display_name: profileName,
        email: finalEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { merge: true });

      const shownKey = `toast_shown_${user.uid}`;
      sessionStorage.setItem(shownKey, "true");

      // Ensure new account starts from the beginning
      localStorage.removeItem("storyline_course_progress");
      localStorage.removeItem("storyline_course_progress_guest");
      localStorage.removeItem(`storyline_course_progress_${user.uid}`);

      toast({
        title: "Registration Successful",
        description: "Welcome to the course!",
      });
      onSuccess(name.trim(), surname.trim());
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Registration Failed",
        description: err.message || "An error occurred during sign up.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-4xl bg-card rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
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
            {/* Mabasa. Logo Block */}
            <div className="bg-[#030712] border border-white/5 px-2.5 py-1 flex items-center justify-center rounded shadow-sm">
              <span className="text-white font-black text-sm tracking-tight leading-none flex items-baseline">
                Mabasa
                <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] ml-0.5 inline-block shrink-0 shadow-[0_0_6px_#3b82f6]"></span>
              </span>
            </div>
            {/* ELEARNING Capsule Pill */}
            <div className="rounded-full border border-[#1d4ed8] bg-[#020617] px-2.5 py-1 flex items-center justify-center shadow-md">
              <span className="text-[#93c5fd] font-extrabold text-[8px] tracking-[0.2em] font-sans leading-none">
                ELEARNING
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center bg-background">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 dark:from-white dark:to-neutral-300 mb-1.5 font-sans text-center">
            Create Account
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-center mb-6 text-xs sm:text-sm max-w-[280px] leading-relaxed">
            Sign up to track your progress and earn your certificate.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="reg-name" className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  First Name
                </Label>
                <Input
                  id="reg-name"
                  placeholder="Thabelo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  disabled={isLoading}
                  className="rounded-lg h-10 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-surname" className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Surname
                </Label>
                <Input
                  id="reg-surname"
                  placeholder="Maluleke"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                  maxLength={100}
                  disabled={isLoading}
                  className="rounded-lg h-10 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-email" className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Email Address
              </Label>
              <Input
                id="reg-email"
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
              <Label htmlFor="reg-password" className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Password
              </Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={100}
                disabled={isLoading}
                className="rounded-lg h-10 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary"
              />

              {password.length > 0 && (
                <div className="space-y-2 pt-1">
                  {/* Strength Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-neutral-400 uppercase tracking-wider font-semibold">Password Strength</span>
                      <span className={`font-bold uppercase tracking-wider ${
                        strengthCount === 1 ? "text-destructive" :
                        strengthCount === 2 ? "text-amber-500" :
                        "text-green-500"
                      }`}>
                        {getStrengthLabel()}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-0.5">
                      <div className={`h-full transition-all duration-300 flex-1 ${strengthCount >= 1 ? getStrengthColor() : "bg-muted"}`} />
                      <div className={`h-full transition-all duration-300 flex-1 ${strengthCount >= 2 ? getStrengthColor() : "bg-muted"}`} />
                      <div className={`h-full transition-all duration-300 flex-1 ${strengthCount >= 3 ? getStrengthColor() : "bg-muted"}`} />
                    </div>
                  </div>

                  {/* Requirements list */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                        passwordChecks.length ? "bg-green-500/10 text-green-500 font-bold" : "bg-muted text-neutral-400"
                      }`}>
                        {passwordChecks.length ? "✓" : "•"}
                      </span>
                      <span className={passwordChecks.length ? "text-green-600 dark:text-green-400 font-medium" : "text-neutral-400"}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                        passwordChecks.hasNumber ? "bg-green-500/10 text-green-500 font-bold" : "bg-muted text-neutral-400"
                      }`}>
                        {passwordChecks.hasNumber ? "✓" : "•"}
                      </span>
                      <span className={passwordChecks.hasNumber ? "text-green-600 dark:text-green-400 font-medium" : "text-neutral-400"}>
                        At least 1 number
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                        passwordChecks.hasSymbol ? "bg-green-500/10 text-green-500 font-bold" : "bg-muted text-neutral-400"
                      }`}>
                        {passwordChecks.hasSymbol ? "✓" : "•"}
                      </span>
                      <span className={passwordChecks.hasSymbol ? "text-green-600 dark:text-green-400 font-medium" : "text-neutral-400"}>
                        At least 1 symbol (!@#$, etc.)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-4 rounded-lg h-10 text-sm font-semibold shadow-sm transition-all hover:opacity-95"
              size="lg"
              disabled={isLoading || !name.trim() || !surname.trim() || !email.trim() || !password || !isPasswordSecure}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>

            <div className="text-center pt-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Already have an account?{" "}
              </span>
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-xs font-semibold text-primary hover:underline transition-all"
                disabled={isLoading}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterScreen;

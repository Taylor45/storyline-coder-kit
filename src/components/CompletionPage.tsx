import { useEffect } from "react";
import { motion } from "framer-motion";
import { Award, UserCircle, Menu, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import CompletionCertificate from "./CompletionCertificate";

interface CompletionPageProps {
  userName: string;
  onMenuOpen?: () => void;
  onStartFromBeginning?: () => void;
}

const CompletionPage = ({ userName, onMenuOpen, onStartFromBeginning }: CompletionPageProps) => {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      });
    }, 500);
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <header className="h-14 border-b border-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(0,0%,5%)] flex items-center justify-between px-3 sm:px-4 md:px-6 shrink-0 shadow-[0_4px_15px_rgba(0,100,255,0.3)]">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {onMenuOpen && (
            <button
              onClick={onMenuOpen}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 active:bg-white/40 text-white shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 min-h-[38px]"
              aria-label="Open course navigation menu"
              id="completion-mobile-nav-hamburger"
            >
              <Menu className="w-5 h-5 text-white" />
              <span className="text-[11px] font-bold tracking-wide uppercase sm:hidden">Menu</span>
            </button>
          )}
          <div className="hidden lg:flex w-8 h-8 rounded-md bg-white/20 items-center justify-center shrink-0">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs text-white/75 font-medium leading-none mb-0.5">Course Complete</p>
            <h2 className="text-xs sm:text-sm font-semibold leading-tight truncate text-white">Completion</h2>
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

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-6 md:mb-10"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold mb-2"
            >
              Congratulations, {userName}!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm md:text-base text-muted-foreground max-w-md mx-auto"
            >
              You've successfully completed all modules of the JavaScript Coding Basics
              for Instructional Design course. Download your certificate below!
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <CompletionCertificate userName={userName} />
          </motion.div>

          {onStartFromBeginning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 flex justify-center pb-8"
            >
              <button
                type="button"
                onClick={onStartFromBeginning}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4" />
                Start Course from Beginning
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompletionPage;

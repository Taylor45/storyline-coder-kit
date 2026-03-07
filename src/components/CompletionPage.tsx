import { useEffect } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import CompletionCertificate from "./CompletionCertificate";

interface CompletionPageProps {
  userName: string;
}

const CompletionPage = ({ userName }: CompletionPageProps) => {
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
      <header className="h-14 border-b border-border bg-card flex items-center px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Course Complete</p>
            <h2 className="text-sm font-semibold leading-tight">Completion</h2>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-6 md:mb-10"
          >
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-4"
            >
              <PartyPopper className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-bold mb-2"
            >
              🎉 Congratulations, {userName}!
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
        </div>
      </main>
    </div>
  );
};

export default CompletionPage;

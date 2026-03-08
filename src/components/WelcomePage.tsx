import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Code2, Layers, Sparkles, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomePageProps {
  onGetStarted: () => void;
  userName?: string;
}

const WelcomePage = ({ onGetStarted, userName }: WelcomePageProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <header className="h-14 border-b border-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(0,0%,5%)] flex items-center px-4 md:px-6 shrink-0 shadow-[0_4px_15px_rgba(0,100,255,0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white">Welcome</h2>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <div className="relative rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-accent/10 p-6 md:p-10 mb-8 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 -translate-y-12 translate-x-12" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-accent/10 translate-y-8 -translate-x-8" />
              <div className="absolute top-1/2 right-8 w-16 h-16 rounded-full bg-primary/3 hidden md:block" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Interactive Course
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-3">
                  JavaScript for{" "}
                  <span className="text-primary">Instructional Design</span>
                </h1>

                <p className="text-base md:text-lg text-muted-foreground font-medium italic mb-6">
                  Add custom interactivity without becoming a developer
                </p>

                <div className="h-px bg-border mb-6" />

                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                  Welcome! In this <strong className="text-foreground">30-minute course</strong>, you'll learn practical JavaScript skills specifically designed for instructional designers working with{" "}
                  <strong className="text-foreground">Articulate Storyline</strong>.
                </p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(220,100%,60%)] p-5 flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Duration</h3>
                <p className="text-xs text-white/80">~30 minutes</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(220,100%,60%)] p-5 flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Modules</h3>
                <p className="text-xs text-white/80">7 interactive modules</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(220,100%,60%)] p-5 flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Certificate</h3>
                <p className="text-xs text-white/80">Upon completion</p>
              </motion.div>
            </div>

            {/* Prerequisites */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-xl border border-border bg-muted/30 p-5 md:p-6"
            >
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                Prerequisites
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Basic understanding of <strong className="text-foreground">Articulate Storyline</strong> and familiarity with <strong className="text-foreground">HTML/CSS</strong> and <strong className="text-foreground">JavaScript</strong>.
              </p>
            </motion.div>

            {/* Get Started Button */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center mt-8"
            >
              <Button size="lg" onClick={onGetStarted} className="gap-2 px-8 text-base">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;

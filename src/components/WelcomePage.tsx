import { motion } from "framer-motion";
import { ArrowRight, Clock, Layers, Award, Rocket, CheckCircle, Sparkles, UserCircle } from "lucide-react";
import courseIllustration from "@/assets/course-illustration.png";

interface WelcomePageProps {
  onGetStarted: () => void;
  userName?: string;
}

const WelcomePage = ({ onGetStarted, userName }: WelcomePageProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <header className="h-14 border-b border-border bg-gradient-to-br from-[hsl(210,100%,45%)] to-[hsl(0,0%,5%)] flex items-center justify-between px-4 md:px-6 shrink-0 shadow-[0_4px_15px_rgba(0,100,255,0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white">Welcome</h2>
        </div>
        {userName && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/80 hidden sm:inline">{userName}</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[hsl(210,40%,96%)] via-[hsl(210,30%,98%)] to-[hsl(220,40%,95%)] relative">
        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[hsl(210,60%,90%)] rounded-full opacity-30 -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-0 w-[300px] h-[300px] bg-[hsl(210,50%,92%)] rounded-full opacity-20 -translate-x-1/2 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto w-full px-4 md:px-8 py-4 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Hero Title + Button row */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-5">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[hsl(215,30%,15%)] leading-tight mb-1">
                  JavaScript for{" "}
                  <span className="text-[hsl(210,100%,40%)]">Instructional Design</span>
                </h1>
                <p className="text-sm md:text-base text-[hsl(215,15%,45%)] font-medium">
                  Add custom interactivity without becoming a developer
                </p>
              </div>
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                onClick={onGetStarted}
                className="mt-3 md:mt-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[hsl(210,100%,42%)] text-white font-semibold text-sm shadow-[0_4px_16px_rgba(0,100,255,0.35)] hover:shadow-[0_6px_24px_rgba(0,100,255,0.45)] hover:bg-[hsl(210,100%,38%)] transition-all active:scale-[0.98] shrink-0"
              >
                <Rocket className="w-4 h-4" />
                Start Course
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Course Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <h2 className="text-xs font-bold text-[hsl(215,30%,15%)] uppercase tracking-wider mb-2.5">
                Course Highlights
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-[hsl(210,30%,88%)] bg-white/70 backdrop-blur-sm p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,80,200,0.05)]">
                  <div className="w-9 h-9 rounded-full bg-[hsl(210,60%,94%)] flex items-center justify-center shrink-0">
                    <Clock className="w-4.5 h-4.5 text-[hsl(210,100%,42%)]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[hsl(210,100%,42%)] leading-tight">30 Min</h3>
                    <p className="text-[10px] text-[hsl(215,15%,50%)] leading-tight">Bite-sized lessons</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[hsl(210,30%,88%)] bg-white/70 backdrop-blur-sm p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,80,200,0.05)]">
                  <div className="w-9 h-9 rounded-full bg-[hsl(210,60%,94%)] flex items-center justify-center shrink-0">
                    <Layers className="w-4.5 h-4.5 text-[hsl(210,100%,42%)]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[hsl(210,100%,42%)] leading-tight">7 Modules</h3>
                    <p className="text-[10px] text-[hsl(215,15%,50%)] leading-tight">Interactive content</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[hsl(210,30%,88%)] bg-white/70 backdrop-blur-sm p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,80,200,0.05)]">
                  <div className="w-9 h-9 rounded-full bg-[hsl(40,70%,92%)] flex items-center justify-center shrink-0">
                    <Award className="w-4.5 h-4.5 text-[hsl(35,80%,45%)]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[hsl(215,30%,15%)] leading-tight">Certificate</h3>
                    <p className="text-[10px] text-[hsl(215,15%,50%)] leading-tight">Upon completion</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Illustration + What You'll Learn + Prerequisites in a row */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4"
            >
              {/* Illustration + What You'll Learn */}
              <div className="rounded-xl border border-[hsl(210,30%,88%)] bg-white/60 backdrop-blur-sm overflow-hidden shadow-[0_2px_8px_rgba(0,80,200,0.05)] flex flex-col">
                <div className="bg-gradient-to-br from-[hsl(210,40%,94%)] to-[hsl(210,50%,90%)] p-4 flex items-center justify-center">
                  <img
                    src={courseIllustration}
                    alt="Instructional designer working on an e-learning course"
                    className="w-full max-w-[200px] h-auto object-contain"
                  />
                </div>
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-4 h-4 text-[hsl(210,100%,42%)]" />
                    <h3 className="text-sm font-bold text-[hsl(215,30%,15%)]">What You'll Learn</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[hsl(155,60%,40%)] shrink-0 mt-0.5" />
                      <span className="text-xs text-[hsl(215,15%,30%)]">
                        Add Storyline triggers with <strong>JavaScript</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[hsl(155,60%,40%)] shrink-0 mt-0.5" />
                      <span className="text-xs text-[hsl(215,15%,30%)]">
                        Create <strong>dynamic</strong> variables in your projects
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[hsl(155,60%,40%)] shrink-0 mt-0.5" />
                      <span className="text-xs text-[hsl(215,15%,30%)]">
                        Build interactive components for <strong>e-learning</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="rounded-xl border border-[hsl(210,30%,88%)] bg-white/60 backdrop-blur-sm p-5 shadow-[0_2px_8px_rgba(0,80,200,0.05)] flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-4 h-4 text-[hsl(210,100%,42%)]" />
                  <h3 className="text-sm font-bold text-[hsl(215,30%,15%)]">Prerequisites</h3>
                </div>
                <p className="text-xs text-[hsl(215,15%,35%)] leading-relaxed">
                  Basic understanding of{" "}
                  <strong className="font-semibold text-[hsl(215,30%,15%)]">Articulate Storyline</strong>{" "}
                  and familiarity with{" "}
                  <strong className="font-semibold text-[hsl(215,30%,15%)]">HTML/CSS</strong>{" "}
                  and{" "}
                  <strong className="font-semibold text-[hsl(215,30%,15%)]">JavaScript</strong>.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;

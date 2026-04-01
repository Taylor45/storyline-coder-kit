import { motion } from "framer-motion";
import { ArrowRight, Clock, Layers, Award, Rocket, CheckCheck, Sparkles, UserCircle, CircleCheckBig } from "lucide-react";
import courseIllustration from "@/assets/microsites-amico.png";

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
          <h2 className="text-sm font-semibold text-white">Introduction</h2>
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

      <main className="flex-1 overflow-hidden bg-gradient-to-br from-[hsl(210,40%,96%)] via-[hsl(210,30%,98%)] to-[hsl(220,40%,95%)] relative">
        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[hsl(210,60%,90%)] rounded-full opacity-30 -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute top-20 left-0 w-[300px] h-[300px] bg-[hsl(210,50%,92%)] rounded-full opacity-20 -translate-x-1/2 blur-2xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Hero Title */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[hsl(215,30%,15%)] leading-tight mb-1">
                Coding Basics for{" "}
                <span className="text-[hsl(210,100%,40%)]">Instructional Designers</span>
              </h1>
              <p className="text-sm md:text-base text-[hsl(215,15%,45%)] font-medium">
                Add custom interactivity without becoming a developer
              </p>
            </div>

            {/* Start Course Button */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={onGetStarted}
              className="mb-16 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(210,100%,42%)] text-white font-semibold text-sm shadow-[0_4px_16px_rgba(0,100,255,0.35)] hover:shadow-[0_6px_24px_rgba(0,100,255,0.45)] hover:bg-[hsl(210,100%,38%)] transition-all active:scale-[0.98]"
            >
              <Rocket className="w-4 h-4" />
              Start Course
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>

            {/* Course Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <h2 className="text-xs font-bold text-[hsl(215,30%,15%)] uppercase tracking-wider mb-2">
                Course Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: Clock, title: "30 Minutes", sub: "Bite-sized lessons" },
                  { icon: Layers, title: "7 Modules", sub: "Interactive content" },
                  { icon: Award, title: "Certificate", sub: "Earn on completion" },
                ].map((item, i) => (
                  <div key={i} className="rounded-full bg-gradient-to-r from-[hsl(210,100%,42%)] to-[hsl(220,80%,30%)] px-5 py-3 flex items-center gap-3 shadow-[0_4px_16px_rgba(0,80,200,0.25)]">
                    <item.icon className="w-5 h-5 text-white/80 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                      <p className="text-[11px] text-white/60">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Illustration + What You'll Learn */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-[hsl(210,30%,88%)] bg-white/60 backdrop-blur-sm overflow-hidden mb-8 shadow-[0_2px_12px_rgba(0,80,200,0.06)]"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-[35%] bg-gradient-to-br from-[hsl(210,40%,94%)] to-[hsl(210,50%,90%)] p-4 flex items-center justify-center">
                  <img
                    src={courseIllustration}
                    alt="Instructional designer working on an e-learning course"
                    className="w-full max-w-[180px] h-auto object-contain"
                  />
                </div>
                <div className="md:w-[65%] p-4 md:p-5 flex flex-col justify-center">
                  <h3 className="text-sm font-bold text-[hsl(215,30%,15%)] mb-3">
                    By the end of this course you should be able to:
                  </h3>
                  <ul className="space-y-1.5">
                    {[
                      "Understand how the web works and the client-server model",
                      "Structure learning content using semantic HTML",
                      "Style and layout educational interfaces with CSS",
                      "Add interactivity to learning experiences using JavaScript",
                      "Build complete interactive e-learning activities from scratch",
                      "Deploy and host your learning content on the web",
                    ].map((objective, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CircleCheckBig className="w-5 h-5 text-[hsl(160,50%,45%)] shrink-0 mt-0" />
                        <span className="text-xs text-[hsl(215,15%,30%)] leading-snug">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Prerequisites */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-[hsl(210,20%,90%)] bg-[hsl(210,20%,96%)] p-4"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-[hsl(210,100%,42%)]" />
                <h3 className="text-sm font-bold text-[hsl(215,30%,15%)]">Prerequisites</h3>
              </div>
              <p className="text-xs text-[hsl(215,15%,35%)] leading-relaxed">
                Basic understanding of{" "}
                <strong className="font-semibold text-[hsl(215,30%,15%)]">Articulate Storyline</strong>,{" "}
                <strong className="font-semibold text-[hsl(215,30%,15%)]">HTML/CSS</strong> and{" "}
                <strong className="font-semibold text-[hsl(215,30%,15%)]">JavaScript</strong>.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;

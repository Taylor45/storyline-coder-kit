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

      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[hsl(210,40%,96%)] via-[hsl(210,30%,98%)] to-[hsl(220,40%,95%)] relative">
        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[hsl(210,60%,90%)] rounded-full opacity-30 -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute top-20 left-0 w-[300px] h-[300px] bg-[hsl(210,50%,92%)] rounded-full opacity-20 -translate-x-1/2 blur-2xl" />

        <div className="relative z-10 flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 md:px-8 py-4 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col"
          >
            {/* Hero + Button row */}
            <div className="flex items-start justify-between gap-4 mb-4">
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                onClick={onGetStarted}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(210,100%,42%)] text-white font-semibold text-sm shadow-[0_4px_16px_rgba(0,100,255,0.35)] hover:shadow-[0_6px_24px_rgba(0,100,255,0.45)] hover:bg-[hsl(210,100%,38%)] transition-all active:scale-[0.98]"
              >
                <Rocket className="w-4 h-4" />
                Start Course
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Course Highlights - compact */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: Clock, label: "30 Minutes", desc: "Bite-sized lessons", color: "text-[hsl(210,100%,42%)]", bg: "bg-[hsl(210,60%,94%)]" },
                  { icon: Layers, label: "7 Modules", desc: "Interactive content", color: "text-[hsl(210,100%,42%)]", bg: "bg-[hsl(210,60%,94%)]" },
                  { icon: Award, label: "Certificate", desc: "Earn on completion", color: "text-[hsl(35,80%,45%)]", bg: "bg-[hsl(40,70%,92%)]" },
                ].map(({ icon: Icon, label, desc, color, bg }) => (
                  <div key={label} className="rounded-xl border border-[hsl(210,30%,88%)] bg-white/70 backdrop-blur-sm px-4 py-3 flex items-center gap-3 shadow-[0_2px_12px_rgba(0,80,200,0.06)]">
                    <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4.5 h-4.5 ${color}`} />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${label === "Certificate" ? "text-[hsl(215,30%,15%)]" : color}`}>{label}</h3>
                      <p className="text-[11px] text-[hsl(215,15%,50%)]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What You'll Learn + Prerequisites side by side */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-3"
            >
              {/* What You'll Learn */}
              <div className="rounded-xl border border-[hsl(210,30%,88%)] bg-white/60 backdrop-blur-sm p-4 md:p-5 shadow-[0_2px_12px_rgba(0,80,200,0.06)]">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[hsl(210,100%,42%)]" />
                  <h3 className="text-sm font-bold text-[hsl(215,30%,15%)]">What You'll Learn</h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    "Understand how the web works and the client-server model",
                    "Structure learning content using semantic HTML",
                    "Style and layout educational interfaces with CSS",
                    "Add interactivity to learning experiences using JavaScript",
                    "Build complete interactive e-learning activities from scratch",
                    "Deploy and host your learning content on the web",
                  ].map((objective, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[hsl(155,60%,40%)] shrink-0 mt-0.5" />
                      <span className="text-xs text-[hsl(215,15%,30%)] leading-relaxed">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right column: illustration + prerequisites */}
              <div className="flex flex-col gap-3">
                <div className="flex-1 rounded-xl border border-[hsl(210,30%,88%)] bg-gradient-to-br from-[hsl(210,40%,94%)] to-[hsl(210,50%,90%)] flex items-center justify-center p-4 shadow-[0_2px_12px_rgba(0,80,200,0.06)]">
                  <img
                    src={courseIllustration}
                    alt="Instructional designer working on an e-learning course"
                    className="w-full max-w-[200px] h-auto object-contain"
                  />
                </div>
                <div className="rounded-xl border border-[hsl(210,30%,88%)] bg-white/60 backdrop-blur-sm p-4 shadow-[0_2px_12px_rgba(0,80,200,0.06)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[hsl(210,100%,42%)]" />
                    <h3 className="text-sm font-bold text-[hsl(215,30%,15%)]">Prerequisites</h3>
                  </div>
                  <p className="text-xs text-[hsl(215,15%,35%)] leading-relaxed">
                    Basic understanding of{" "}
                    <strong className="font-semibold text-[hsl(215,30%,15%)]">Articulate Storyline</strong>,{" "}
                    <strong className="font-semibold text-[hsl(215,30%,15%)]">HTML/CSS</strong> and{" "}
                    <strong className="font-semibold text-[hsl(215,30%,15%)]">JavaScript</strong>.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;

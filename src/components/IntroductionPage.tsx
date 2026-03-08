import { Target, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface IntroductionPageProps {
  onBack?: () => void;
  onNext?: () => void;
}

const learningObjectives = [
  "Understand how the web works and the client-server model",
  "Structure learning content using semantic HTML",
  "Style and layout educational interfaces with CSS",
  "Add interactivity to learning experiences using JavaScript",
  "Build complete interactive e-learning activities from scratch",
  "Deploy and host your learning content on the web",
];

const IntroductionPage = ({ onBack, onNext }: IntroductionPageProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <header className="h-14 border-b border-border bg-card flex items-center px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-semibold">Introduction</h2>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold">Course Introduction</h1>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Welcome to <strong className="text-foreground">JavaScript Coding Basics for Instructional Design</strong>. This course will equip you with the foundational web development skills needed to create interactive, engaging learning experiences.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold mb-4">By the end of this course, you should be able to:</h2>
              <div className="space-y-3">
                {learningObjectives.map((objective, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground/85 leading-relaxed">{objective}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default IntroductionPage;

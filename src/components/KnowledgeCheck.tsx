import { useState } from "react";
import { QuizQuestion } from "@/data/courseData";
import { Check, X, RotateCcw, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface KnowledgeCheckProps {
  questions: QuizQuestion[];
  onPass: () => void;
  onAttempt?: () => void;
}

const KnowledgeCheck = ({ questions, onPass, onAttempt }: KnowledgeCheckProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const question = questions[currentQ];
  const isCorrect = selected === question?.correctIndex;
  const passingScore = Math.ceil(questions.length * 0.7);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setFinished(true);
      onAttempt?.();
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setSubmitted(false);
    setCorrectCount(0);
    setFinished(false);
  };

  const finalScore = correctCount;
  const passed = finalScore >= passingScore;

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-8 text-center max-w-lg mx-auto"
      >
        <div
          className={cn(
            "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
            passed ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}
        >
          {passed ? <Award className="w-8 h-8" /> : <RotateCcw className="w-8 h-8" />}
        </div>
        <h3 className="text-xl font-bold mb-2">
          {passed ? "Knowledge Check Passed!" : "Not Quite — Try Again"}
        </h3>
        <p className="text-muted-foreground mb-4">
          You scored {finalScore} out of {questions.length} ({Math.round((finalScore / questions.length) * 100)}%).
          {!passed && ` You need ${passingScore} correct to pass.`}
        </p>
        {passed ? (
          <button
            onClick={onPass}
            className="px-6 py-2.5 rounded-lg bg-success text-success-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Continue to Next Section
          </button>
        ) : (
          <button
            onClick={handleRetry}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Retry Knowledge Check
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Knowledge Check
        </h3>
        <span className="text-sm text-muted-foreground">
          Question {currentQ + 1} of {questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-base font-medium mb-4">{question.question}</p>

          <div className="space-y-2 mb-6">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg border transition-all text-sm",
                  !submitted && selected === i && "border-primary bg-primary/5 ring-1 ring-primary",
                  !submitted && selected !== i && "border-border hover:border-primary/40 hover:bg-muted/50",
                  submitted && i === question.correctIndex && "border-success bg-success/10 text-foreground",
                  submitted && selected === i && i !== question.correctIndex && "border-destructive bg-destructive/10"
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0",
                      !submitted && selected === i && "border-primary text-primary",
                      submitted && i === question.correctIndex && "border-success bg-success text-success-foreground",
                      submitted && selected === i && i !== question.correctIndex && "border-destructive bg-destructive text-destructive-foreground"
                    )}
                  >
                    {submitted && i === question.correctIndex ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : submitted && selected === i ? (
                      <X className="w-3.5 h-3.5" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  {opt}
                </span>
              </button>
            ))}
          </div>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-lg mb-4 text-sm",
                isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}
            >
              <p className="font-medium mb-1">{isCorrect ? "Correct!" : "Incorrect"}</p>
              <p className="text-foreground/80">{question.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className={cn(
              "px-5 py-2 rounded-lg font-medium text-sm transition-all",
              selected !== null
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
          </button>
        )}
      </div>
    </div>
  );
};

export default KnowledgeCheck;

import { useState, useEffect, useCallback } from "react";
import { QuizQuestion } from "@/data/courseData";
import {
  Check,
  X,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface KnowledgeCheckProps {
  questions: QuizQuestion[];
  onPass: () => void;
  onAttempt?: (score: number, total: number) => void;
}

const KnowledgeCheck = ({ questions, onPass, onAttempt }: KnowledgeCheckProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    new Array(questions.length).fill(null)
  );
  const [finished, setFinished] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({});

  // Reset when questions change
  useEffect(() => {
    setCurrentQ(0);
    setAnswers(new Array(questions.length).fill(null));
    setFinished(false);
    setExpandedReviews({});
  }, [questions]);

  const selectedAnswer = answers[currentQ] ?? null;

  // Calculate score at the end
  const correctCount = answers.reduce<number>((acc, ans, idx) => {
    if (ans !== null && ans === questions[idx]?.correctIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  // For knowledge checks with more than one question, user must get at least 50%.
  // For single-question checks, user must get 100% (1/1).
  const passingScore = questions.length > 1 ? Math.ceil(questions.length * 0.5) : 1;
  const percentScore = Math.round((correctCount / questions.length) * 100);
  const passed = correctCount >= passingScore;
  const allAnswered = answers.every((a) => a !== null);

  const handleSelectOption = useCallback((optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = optionIndex;
      return next;
    });
  }, [currentQ]);

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
    }
  }, [currentQ, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentQ > 0) {
      setCurrentQ((q) => q - 1);
    }
  }, [currentQ]);

  const handleSubmitQuiz = useCallback(() => {
    setFinished(true);
    // Expand all reviews by default on the results screen for quick inspection
    const initialExpanded: Record<number, boolean> = {};
    questions.forEach((_, idx) => {
      initialExpanded[idx] = true;
    });
    setExpandedReviews(initialExpanded);
    onAttempt?.(correctCount, questions.length);
  }, [correctCount, questions, onAttempt]);

  const handleRetry = useCallback(() => {
    setCurrentQ(0);
    setAnswers(new Array(questions.length).fill(null));
    setFinished(false);
    setExpandedReviews({});
  }, [questions.length]);

  const toggleReview = (index: number) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (finished) {
        if (e.key === "Enter") {
          if (passed) {
            onPass();
          } else {
            handleRetry();
          }
        }
        return;
      }

      // Numbers 1-4 or letters A-D for option selection
      const currentQuestion = questions[currentQ];
      if (currentQuestion) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= currentQuestion.options.length) {
          handleSelectOption(num - 1);
          return;
        }

        const charCode = e.key.toUpperCase().charCodeAt(0);
        if (e.key.length === 1 && charCode >= 65 && charCode < 65 + currentQuestion.options.length) {
          handleSelectOption(charCode - 65);
          return;
        }
      }

      // Enter to advance or submit
      if (e.key === "Enter") {
        if (answers[currentQ] !== null) {
          if (currentQ < questions.length - 1) {
            handleNext();
          } else if (allAnswered) {
            handleSubmitQuiz();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    finished,
    passed,
    onPass,
    currentQ,
    questions,
    answers,
    allAnswered,
    handleNext,
    handleSubmitQuiz,
    handleSelectOption,
    handleRetry,
  ]);

  // Results & Feedback View (Shown only at the end)
  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-border bg-card p-6 md:p-8 max-w-2xl mx-auto shadow-xl relative overflow-hidden"
      >
        {/* Status Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <h3 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight mb-1.5">
            {passed
              ? percentScore === 100
                ? "Mastery Achieved"
                : "Knowledge Check Passed"
              : "Keep Practicing"}
          </h3>

          <p className="text-muted-foreground text-xs md:text-sm max-w-md leading-relaxed">
            {passed
              ? "Great job! You have demonstrated a strong understanding of these core concepts."
              : `You scored ${correctCount} of ${questions.length}. You need at least ${passingScore} correct (${Math.round(
                  (passingScore / questions.length) * 100
                )}%) to pass.`}
          </p>
        </div>

        {/* Score Summary Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6 bg-muted/40 p-3.5 rounded-xl border border-border/70 text-center">
          <div className="p-1.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">
              Score
            </span>
            <span className="text-lg md:text-xl font-bold text-foreground">
              {correctCount} / {questions.length}
            </span>
          </div>
          <div className="p-1.5 border-x border-border/70">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">
              Accuracy
            </span>
            <span
              className={cn(
                "text-lg md:text-xl font-bold",
                passed ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
              )}
            >
              {percentScore}%
            </span>
          </div>
          <div className="p-1.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">
              Result
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5",
                passed
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-destructive/15 text-destructive"
              )}
            >
              {passed ? "PASSED" : "NEEDS RETRY"}
            </span>
          </div>
        </div>

        {/* Full Questions Feedback List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Feedback on All Questions ({questions.length})
            </h4>
            <span className="text-[11px] text-muted-foreground">
              Review your answers & explanations
            </span>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const userSelected = answers[idx];
              const isQCorrect = userSelected === q.correctIndex;
              const isExpanded = expandedReviews[idx] ?? true;

              return (
                <div
                  key={idx}
                  className={cn(
                    "border rounded-xl transition-all text-left overflow-hidden",
                    isQCorrect
                      ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                      : "border-destructive/30 bg-destructive/[0.02]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleReview(idx)}
                    className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                          isQCorrect
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-destructive/20 text-destructive"
                        )}
                      >
                        {isQCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      </span>
                      <span className="text-xs md:text-sm font-semibold text-foreground truncate">
                        Question {idx + 1}: {q.question}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 pt-1 text-xs md:text-sm border-t border-border/50 bg-card/60"
                      >
                        <p className="font-medium text-foreground mb-2">{q.question}</p>

                        <div className="space-y-1.5 mb-3 bg-muted/30 p-2.5 rounded-lg border border-border/50 text-xs">
                          <p className="text-muted-foreground">
                            <strong className="text-foreground font-semibold">Correct Answer:</strong>{" "}
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              {q.options[q.correctIndex]}
                            </span>
                          </p>
                          {userSelected !== null && !isQCorrect && (
                            <p className="text-muted-foreground">
                              <strong className="text-foreground font-semibold">Your Answer:</strong>{" "}
                              <span className="text-destructive font-medium">
                                {q.options[userSelected]}
                              </span>
                            </p>
                          )}
                          {userSelected === null && (
                            <p className="text-muted-foreground italic">No answer selected</p>
                          )}
                        </div>

                        <div className="p-3 rounded-lg bg-muted/60 text-muted-foreground text-xs leading-relaxed border border-border/40">
                          <strong className="text-foreground font-semibold block mb-1">
                            Explanation:
                          </strong>
                          {q.explanation}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-border">
          {passed ? (
            <>
              <button
                onClick={handleRetry}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-1.5 order-2 sm:order-1"
              >
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                <span>Practice Again</span>
              </button>
              <button
                onClick={onPass}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs md:text-sm transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 order-1 sm:order-2 active:scale-[0.98]"
              >
                <span>Continue Course</span>
                <ArrowRight className="w-4 h-4" />
                <span className="hidden md:inline text-[10px] bg-emerald-700/60 px-1.5 py-0.5 rounded text-emerald-100 font-mono">
                  ↵
                </span>
              </button>
            </>
          ) : (
            <button
              onClick={handleRetry}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs md:text-sm hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
              <span className="hidden md:inline text-[10px] bg-primary-foreground/20 px-1.5 py-0.5 rounded text-primary-foreground font-mono">
                ↵
              </span>
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // Active Quiz View: clean, unrevealed questionnaire
  const currentQuestion = questions[currentQ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-7 max-w-2xl mx-auto shadow-md relative overflow-hidden">
      {/* Header & Step Dots */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm md:text-base font-bold text-foreground">Knowledge Check</h3>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            Question <strong className="text-foreground">{currentQ + 1}</strong> of {questions.length}
          </span>
        </div>

        {/* Clean step indicators without right/wrong spoilers */}
        <div className="flex items-center gap-1.5 mb-2">
          {questions.map((_, i) => {
            const hasAnswered = answers[i] !== null;
            const isCurrent = i === currentQ;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentQ(i)}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-200 cursor-pointer",
                  isCurrent
                    ? "bg-primary shadow-sm ring-2 ring-primary/20"
                    : hasAnswered
                    ? "bg-primary/50"
                    : "bg-muted hover:bg-muted-foreground/30"
                )}
                title={`Jump to question ${i + 1}`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
          <span>Passing Requirement: {passingScore} of {questions.length} correct ({Math.round((passingScore / questions.length) * 100)}%)</span>
          <span>
            Answered: <strong className="text-foreground">{answers.filter((a) => a !== null).length}</strong> / {questions.length}
          </span>
        </div>
      </div>

      {/* Question Body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.18 }}
        >
          <div className="mb-5">
            <h4 className="text-base md:text-lg font-semibold text-foreground leading-snug">
              {currentQuestion.question}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1">
              Select your answer from the options below:
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-2.5 mb-6">
            {currentQuestion.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isOptionSelected = selectedAnswer === i;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(i)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border transition-all text-xs md:text-sm flex items-center justify-between gap-3 relative group cursor-pointer",
                    isOptionSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm text-foreground font-medium"
                      : "border-border hover:border-primary/40 hover:bg-muted/40 bg-card text-foreground/90"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={cn(
                        "w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                        isOptionSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-muted/60 text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground"
                      )}
                    >
                      {letter}
                    </span>
                    <span className="leading-snug break-words">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentQ === 0}
          className={cn(
            "px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 border border-border",
            currentQ === 0
              ? "opacity-40 cursor-not-allowed text-muted-foreground bg-muted/20"
              : "hover:bg-muted text-foreground bg-card cursor-pointer"
          )}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {currentQ < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={cn(
                "px-5 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all flex items-center gap-2 shadow-sm",
                selectedAnswer !== null
                  ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] shadow-primary/20 cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
              )}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitQuiz}
              disabled={!allAnswered}
              className={cn(
                "px-6 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all flex items-center gap-2 shadow-md",
                allAnswered
                  ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
              )}
            >
              <span>Submit</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCheck;

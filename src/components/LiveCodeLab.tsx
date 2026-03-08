import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Send, Eye, ChevronRight, ChevronLeft, Terminal, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Challenge {
  id: number;
  title: string;
  description: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  explanation: string;
  hint: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Greeting Generator",
    description:
      "Create a function called `greetLearner` that takes a learner's name as a parameter and returns a personalized greeting string. For example, greetLearner(\"Alex\") should return \"Welcome, Alex! Ready to learn?\"",
    starterCode: `// Challenge 1: Greeting Generator
// Write a function that greets a learner by name.

function greetLearner(name) {
  // Your code here

}

// Test your function:
console.log(greetLearner("Alex"));`,
    solutionCode: `// Challenge 1: Greeting Generator
function greetLearner(name) {
  return "Welcome, " + name + "! Ready to learn?";
}

// Test your function:
console.log(greetLearner("Alex"));`,
    expectedOutput: 'Welcome, Alex! Ready to learn?',
    explanation:
      "This challenge introduces **function declarations** and **string concatenation** — two fundamental JavaScript concepts. The function takes a parameter (`name`), builds a greeting string using the `+` operator, and returns the result. In instructional design, you'd use this pattern to personalize feedback messages, display learner names on certificates, or customize welcome screens.",
    hint: "Use the `return` keyword with string concatenation: \"Welcome, \" + name + \"! Ready to learn?\"",
  },
  {
    id: 2,
    title: "Score Calculator",
    description:
      "Write a function called `calculateScore` that takes two parameters: `correct` (number of correct answers) and `total` (total questions). Return the percentage score rounded to the nearest whole number.",
    starterCode: `// Challenge 2: Score Calculator
// Calculate a learner's percentage score.

function calculateScore(correct, total) {
  // Your code here

}

// Test your function:
console.log(calculateScore(7, 10));
console.log(calculateScore(3, 8));`,
    solutionCode: `// Challenge 2: Score Calculator
function calculateScore(correct, total) {
  return Math.round((correct / total) * 100);
}

// Test your function:
console.log(calculateScore(7, 10));
console.log(calculateScore(3, 8));`,
    expectedOutput: '70\n38',
    explanation:
      "This challenge practices **arithmetic operators** and the **Math.round()** method. Dividing `correct` by `total` gives a decimal (0.7), multiplying by 100 converts it to a percentage (70), and `Math.round()` ensures a clean whole number. Score calculation is one of the most common tasks in e-learning — used in quiz engines, progress bars, and completion criteria.",
    hint: "Divide correct by total, multiply by 100, then use Math.round() to round the result.",
  },
  {
    id: 3,
    title: "Pass/Fail Logic",
    description:
      "Create a function called `getResult` that takes a `score` (percentage) and returns an object with two properties: `passed` (boolean, true if score >= 70) and `message` (a feedback string). If passed: \"Congratulations! You passed with [score]%\". If failed: \"You scored [score]%. You need 70% to pass. Try again!\"",
    starterCode: `// Challenge 3: Pass/Fail Logic
// Determine if a learner passed and provide feedback.

function getResult(score) {
  // Your code here

}

// Test your function:
const result1 = getResult(85);
console.log(result1.passed);
console.log(result1.message);

const result2 = getResult(55);
console.log(result2.passed);
console.log(result2.message);`,
    solutionCode: `// Challenge 3: Pass/Fail Logic
function getResult(score) {
  if (score >= 70) {
    return {
      passed: true,
      message: "Congratulations! You passed with " + score + "%"
    };
  } else {
    return {
      passed: false,
      message: "You scored " + score + "%. You need 70% to pass. Try again!"
    };
  }
}

// Test your function:
const result1 = getResult(85);
console.log(result1.passed);
console.log(result1.message);

const result2 = getResult(55);
console.log(result2.passed);
console.log(result2.message);`,
    expectedOutput: 'true\nCongratulations! You passed with 85%\nfalse\nYou scored 55%. You need 70% to pass. Try again!',
    explanation:
      "This challenge combines **conditional logic (if/else)**, **comparison operators (>=)**, and **objects** — the building blocks of any assessment system. Returning an object with multiple properties is a pattern you'll use constantly: quiz results with scores and feedback, progress data with completion status and timestamps, or user profiles with names and roles. This is exactly how real LMS grading systems work under the hood.",
    hint: "Use an if/else statement checking `score >= 70`. Return an object with `passed` and `message` properties in each branch.",
  },
];

const LiveCodeLab = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [codes, setCodes] = useState<string[]>(challenges.map((c) => c.starterCode));
  const [output, setOutput] = useState<string>("");
  const [showSolution, setShowSolution] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const challenge = challenges[currentChallenge];

  const runCode = (code: string): string => {
    const logs: string[] = [];
    const mockConsole = {
      log: (...args: unknown[]) => {
        logs.push(args.map((a) => {
          if (typeof a === "object" && a !== null) return JSON.stringify(a);
          return String(a);
        }).join(" "));
      },
    };

    try {
      const fn = new Function("console", code);
      fn(mockConsole);
      return logs.join("\n");
    } catch (err: unknown) {
      return `Error: ${err instanceof Error ? err.message : String(err)}`;
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setShowSolution(false);
    setSubmitted(false);
    setTimeout(() => {
      const result = runCode(codes[currentChallenge]);
      setOutput(result);
      setIsRunning(false);
    }, 300);
  };

  const handleSubmit = () => {
    setIsRunning(true);
    setShowSolution(false);
    setTimeout(() => {
      const result = runCode(codes[currentChallenge]);
      setOutput(result);
      setSubmitted(true);
      setIsCorrect(result.trim() === challenge.expectedOutput.trim());
      setIsRunning(false);
    }, 400);
  };

  const handleViewSolution = () => {
    setShowSolution(true);
  };

  const handleReset = () => {
    const updated = [...codes];
    updated[currentChallenge] = challenge.starterCode;
    setCodes(updated);
    setOutput("");
    setShowSolution(false);
    setSubmitted(false);
  };

  const switchChallenge = (index: number) => {
    setCurrentChallenge(index);
    setOutput("");
    setShowSolution(false);
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Challenge selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {challenges.map((c, i) => (
          <button
            key={c.id}
            onClick={() => switchChallenge(i)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
              currentChallenge === i
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
            )}
          >
            Challenge {c.id}: {c.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentChallenge}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Description */}
          <div className="rounded-xl border border-border bg-card p-4 md:p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                {challenge.id}
              </span>
              <h3 className="text-base font-semibold">{challenge.title}</h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {challenge.description.split(/(`[^`]+`)/g).map((part, i) => {
                if (part.startsWith("`") && part.endsWith("`")) {
                  return (
                    <code key={i} className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary">
                      {part.slice(1, -1)}
                    </code>
                  );
                }
                return part;
              })}
            </p>
          </div>

          {/* Code Editor */}
          <div className="rounded-xl overflow-hidden border border-[hsl(var(--border))]">
            {/* Editor header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[hsl(220,20%,12%)]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[hsl(0,70%,50%)]" />
                  <span className="w-3 h-3 rounded-full bg-[hsl(45,70%,50%)]" />
                  <span className="w-3 h-3 rounded-full bg-[hsl(120,50%,45%)]" />
                </div>
                <span className="text-xs text-[hsl(220,10%,55%)] ml-2 font-mono">script.js</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-[hsl(220,10%,55%)] hover:text-[hsl(220,10%,75%)] transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Textarea editor */}
            <textarea
              value={codes[currentChallenge]}
              onChange={(e) => {
                const updated = [...codes];
                updated[currentChallenge] = e.target.value;
                setCodes(updated);
              }}
              spellCheck={false}
              className="w-full min-h-[240px] p-4 font-mono text-sm leading-relaxed resize-y bg-[hsl(220,20%,14%)] text-[hsl(210,15%,85%)] focus:outline-none selection:bg-[hsl(210,60%,30%)]"
              style={{ tabSize: 2 }}
            />

            {/* Action buttons */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[hsl(220,20%,12%)] border-t border-[hsl(220,15%,20%)]">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[hsl(210,60%,35%)] text-[hsl(0,0%,95%)] hover:bg-[hsl(210,60%,40%)] transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                Run
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[hsl(145,50%,35%)] text-[hsl(0,0%,95%)] hover:bg-[hsl(145,50%,40%)] transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                Submit
              </button>
              <button
                onClick={handleViewSolution}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[hsl(220,15%,25%)] text-[hsl(220,10%,70%)] hover:bg-[hsl(220,15%,30%)] hover:text-[hsl(220,10%,85%)] transition-colors ml-auto"
              >
                <Eye className="w-3.5 h-3.5" />
                View Solution
              </button>
            </div>
          </div>

          {/* Console Output */}
          {output && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 rounded-xl overflow-hidden border border-[hsl(var(--border))]"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-[hsl(220,20%,10%)]">
                <Terminal className="w-3.5 h-3.5 text-[hsl(220,10%,55%)]" />
                <span className="text-xs text-[hsl(220,10%,55%)] font-mono">Console Output</span>
                {submitted && (
                  <span className={cn(
                    "ml-auto flex items-center gap-1 text-xs font-medium",
                    isCorrect ? "text-[hsl(145,60%,50%)]" : "text-[hsl(0,60%,55%)]"
                  )}>
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {isCorrect ? "Correct!" : "Not quite right"}
                  </span>
                )}
              </div>
              <pre className="p-4 text-sm font-mono leading-relaxed bg-[hsl(220,20%,12%)] text-[hsl(120,40%,65%)] whitespace-pre-wrap">
                {output}
              </pre>
            </motion.div>
          )}

          {/* Submitted feedback */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-4 rounded-xl border p-4 md:p-5",
                isCorrect
                  ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5"
                  : "border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5"
              )}
            >
              <p className={cn(
                "text-sm font-semibold mb-1",
                isCorrect ? "text-success" : "text-destructive"
              )}>
                {isCorrect ? "🎉 Great job!" : "💡 Keep trying!"}
              </p>
              <p className="text-sm text-foreground/70">
                {isCorrect
                  ? "Your output matches the expected result. Well done!"
                  : `Expected output:\n`}
              </p>
              {!isCorrect && (
                <pre className="mt-2 p-3 rounded-lg bg-muted text-xs font-mono text-foreground/80">
                  {challenge.expectedOutput}
                </pre>
              )}
            </motion.div>
          )}

          {/* Solution & Explanation */}
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-4"
            >
              <div className="rounded-xl overflow-hidden border border-[hsl(var(--border))]">
                <div className="px-4 py-2 bg-[hsl(220,20%,12%)] flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-[hsl(45,70%,55%)]" />
                  <span className="text-xs text-[hsl(45,70%,55%)] font-mono">Solution</span>
                </div>
                <pre className="p-4 text-sm font-mono leading-relaxed bg-[hsl(220,20%,14%)] text-[hsl(210,15%,85%)] whitespace-pre-wrap overflow-x-auto">
                  {challenge.solutionCode}
                </pre>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 md:p-5">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <span className="text-base">📖</span> Explanation
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {challenge.explanation.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation between challenges */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => switchChallenge(currentChallenge - 1)}
              disabled={currentChallenge === 0}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                currentChallenge === 0
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Challenge
            </button>
            <span className="text-xs text-muted-foreground">
              {currentChallenge + 1} / {challenges.length}
            </span>
            <button
              onClick={() => switchChallenge(currentChallenge + 1)}
              disabled={currentChallenge === challenges.length - 1}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                currentChallenge === challenges.length - 1
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              )}
            >
              Next Challenge
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LiveCodeLab;

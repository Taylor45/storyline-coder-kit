import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Send, Eye, ChevronRight, ChevronLeft, Terminal, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";

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
    title: "Personalized Welcome Message",
    description:
      "Simulate a Storyline scenario: a learner enters their name into a text-entry field stored in a variable called `LearnerName`. Write a function called `buildWelcome` that takes `learnerName` (string) and returns a personalized greeting. If the name is empty or only whitespace, return a generic greeting. Test with both a name and an empty string.",
    starterCode: `// Challenge 1: Personalized Welcome Message
// Simulates: Storyline Execute JavaScript trigger
// on a "Continue" button click after a text-entry field.
//
// In real Storyline, you'd use:
//   var player = GetPlayer();
//   var name = player.GetVar("LearnerName");
// Here we simulate that with a function parameter.

function buildWelcome(learnerName) {
  // Your code here
  // Return "Welcome, [name]! Let's begin the training."
  // If name is empty/whitespace, return "Welcome! Let's begin the training."

}

// Test your function (simulating two different learners):
console.log(buildWelcome("Sarah"));
console.log(buildWelcome("  "));`,
    solutionCode: `// Challenge 1: Personalized Welcome Message
// In Storyline, this runs via Execute JavaScript trigger.
// GetPlayer().GetVar("LearnerName") provides the name.

function buildWelcome(learnerName) {
  if (learnerName && learnerName.trim() !== "") {
    return "Welcome, " + learnerName.trim() + "! Let's begin the training.";
  } else {
    return "Welcome! Let's begin the training.";
  }
}

// Test your function:
console.log(buildWelcome("Sarah"));
console.log(buildWelcome("  "));`,
    expectedOutput: "Welcome, Sarah! Let's begin the training.\nWelcome! Let's begin the training.",
    explanation:
      "This challenge mirrors a real Storyline task: personalizing content based on learner input. In Storyline, you'd read the variable with `GetPlayer().GetVar(\"LearnerName\")` and write the result back with `SetVar(\"WelcomeMessage\", greeting)`. The key JavaScript concepts are **string methods** (`trim()` removes whitespace), **conditional logic** (if/else to handle empty input), and **string concatenation** (building the greeting). Always handle the empty-name case — learners may skip text-entry fields, and your course should still display something meaningful rather than \"Welcome, !\".",
    hint: "Use `learnerName.trim()` to remove whitespace, then check if the result is not empty with `learnerName && learnerName.trim() !== \"\"`.",
  },
  {
    id: 2,
    title: "Storyline Score Calculator",
    description:
      "Simulate a Storyline results slide: write a function called `calculateResults` that takes `correctCount` (number) and `totalQuestions` (number). Return an object with three properties: `percentage` (rounded whole number), `passed` (boolean, true if >= 80%), and `message` (a results string). This is exactly the logic you'd put in an Execute JavaScript trigger on a results slide.",
    starterCode: `// Challenge 2: Storyline Score Calculator
// Simulates: Execute JavaScript on Timeline Start
// of a "Results" slide in Storyline.
//
// In real Storyline:
//   var correct = player.GetVar("CorrectCount");
//   var total = player.GetVar("TotalQuestions");
//   player.SetVar("ScorePercent", percentage);
//   player.SetVar("CoursePassed", passed);

function calculateResults(correctCount, totalQuestions) {
  // Your code here
  // Return { percentage: ..., passed: ..., message: ... }
  // Message if passed: "Congratulations! You passed with [X]%."
  // Message if failed: "You scored [X]%. You need 80% to pass."

}

// Test (simulating two different quiz outcomes):
var r1 = calculateResults(9, 10);
console.log(r1.percentage);
console.log(r1.passed);
console.log(r1.message);

var r2 = calculateResults(6, 10);
console.log(r2.percentage);
console.log(r2.passed);
console.log(r2.message);`,
    solutionCode: `// Challenge 2: Storyline Score Calculator
// In Storyline, you'd read CorrectCount and TotalQuestions
// with GetVar(), then write results back with SetVar().

function calculateResults(correctCount, totalQuestions) {
  var percentage = Math.round((correctCount / totalQuestions) * 100);
  var passed = percentage >= 80;
  var message;

  if (passed) {
    message = "Congratulations! You passed with " + percentage + "%.";
  } else {
    message = "You scored " + percentage + "%. You need 80% to pass.";
  }

  return { percentage: percentage, passed: passed, message: message };
}

// Test:
var r1 = calculateResults(9, 10);
console.log(r1.percentage);
console.log(r1.passed);
console.log(r1.message);

var r2 = calculateResults(6, 10);
console.log(r2.percentage);
console.log(r2.passed);
console.log(r2.message);`,
    expectedOutput: "90\ntrue\nCongratulations! You passed with 90%.\n60\nfalse\nYou scored 60%. You need 80% to pass.",
    explanation:
      "This is one of the most common Storyline JavaScript patterns. On a real results slide, you'd read `CorrectCount` and `TotalQuestions` with `GetPlayer().GetVar()`, calculate the percentage with `Math.round((correct / total) * 100)`, then write results back: `SetVar(\"ScorePercent\", percentage)` and `SetVar(\"CoursePassed\", passed)`. The **object return pattern** (`{ percentage, passed, message }`) mirrors how you'd set multiple Storyline variables from a single script. The `passed` boolean maps directly to a Storyline True/False variable that controls whether the \"Pass\" or \"Fail\" layer is shown.",
    hint: "Calculate percentage with `Math.round((correctCount / totalQuestions) * 100)`, check `>= 80` for passed, and return an object with all three properties.",
  },
  {
    id: 3,
    title: "Branching Scenario Evaluator",
    description:
      "Simulate a compliance training branching scenario in Storyline. Write a function called `evaluateScenario` that takes three decision strings: `d1`, `d2`, `d3`. The correct decisions are: d1 = \"report\", d2 = \"escalate\", d3 = \"document\". Count how many are correct and return an object with `correctCount`, `tier` (\"exemplary\" if 3, \"acceptable\" if 2, \"needsWork\" otherwise), and `feedback` (a string explaining the result).",
    starterCode: `// Challenge 3: Branching Scenario Evaluator
// Simulates: Execute JavaScript on Timeline Start
// of an "Outcome" slide in a compliance training scenario.
//
// In Storyline, each decision is stored in a text variable:
//   var d1 = player.GetVar("Decision1"); // "report" or "ignore"
//   var d2 = player.GetVar("Decision2"); // "escalate" or "confront"
//   var d3 = player.GetVar("Decision3"); // "document" or "skip"
// The result tier controls which layer Storyline shows.

function evaluateScenario(d1, d2, d3) {
  // Correct path: "report" → "escalate" → "document"
  // Your code here
  // Return { correctCount: ..., tier: ..., feedback: ... }

}

// Test with different learner paths:
var path1 = evaluateScenario("report", "escalate", "document");
console.log(path1.tier);
console.log(path1.feedback);

var path2 = evaluateScenario("report", "confront", "document");
console.log(path2.tier);
console.log(path2.feedback);

var path3 = evaluateScenario("ignore", "confront", "skip");
console.log(path3.tier);
console.log(path3.feedback);`,
    solutionCode: `// Challenge 3: Branching Scenario Evaluator
// In Storyline, player.SetVar("OutcomeTier", tier)
// controls which layer is shown via a trigger:
// "Show layer [Exemplary] when OutcomeTier == exemplary"

function evaluateScenario(d1, d2, d3) {
  var correctCount = 0;
  if (d1 === "report")   correctCount++;
  if (d2 === "escalate") correctCount++;
  if (d3 === "document") correctCount++;

  var tier;
  var feedback;

  if (correctCount === 3) {
    tier = "exemplary";
    feedback = "Outstanding! You followed the correct protocol at every step.";
  } else if (correctCount === 2) {
    tier = "acceptable";
    feedback = "Good instincts, but one decision could be improved. Review the highlighted step.";
  } else {
    tier = "needsWork";
    feedback = "Several decisions need reconsideration. Please review the policy and retry.";
  }

  return { correctCount: correctCount, tier: tier, feedback: feedback };
}

// Test:
var path1 = evaluateScenario("report", "escalate", "document");
console.log(path1.tier);
console.log(path1.feedback);

var path2 = evaluateScenario("report", "confront", "document");
console.log(path2.tier);
console.log(path2.feedback);

var path3 = evaluateScenario("ignore", "confront", "skip");
console.log(path3.tier);
console.log(path3.feedback);`,
    expectedOutput: "exemplary\nOutstanding! You followed the correct protocol at every step.\nacceptable\nGood instincts, but one decision could be improved. Review the highlighted step.\nneedsWork\nSeveral decisions need reconsideration. Please review the policy and retry.",
    explanation:
      "This challenge recreates a real Storyline branching scenario evaluation. In production, each `d1`/`d2`/`d3` value comes from `GetPlayer().GetVar(\"Decision1\")` etc., set by button triggers on previous slides. The **string comparison** (`===`) checks exact matches against the correct answers. The **counter pattern** (`correctCount++`) is cleaner than nested if/else chains when evaluating multiple independent decisions. The `tier` string maps directly to a Storyline text variable that triggers layer visibility — e.g., \"Show layer [Exemplary] when OutcomeTier changes to exemplary\". This pattern scales well: you could add Decision4, Decision5, etc. without restructuring your logic.",
    hint: "Compare each decision with `===` against the correct answer (\"report\", \"escalate\", \"document\"), increment a counter for each match, then use if/else if/else to set the tier based on the count.",
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

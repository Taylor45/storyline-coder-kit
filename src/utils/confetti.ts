import confetti from "canvas-confetti";

/**
 * Trigger celebratory confetti burst when passing a knowledge check or quiz.
 */
export const triggerKnowledgeCheckConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-stage confetti cannon burst
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ["#3b82f6", "#10b981", "#6366f1"],
  });

  fire(0.2, {
    spread: 60,
    colors: ["#f59e0b", "#ec4899", "#8b5cf6"],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ["#3b82f6", "#10b981", "#f59e0b"],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ["#ffffff", "#3b82f6", "#10b981"],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ["#fbbf24", "#34d399", "#60a5fa"],
  });
};

/**
 * Trigger a short cheerful star/sparkle burst when answering a single question correctly.
 */
export const triggerCorrectAnswerConfetti = () => {
  confetti({
    particleCount: 35,
    spread: 50,
    origin: { y: 0.8 },
    colors: ["#10b981", "#3b82f6", "#fbbf24"],
    scalar: 0.9,
    zIndex: 9999,
  });
};

/**
 * Trigger grand celebration confetti for course completion.
 */
export const triggerCourseCompletionConfetti = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;

  const interval: ReturnType<typeof setInterval> = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2,
      },
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"],
      zIndex: 9999,
    });
  }, 250);
};

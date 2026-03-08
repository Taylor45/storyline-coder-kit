import { Globe, FileCode, Palette, Zap, Layers, Rocket, FlaskConical } from "lucide-react";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleSection {
  title: string;
  content: string;
  codeExample?: string;
  codeLanguage?: string;
}

export interface CourseModule {
  id: number;
  title: string;
  subtitle: string;
  icon: typeof Globe;
  color: string;
  sections: ModuleSection[];
  quiz?: QuizQuestion[];
  miniProject?: {
    title: string;
    description: string;
    steps: string[];
  };
}

export const courseModules: CourseModule[] = [
  {
    id: 1,
    title: "How the Web Works",
    subtitle: "Understand the foundations of the internet and web technologies",
    icon: Globe,
    color: "primary",
    sections: [
      {
        title: "Client-Server Model",
        content: "The web operates on a client-server model. When you type a URL into your browser (the client), it sends a request to a server. The server processes the request and sends back HTML, CSS, and JavaScript files that your browser renders into the webpage you see.\n\nAs an instructional designer, understanding this model helps you appreciate how your learning content travels from a server to your learner's device.",
      },
      {
        title: "HTML, CSS & JavaScript — The Big Three",
        content: "Every webpage is built with three core technologies:\n\n• **HTML** (HyperText Markup Language) — Provides the structure and content. Think of it as the skeleton.\n• **CSS** (Cascading Style Sheets) — Controls the visual presentation. Think of it as the clothing and makeup.\n• **JavaScript** — Adds interactivity and dynamic behavior. Think of it as the muscles and brain.\n\nIn Articulate Storyline, you design slides with layers and triggers. On the web, HTML is your slide content, CSS is your formatting, and JavaScript is your triggers.",
      },
      {
        title: "How Browsers Render Pages",
        content: "When a browser receives HTML, it builds a Document Object Model (DOM) — a tree-like structure representing every element on the page. CSS is then applied to style these elements, and JavaScript can manipulate the DOM to create interactive experiences.\n\nThis rendering pipeline is important to understand because it affects how quickly your learning content loads and how smoothly interactions feel.",
      },
    ],
    quiz: [
      {
        question: "What does HTML provide in a web page?",
        options: ["Visual styling", "Structure and content", "Interactivity", "Server-side logic"],
        correctIndex: 1,
        explanation: "HTML (HyperText Markup Language) provides the structure and content of a web page — like headings, paragraphs, images, and links.",
      },
      {
        question: "In the client-server model, what is the 'client'?",
        options: ["The database", "The web server", "The user's browser", "The API"],
        correctIndex: 2,
        explanation: "The client is the user's web browser, which sends requests to the server and renders the response.",
      },
      {
        question: "What is the DOM?",
        options: [
          "A CSS framework",
          "A tree-like structure representing page elements",
          "A JavaScript library",
          "A type of web server",
        ],
        correctIndex: 1,
        explanation: "The DOM (Document Object Model) is a tree-like representation of all elements in an HTML document that browsers create for rendering and manipulation.",
      },
    ],
  },
  {
    id: 2,
    title: "HTML for Learning Content",
    subtitle: "Structure your educational content with semantic HTML",
    icon: FileCode,
    color: "info",
    sections: [
      {
        title: "Semantic HTML Elements",
        content: "Semantic HTML uses meaningful tags that describe the purpose of content. Instead of generic `<div>` tags everywhere, semantic elements like `<header>`, `<nav>`, `<main>`, `<article>`, and `<footer>` tell browsers and screen readers what each section means.\n\nFor instructional designers, semantic HTML improves accessibility — a critical requirement in most learning environments.",
      },
      {
        title: "Common HTML Elements for Learning Content",
        content: "Here are the HTML elements you'll use most frequently when building learning content:",
        codeExample: `<!-- Headings for lesson structure -->
<h1>Module Title</h1>
<h2>Lesson Objective</h2>
<h3>Key Concept</h3>

<!-- Paragraphs and emphasis -->
<p>This is instructional text with <strong>key terms</strong> and <em>emphasis</em>.</p>

<!-- Ordered lists for step-by-step procedures -->
<ol>
  <li>Read the scenario</li>
  <li>Select the best response</li>
  <li>Review the feedback</li>
</ol>

<!-- Images with alt text for accessibility -->
<img src="diagram.png" alt="Network topology diagram showing client-server architecture" />`,
        codeLanguage: "html",
      },
      {
        title: "Forms for Assessments",
        content: "HTML forms are the foundation of online assessments. Radio buttons for multiple choice, checkboxes for multi-select, and text inputs for short answer — all use native HTML form elements.",
        codeExample: `<form id="quiz-form">
  <fieldset>
    <legend>What is the primary purpose of CSS?</legend>
    
    <label>
      <input type="radio" name="q1" value="a" />
      Structure content
    </label>
    <label>
      <input type="radio" name="q1" value="b" />
      Style and layout
    </label>
    <label>
      <input type="radio" name="q1" value="c" />
      Add interactivity
    </label>
  </fieldset>
  
  <button type="submit">Submit Answer</button>
</form>`,
        codeLanguage: "html",
      },
    ],
    quiz: [
      {
        question: "Why is semantic HTML important for learning content?",
        options: [
          "It makes pages load faster",
          "It improves accessibility and content meaning",
          "It adds visual styling",
          "It enables JavaScript functionality",
        ],
        correctIndex: 1,
        explanation: "Semantic HTML provides meaning and structure that assistive technologies can interpret, making content more accessible to all learners.",
      },
    ],
  },
  {
    id: 3,
    title: "CSS for Visual Design & UX",
    subtitle: "Create beautiful, accessible learning interfaces with CSS",
    icon: Palette,
    color: "accent",
    sections: [
      {
        title: "The Box Model",
        content: "Every HTML element is a rectangular box with four layers: **content** (the actual text/image), **padding** (space between content and border), **border** (the edge), and **margin** (space outside the border).\n\nUnderstanding the box model is like understanding how Storyline handles object margins and padding. It's fundamental to controlling layout and spacing.",
      },
      {
        title: "Flexbox & Grid Layouts",
        content: "Modern CSS provides powerful layout systems:\n\n• **Flexbox** — Perfect for one-dimensional layouts (rows or columns). Use it for navigation bars, card rows, or centering content.\n• **CSS Grid** — Ideal for two-dimensional layouts (rows AND columns simultaneously). Use it for dashboard-style layouts or complex page structures.",
        codeExample: `/* Flexbox: Center content perfectly */
.lesson-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 2rem;
}

/* Grid: Create a course dashboard */
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}`,
        codeLanguage: "css",
      },
      {
        title: "Responsive Design",
        content: "Your learners will access content on phones, tablets, and desktops. CSS media queries let you adapt layouts for different screen sizes, ensuring a great experience everywhere.",
        codeExample: `/* Mobile-first approach */
.content-area {
  padding: 1rem;
  font-size: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .content-area {
    padding: 2rem;
    font-size: 1.125rem;
    max-width: 720px;
    margin: 0 auto;
  }
}`,
        codeLanguage: "css",
      },
    ],
    quiz: [
      {
        question: "What are the four layers of the CSS box model (inside to outside)?",
        options: [
          "Margin, border, padding, content",
          "Content, padding, border, margin",
          "Border, content, margin, padding",
          "Padding, content, border, margin",
        ],
        correctIndex: 1,
        explanation: "The CSS box model layers from inside to outside are: content → padding → border → margin.",
      },
    ],
  },
  {
    id: 4,
    title: "JavaScript for Interactivity",
    subtitle: "Add dynamic behavior and logic to your learning experiences",
    icon: Zap,
    color: "warning",
    sections: [
      {
        title: "Variables & Data Types",
        content: "JavaScript variables store data that your interactive elements need. Modern JavaScript uses `const` (for values that don't change) and `let` (for values that do).",
        codeExample: `// Learner data
const learnerName = "Alex";
let currentScore = 0;
let moduleComplete = false;

// Array of quiz answers
const correctAnswers = ["b", "c", "a", "d"];

// Object for tracking progress
const progress = {
  currentModule: 1,
  totalModules: 6,
  completedModules: [],
  quizScores: {}
};`,
        codeLanguage: "javascript",
      },
      {
        title: "DOM Manipulation",
        content: "JavaScript interacts with HTML through the DOM. You can select elements, change their content, modify styles, and respond to user actions — just like triggers in Storyline.",
        codeExample: `// Select elements
const feedbackBox = document.querySelector('.feedback');
const scoreDisplay = document.getElementById('score');

// Change content dynamically
feedbackBox.textContent = "Correct! Great job!";
feedbackBox.classList.add('correct');

// Update score
currentScore += 10;
scoreDisplay.textContent = \`Score: \${currentScore}\`;

// Show/hide elements (like Storyline layers)
document.querySelector('.hint-panel').style.display = 'block';`,
        codeLanguage: "javascript",
      },
      {
        title: "Event Listeners",
        content: "Event listeners are the JavaScript equivalent of Storyline triggers. They wait for user actions (clicks, key presses, form submissions) and execute code in response.",
        codeExample: `// Click handler for a quiz button
document.querySelector('#submit-btn').addEventListener('click', () => {
  const selected = document.querySelector('input[name="q1"]:checked');
  
  if (!selected) {
    alert('Please select an answer.');
    return;
  }
  
  if (selected.value === correctAnswers[0]) {
    showFeedback('correct', 'Well done!');
    currentScore += 10;
  } else {
    showFeedback('incorrect', 'Try again!');
  }
});`,
        codeLanguage: "javascript",
      },
    ],
    quiz: [
      {
        question: "What is the JavaScript equivalent of a Storyline trigger?",
        options: ["A variable", "An event listener", "A CSS selector", "An HTML attribute"],
        correctIndex: 1,
        explanation: "Event listeners in JavaScript respond to user actions (clicks, key presses, etc.) just like triggers respond to interactions in Storyline.",
      },
    ],
  },
  {
    id: 5,
    title: "Building Interactive Learning Experiences",
    subtitle: "Combine HTML, CSS & JS to create engaging e-learning activities",
    icon: Layers,
    color: "success",
    sections: [
      {
        title: "Drag-and-Drop Activities",
        content: "Drag-and-drop is one of the most engaging interaction types in e-learning. The HTML Drag and Drop API provides native browser support, while libraries like SortableJS make implementation easier.\n\nThink about matching exercises, ordering activities, or categorization tasks — all achievable with drag-and-drop.",
      },
      {
        title: "Building a Quiz Engine",
        content: "A reusable quiz engine is incredibly valuable. By separating your quiz data (questions, options, correct answers) from your quiz logic (checking answers, showing feedback, tracking scores), you can create unlimited assessments from a single codebase.",
        codeExample: `// Quiz data structure
const quizData = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language"
    ],
    correct: 0,
    feedback: {
      correct: "That's right! HTML = HyperText Markup Language.",
      incorrect: "Not quite. HTML stands for HyperText Markup Language."
    }
  }
];

// Reusable quiz renderer
function renderQuiz(container, questions) {
  questions.forEach((q, index) => {
    const questionEl = document.createElement('div');
    questionEl.className = 'quiz-question';
    questionEl.innerHTML = \`
      <h3>Question \${index + 1}</h3>
      <p>\${q.question}</p>
      \${q.options.map((opt, i) => \`
        <label class="quiz-option">
          <input type="radio" name="q\${index}" value="\${i}" />
          \${opt}
        </label>
      \`).join('')}
    \`;
    container.appendChild(questionEl);
  });
}`,
        codeLanguage: "javascript",
      },
      {
        title: "Progress Tracking & Completion",
        content: "Tracking learner progress is essential. You can use localStorage to persist progress across sessions, or send data to a Learning Record Store (LRS) using the xAPI standard.\n\nKey metrics to track: module completion, quiz scores, time spent, and interaction attempts.",
      },
    ],
    miniProject: {
      title: "Build a Flashcard Activity",
      description: "Create an interactive flashcard set that lets learners flip cards to reveal answers, mark cards as mastered, and track their progress through the deck.",
      steps: [
        "Create an array of flashcard objects with 'front' and 'back' properties",
        "Build the HTML structure for a card with a flip animation",
        "Add CSS for the 3D card flip effect using transform and perspective",
        "Implement JavaScript to handle card flipping, navigation, and mastery tracking",
        "Add a progress indicator showing cards mastered vs. remaining",
      ],
    },
  },
  {
    id: 6,
    title: "Hosting & Deployment",
    subtitle: "Share your learning content with the world",
    icon: Rocket,
    color: "destructive",
    sections: [
      {
        title: "Static Hosting Options",
        content: "For learning content built with HTML, CSS, and JavaScript, static hosting is the simplest and most cost-effective option:\n\n• **GitHub Pages** — Free, integrates with version control. Great for portfolios and simple courses.\n• **Netlify** — Free tier, automatic deploys from Git, custom domains, and form handling.\n• **Vercel** — Excellent performance, serverless functions, and preview deployments.\n• **Amazon S3** — Enterprise-grade, pay-as-you-go, integrates with CloudFront CDN.",
      },
      {
        title: "Deploying to GitHub Pages",
        content: "GitHub Pages is the easiest way to get started. Push your HTML, CSS, and JS files to a GitHub repository, enable Pages in settings, and your content is live.",
        codeExample: `# Initialize a git repository
git init

# Add your files
git add index.html style.css script.js

# Commit
git commit -m "Initial course deployment"

# Add remote and push
git remote add origin https://github.com/you/my-course.git
git push -u origin main

# Enable GitHub Pages in repository Settings > Pages
# Your course will be live at: https://you.github.io/my-course/`,
        codeLanguage: "bash",
      },
      {
        title: "SCORM & LMS Integration",
        content: "If you need to deploy to a Learning Management System (LMS), you'll need to package your content as a SCORM package. SCORM wraps your HTML/CSS/JS content with an API that communicates with the LMS — reporting completion, scores, and time spent.\n\nTools like SCORM Cloud or pipwerks SCORM wrapper library can help bridge your custom web content with LMS platforms like Moodle, Canvas, or Blackboard.",
      },
    ],
    quiz: [
      {
        question: "Which hosting platform offers free hosting with Git integration?",
        options: ["AWS Lambda", "GitHub Pages", "Docker Hub", "MongoDB Atlas"],
        correctIndex: 1,
        explanation: "GitHub Pages offers free static hosting that integrates directly with your Git repository — perfect for simple learning content.",
      },
    ],
  },
  {
    id: 7,
    title: "Live Code Lab",
    subtitle: "Practice JavaScript with hands-on coding challenges",
    icon: FlaskConical,
    color: "info",
    sections: [
      {
        title: "Hands-On Practice",
        content: "This module is your coding playground. Instead of reading lessons, you'll write real JavaScript to solve three progressive challenges inspired by instructional design scenarios.\n\nEach challenge builds on the previous one — starting with simple string output, moving to arithmetic logic, and finishing with conditional branching and objects.",
      },
      {
        title: "How It Works",
        content: "Use the **Code Lab** tab to access the interactive editor. For each challenge:\n\n• Read the prompt carefully\n• Write your solution in the dark-themed editor\n• Click **Run** to test your code and see console output\n• Click **Submit** to check if your output matches the expected result\n• Click **View Solution** to reveal the answer and a detailed explanation",
      },
    ],
    quiz: [
      {
        question: "What does Math.round(7/10 * 100) return?",
        options: ["7", "70", "0.7", "71"],
        correctIndex: 1,
        explanation: "7 divided by 10 is 0.7, multiplied by 100 is 70, and Math.round(70) is 70.",
      },
      {
        question: "Which keyword is used to return a value from a function?",
        options: ["output", "return", "send", "give"],
        correctIndex: 1,
        explanation: "The `return` keyword exits a function and sends a value back to the caller.",
      },
    ],
  },
];

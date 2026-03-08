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

export interface FlashCard {
  icon: string;
  title: string;
  description: string;
}

export interface CourseModule {
  id: number;
  title: string;
  subtitle: string;
  icon: typeof Globe;
  color: string;
  sections: ModuleSection[];
  flashCards?: FlashCard[];
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
    flashCards: [
      { icon: "🌐", title: "Client-Server", description: "Browser requests → Server responds with HTML/CSS/JS" },
      { icon: "🏗️", title: "The Big Three", description: "HTML = structure, CSS = style, JS = interactivity" },
      { icon: "🌳", title: "The DOM", description: "Tree-like model browsers build from your HTML" },
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
    flashCards: [
      { icon: "🏷️", title: "Semantic HTML", description: "Use meaningful tags like <header>, <main>, <article>" },
      { icon: "📝", title: "Forms", description: "Radio buttons, checkboxes & inputs for assessments" },
      { icon: "♿", title: "Accessibility", description: "Alt text & proper structure for screen readers" },
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
    flashCards: [
      { icon: "📦", title: "Box Model", description: "Content → Padding → Border → Margin" },
      { icon: "📐", title: "Flexbox & Grid", description: "Modern layout systems for rows, columns & dashboards" },
      { icon: "📱", title: "Responsive", description: "Media queries adapt layouts for any screen size" },
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
    title: "JavaScript in Storyline: The Basics",
    subtitle: "Use JavaScript to extend Storyline's built-in functionality",
    icon: Zap,
    color: "warning",
    sections: [
      {
        title: "Why Use JavaScript in Storyline?",
        content: "Articulate Storyline is a powerful authoring tool, but there are things it simply can't do on its own — dynamic text replacement, real-time calculations, connecting to external APIs, or creating complex branching logic that goes beyond built-in triggers.\n\nJavaScript bridges that gap. By executing custom scripts through Storyline's **Execute JavaScript** trigger, you can manipulate slide content, read and write Storyline variables, and even interact with the browser environment. This module teaches you the foundational JavaScript concepts you'll use inside Storyline projects.",
      },
      {
        title: "Storyline Variables & JavaScript Variables",
        content: "Storyline has its own variable system (Text, Number, True/False). JavaScript can **read** and **write** those variables using the `GetPlayer()` API. This is the most critical concept for Storyline JavaScript development.\n\n• `GetPlayer().GetVar(\"variableName\")` — reads a Storyline variable\n• `GetPlayer().SetVar(\"variableName\", value)` — writes to a Storyline variable\n\nBelow is a realistic example: a Storyline slide asks the learner to enter their name into an input field stored in a Storyline text variable called `LearnerName`. A JavaScript trigger then personalizes a welcome message.",
        codeExample: `// ── Storyline Execute JavaScript Trigger ──
// This script runs when the learner clicks a "Continue" button.
// It reads the learner's name from a Storyline text variable
// and creates a personalized greeting stored back in Storyline.

// Step 1: Access the Storyline player object.
// GetPlayer() is a global function Storyline injects into the page.
var player = GetPlayer();

// Step 2: Read the LearnerName variable set by a text-entry field.
var name = player.GetVar("LearnerName");

// Step 3: Build a personalized greeting string.
// If the learner left the field blank, use a fallback name.
var greeting;
if (name && name.trim() !== "") {
  greeting = "Welcome, " + name + "! Let's begin the training.";
} else {
  greeting = "Welcome! Let's begin the training.";
}

// Step 4: Write the greeting back to a Storyline variable
// called "WelcomeMessage" which is displayed in a text box
// with the reference %WelcomeMessage%.
player.SetVar("WelcomeMessage", greeting);`,
        codeLanguage: "javascript",
      },
      {
        title: "Event Timing: When Does Your Code Run?",
        content: "In Storyline, you attach an **Execute JavaScript** trigger to a specific event — a button click, a timeline start, a slide load, or a variable change. The JavaScript runs at that exact moment, not before.\n\nThis is important because the DOM (the webpage elements) may not be fully ready when the timeline starts. Best practices:\n\n• **On button click** — safest, the page is always fully loaded.\n• **When timeline starts** — good for initialization, but some slide elements may still be rendering.\n• **When variable changes** — great for reactive logic (e.g., recalculating a score whenever `QuizAnswer` changes).\n\nBelow is an example that runs when the timeline starts on a slide. It calculates a percentage score from two Storyline number variables and conditionally shows a pass/fail message.",
        codeExample: `// ── Runs on Timeline Start of the "Results" slide ──
// Calculates percentage score and sets a result message.

var player = GetPlayer();

// Read the score variables set by previous quiz slides.
// "CorrectCount" increments each time the learner answers correctly.
// "TotalQuestions" holds the total number of questions (e.g., 10).
var correct = player.GetVar("CorrectCount");
var total   = player.GetVar("TotalQuestions");

// Calculate percentage — guard against division by zero.
var percentage = 0;
if (total > 0) {
  percentage = Math.round((correct / total) * 100);
}

// Write the percentage to a Storyline Number variable
// displayed on the results slide as "You scored %ScorePercent%%".
player.SetVar("ScorePercent", percentage);

// Determine pass/fail (passing threshold: 80%).
var resultMessage;
if (percentage >= 80) {
  resultMessage = "Congratulations! You passed with " + percentage + "%.";
  player.SetVar("CoursePassed", true);
} else {
  resultMessage = "You scored " + percentage + "%. You need 80% to pass. Please review and try again.";
  player.SetVar("CoursePassed", false);
}

// Write the message to a text variable shown on screen.
player.SetVar("ResultMessage", resultMessage);`,
        codeLanguage: "javascript",
      },
    flashCards: [
      { icon: "🎮", title: "GetPlayer()", description: "The bridge between JavaScript and Storyline variables" },
      { icon: "⏱️", title: "Event Timing", description: "Button clicks are the safest trigger for JS execution" },
      { icon: "🔄", title: "Read & Write", description: "GetVar() reads, SetVar() writes Storyline variables" },
    ],
    quiz: [
      {
        question: "How do you read a Storyline variable called 'Score' from JavaScript?",
        options: [
          "document.getElementById('Score')",
          "GetPlayer().GetVar(\"Score\")",
          "Storyline.get('Score')",
          "player.readVariable('Score')",
        ],
        correctIndex: 1,
        explanation: "GetPlayer().GetVar(\"Score\") is the correct Storyline JavaScript API call. GetPlayer() returns the player object, and GetVar() reads any Storyline variable by name.",
      },
      {
        question: "When is the safest time to run JavaScript that reads a text-entry field value?",
        options: [
          "When the timeline starts",
          "When the slide loads for the first time",
          "When the learner clicks a button after entering text",
          "Immediately when the browser opens",
        ],
        correctIndex: 2,
        explanation: "Running JavaScript on a button click ensures the learner has already typed their response and the page is fully rendered, making it the safest trigger point.",
      },
      {
        question: "What does player.SetVar('CoursePassed', true) do in Storyline?",
        options: [
          "Creates a new HTML element on the page",
          "Sends data to an external server",
          "Writes the value 'true' to a Storyline True/False variable",
          "Displays an alert box to the learner",
        ],
        correctIndex: 2,
        explanation: "SetVar writes a value back to a Storyline variable. Here it sets the True/False variable 'CoursePassed' to true, which can then control layer visibility or slide navigation via Storyline triggers.",
      },
    ],
  },
  {
    id: 5,
    title: "Advanced Storyline JavaScript Techniques",
    subtitle: "Dynamic content, branching scenarios, and DOM manipulation in Storyline",
    icon: Layers,
    color: "success",
    sections: [
      {
        title: "Dynamic Content Injection",
        content: "Sometimes you need to display content that Storyline can't generate natively — like a formatted summary of results, a dynamically generated list, or content pulled from an external source.\n\nThe most common approach is to build a string in JavaScript and store it in a Storyline text variable that a text box references via `%VariableName%`.\n\nBelow is a realistic example: a results summary slide that reads individual module scores and generates a formatted performance report.",
        codeExample: `// ── Runs on Timeline Start of the "Summary" slide ──
// Builds a dynamic performance summary based on quiz results
// stored across multiple Storyline variables.

var player = GetPlayer();

// Read individual module scores (set during each module's quiz).
var mod1 = player.GetVar("Module1Score");  // e.g., 3 out of 5
var mod2 = player.GetVar("Module2Score");  // e.g., 4 out of 5
var mod3 = player.GetVar("Module3Score");  // e.g., 2 out of 5
var totalPossible = 15; // 5 questions per module

// Build a structured summary string.
// Storyline text variables support plain text,
// so we format with line breaks and symbols.
var summary = "";
summary += "YOUR PERFORMANCE SUMMARY\\n";
summary += "━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n\\n";
summary += "Module 1 — Web Basics: " + mod1 + "/5 ";
summary += (mod1 >= 4 ? "✅ Passed" : "❌ Needs Review") + "\\n";
summary += "Module 2 — HTML: " + mod2 + "/5 ";
summary += (mod2 >= 4 ? "✅ Passed" : "❌ Needs Review") + "\\n";
summary += "Module 3 — CSS: " + mod3 + "/5 ";
summary += (mod3 >= 4 ? "✅ Passed" : "❌ Needs Review") + "\\n\\n";

var overallScore = mod1 + mod2 + mod3;
var overallPercent = Math.round((overallScore / totalPossible) * 100);

summary += "━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n";
summary += "Overall: " + overallScore + "/" + totalPossible;
summary += " (" + overallPercent + "%)\\n\\n";

if (overallPercent >= 80) {
  summary += "Excellent work! You've demonstrated strong mastery.";
} else if (overallPercent >= 60) {
  summary += "Good effort! Review the flagged modules.";
} else {
  summary += "Please revisit the modules marked for review.";
}

// Store in a Storyline text variable shown via %SummaryText%.
player.SetVar("SummaryText", summary);`,
        codeLanguage: "javascript",
      },
      {
        title: "Branching Scenarios with JavaScript Logic",
        content: "Storyline supports basic branching through slide triggers, but complex multi-variable branching — where the outcome depends on a **combination** of previous choices — is much easier to manage in JavaScript.\n\nImagine a compliance training scenario where the learner makes three decisions across three slides. Each decision is stored in a Storyline text variable (`Decision1`, `Decision2`, `Decision3`). On the outcome slide, JavaScript evaluates all three together to determine which ending to show.",
        codeExample: `// ── Runs on Timeline Start of the "Outcome" slide ──
// Evaluates a combination of learner decisions to determine
// which Storyline layer to show as the scenario ending.

var player = GetPlayer();

// Read the three decision variables.
// Each was set by a button trigger on its respective slide:
// "report" or "ignore" for Decision1
// "confront" or "escalate" for Decision2  
// "document" or "skip" for Decision3
var d1 = player.GetVar("Decision1");
var d2 = player.GetVar("Decision2");
var d3 = player.GetVar("Decision3");

// Count how many "correct" decisions the learner made.
// Correct path: report → escalate → document
var correctChoices = 0;
if (d1 === "report")   correctChoices++;
if (d2 === "escalate") correctChoices++;
if (d3 === "document") correctChoices++;

// Determine the outcome tier.
// Storyline triggers show layers based on OutcomeTier value:
// "Show layer [Exemplary] when OutcomeTier == exemplary"
var tier;
if (correctChoices === 3) {
  tier = "exemplary";
} else if (correctChoices === 2) {
  tier = "acceptable";
} else {
  tier = "needsWork";
}

player.SetVar("OutcomeTier", tier);

// Build a detailed explanation for the results text box.
var explanation = "Your decisions: ";
explanation += d1 + " → " + d2 + " → " + d3 + ". ";
explanation += "You made " + correctChoices + "/3 correct choices. ";

if (tier === "exemplary") {
  explanation += "Outstanding — you followed the ideal protocol at every step.";
} else if (tier === "acceptable") {
  explanation += "Good instincts, but one choice could be improved.";
} else {
  explanation += "Several decisions need reconsideration. Please review the policy.";
}

player.SetVar("OutcomeExplanation", explanation);`,
        codeLanguage: "javascript",
      },
      {
        title: "Manipulating Storyline's DOM for Visual Effects",
        content: "While `GetPlayer()` is the official API, you can also directly manipulate the HTML elements Storyline generates. This is an advanced technique — Storyline doesn't guarantee stable element IDs across publishes, so use it carefully.\n\nA common use case: highlighting a key term with a glowing animation, or changing the styling of an element to draw attention after a delay.\n\n⚠️ **Warning**: Direct DOM manipulation can break if Storyline updates its HTML structure. Always test after republishing.",
        codeExample: `// ── Advanced: Highlighting a Storyline element via DOM ──
// Finds a text element by its accessibility name and applies
// a pulsing highlight animation after a short delay.

// From an Execute JavaScript trigger, 'document' refers to
// the slide's DOM inside Storyline's iframe.

// Find all elements with accessibility text attributes.
var allText = document.querySelectorAll('[data-acc-text]');

for (var i = 0; i < allText.length; i++) {
  var el = allText[i];
  // Look for the element whose accessibility name is "KeyTerm"
  // (set in Storyline's accessibility panel for the object).
  if (el.getAttribute('data-acc-text') === 'KeyTerm') {
    // Apply a glowing highlight after a 2-second delay.
    setTimeout(function() {
      el.style.transition = 'all 0.5s ease';
      el.style.boxShadow = '0 0 20px rgba(255, 200, 0, 0.8)';
      el.style.borderRadius = '4px';

      // Remove the highlight after 3 seconds.
      setTimeout(function() {
        el.style.boxShadow = 'none';
      }, 3000);
    }, 2000);
    break; // Stop after finding the target element.
  }
}`,
        codeLanguage: "javascript",
      },
    flashCards: [
      { icon: "💉", title: "Dynamic Content", description: "Build strings in JS and display via %VariableName%" },
      { icon: "🌿", title: "Branching Logic", description: "Evaluate multiple variables for complex scenario outcomes" },
      { icon: "⚠️", title: "DOM Caution", description: "Direct DOM manipulation may break across Storyline versions" },
    ],
    quiz: [
      {
        question: "In a branching scenario, why would you use JavaScript instead of Storyline triggers alone?",
        options: [
          "JavaScript runs faster than Storyline triggers",
          "JavaScript can evaluate multiple variables together for complex branching logic",
          "Storyline triggers cannot navigate between slides",
          "JavaScript is required for any kind of branching",
        ],
        correctIndex: 1,
        explanation: "While Storyline triggers handle simple branching well, JavaScript excels when you need to evaluate combinations of multiple variables to determine an outcome — such as scoring three decisions together to pick one of several endings.",
      },
      {
        question: "What is the risk of directly manipulating Storyline's DOM with JavaScript?",
        options: [
          "It makes the course file too large",
          "It could break if Storyline changes its HTML structure in a future version",
          "DOM manipulation is not allowed in web browsers",
          "It prevents the course from being published",
        ],
        correctIndex: 1,
        explanation: "Storyline doesn't guarantee stable HTML element IDs or structure across versions, so direct DOM manipulation may break when you update Storyline or republish. Always test thoroughly.",
      },
      {
        question: "How can you display a dynamically generated multi-line summary in Storyline?",
        options: [
          "Use document.write() to inject HTML into the slide",
          "Build a string with \\n line breaks and store it in a Storyline text variable",
          "Storyline cannot display dynamic text at all",
          "Use CSS to generate text content automatically",
        ],
        correctIndex: 1,
        explanation: "By building a string in JavaScript with \\n for line breaks and writing it to a Storyline text variable with SetVar(), you can display dynamic multi-line content in any text box that references %VariableName%.",
      },
    ],
    miniProject: {
      title: "Build a Branching Scenario Score Calculator",
      description: "Create a JavaScript snippet for Storyline that reads three decision variables, calculates a weighted score, and sets the appropriate outcome layer and feedback message.",
      steps: [
        "Define three Storyline text variables (Decision1, Decision2, Decision3) and a scoring rubric",
        "Write JavaScript to read all three variables using GetPlayer().GetVar()",
        "Implement weighted scoring logic (some decisions worth more than others)",
        "Set an OutcomeTier variable that Storyline triggers use to show the correct ending layer",
        "Generate a personalized feedback string and store it in a Storyline text variable",
      ],
    },
  },
  {
    id: 6,
    title: "Storyline + External Integrations",
    subtitle: "Connect Storyline courses to external tools, APIs, and data sources",
    icon: Rocket,
    color: "destructive",
    sections: [
      {
        title: "Sending Data from Storyline to External Services",
        content: "One of JavaScript's most powerful capabilities in Storyline is connecting to external services. You can send learner data to Google Sheets, a webhook, an analytics platform, or a custom API — all from an Execute JavaScript trigger.\n\nThis is useful for:\n• **Custom analytics** — Track detailed interaction data beyond what SCORM provides.\n• **Certificate generation** — Send the learner's name and score to an API that generates a PDF.\n• **Leaderboards** — Post scores to a shared database for competitive learning.\n\nBelow is a realistic example: sending quiz results to a Google Sheets spreadsheet via a Google Apps Script web app.",
        codeExample: `// ── Runs when the learner clicks "Submit Results" ──
// Sends course completion data to a Google Sheets spreadsheet
// via a Google Apps Script web app URL.

var player = GetPlayer();

// Gather all the data we want to record.
var learnerName = player.GetVar("LearnerName");
var score       = player.GetVar("ScorePercent");
var passed      = player.GetVar("CoursePassed");
var courseName  = "JavaScript Basics for ID";

// Build the data payload.
var payload = {
  name: learnerName,
  course: courseName,
  score: score,
  passed: passed,
  completedAt: new Date().toISOString()
};

// Send the data using the Fetch API.
// Replace the URL with your Google Apps Script deployment URL.
var webhookURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

fetch(webhookURL, {
  method: "POST",
  mode: "no-cors",  // Required for cross-origin requests
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
})
.then(function() {
  // Confirm submission to the learner.
  player.SetVar("SubmissionStatus", "✅ Results submitted successfully!");
})
.catch(function(error) {
  // Graceful fallback if the request fails.
  player.SetVar("SubmissionStatus", "⚠️ Submission failed. Check your connection.");
  console.error("Submission error:", error);
});`,
        codeLanguage: "javascript",
      },
      {
        title: "Loading External Content into Storyline",
        content: "You can also pull data **into** Storyline from external sources — loading a daily tip from a JSON file, fetching localized content based on browser language, or pulling updated policy text from a CMS.\n\nThis keeps course content fresh without republishing the Storyline file. The external data source can be updated independently.",
        codeExample: `// ── Runs on Timeline Start of the "Daily Tip" slide ──
// Fetches a random tip from an external JSON file hosted
// alongside the published Storyline output.

var player = GetPlayer();

// The tips.json file is placed in the published output folder.
// Format: [{ "title": "Tip Title", "body": "Tip content..." }, ...]
fetch("tips.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(tips) {
    // Select a random tip from the array.
    var randomIndex = Math.floor(Math.random() * tips.length);
    var tip = tips[randomIndex];

    // Write tip data to Storyline variables.
    // Text boxes on the slide reference %TipTitle% and %TipBody%.
    player.SetVar("TipTitle", tip.title);
    player.SetVar("TipBody", tip.body);
    player.SetVar("TipNumber", randomIndex + 1);
    player.SetVar("TotalTips", tips.length);
  })
  .catch(function(error) {
    // Fallback for offline learners.
    player.SetVar("TipTitle", "Did You Know?");
    player.SetVar("TipBody", "JavaScript can make your Storyline courses smarter and more dynamic!");
    console.error("Failed to load tips:", error);
  });`,
        codeLanguage: "javascript",
      },
      {
        title: "SCORM & xAPI: Reporting Custom Data to Your LMS",
        content: "Storyline handles basic SCORM reporting automatically (completion, score, pass/fail). But what if you want to report **custom data** — like which questions were missed, how long a learner spent on a scenario, or which path they chose in a branching exercise?\n\nFor SCORM, you can write to the `cmi.suspend_data` field to store custom JSON that persists between sessions. For xAPI (Tin Can), you can send rich **statements** describing exactly what the learner did.\n\n⚠️ **Note**: Direct SCORM API calls are advanced. Always test in your specific LMS.",
        codeExample: `// ── Advanced: Writing custom data to SCORM suspend_data ──
// Persists custom JSON data between course sessions in the LMS.

var player = GetPlayer();

// Build a custom data object with detailed tracking info.
var customData = {
  scenarioPath: player.GetVar("Decision1") + " > "
    + player.GetVar("Decision2") + " > "
    + player.GetVar("Decision3"),
  attemptsCount: player.GetVar("AttemptNumber"),
  moduleScores: {
    mod1: player.GetVar("Module1Score"),
    mod2: player.GetVar("Module2Score"),
    mod3: player.GetVar("Module3Score")
  },
  lastAccessed: new Date().toISOString()
};

// Convert to JSON string for SCORM storage.
var jsonString = JSON.stringify(customData);

// Find the SCORM API in the parent window chain.
// The LMS provides this API; Storyline connects to it automatically,
// but for custom data we need direct access.
function findSCORMAPI(win) {
  var attempts = 0;
  while (win && !win.API_1484_11 && !win.API && attempts < 10) {
    win = win.parent;
    attempts++;
  }
  return win.API_1484_11 || win.API || null;
}

var scormAPI = findSCORMAPI(window);

if (scormAPI) {
  // SCORM 2004 uses cmi.suspend_data to store custom strings.
  scormAPI.SetValue("cmi.suspend_data", jsonString);
  scormAPI.Commit("");  // Save immediately.
  console.log("Custom data saved to SCORM:", jsonString);
} else {
  console.warn("SCORM API not found — running outside an LMS.");
}`,
        codeLanguage: "javascript",
      },
    flashCards: [
      { icon: "📡", title: "Fetch API", description: "Send data to Google Sheets, webhooks & external APIs" },
      { icon: "📥", title: "Load Content", description: "Pull dynamic tips or updates from external JSON files" },
      { icon: "📊", title: "SCORM/xAPI", description: "Report custom learner data beyond basic completion" },
    ],
    quiz: [
      {
        question: "Why would you use fetch() inside a Storyline JavaScript trigger?",
        options: [
          "To style elements with CSS animations",
          "To send learner data to external services or load dynamic content",
          "To create new Storyline slides programmatically",
          "To replace the SCORM API entirely",
        ],
        correctIndex: 1,
        explanation: "The fetch() API lets you make HTTP requests from JavaScript. In Storyline, this enables sending data to external services (Google Sheets, analytics, APIs) or pulling in dynamic content without republishing.",
      },
      {
        question: "What happens if a fetch() call fails inside Storyline (e.g., learner is offline)?",
        options: [
          "Storyline automatically retries the request",
          "The course crashes and must be restarted",
          "The .catch() handler runs, letting you show a fallback message",
          "The browser displays a system error dialog",
        ],
        correctIndex: 2,
        explanation: "When fetch() fails, the .catch() callback executes. Best practice is to always include a .catch() that sets a Storyline variable with a graceful error message so the learner isn't left confused.",
      },
      {
        question: "What is SCORM suspend_data used for?",
        options: [
          "Displaying the learner's name on screen",
          "Persisting custom JSON data between course sessions in the LMS",
          "Suspending the course timeline temporarily",
          "Storing CSS styles for the course player",
        ],
        correctIndex: 1,
        explanation: "SCORM's cmi.suspend_data field stores a string (typically JSON) that persists between sessions. This lets you save custom tracking data like scenario paths, attempt counts, or module scores so learners can resume where they left off.",
      },
    ],
  },
  {
    id: 7,
    title: "Live Code Lab",
    subtitle: "Practice writing Storyline JavaScript with hands-on challenges",
    icon: FlaskConical,
    color: "info",
    sections: [
      {
        title: "Hands-On Practice",
        content: "This module is your coding playground. Instead of reading lessons, you'll write real JavaScript to solve three progressive challenges that simulate common Storyline scripting scenarios.\n\nEach challenge mirrors a real task you'd perform as an instructional designer using JavaScript in Articulate Storyline — from personalizing content to calculating scores and implementing conditional branching logic.",
      },
      {
        title: "How It Works",
        content: "Use the **Code Lab** tab to access the interactive editor. For each challenge:\n\n• Read the prompt carefully — each describes a realistic Storyline scenario\n• Write your solution in the dark-themed editor\n• Click **Run** to test your code and see console output\n• Click **Submit** to check if your output matches the expected result\n• Click **View Solution** to reveal the answer with a detailed explanation of how the code works in a Storyline context",
      },
    flashCards: [
      { icon: "🧪", title: "Hands-On", description: "Write real JavaScript for Storyline scenarios" },
      { icon: "✅", title: "Test & Submit", description: "Run code, check output, and verify solutions" },
    ],
    quiz: [
      {
        question: "In a Storyline Execute JavaScript trigger, what does GetPlayer().SetVar('Score', 85) do?",
        options: [
          "Creates a new JavaScript variable called Score with value 85",
          "Writes the value 85 to a Storyline variable named 'Score'",
          "Displays the number 85 on screen",
          "Sends the score to the LMS",
        ],
        correctIndex: 1,
        explanation: "SetVar writes a value to a Storyline variable. Here it sets the 'Score' variable to 85, which can then be displayed on-screen using %Score% or used in Storyline triggers.",
      },
      {
        question: "What does Math.round((7/10) * 100) return, and why is this useful in Storyline?",
        options: [
          "7 — useful for counting correct answers",
          "70 — useful for calculating and displaying a percentage score",
          "0.7 — useful for setting opacity values",
          "100 — useful for setting the maximum score",
        ],
        correctIndex: 1,
        explanation: "7/10 = 0.7, multiplied by 100 = 70, and Math.round(70) = 70. This pattern is essential in Storyline for converting a fraction (correct/total) into a clean percentage to display on a results slide.",
      },
    ],
  },
];

// Duplicated minimal course outline for the MCP server. Kept separate from
// src/data/courseData.ts because that file imports lucide-react icons, which
// don't belong in the Deno edge-function bundle.

export interface McpModuleSection {
  title: string;
  content: string;
  codeExample?: string;
  codeLanguage?: string;
}

export interface McpModule {
  id: number;
  title: string;
  subtitle: string;
  sections: McpModuleSection[];
}

export const mcpCourseModules: McpModule[] = [
  {
    id: 1,
    title: "How the Web Works",
    subtitle: "Foundations of the internet, browsers, and the client-server model.",
    sections: [
      {
        title: "Client and server",
        content:
          "A browser (client) requests a page from a server over HTTP. The server responds with HTML, CSS, and JavaScript that the browser renders.",
      },
    ],
  },
  {
    id: 2,
    title: "HTML: Structure",
    subtitle: "Semantic markup for building learning content.",
    sections: [
      { title: "Elements and tags", content: "HTML is made of nested elements that describe content structure." },
    ],
  },
  {
    id: 3,
    title: "The DOM Tree",
    subtitle: "How the browser turns HTML into a live tree JavaScript can manipulate.",
    sections: [{ title: "Nodes", content: "Every element is a node in the DOM tree." }],
  },
  {
    id: 4,
    title: "CSS: Styling",
    subtitle: "Colors, layout, and responsive design.",
    sections: [{ title: "Selectors", content: "Selectors target elements to apply styles." }],
  },
  {
    id: 5,
    title: "JavaScript: Behavior",
    subtitle: "Adding interactivity to learning experiences.",
    sections: [{ title: "Variables and functions", content: "The building blocks of JS logic." }],
  },
  {
    id: 6,
    title: "Building Interactivity",
    subtitle: "Events, state, and dynamic content.",
    sections: [{ title: "Event listeners", content: "Respond to clicks, input, and other user actions." }],
  },
  {
    id: 7,
    title: "Live Code Lab",
    subtitle: "Write and run real code in the browser.",
    sections: [{ title: "Practice", content: "Use the in-browser editor to try HTML/CSS/JS." }],
  },
];

export const TOTAL_MODULES = mcpCourseModules.length;

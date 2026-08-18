import { motion } from "framer-motion";
import { AppSidebar } from "@/components/AppSidebar";
import { FileText, Server, Globe, Folder, Terminal, ExternalLink } from "lucide-react";

const SECTIONS = [
  {
    title: "Project Overview",
    content: `DermScan Pro is a professional-grade AI-powered skin lesion classification system. It uses deep learning (InceptionV3 architecture) to analyze dermatoscopic images and classify them into 7 diagnostic categories. The system features a tournament-based model selection pipeline that evaluates 4 architectures and automatically deploys the best performer.`,
  },
  {
    title: "How to Run Locally",
    steps: [
      "Clone the repository from GitHub",
      "Set up a Python 3.11+ virtual environment",
      "Install backend dependencies: pip install fastapi uvicorn tensorflow pillow",
      "Run the classifier notebook to generate the model: jupyter notebook classifier.ipynb",
      "Start the backend: python main.py (runs on http://localhost:8000)",
      "Install frontend dependencies: npm install",
      "Set VITE_API_URL=http://localhost:8000 in .env file",
      "Start the frontend: npm run dev",
    ],
  },
];

const ENDPOINTS = [
  { method: "POST", path: "/api/v1/predict", description: "Upload image for classification. Returns prediction, confidence, and probability distribution." },
];

const TECH_STACK = [
  { category: "Frontend", items: "React 18, Vite, Tailwind CSS, Framer Motion, Recharts, TypeScript" },
  { category: "Backend", items: "FastAPI, Uvicorn, Pydantic" },
  { category: "AI/ML", items: "TensorFlow/Keras, InceptionV3, PIL/Pillow" },
  { category: "Dataset", items: "HAM10000 (10,015 dermatoscopic images, 7 classes)" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 ml-16 lg:ml-60">
        <header className="sticky top-0 z-10 h-14 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center px-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Documentation</h2>
            <p className="text-[11px] text-muted-foreground">Setup Guide & API Reference</p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-4xl">
          {/* Overview */}
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">{s.title}</h3>
              </div>
              <div className="p-5">
                {s.content && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.content}</p>
                )}
                {s.steps && (
                  <ol className="space-y-2">
                    {s.steps.map((step, j) => (
                      <li key={j} className="flex gap-3 text-xs">
                        <span className="w-5 h-5 rounded-md bg-secondary/60 flex items-center justify-center text-[10px] font-mono text-muted-foreground flex-shrink-0">
                          {j + 1}
                        </span>
                        <span className="text-muted-foreground leading-relaxed pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </motion.div>
          ))}

          {/* API Reference */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
              <Server className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold">API Reference</h3>
            </div>
            <div className="p-5 space-y-3">
              {ENDPOINTS.map((ep) => (
                <div key={ep.path} className="bg-secondary/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/15 text-accent">
                      {ep.method}
                    </span>
                    <code className="text-xs font-mono text-foreground">{ep.path}</code>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{ep.description}</p>
                  <div className="mt-2">
                    <p className="text-[10px] text-muted-foreground mb-1">Response shape:</p>
                    <pre className="text-[10px] font-mono text-muted-foreground/80 bg-background/50 rounded p-3 overflow-x-auto">
{`{
  "prediction": "Melanocytic nevi",
  "confidence": "87.34%",
  "probability_data": [
    { "name": "Melanocytic nevi", "score": 87.34 },
    ...
  ],
  "status": "success"
}`}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
              <Folder className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Technology Stack</h3>
            </div>
            <div className="divide-y divide-border/30">
              {TECH_STACK.map((t) => (
                <div key={t.category} className="px-5 py-3 flex items-start gap-4">
                  <span className="text-[11px] font-semibold text-foreground w-20 flex-shrink-0">{t.category}</span>
                  <span className="text-xs text-muted-foreground">{t.items}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Project structure */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Project Structure</h3>
            </div>
            <pre className="p-5 text-[11px] font-mono text-muted-foreground leading-relaxed">
{`DermScan-Pro/
├── backend/
│   ├── main.py                  # FastAPI server
│   └── skin_disease_model.h5    # Trained model (generated)
├── classifier/
│   └── classifier.ipynb         # Tournament training notebook
├── frontend/
│   ├── src/
│   │   ├── components/          # Modular UI components
│   │   ├── pages/               # Route pages
│   │   ├── lib/api.ts           # API client
│   │   └── index.css            # Design system
│   └── package.json
└── README.md`}
            </pre>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

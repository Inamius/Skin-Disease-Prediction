import { motion } from "framer-motion";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Brain,
  Layers,
  ArrowRight,
  Image,
  Cpu,
  GitBranch,
} from "lucide-react";
import { useEffect, useState } from "react";

const API = "http://localhost:8000/api/v1";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function ArchitecturePage() {
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    fetch(`${API}/model-info`)
      .then((res) => res.json())
      .then(setModel)
      .catch(() => setModel(null));
  }, []);

  if (!model) {
    return <div className="p-10 text-muted-foreground">Loading architecture...</div>;
  }

  // 🔥 DYNAMIC VALUES
  const MODEL_NAME = model.name || "Unknown";
  const ACCURACY = model.accuracy ? (model.accuracy * 100).toFixed(2) + "%" : "N/A";
  const PARAMS = model.parameters || "Unknown";

  // 🔥 SAME UI — JUST DATA CHANGED
  const LAYERS = [
    { name: "Input Layer", detail: "224 × 224 × 3 RGB Tensor", type: "input" },
    { name: `${MODEL_NAME} Base`, detail: "Pre-trained on ImageNet", type: "conv" },
    { name: "Global Average Pooling 2D", detail: "Spatial dimensionality reduction", type: "pool" },
    { name: "Dense (Softmax)", detail: "7 output neurons — skin condition classes", type: "output" },
  ];

  const SPECS = [
    { label: "Model Name", value: MODEL_NAME },
    { label: "Accuracy", value: ACCURACY },
    { label: "Total Parameters", value: PARAMS },
    { label: "Input Shape", value: "(224, 224, 3)" },
    { label: "Output Shape", value: "(7,)" },
    { label: "Optimizer", value: "Adam" },
    { label: "Loss Function", value: "Categorical Crossentropy" },
    { label: "Activation", value: "Softmax" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 ml-16 lg:ml-60">
        <header className="sticky top-0 z-10 h-14 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center px-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Model Architecture</h2>
            <p className="text-[11px] text-muted-foreground">
              {MODEL_NAME} Transfer Learning Pipeline
            </p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-5xl">

          {/* Architecture Flow */}
          <motion.div {...fadeIn} className="glass-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Network Architecture Flow</h3>
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-3">
                {LAYERS.map((layer, i) => (
                  <div key={layer.name} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      layer.type === "input" ? "bg-accent/12" :
                      layer.type === "conv" ? "bg-primary/12" :
                      layer.type === "pool" ? "bg-warning/12" : "bg-success/12"
                    }`}>
                      {layer.type === "input" ? <Image className="w-4 h-4 text-accent" /> :
                       layer.type === "conv" ? <Brain className="w-4 h-4 text-primary" /> :
                       layer.type === "pool" ? <Layers className="w-4 h-4 text-warning" /> :
                       <Cpu className="w-4 h-4 text-success" />}
                    </div>
                    <div className="flex-1 bg-secondary/30 rounded-lg p-3">
                      <p className="text-sm font-medium text-foreground">{layer.name}</p>
                      <p className="text-[11px] text-muted-foreground">{layer.detail}</p>
                    </div>
                    {i < LAYERS.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground/30 flex-shrink-0 rotate-90 lg:rotate-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Model Specs */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold">Model Specifications</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-border/30">
              {SPECS.map((s) => (
                <div key={s.label} className="bg-card p-4 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-xs font-mono font-semibold text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Transfer Learning */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="glass-card p-5 space-y-3">
            <h3 className="text-sm font-semibold">Transfer Learning Strategy</h3>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>
                The model uses <span className="text-primary font-medium">{MODEL_NAME}</span> pre-trained on ImageNet as the feature extractor.
                All convolutional layers are <span className="text-foreground font-medium">frozen</span> to preserve learned representations.
              </p>
              <p>
                Only the final Dense classification head is trained on the HAM10000 dermatoscopic dataset,
                mapping extracted features to 7 diagnostic categories.
              </p>
            </div>
          </motion.div>

        </main>
      </div>
    </div>
  );
}
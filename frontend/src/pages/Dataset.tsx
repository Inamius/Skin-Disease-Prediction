import { motion } from "framer-motion";
import { AppSidebar } from "@/components/AppSidebar";
import { Database, Image, Users, Layers, BarChart3 } from "lucide-react";

const CLASSES = [
  { code: "nv", name: "Melanocytic nevi", count: 6705, pct: 66.95, risk: "low" },
  { code: "mel", name: "Melanoma", count: 1113, pct: 11.11, risk: "high" },
  { code: "bkl", name: "Benign keratosis", count: 1099, pct: 10.97, risk: "low" },
  { code: "bcc", name: "Basal cell carcinoma", count: 514, pct: 5.13, risk: "high" },
  { code: "akiec", name: "Actinic keratoses", count: 327, pct: 3.27, risk: "medium" },
  { code: "vasc", name: "Vascular lesions", count: 142, pct: 1.42, risk: "medium" },
  { code: "df", name: "Dermatofibroma", count: 115, pct: 1.15, risk: "low" },
];

const DATASET_STATS = [
  { label: "Total Images", value: "10,015", icon: Image },
  { label: "Unique Patients", value: "~7,000", icon: Users },
  { label: "Diagnostic Classes", value: "7", icon: Layers },
  { label: "Image Resolution", value: "600×450 px", icon: BarChart3 },
];

export default function DatasetPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 ml-16 lg:ml-60">
        <header className="sticky top-0 z-10 h-14 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center px-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Dataset HAM10000</h2>
            <p className="text-[11px] text-muted-foreground">Human Against Machine — 10,000 Training Images</p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-5xl">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {DATASET_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] text-muted-foreground uppercase tracking-widest">{s.label}</span>
                </div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Class distribution */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
              <Database className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold">Class Distribution</h3>
            </div>

            <div className="divide-y divide-border/30">
              {CLASSES.map((c, i) => (
                <motion.div
                  key={c.code}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="px-5 py-3.5 flex items-center gap-4"
                >
                  <span className="text-[11px] font-mono text-muted-foreground w-12 flex-shrink-0 uppercase">{c.code}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    c.risk === "high" ? "bg-destructive/15 text-destructive" :
                    c.risk === "medium" ? "bg-warning/15 text-warning" :
                    "bg-success/15 text-success"
                  }`}>
                    {c.risk}
                  </span>
                  <div className="w-32 flex-shrink-0">
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.pct}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground w-20 text-right flex-shrink-0">
                    {c.count.toLocaleString()} ({c.pct}%)
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* About dataset */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-5 space-y-3"
          >
            <h3 className="text-sm font-semibold">About HAM10000</h3>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>
                The <span className="text-foreground font-medium">HAM10000</span> ("Human Against Machine with 10000 training images")
                dataset is a large collection of multi-source dermatoscopic images of pigmented lesions, published by the
                Medical University of Vienna.
              </p>
              <p>
                Images were collected over 20 years from different populations using various dermatoscopes.
                Ground truth was established through histopathology (&gt;50%), follow-up examination, expert consensus,
                and in-vivo confocal microscopy.
              </p>
              <p>
                The dataset exhibits significant <span className="text-warning font-medium">class imbalance</span> — melanocytic nevi
                represent ~67% of all images, while rare conditions like dermatofibroma account for only ~1%.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

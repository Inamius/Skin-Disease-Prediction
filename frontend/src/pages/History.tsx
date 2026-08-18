import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSidebar } from "@/components/AppSidebar";
import { PredictionResultCard } from "@/components/PredictionResult";
import { ProbabilityChart } from "@/components/ProbabilityChart";
import { History, Trash2, Clock, ArrowLeft } from "lucide-react";
import { getScanHistory, clearScanHistory, type ScanHistoryEntry } from "@/lib/api";
import { Button } from "@/components/ui/button";

const RISK_MAP: Record<string, { level: string; color: string }> = {
  "Melanoma": { level: "HIGH", color: "text-destructive" },
  "Basal cell carcinoma": { level: "HIGH", color: "text-destructive" },
  "Actinic keratoses": { level: "MED", color: "text-warning" },
  "Vascular lesions": { level: "MED", color: "text-warning" },
  "Dermatofibroma": { level: "LOW", color: "text-success" },
  "Benign keratosis": { level: "LOW", color: "text-success" },
  "Melanocytic nevi": { level: "LOW", color: "text-success" },
};

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [selected, setSelected] = useState<ScanHistoryEntry | null>(null);

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const handleClear = () => {
    clearScanHistory();
    setHistory([]);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 ml-16 lg:ml-60">
        <header className="sticky top-0 z-10 h-14 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center justify-between px-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Scan History</h2>
            <p className="text-[11px] text-muted-foreground">Past diagnostic analyses</p>
          </div>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs text-muted-foreground hover:text-destructive gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          )}
        </header>

        <main className="p-6 max-w-6xl">
          {selected ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to history
              </button>

              <div className="grid lg:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="glass-card overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-border/50">
                      <h3 className="text-sm font-semibold">Scanned Image</h3>
                    </div>
                    <div className="p-5">
                      <img
                        src={selected.imageDataUrl}
                        alt="Scanned lesion"
                        className="w-full max-h-64 object-contain rounded-lg border border-border/50"
                      />
                      <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                        <span className="font-mono">{selected.imageName}</span>
                        <span>•</span>
                        <span>{new Date(selected.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <PredictionResultCard result={selected.result} />
                </div>
                <div>
                  <ProbabilityChart result={selected.result} />
                </div>
              </div>
            </div>
          ) : history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <Clock className="w-16 h-16 text-muted-foreground/15 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No scan history</h3>
              <p className="text-sm text-muted-foreground/60 mt-1 max-w-sm">
                Scan results will appear here automatically after you analyze images in the Diagnostic Workspace.
              </p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {history.map((entry, i) => {
                  const risk = RISK_MAP[entry.result.prediction] || { level: "MED", color: "text-warning" };
                  return (
                    <motion.button
                      key={entry.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelected(entry)}
                      className="glass-card-hover overflow-hidden text-left group"
                    >
                      <div className="relative h-36 bg-muted/10 overflow-hidden">
                        <img
                          src={entry.imageDataUrl}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur-sm ${risk.color}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {risk.level}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {entry.result.prediction}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-xs font-mono text-primary">{entry.result.confidence}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

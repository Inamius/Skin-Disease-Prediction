import { motion } from "framer-motion";
import { AppSidebar } from "@/components/AppSidebar";
import { Trophy, Swords, Clock, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

const API = "http://localhost:8000";

export default function TournamentPage() {
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/tournament_results.json`)
      .then((res) => res.json())
      .then((data) => {
        // sort by accuracy DESC
        const sorted = [...data].sort((a, b) => b.val_accuracy - a.val_accuracy);

        // normalize for UI
        const formatted = sorted.map((m, i) => ({
          name: m.name,
          type: "Pre-trained + Fine-tuned (ImageNet)",
          accuracy: m.val_accuracy * 100,
          params: m.params || "Unknown",
          trainable: m.trainable || "—",
          winner: i === 0,
          notes: m.notes || "Model evaluated on HAM10000 dataset.",
        }));

        setModels(formatted);
      })
      .catch(() => setModels([]));
  }, []);

  if (!models.length) {
    return <div className="p-10 text-muted-foreground">Loading tournament...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />

      <div className="flex-1 ml-16 lg:ml-60">
        <header className="sticky top-0 z-10 h-14 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center px-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Tournament Logs</h2>
            <p className="text-[11px] text-muted-foreground">
              Model Selection via Competitive Evaluation
            </p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-5xl">

          {/* TOP STATS (UNCHANGED UI) */}
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: Swords, label: "Competitors", value: `${models.length} Models`, color: "text-primary" },
              { icon: Clock, label: "Total Duration", value: "~20 min", color: "text-warning" },
              { icon: Cpu, label: "Hardware", value: "Apple M2 Air 8GB", color: "text-accent" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary/60 flex items-center justify-center">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-bold text-foreground">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* TOURNAMENT RESULTS */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold">Tournament Results</h3>
            </div>

            <div className="divide-y divide-border/30">
              {models.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className={`p-5 ${m.winner ? "bg-accent/5" : ""}`}
                >
                  <div className="flex items-start gap-4">

                    {/* LEFT ICON */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      m.winner ? "bg-accent/15" : "bg-secondary/50"
                    }`}>
                      {m.winner ? (
                        <Trophy className="w-5 h-5 text-accent" />
                      ) : (
                        <span className="text-sm font-mono text-muted-foreground">
                          #{i + 1}
                        </span>
                      )}
                    </div>

                    {/* MAIN */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-base font-semibold ${
                          m.winner ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {m.name}
                        </p>

                        {m.winner && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 text-accent uppercase">
                            Champion
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-muted-foreground mt-0.5">{m.type}</p>
                      <p className="text-xs text-muted-foreground/80 mt-2">{m.notes}</p>

                      <div className="flex gap-4 mt-3 text-[11px]">
                        <span>Params: <b>{m.params}</b></span>
                        <span>Trainable: <b>{m.trainable}</b></span>
                        <span>Epochs: <b>1</b></span>
                      </div>
                    </div>

                    {/* RIGHT ACCURACY */}
                    <div className="text-right">
                      <p className={`text-2xl font-bold font-mono ${
                        m.winner ? "text-accent" : "text-muted-foreground"
                      }`}>
                        {m.accuracy.toFixed(2)}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">accuracy</p>
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.accuracy}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full ${
                        m.winner ? "bg-accent" : "bg-muted-foreground/30"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </main>
      </div>
    </div>
  );
}
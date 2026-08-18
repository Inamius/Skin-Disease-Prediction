import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

type Model = {
  name: string;
  val_accuracy: number;
  params: string;
  trainable: number;
};

export function TournamentCard() {
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/tournament")
      .then((res) => res.json())
      .then((data) => {
        // 🔥 sort descending
        const sorted = data.sort(
          (a: Model, b: Model) => b.val_accuracy - a.val_accuracy
        );
        setModels(sorted);
      })
      .catch(() => console.error("Failed to load tournament"));
  }, []);

  if (!models.length) {
    return (
      <div className="glass-card p-6 text-center text-muted-foreground text-sm">
        Loading tournament...
      </div>
    );
  }

  return (
    <motion.div className="glass-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border/50">
        <h3 className="text-sm font-semibold">Model Tournament</h3>
      </div>

      <div className="p-5 space-y-3">
        {models.map((m, i) => {
          const winner = i === 0;

          return (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                winner
                  ? "bg-accent/10 border border-accent/20"
                  : "bg-secondary/30"
              }`}
            >
              {winner ? (
                <Trophy className="w-4 h-4 text-accent" />
              ) : (
                <span className="text-xs text-muted-foreground">
                  #{i + 1}
                </span>
              )}

              <div className="flex-1">
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  Params: {m.params} · Trainable: {m.trainable}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-mono font-bold text-accent">
                  {(m.val_accuracy * 100).toFixed(2)}%
                </p>
              </div>

             <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
  <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${m.val_accuracy * 100}%` }}
    transition={{
      duration: 0.9,
      delay: 0.2 + i * 0.1,
      ease: "easeOut",
    }}
    className={`h-full rounded-full ${
      i === 0 ? "bg-accent" : "bg-muted-foreground/40"
    }`}
  />
</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
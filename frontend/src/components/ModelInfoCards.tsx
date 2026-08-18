import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Target, Layers, Database } from "lucide-react";

type ModelInfo = {
  name: string;
  accuracy: number;
  parameters: string;
  dataset: string;
  dataset_size: number;
};

function CountUp({
  end,
  decimals = 0,
  suffix = "",
}: {
  end: number;
  decimals?: number;
  suffix?: string;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let current = 0;

    const step = end / 50;

    const id = setInterval(() => {
      current += step;

      if (current >= end) {
        current = end;
        clearInterval(id);
      }

      setN(current);
    }, 25);

    return () => clearInterval(id);
  }, [end]);

  return (
    <>
      {n.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}

export function ModelInfoCards() {
  const [data, setData] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/model-info")
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setData({
          name: "EfficientNetB3",
          accuracy: 0.775,
          parameters: "12.3M",
          dataset: "HAM10000",
          dataset_size: 10015,
        });

        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="glass-card p-4 animate-pulse h-[90px]"
          />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: "Architecture",
      value: data.name,
      sub: "Transfer Learning + Fine-tuning",
      icon: Brain,
      accent: "primary",
    },
    {
      label: "Precision",
      value: (
        <CountUp
          end={data.accuracy * 100}
          decimals={2}
          suffix="%"
        />
      ),
      sub: "Tournament Champion Accuracy",
      icon: Target,
      accent: "accent",
    },
    {
      label: "Features",
      value: "CNN-Latent",
      sub: `Automated Extraction · ${data.parameters}`,
      icon: Layers,
      accent: "primary",
    },
    {
      label: "Dataset",
      value: data.dataset,
      sub: (
        <>
          <CountUp end={data.dataset_size} /> Images
        </>
      ),
      icon: Database,
      accent: "accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.45,
            delay: i * 0.08,
          }}
          whileHover={{
            y: -5,
            scale: 1.02,
          }}
          className="glass-card-hover p-4 stat-glow"
        >
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              animate={{
                rotate: [0, 4, -4, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className={`w-7 h-7 rounded-md flex items-center justify-center ${
                s.accent === "primary"
                  ? "bg-primary/12"
                  : "bg-accent/12"
              }`}
            >
              <s.icon
                className={`w-3.5 h-3.5 ${
                  s.accent === "primary"
                    ? "text-primary"
                    : "text-accent"
                }`}
              />
            </motion.div>

            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              {s.label}
            </span>
          </div>

          <p className="text-xl font-bold text-foreground leading-none mb-1">
            {s.value}
          </p>

          <p className="text-[11px] text-muted-foreground leading-snug">
            {s.sub}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
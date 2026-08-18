import { ShieldAlert } from "lucide-react";
import type { PredictionResult } from "@/lib/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function ClinicalRiskCard({
  result,
}: {
  result: PredictionResult;
}) {
  const a = result.abcde;

  const score = clamp(
    Math.round(
      (
        a.asymmetry * 0.22 +
        a.border * 0.28 +
        a.color * 0.18 +
        Math.min(a.diameter, 10) * 0.12 +
        a.risk_score * 0.2
      ) * 10
    ),
    0,
    100
  );

  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let n = 0;

    const id = setInterval(() => {
      n += 2;

      if (n >= score) {
        n = score;
        clearInterval(id);
      }

      setAnimatedScore(n);
    }, 20);

    return () => clearInterval(id);
  }, [score]);

  const level =
    score >= 70
      ? {
          label: "HIGH RISK",
          color: "text-red-400",
          glow: "shadow-red-500/20",
          ring: "stroke-red-400",
        }
      : score >= 35
      ? {
          label: "MODERATE RISK",
          color: "text-yellow-400",
          glow: "shadow-yellow-500/20",
          ring: "stroke-yellow-400",
        }
      : {
          label: "LOW RISK",
          color: "text-green-400",
          glow: "shadow-green-500/20",
          ring: "stroke-green-400",
        };

  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference -
    (animatedScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`glass-card p-6 ${level.glow} shadow-xl`}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <ShieldAlert
            className={`w-5 h-5 ${level.color}`}
          />
        </motion.div>

        <h3 className="text-2xl font-bold">
          Clinical Risk Index
        </h3>
      </div>

      <div className="flex items-center justify-between gap-10">
        <div className="relative w-[190px] h-[190px] shrink-0">
          <svg
            width="190"
            height="190"
            className="-rotate-90"
          >
            <circle
              cx="95"
              cy="95"
              r={radius}
              strokeWidth="14"
              className="stroke-zinc-800"
              fill="none"
            />

            <motion.circle
              cx="95"
              cy="95"
              r={radius}
              strokeWidth="14"
              strokeLinecap="round"
              className={level.ring}
              fill="none"
              strokeDasharray={circumference}
              animate={{
                strokeDashoffset: offset,
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className={`text-5xl font-bold font-mono ${level.color}`}
              animate={{
                scale: [0.9, 1.05, 1],
              }}
              transition={{
                duration: 0.5,
              }}
            >
              {animatedScore}
            </motion.div>

            <div className="text-xs text-muted-foreground mt-1">
              /100
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.25,
            duration: 0.5,
          }}
          className="flex-1"
        >
          <div
            className={`text-2xl font-bold mb-3 ${level.color}`}
          >
            {level.label}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground leading-7">
            <p>• Asymmetry contributes to structural concern</p>
            <p>• Border irregularity heavily influences score</p>
            <p>• Color variation affects lesion complexity</p>
            <p>• Diameter increases clinical weight</p>
            <p>• Combined morphology determines final risk</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
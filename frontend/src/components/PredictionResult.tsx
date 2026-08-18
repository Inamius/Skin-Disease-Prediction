import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { PredictionResult as PredResult } from "@/lib/api";

const RISK_MAP: Record<
  string,
  {
    level: "high" | "medium" | "low";
    color: string;
    glow: string;
    bgClass: string;
  }
> = {
  Melanoma: {
    level: "high",
    color: "text-red-400",
    glow: "shadow-red-500/25",
    bgClass: "bg-red-500/10",
  },
  "Basal cell carcinoma": {
    level: "high",
    color: "text-red-400",
    glow: "shadow-red-500/25",
    bgClass: "bg-red-500/10",
  },
  "Actinic keratoses": {
    level: "medium",
    color: "text-yellow-400",
    glow: "shadow-yellow-500/25",
    bgClass: "bg-yellow-500/10",
  },
  "Vascular lesions": {
    level: "medium",
    color: "text-yellow-400",
    glow: "shadow-yellow-500/25",
    bgClass: "bg-yellow-500/10",
  },
  Dermatofibroma: {
    level: "low",
    color: "text-green-400",
    glow: "shadow-green-500/25",
    bgClass: "bg-green-500/10",
  },
  "Benign keratosis": {
    level: "low",
    color: "text-green-400",
    glow: "shadow-green-500/25",
    bgClass: "bg-green-500/10",
  },
  "Melanocytic nevi": {
    level: "low",
    color: "text-green-400",
    glow: "shadow-green-500/25",
    bgClass: "bg-green-500/10",
  },
  "No Suspicious Lesion Detected": {
    level: "low",
    color: "text-green-400",
    glow: "shadow-green-500/25",
    bgClass: "bg-green-500/10",
  },
};

const DISEASE_INFO: Record<string, string> = {
  Melanoma:
    "A serious skin cancer originating in melanocytes. Early intervention is critical.",
  "Basal cell carcinoma":
    "Most common skin cancer. Rarely spreads, but may damage surrounding tissue.",
  "Actinic keratoses":
    "Sun-induced rough lesions considered pre-cancerous.",
  "Vascular lesions":
    "Blood vessel abnormalities, often benign in nature.",
  Dermatofibroma:
    "Common benign skin nodule, generally harmless.",
  "Benign keratosis":
    "Non-cancerous skin growth, usually harmless.",
  "Melanocytic nevi":
    "Typical moles. Usually benign but should be observed.",
  "No Suspicious Lesion Detected":
    "No suspicious lesion pattern detected by current analysis.",
};

function Counter({ value }: { value: string }) {
  const target = parseFloat(value);
  const [n, setN] = useState(0);

  useEffect(() => {
    let cur = 0;
    const step = target / 45;

    const id = setInterval(() => {
      cur += step;

      if (cur >= target) {
        cur = target;
        clearInterval(id);
      }

      setN(cur);
    }, 18);

    return () => clearInterval(id);
  }, [target]);

  return <>{n.toFixed(2)}%</>;
}

export function PredictionResultCard({
  result,
}: {
  result: PredResult;
}) {
  const risk =
    RISK_MAP[result.prediction] || {
      level: "medium",
      color: "text-yellow-400",
      glow: "shadow-yellow-500/25",
      bgClass: "bg-yellow-500/10",
    };

  const Icon =
    risk.level === "high"
      ? AlertTriangle
      : risk.level === "low"
      ? CheckCircle
      : Shield;

  const info =
    DISEASE_INFO[result.prediction] || "";

  const confidence = result.confidence.replace(
    "%",
    ""
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      whileHover={{
        y: -3,
      }}
      className={`glass-card-hover overflow-hidden relative ${risk.glow}`}
    >
      <motion.div
        animate={{
          x: ["-120%", "140%"],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "linear",
        }}
        className="absolute inset-y-0 w-40 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
      />

      <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-sm font-semibold">
          Inference Engine Output
        </h3>

        <Sparkles className="w-4 h-4 text-primary" />
      </div>

      <div className="p-6 space-y-5">
        <div className="flex gap-5 items-center">
          <motion.div
            animate={{
              scale:
                risk.level === "high"
                  ? [1, 1.08, 1]
                  : [1, 1.03, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${risk.bgClass}`}
          >
            <Icon
              className={`w-8 h-8 ${risk.color}`}
            />
          </motion.div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold leading-tight">
              {result.prediction}
            </h2>

            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${risk.color}`}
              >
                {risk.level} risk
              </span>

              <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                {result.image_type ===
                "non-dermoscopic"
                  ? "Enhanced Scan"
                  : "Dermoscopic"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">
              Confidence
            </p>

            <p className="text-3xl font-bold text-primary font-mono">
              <Counter value={confidence} />
            </p>
          </div>
        </div>

        {result.note && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-muted-foreground leading-7">
            {result.note}
          </div>
        )}

        {result.advice && (
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 text-sm text-primary leading-7">
            💡 {result.advice}
          </div>
        )}

        {info && (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-muted-foreground leading-7">
            {info}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground/70 leading-6">
          ⚕️ AI-assisted screening only. Not
          a medical diagnosis.
        </p>
      </div>
    </motion.div>
  );
}
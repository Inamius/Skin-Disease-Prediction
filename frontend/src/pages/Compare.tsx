import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  GitCompareArrows,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  Activity,
  Brain,
  CalendarDays,
} from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { getScanHistory } from "@/lib/api";

function safeNum(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function Metric({
  label,
  left,
  right,
}: {
  label: string;
  left: number;
  right: number;
}) {
  const delta = right - left;

  const improved = delta < 0;

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="flex justify-between mb-3">
        <span className="text-sm text-muted-foreground">
          {label}
        </span>

        <span className="font-mono text-sm font-bold">
          {left.toFixed(2)} → {right.toFixed(2)}
        </span>
      </div>

      <div className="h-3 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${Math.min(right * 10, 100)}%`,
          }}
          transition={{ duration: 0.7 }}
          className={`h-full ${
            improved
              ? "bg-green-400"
              : delta > 0
              ? "bg-red-400"
              : "bg-yellow-400"
          }`}
        />
      </div>
    </div>
  );
}

function getRisk(score: number) {
  if (score < 3) {
    return {
      label: "LOW RISK",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
    };
  }

  if (score < 6) {
    return {
      label: "MEDIUM RISK",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
    };
  }

  return {
    label: "HIGH RISK",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  };
}

export default function ComparePage() {
  const scans = useMemo(() => getScanHistory(), []);

  const [leftId, setLeftId] = useState(
    scans[0]?.id ?? ""
  );

  const [rightId, setRightId] = useState(
    scans[1]?.id ?? scans[0]?.id ?? ""
  );

  const left =
    scans.find((s) => s.id === leftId) ||
    null;

  const right =
    scans.find((s) => s.id === rightId) ||
    null;

  if (scans.length < 2) {
    return (
      <div className="min-h-screen bg-background flex">
        <AppSidebar />

        <div className="flex-1 ml-16 lg:ml-60 p-8">
          <div className="glass-card-hover p-16 rounded-3xl text-center">
            <h1 className="text-3xl font-bold mb-3">
              Need at least 2 scans
            </h1>

            <p className="text-muted-foreground">
              Run more scans first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!left || !right) return null;

 type ABCDE = {
  asymmetry?: number;
  border?: number;
  color?: number;
  diameter?: number;
  risk_score?: number;
};

const leftABC: ABCDE = left.result?.abcde ?? {};
const rightABC: ABCDE = right.result?.abcde ?? {};

  const leftAsym = safeNum(leftABC.asymmetry);
  const rightAsym = safeNum(rightABC.asymmetry);

  const leftBorder = safeNum(leftABC.border);
  const rightBorder = safeNum(rightABC.border);

  const leftColor = safeNum(leftABC.color);
  const rightColor = safeNum(rightABC.color);

  const leftDiameter = safeNum(leftABC.diameter);
  const rightDiameter = safeNum(rightABC.diameter);

  const leftRisk = safeNum(leftABC.risk_score);
  const rightRisk = safeNum(rightABC.risk_score);

  const leftConfidence = safeNum(
    parseFloat(left.result?.confidence || "0")
  );

  const rightConfidence = safeNum(
    parseFloat(right.result?.confidence || "0")
  );

  const diff = rightConfidence - leftConfidence;

  const verdict =
    diff > 2
      ? {
          text: "Worsened",
          color: "text-red-400",
          icon: TrendingUp,
        }
      : diff < -2
      ? {
          text: "Improved",
          color: "text-green-400",
          icon: TrendingDown,
        }
      : {
          text: "Stable",
          color: "text-yellow-400",
          icon: Minus,
        };

  const Icon = verdict.icon;

  // =========================
  // SIMILARITY SCORE
  // =========================
  const similarityRaw =
    100 -
    (
      Math.abs(leftAsym - rightAsym) +
      Math.abs(leftBorder - rightBorder) +
      Math.abs(leftColor - rightColor) +
      Math.abs(leftDiameter - rightDiameter)
    ) *
      5;

  const similarity = Math.max(
    0,
    Math.min(100, similarityRaw)
  );

  // =========================
  // AI OBSERVATION
  // =========================
  let observation =
    "Lesion characteristics remain relatively stable.";

  if (
    rightAsym > leftAsym ||
    rightBorder > leftBorder
  ) {
    observation =
      "The second scan exhibits increased structural irregularity and asymmetry.";
  }

  if (
    rightAsym < leftAsym &&
    rightBorder < leftBorder
  ) {
    observation =
      "The second scan shows reduced asymmetry and border irregularity.";
  }

  if (rightColor > leftColor + 1.2) {
    observation +=
      " Increased color variation is also detected.";
  }

  // =========================
  // RECOMMENDATION
  // =========================
  let recommendation =
    "Routine monitoring suggested.";

  if (rightRisk > 6) {
    recommendation =
      "Clinical dermatology review advised due to elevated risk indicators.";
  } else if (rightRisk > leftRisk) {
    recommendation =
      "Monitor lesion progression closely over time.";
  }

  const risk = getRisk(rightRisk);

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />

      <div className="flex-1 ml-16 lg:ml-60 p-8 max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="glass-card-hover p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-2">
            <GitCompareArrows className="w-6 h-6 text-primary" />

            <h1 className="text-3xl font-bold">
              Compare Scans
            </h1>
          </div>

          <p className="text-muted-foreground">
            Longitudinal lesion progression analysis
          </p>
        </div>

        {/* SELECTORS */}
        <div className="grid lg:grid-cols-2 gap-5">
          <select
            value={leftId}
            onChange={(e) =>
              setLeftId(e.target.value)
            }
            className="h-14 rounded-2xl bg-white/5 border border-white/10 px-4"
          >
            {scans.map((s) => (
              <option key={s.id} value={s.id}>
                {s.result.prediction} •{" "}
                {new Date(
                  s.timestamp
                ).toLocaleDateString()}
              </option>
            ))}
          </select>

          <select
            value={rightId}
            onChange={(e) =>
              setRightId(e.target.value)
            }
            className="h-14 rounded-2xl bg-white/5 border border-white/10 px-4"
          >
            {scans.map((s) => (
              <option key={s.id} value={s.id}>
                {s.result.prediction} •{" "}
                {new Date(
                  s.timestamp
                ).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* TIMELINE */}
        <div className="glass-card-hover rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">
              Scan Timeline
            </h2>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-muted-foreground">
                Previous Scan
              </p>

              <p className="font-semibold mt-1">
                {left.result.prediction}
              </p>

              <p className="text-sm text-primary mt-1">
                {left.result.confidence}
              </p>
            </div>

            <div className="w-20 h-1 bg-primary/40 rounded-full" />

            <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-muted-foreground">
                Latest Scan
              </p>

              <p className="font-semibold mt-1">
                {right.result.prediction}
              </p>

              <p className="text-sm text-primary mt-1">
                {right.result.confidence}
              </p>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="grid lg:grid-cols-2 gap-6">
          {[left, right].map((scan) => (
            <motion.div
              key={scan.id}
              whileHover={{ y: -6 }}
              className="glass-card-hover rounded-3xl overflow-hidden"
            >
              <img
                src={scan.imageDataUrl}
                className="w-full h-[340px] object-cover"
              />

              <div className="p-5">
                <h2 className="text-2xl font-bold">
                  {scan.result.prediction}
                </h2>

                <p className="text-primary text-xl font-mono mt-1">
                  {scan.result.confidence}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ANALYSIS CARDS */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* SIMILARITY */}
          <div className="glass-card-hover rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">
                Similarity Score
              </h2>
            </div>

            <p className="text-5xl font-bold text-primary">
              {similarity.toFixed(0)}%
            </p>

            <p className="text-sm text-muted-foreground mt-3">
              Morphological similarity between scans
            </p>
          </div>

          {/* RISK */}
          <div className="glass-card-hover rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-bold">
                Risk Classification
              </h2>
            </div>

            <div
              className={`inline-flex px-4 py-2 rounded-2xl border ${risk.bg}`}
            >
              <span className={`font-bold ${risk.color}`}>
                {risk.label}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Based on ABCDE lesion analysis
            </p>
          </div>

          {/* OBSERVATION */}
          <div className="glass-card-hover rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">
                AI Observation
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {observation}
            </p>
          </div>
        </div>

        {/* CLINICAL DELTA */}
        <div className="glass-card-hover p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              Clinical Delta
            </h2>

            <div
              className={`flex items-center gap-2 ${verdict.color}`}
            >
              <Icon className="w-5 h-5" />

              <span className="font-semibold">
                {verdict.text}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Metric
              label="Asymmetry"
              left={leftAsym}
              right={rightAsym}
            />

            <Metric
              label="Border"
              left={leftBorder}
              right={rightBorder}
            />

            <Metric
              label="Color"
              left={leftColor}
              right={rightColor}
            />

            <Metric
              label="Diameter"
              left={leftDiameter}
              right={rightDiameter}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Confidence Delta
            </p>

            <p
              className={`text-6xl font-bold mt-3 ${
                diff > 0
                  ? "text-red-400"
                  : diff < 0
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {diff > 0 ? "+" : ""}
              {diff.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* RECOMMENDATION */}
        <div className="glass-card-hover rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4">
            Recommendation
          </h2>

          <p className="text-muted-foreground leading-relaxed">
            {recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
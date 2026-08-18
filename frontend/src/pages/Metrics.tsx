import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { Grid3X3, Target, TrendingUp } from "lucide-react";

const CLASSES_SHORT = ["AK", "BCC", "BKL", "DF", "MEL", "NV", "VASC"];
const CLASSES_FULL = [
  "Actinic keratoses",
  "Basal cell carcinoma",
  "Benign keratosis",
  "Dermatofibroma",
  "Melanoma",
  "Melanocytic nevi",
  "Vascular lesions",
];

const PER_CLASS = [
  { name: "AK", fullName: "Actinic keratoses", precision: 62, recall: 55, f1: 58, support: 327 },
  { name: "BCC", fullName: "Basal cell carcinoma", precision: 71, recall: 65, f1: 68, support: 514 },
  { name: "BKL", fullName: "Benign keratosis", precision: 73, recall: 70, f1: 71, support: 1099 },
  { name: "DF", fullName: "Dermatofibroma", precision: 68, recall: 52, f1: 59, support: 115 },
  { name: "MEL", fullName: "Melanoma", precision: 65, recall: 60, f1: 62, support: 1113 },
  { name: "NV", fullName: "Melanocytic nevi", precision: 89, recall: 93, f1: 91, support: 6705 },
  { name: "VASC", fullName: "Vascular lesions", precision: 82, recall: 78, f1: 80, support: 142 },
];

const CONFUSION_MATRIX = [
  [180, 25, 40, 5, 52, 20, 5],
  [15, 334, 30, 8, 67, 50, 10],
  [20, 30, 769, 10, 120, 130, 20],
  [5, 8, 15, 60, 12, 10, 5],
  [30, 45, 80, 8, 668, 260, 22],
  [12, 20, 50, 5, 88, 6476, 54],
  [3, 5, 8, 2, 13, 0, 111],
];

const OVERALL = {
  accuracy: 78.11,
  macroPrecision: 72.86,
  macroRecall: 67.57,
  macroF1: 69.86,
  weightedF1: 82.30,
};

const COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(82, 85%, 55%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 60%)",
  "hsl(0, 72%, 51%)",
  "hsl(170, 70%, 50%)",
  "hsl(320, 70%, 55%)",
];

function getHeatColor(value: number, maxVal: number): string {
  const ratio = maxVal > 0 ? value / maxVal : 0;
  if (ratio > 0.7) return "bg-primary/80";
  if (ratio > 0.4) return "bg-primary/40";
  if (ratio > 0.15) return "bg-primary/20";
  if (value > 0) return "bg-primary/8";
  return "bg-transparent";
}

export default function MetricsPage() {
  const maxVal = Math.max(...CONFUSION_MATRIX.flat());

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 ml-16 lg:ml-60">
        <header className="sticky top-0 z-10 h-14 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center px-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Model Metrics</h2>
            <p className="text-[11px] text-muted-foreground">Per-Class Performance & Confusion Matrix</p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-6xl">
          {/* Overall stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Accuracy", value: `${OVERALL.accuracy}%`, color: "text-primary" },
              { label: "Macro Precision", value: `${OVERALL.macroPrecision}%`, color: "text-accent" },
              { label: "Macro Recall", value: `${OVERALL.macroRecall}%`, color: "text-warning" },
              { label: "Macro F1", value: `${OVERALL.macroF1}%`, color: "text-chart-4" },
              { label: "Weighted F1", value: `${OVERALL.weightedF1}%`, color: "text-success" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 text-center"
              >
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                <p className={`text-xl font-bold font-mono mt-1 ${s.color}`}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Precision/Recall/F1 bar chart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Per-Class Precision & Recall</h3>
              </div>
              <div className="p-5 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PER_CLASS}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "hsl(210, 40%, 85%)", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                      axisLine={false}
                      tickLine={false}
                      unit="%"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(240, 6%, 8%)",
                        border: "1px solid hsl(240, 4%, 16%)",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontFamily: "JetBrains Mono",
                        color: "hsl(210, 40%, 96%)",
                      }}
                    />
                    <Bar dataKey="precision" fill="hsl(199, 89%, 48%)" radius={[3, 3, 0, 0]} barSize={14} name="Precision %" />
                    <Bar dataKey="recall" fill="hsl(82, 85%, 55%)" radius={[3, 3, 0, 0]} barSize={14} name="Recall %" />
                    <Bar dataKey="f1" fill="hsl(38, 92%, 50%)" radius={[3, 3, 0, 0]} barSize={14} name="F1 %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Radar chart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold">F1 Score Radar</h3>
              </div>
              <div className="p-5 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={PER_CLASS}>
                    <PolarGrid stroke="hsl(240, 4%, 16%)" />
                    <PolarAngleAxis
                      dataKey="name"
                      tick={{ fill: "hsl(210, 40%, 85%)", fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 8 }}
                    />
                    <Radar
                      name="F1 Score"
                      dataKey="f1"
                      stroke="hsl(199, 89%, 48%)"
                      fill="hsl(199, 89%, 48%)"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name="Recall"
                      dataKey="recall"
                      stroke="hsl(82, 85%, 55%)"
                      fill="hsl(82, 85%, 55%)"
                      fillOpacity={0.1}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Confusion Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-border/50 flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Confusion Matrix</h3>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr>
                    <th className="text-[10px] text-muted-foreground p-2 font-medium">Actual ↓ / Pred →</th>
                    {CLASSES_SHORT.map((c) => (
                      <th key={c} className="text-[10px] text-muted-foreground p-2 font-mono font-medium">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CONFUSION_MATRIX.map((row, i) => (
                    <tr key={i}>
                      <td className="text-[10px] text-muted-foreground p-2 font-mono font-medium text-left">
                        {CLASSES_SHORT[i]}
                      </td>
                      {row.map((val, j) => (
                        <td key={j} className="p-1">
                          <div
                            className={`rounded-md py-1.5 px-1 text-[10px] font-mono ${
                              i === j
                                ? "bg-accent/20 text-accent font-bold"
                                : `${getHeatColor(val, maxVal)} text-foreground/70`
                            }`}
                          >
                            {val}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
                {CLASSES_SHORT.map((c, i) => (
                  <span key={c} className="text-[10px] text-muted-foreground">
                    <span className="font-mono font-bold text-foreground">{c}</span> = {CLASSES_FULL[i]}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Per-class detail table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-border/50">
              <h3 className="text-sm font-semibold">Classification Report</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    {["Class", "Precision", "Recall", "F1-Score", "Support"].map((h) => (
                      <th key={h} className="text-[10px] text-muted-foreground uppercase tracking-wider px-5 py-3 text-left font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PER_CLASS.map((c, i) => (
                    <tr key={c.name} className="border-b border-border/15 hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-2.5 text-xs font-medium text-foreground">{c.fullName}</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-primary">{c.precision}%</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-accent">{c.recall}%</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-warning">{c.f1}%</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-muted-foreground">{c.support.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

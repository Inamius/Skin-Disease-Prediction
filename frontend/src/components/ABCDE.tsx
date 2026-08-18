import { Activity } from "lucide-react";
import type { PredictionResult } from "@/lib/api";

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-sm uppercase tracking-wide text-muted-foreground/80 font-medium">
        {label}
      </span>

      <span className="text-xl font-bold font-mono text-foreground tracking-tight">
        {value}
      </span>
    </div>
  );
}

export function ABCDECard({
  result,
}: {
  result: PredictionResult;
}) {
  const a = result.abcde;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <Activity className="w-5 h-5 text-primary" />

        <h3 className="text-2xl font-bold tracking-tight text-foreground">
          Clinical Breakdown
        </h3>
      </div>

      <div className="space-y-2">
        <Row label="Asymmetry" value={`${a.asymmetry}/10`} />
        <Row label="Border" value={`${a.border}/10`} />
        <Row label="Color Variation" value={`${a.color}/10`} />
        <Row label="Diameter" value={`${a.diameter} mm`} />
        <Row label="Evolution" value={a.evolution.toUpperCase()} />
      </div>
    </div>
  );
}
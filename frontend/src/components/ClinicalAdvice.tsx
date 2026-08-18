import { motion } from "framer-motion";
import { ShieldAlert, Stethoscope, Info } from "lucide-react";
import type { PredictionResult } from "@/lib/api";

const ADVICE_MAP: Record<string, { action: string; urgency: string }> = {
  "Melanoma": {
    action: "Consult a dermatologist immediately. Early biopsy is strongly recommended.",
    urgency: "High urgency",
  },
  "Basal cell carcinoma": {
    action: "Seek medical evaluation. Treatment is usually effective if caught early.",
    urgency: "High urgency",
  },
  "Actinic keratoses": {
    action: "Monitor closely and consult a doctor. May require treatment to prevent progression.",
    urgency: "Moderate urgency",
  },
  "Vascular lesions": {
    action: "Usually benign. Monitor for changes in size or color.",
    urgency: "Low urgency",
  },
  "Dermatofibroma": {
    action: "Benign condition. No treatment required unless symptomatic.",
    urgency: "Low urgency",
  },
  "Benign keratosis": {
    action: "Generally harmless. No treatment needed unless irritation occurs.",
    urgency: "Low urgency",
  },
  "Melanocytic nevi": {
    action: "Monitor regularly. Watch for ABCDE changes (asymmetry, border, color).",
    urgency: "Low urgency",
  },
};

export function ClinicalAdvice({ result }: { result: PredictionResult }) {
  if (!result) return null;

  const advice = ADVICE_MAP[result.prediction];

  if (!advice) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-5 space-y-4 border border-border/50"
    >
      <div className="flex items-center gap-2">
        <Stethoscope className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold">AI Clinical Guidance</h3>
      </div>

      {/* Urgency */}
      <div className="flex items-center gap-2 text-xs">
        <ShieldAlert className="w-4 h-4 text-warning" />
        <span className="font-medium text-warning">{advice.urgency}</span>
      </div>

      {/* Action */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {advice.action}
      </p>

      {/* Extra safety note */}
      <div className="flex items-start gap-2 text-[11px] text-muted-foreground/70">
        <Info className="w-4 h-4 mt-0.5" />
        <span>
          This is AI-generated guidance and not a medical diagnosis. Always consult a professional.
        </span>
      </div>
    </motion.div>
  );
}
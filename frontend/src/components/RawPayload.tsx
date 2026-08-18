import { motion } from "framer-motion";
import { Code, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { PredictionResult } from "@/lib/api";

export function RawPayload({ result }: { result: PredictionResult }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(result, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card overflow-hidden"
    >
      <div className="px-5 py-3.5 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Raw API Response</h3>
        </div>
        <button
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary/60"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <pre className="p-5 text-[11px] font-mono text-muted-foreground overflow-x-auto max-h-52 leading-relaxed">
        {json}
      </pre>
    </motion.div>
  );
}

import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  History,
  Trash2,
  Clock3,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";
import {
  getScanHistory,
  clearScanHistory,
  type ScanHistoryEntry,
} from "@/lib/api";
import {
  useState,
  useEffect,
  useMemo,
} from "react";

const RISK_MAP: Record<
  string,
  {
    level: string;
    color: string;
    bg: string;
  }
> = {
  Melanoma: {
    level: "HIGH",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  "Basal cell carcinoma": {
    level: "HIGH",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  "Actinic keratoses": {
    level: "MED",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  "Vascular lesions": {
    level: "MED",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  Dermatofibroma: {
    level: "LOW",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  "Benign keratosis": {
    level: "LOW",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  "Melanocytic nevi": {
    level: "LOW",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  "No Suspicious Lesion Detected": {
    level: "CLEAR",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
};

interface ScanHistoryPanelProps {
  onSelectScan?: (
    entry: ScanHistoryEntry
  ) => void;
  refreshTrigger?: number;
}

export function ScanHistoryPanel({
  onSelectScan,
  refreshTrigger,
}: ScanHistoryPanelProps) {
  const [history, setHistory] = useState<
    ScanHistoryEntry[]
  >([]);

  const [query, setQuery] =
    useState("");

  useEffect(() => {
    setHistory(getScanHistory());
  }, [refreshTrigger]);

  const filtered = useMemo(() => {
    return history.filter((x) =>
      x.result.prediction
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [history, query]);

  const handleClear = () => {
    clearScanHistory();
    setHistory([]);
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="glass-card-hover overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <History className="w-5 h-5 text-primary" />
          </motion.div>

          <div>
            <h3 className="font-semibold">
              Scan Timeline
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Previous diagnostic sessions
            </p>
          </div>

          {history.length > 0 && (
            <span className="px-2 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10">
              {history.length}
            </span>
          )}
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <input
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search scans..."
              className="w-full h-11 rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 outline-none"
            />
          </div>
        </div>
      )}

      <div className="max-h-[500px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Clock3 className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />

            <p className="text-sm text-muted-foreground">
              No scans found
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <AnimatePresence>
              {filtered.map((entry, i) => {
                const risk =
                  RISK_MAP[
                    entry.result.prediction
                  ] || {
                    level: "MED",
                    color:
                      "text-yellow-400",
                    bg:
                      "bg-yellow-500/10",
                  };

                return (
                  <motion.button
                    key={entry.id}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: i * 0.04,
                    }}
                    whileHover={{
                      y: -3,
                      scale: 1.01,
                    }}
                    onClick={() =>
                      onSelectScan?.(
                        entry
                      )
                    }
                    className="w-full rounded-3xl bg-white/5 border border-white/10 p-4 text-left transition overflow-hidden relative"
                  >
                    <motion.div
                      animate={{
                        x: [
                          "-120%",
                          "130%",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat:
                          Infinity,
                        repeatDelay: 3,
                        ease: "linear",
                      }}
                      className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                    />

                    <div className="flex gap-4 relative z-10">
                      <img
                        src={
                          entry.imageDataUrl
                        }
                        alt=""
                        className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${risk.bg} ${risk.color}`}
                          >
                            {
                              risk.level
                            }
                          </span>

                          <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {
                              entry.result
                                .confidence
                            }
                          </span>
                        </div>

                        <h4 className="font-semibold text-lg truncate">
                          {
                            entry.result
                              .prediction
                          }
                        </h4>

                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock3 className="w-3.5 h-3.5" />
                          {new Date(
                            entry.timestamp
                          ).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
                      </div>
                    </div>

                    <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
                        style={{
                          width:
                            entry.result.confidence,
                        }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="px-5 py-3 border-t border-white/10 text-xs text-muted-foreground flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Diagnostic history saved locally
        </div>
      )}
    </motion.div>
  );
}
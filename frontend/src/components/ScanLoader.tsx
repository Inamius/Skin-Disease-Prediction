import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Brain,
  ScanLine,
  Activity,
} from "lucide-react";

const steps = [
  {
    label: "Uploading image",
    icon: Activity,
  },
  {
    label: "Enhancing dermoscopy",
    icon: Sparkles,
  },
  {
    label: "Running neural inference",
    icon: Brain,
  },
  {
    label: "Generating GradCAM",
    icon: ScanLine,
  },
  {
    label: "Segmenting lesion",
    icon: Activity,
  },
  {
    label: "Computing ABCDE metrics",
    icon: Brain,
  },
  {
    label: "Final diagnosis ready",
    icon: CheckCircle2,
  },
];

export function ScanLoader() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((v) =>
        Math.min(v + 1, steps.length - 1)
      );
    }, 700);

    return () => clearInterval(id);
  }, []);

  const progress =
    ((active + 1) / steps.length) * 100;

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
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">
            Neural Scan Pipeline
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time diagnostic workflow
          </p>
        </div>

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center"
        >
          <Brain className="w-5 h-5 text-primary" />
        </motion.div>
      </div>

      <div className="p-6">
        <div className="mb-7">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">
              Progress
            </span>

            <span className="font-mono text-primary font-bold">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.5,
              }}
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-400 to-green-400 rounded-full relative"
            >
              <motion.div
                animate={{
                  x: [-40, 260],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-y-0 w-20 bg-white/30 blur-md"
              />
            </motion.div>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => {
            const done = i < active;
            const current = i === active;
            const Icon = step.icon;

            return (
              <motion.div
                key={step.label}
                initial={{
                  opacity: 0,
                  x: 15,
                }}
                animate={{
                  opacity:
                    done || current
                      ? 1
                      : 0.35,
                  x: 0,
                }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : current ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 text-muted-foreground/50" />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      current
                        ? "text-primary"
                        : done
                        ? "text-white"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>

                  {current && (
                    <motion.div
                      animate={{
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                      }}
                      className="text-[11px] text-primary mt-1"
                    >
                      Processing...
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
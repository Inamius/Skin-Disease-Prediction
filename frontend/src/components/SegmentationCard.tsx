import { motion } from "framer-motion";
import {
  ScanSearch,
  Sparkles,
  Shapes,
  ShieldCheck,
} from "lucide-react";
import type { SegmentResult } from "@/lib/api";

function Meter({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const radius = 44;
  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (value / 100) * circumference;

  return (
    <div className="relative w-[110px] h-[110px]">
      <svg
        width="110"
        height="110"
        className="-rotate-90"
      >
        <circle
          cx="55"
          cy="55"
          r={radius}
          strokeWidth="10"
          className="stroke-zinc-800"
          fill="none"
        />

        <motion.circle
          cx="55"
          cy="55"
          r={radius}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          className={color}
          strokeDasharray={circumference}
          initial={{
            strokeDashoffset:
              circumference,
          }}
          animate={{
            strokeDashoffset: offset,
          }}
          transition={{
            duration: 1.2,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl font-bold font-mono">
          {value}%
        </div>
        <div className="text-[10px] text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}

function Chip({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10">
      {children}
    </span>
  );
}

export function SegmentationCard({
  segment,
}: {
  segment: SegmentResult;
}) {
  const borderColor =
    segment.border_score >= 5
      ? "stroke-red-400"
      : segment.border_score >= 2.5
      ? "stroke-yellow-400"
      : "stroke-green-400";

  const borderText =
    segment.border_score >= 5
      ? "text-red-400"
      : segment.border_score >= 2.5
      ? "text-yellow-400"
      : "text-green-400";

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
      whileHover={{
        y: -3,
      }}
      className="glass-card-hover overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"
        >
          <ScanSearch className="w-5 h-5 text-green-400" />
        </motion.div>

        <div>
          <h3 className="font-semibold">
            Lesion Segmentation
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Morphological boundary analysis
          </p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/20">
          <motion.img
            whileHover={{
              scale: 1.03,
            }}
            src={`data:image/png;base64,${segment.overlay_base64}`}
            alt="Segmentation"
            className="w-full h-64 object-contain"
          />

          <motion.div
            animate={{
              y: [-100, 280],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-0 w-full h-24 bg-gradient-to-b from-transparent via-green-400/15 to-transparent blur-xl"
          />

          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-xs flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-green-400" />
            Lesion Boundary
          </div>
        </div>

        <div className="flex justify-center gap-8">
          <Meter
            value={segment.area_percent}
            label="Coverage"
            color="stroke-cyan-400"
          />

          <Meter
            value={Math.round(
              segment.border_score * 10
            )}
            label="Border"
            color={borderColor}
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Chip>
            <Shapes className="w-3 h-3 inline mr-1" />
            {segment.shape.toUpperCase()}
          </Chip>

          <Chip>
            <ShieldCheck className="w-3 h-3 inline mr-1" />
            {segment.confidence.toUpperCase()}
          </Chip>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Area Coverage
            </span>
            <span className="font-bold font-mono">
              {segment.area_percent}%
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Border Complexity
            </span>
            <span
              className={`font-bold font-mono ${borderText}`}
            >
              {segment.border_score}/10
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Shape
            </span>
            <span className="font-bold font-mono">
              {segment.shape.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
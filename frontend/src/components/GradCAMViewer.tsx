import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Scan,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import type { GradCAMResult } from "@/lib/api";

interface GradCAMViewerProps {
  gradcam: GradCAMResult | null;
  originalImage?: string;
  isLoading?: boolean;
}

export function GradCAMViewer({
  gradcam,
  isLoading,
}: GradCAMViewerProps) {
  const [showOverlay, setShowOverlay] =
    useState(true);

  const [opacity, setOpacity] =
    useState(85);

  if (isLoading) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="glass-card-hover overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
          <Scan className="w-4 h-4 text-primary animate-pulse" />
          <h3 className="text-sm font-semibold">
            AI Focus Mapping
          </h3>
        </div>

        <div className="p-10 flex flex-col items-center gap-4">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full"
          />

          <p className="text-sm text-muted-foreground">
            Generating neural attention map...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!gradcam?.overlay_base64) {
    return (
      <div className="glass-card-hover p-10 text-center">
        <Scan className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          Grad-CAM unavailable
        </p>
      </div>
    );
  }

  const heatmap =
    `data:image/png;base64,${gradcam.heatmap_base64}`;

  const overlay =
    `data:image/png;base64,${gradcam.overlay_base64}`;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
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
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold">
            AI Focus Mapping
          </h3>
        </div>

        <button
          onClick={() =>
            setShowOverlay(!showOverlay)
          }
          className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-xs hover:bg-white/10 transition"
        >
          {showOverlay ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
          {showOverlay
            ? "Overlay"
            : "Heatmap"}
        </button>
      </div>

      <div className="p-5 space-y-5">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/20">
          <motion.img
            whileHover={{
              scale: 1.03,
            }}
            src={
              showOverlay
                ? overlay
                : heatmap
            }
            alt="GradCAM"
            className="w-full h-64 object-contain"
            style={{
              opacity: opacity / 100,
            }}
          />

          <motion.div
            animate={{
              y: [-120, 320],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-0 w-full h-24 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent blur-xl pointer-events-none"
          />

          {gradcam.peak_attention &&
            gradcam.peak_attention.length ===
              2 && (
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="absolute w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/40"
                style={{
                  left:
                    gradcam.peak_attention[0],
                  top:
                    gradcam.peak_attention[1],
                }}
              />
            )}

          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-xs flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-primary" />
            AI Focus Region
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              Heatmap Intensity
            </span>
          </div>

          <input
            type="range"
            min={25}
            max={100}
            value={opacity}
            onChange={(e) =>
              setOpacity(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-muted-foreground leading-7">
          🧠{" "}
          {gradcam.explanation ||
            "Neural network attention concentrated in highlighted regions."}
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Attention Score
          </span>

          <span className="font-bold text-primary font-mono">
            {(
              gradcam.attention_score ??
              0
            ).toFixed(1)}
            %
          </span>
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>🔵 Low</span>
          <span>🟡 Medium</span>
          <span>🔴 High</span>
        </div>
      </div>
    </motion.div>
  );
}
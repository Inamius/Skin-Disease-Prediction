import { motion } from "framer-motion";
import { useState } from "react";

const PARTS = [
  "Head",
  "Chest",
  "Abdomen",
  "Left Arm",
  "Right Arm",
  "Left Leg",
  "Right Leg",
];

export function Body3DSelector() {
  const [selected, setSelected] = useState("Chest");

  return (
    <div className="glass-card p-6 rounded-3xl">
      <h3 className="text-2xl font-bold mb-2">
        Body Region Selector
      </h3>

      <p className="text-sm text-muted-foreground mb-5">
        Click body area
      </p>

      <div
        className="h-[520px] flex items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-black perspective-[1200px]"
      >
        <motion.div
          animate={{ rotateY: [0, 8, 0, -8, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="relative w-[220px] h-[420px] preserve-3d"
        >
          {[
            { name: "Head", cls: "w-24 h-24 top-0 left-1/2 -translate-x-1/2 rounded-full" },
            { name: "Chest", cls: "w-36 h-28 top-24 left-1/2 -translate-x-1/2 rounded-3xl" },
            { name: "Abdomen", cls: "w-28 h-24 top-52 left-1/2 -translate-x-1/2 rounded-3xl" },
            { name: "Left Arm", cls: "w-10 h-32 top-28 left-0 rounded-full" },
            { name: "Right Arm", cls: "w-10 h-32 top-28 right-0 rounded-full" },
            { name: "Left Leg", cls: "w-12 h-36 bottom-0 left-[60px] rounded-full" },
            { name: "Right Leg", cls: "w-12 h-36 bottom-0 right-[60px] rounded-full" },
          ].map((p) => {
            const active = selected === p.name;

            return (
              <motion.button
                key={p.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelected(p.name)}
                className={`absolute ${p.cls} transition-all border ${
                  active
                    ? "bg-cyan-400 shadow-[0_0_35px_rgba(56,189,248,.8)] border-cyan-200"
                    : "bg-zinc-700 hover:bg-zinc-500 border-zinc-500"
                }`}
              />
            );
          })}
        </motion.div>
      </div>

      <div className="mt-5 text-center">
        <span className="px-5 py-2 rounded-full bg-primary/15 text-primary font-semibold">
          Selected: {selected}
        </span>
      </div>
    </div>
  );
}
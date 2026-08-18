import { motion } from "framer-motion";

const blobs = [
  {
    size: 500,
    top: "-5%",
    left: "-5%",
    duration: 18,
    dark: "bg-cyan-500/18",
    light: "bg-cyan-300/30",
  },
  {
    size: 420,
    top: "55%",
    left: "70%",
    duration: 24,
    dark: "bg-blue-500/18",
    light: "bg-blue-300/30",
  },
  {
    size: 340,
    top: "10%",
    left: "78%",
    duration: 20,
    dark: "bg-violet-500/16",
    light: "bg-violet-300/25",
  },
  {
    size: 300,
    top: "72%",
    left: "20%",
    duration: 22,
    dark: "bg-sky-400/15",
    light: "bg-sky-200/25",
  },
];

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`
            absolute rounded-full blur-[120px]
            ${b.light}
            dark:${b.dark}
          `}
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -35, 25, 0],
            scale: [1, 1.08, 0.94, 1],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-white dark:bg-[#05070d]/70 transition-colors duration-500" />
    </div>
  );
}
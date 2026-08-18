import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import type { PredictionResult } from "@/lib/api";

const COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(82, 85%, 55%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 60%)",
  "hsl(0, 72%, 51%)",
  "hsl(170, 70%, 50%)",
  "hsl(320, 70%, 55%)",
];

export function ProbabilityChart({
  result,
}: {
  result: PredictionResult;
}) {
  const data = result.probability_data.map((d) => ({
    name:
      d.name.length > 18
        ? d.name.slice(0, 16) + "…"
        : d.name,
    fullName: d.name,
    score: d.score,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -3 }}
      className="glass-card-hover overflow-hidden"
    >
      <div className="px-5 py-3.5 border-b border-border/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Probability Distribution
        </h3>

        <span className="text-[10px] text-muted-foreground font-mono">
          {data.length} classes
        </span>
      </div>

      <div className="p-5">
        <div className="h-72">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                left: 0,
                right: 28,
                top: 8,
                bottom: 8,
              }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                unit="%"
                tick={{
                  fill: "hsl(215,16%,60%)",
                  fontSize: 10,
                  fontFamily: "JetBrains Mono",
                }}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={130}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "hsl(210,40%,88%)",
                  fontSize: 10,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(255,255,255,0.03)",
                }}
                contentStyle={{
                  background:
                    "rgba(15,23,42,0.9)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  backdropFilter: "blur(12px)",
                }}
                labelStyle={{
                  color: "#fff",
                  fontWeight: 600,
                }}
                itemStyle={{
                  color: "#dbeafe",
                }}
                formatter={(v: number) => [
                  `${v.toFixed(2)}%`,
                  "Confidence",
                ]}
              />

              <Bar
                dataKey="score"
                radius={[0, 8, 8, 0]}
                barSize={20}
                animationDuration={1400}
                animationEasing="ease-out"
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      COLORS[i % COLORS.length]
                    }
                    fillOpacity={
                      i === 0 ? 1 : 0.58
                    }
                  />
                ))}

                <LabelList
                  dataKey="score"
                  position="right"
                  formatter={(v: number) =>
                    `${v.toFixed(1)}%`
                  }
                  style={{
                    fill: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
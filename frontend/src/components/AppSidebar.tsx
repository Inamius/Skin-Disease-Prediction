import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Database,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Microscope,
  History,
  BarChart3,
  Bot,
  Sparkles,
  GitCompareArrows,
} from "lucide-react";

const NAV_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Diagnostic Workspace",
    path: "/",
  },
  {
    icon: Bot,
    label: "AI Assistant",
    path: "/assistant",
  },
  {
    icon: History,
    label: "Scan History",
    path: "/history",
  },
  {
    icon: GitCompareArrows,
    label: "Compare Scans",
    path: "/compare",
  },
  {
    icon: BarChart3,
    label: "Model Metrics",
    path: "/metrics",
  },
  {
    icon: Brain,
    label: "Model Architecture",
    path: "/architecture",
  },
  {
    icon: Database,
    label: "Dataset HAM10000",
    path: "/dataset",
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.aside
      animate={{
        width: collapsed ? 74 : 260,
      }}
      transition={{
        duration: 0.28,
      }}
      className="fixed left-0 top-0 h-screen z-30 flex flex-col border-r border-white/10 backdrop-blur-2xl bg-[rgba(8,12,24,0.72)] shadow-2xl"
    >
      <div
        onClick={() => navigate("/")}
        className="h-16 px-4 flex items-center gap-3 border-b border-white/10 cursor-pointer"
      >
        <motion.div
          whileHover={{
            rotate: 15,
            scale: 1.08,
          }}
          className="relative w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0"
        >
          <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-md" />
          <Microscope className="relative w-5 h-5 text-primary" />
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <h1 className="text-sm font-bold whitespace-nowrap">
                Derm<span className="text-primary">Scan</span>{" "}
                <span className="text-accent">Pro</span>
              </h1>

              <p className="text-[10px] text-muted-foreground">
                Neural Command Center
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 p-3 space-y-2">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;

          return (
            <motion.button
              key={item.label}
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-2xl overflow-hidden transition-all ${
                active
                  ? "text-white"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-cyan-400/10 border border-primary/25"
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                  }}
                />
              )}

              <motion.div
                animate={
                  active
                    ? { scale: [1, 1.12, 1] }
                    : {}
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="relative z-10"
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? "text-primary" : ""
                  }`}
                />
              </motion.div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 whitespace-nowrap text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {active && !collapsed && (
                <motion.div
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="ml-auto relative z-10"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
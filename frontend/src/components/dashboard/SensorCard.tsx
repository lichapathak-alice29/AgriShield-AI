import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState, type ElementType } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function SensorCard({
  icon: Icon, label, value, unit, status, trend, tint = "emerald", data,
}: {
  icon: ElementType; label: string; value: number; unit: string; status: string; trend: number;
  tint?: "emerald" | "sky" | "amber" | "critical"; data: { v: number }[];
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => (Number.isInteger(value) ? Math.round(v) : Math.round(v * 10) / 10));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const c = animate(mv, value, { duration: 1.2, ease: "easeOut" });
    const u = rounded.on("change", (v) => setDisplay(v as number));
    return () => { c.stop(); u(); };
  }, [value, mv, rounded]);

  const colors = {
    emerald: { stroke: "oklch(0.62 0.16 155)", bg: "oklch(0.62 0.16 155 / 0.15)" },
    sky: { stroke: "oklch(0.72 0.11 220)", bg: "oklch(0.72 0.11 220 / 0.15)" },
    amber: { stroke: "oklch(0.78 0.14 75)", bg: "oklch(0.78 0.14 75 / 0.15)" },
    critical: { stroke: "oklch(0.62 0.22 25)", bg: "oklch(0.62 0.22 25 / 0.15)" },
  }[tint];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-5 relative overflow-hidden group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl grid place-items-center border" style={{ background: colors.bg, borderColor: colors.stroke + "40" }}>
            <Icon className="h-4 w-4" style={{ color: colors.stroke }}/>
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        </div>
        <div className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${trend >= 0 ? "text-emerald bg-emerald/10" : "text-critical bg-critical/10"}`}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <div className="text-3xl font-bold tabular-nums tracking-tight">{display}</div>
        <div className="text-sm text-muted-foreground">{unit}</div>
      </div>
      <div className="text-xs mt-1" style={{ color: colors.stroke }}>{status}</div>
      <div className="mt-3 h-14 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.4"/>
                <stop offset="100%" stopColor={colors.stroke} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={colors.stroke} strokeWidth={2} fill={`url(#grad-${label})`}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

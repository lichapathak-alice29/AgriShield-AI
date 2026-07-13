import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function HealthGauge({ score = 92 }: { score?: number }) {
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const rounded = useTransform(value, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(value, score, { duration: 1.6, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [score, value, rounded]);

  const color =
    score >= 90 ? "oklch(0.62 0.16 155)" :
    score >= 70 ? "oklch(0.65 0.15 145)" :
    score >= 50 ? "oklch(0.78 0.14 75)" :
                  "oklch(0.62 0.22 25)";
  const label =
    score >= 90 ? "Optimal · No action required" :
    score >= 70 ? "Healthy · Minor adjustments" :
    score >= 50 ? "Attention · Review recommendations" :
                  "Critical · Immediate action";

  const R = 88;
  const CIRC = 2 * Math.PI * R;
  const dash = (score / 100) * CIRC;

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col items-center">
      <div className="flex justify-between w-full items-center mb-2">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Health Score</div>
          <div className="text-sm font-medium">AI Assessment</div>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald bg-emerald/10 px-2 py-1 rounded-full">
          <Sparkles className="h-3 w-3"/> Live
        </div>
      </div>
      <div className="relative h-52 w-52">
        <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
              <stop offset="100%" stopColor={color} stopOpacity="0.5"/>
            </linearGradient>
          </defs>
          <circle cx="110" cy="110" r={R} stroke="var(--border)" strokeWidth="14" fill="none"/>
          <motion.circle
            cx="110" cy="110" r={R} stroke="url(#gaugeGrad)" strokeWidth="14" fill="none"
            strokeLinecap="round" strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: CIRC - dash }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 12px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-5xl font-bold tracking-tight tabular-nums">{display}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">/ 100</div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm font-medium" style={{ color }}>{label}</div>
    </div>
  );
}

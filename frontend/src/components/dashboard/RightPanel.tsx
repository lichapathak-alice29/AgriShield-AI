import { motion } from "framer-motion";
import { AlertTriangle, Sparkles, Cloud, Droplets, Sun, CheckCircle2, Clock } from "lucide-react";
import { alerts, recommendations, schedule } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = { leaf: Sparkles, droplets: Droplets, sun: Sun };
const levelStyles: Record<string, string> = {
  critical: "border-critical/40 bg-critical/5 text-critical",
  warning: "border-amber-accent/40 bg-amber-accent/5 text-amber-accent",
  info: "border-sky-accent/40 bg-sky-accent/5 text-sky-accent",
  resolved: "border-emerald/40 bg-emerald/5 text-emerald",
};

export function RightPanel() {
  return (
    <div className="space-y-4">
      <Weather/>
      <RecentAlerts/>
      <Recommendations/>
      <Schedule/>
    </div>
  );
}

function Weather() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Today's Weather</div>
        <Cloud className="h-4 w-4 text-sky-accent"/>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <div className="text-4xl font-bold tracking-tight">26°</div>
        <div className="text-sm text-muted-foreground mb-1">Partly cloudy</div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        {[
          { t: "12", h: "24°" }, { t: "15", h: "27°" }, { t: "18", h: "23°" }, { t: "21", h: "20°" },
        ].map((s) => (
          <div key={s.t} className="rounded-xl bg-muted/50 p-2">
            <div className="text-[10px] text-muted-foreground">{s.t}:00</div>
            <div className="text-sm font-medium mt-0.5">{s.h}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RecentAlerts() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Recent Alerts</div>
        <span className="text-[10px] text-critical bg-critical/10 px-2 py-0.5 rounded-full">2 active</span>
      </div>
      <div className="space-y-2">
        {alerts.slice(0, 4).map((a) => (
          <div key={a.id} className={`rounded-2xl border p-3 ${levelStyles[a.level]}`}>
            <div className="flex items-start gap-2">
              {a.level === "critical" ? <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5"/> :
               a.level === "resolved" ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> :
               <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5"/>}
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{a.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{a.zone} · {a.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Recommendations() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">AI Recommendations</div>
        <Sparkles className="h-4 w-4 text-emerald"/>
      </div>
      <div className="space-y-2">
        {recommendations.map((r) => {
          const Icon = iconMap[r.icon] ?? Sparkles;
          return (
            <div key={r.title} className="rounded-2xl border border-border p-3 hover:bg-accent/50 transition">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-xl bg-emerald/10 grid place-items-center shrink-0">
                  <Icon className="h-4 w-4 text-emerald"/>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.body}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function Schedule() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Upcoming Irrigation</div>
        <Clock className="h-4 w-4 text-sky-accent"/>
      </div>
      <div className="space-y-2">
        {schedule.map((s) => (
          <div key={s.time} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-accent/50">
            <div className="text-sm font-semibold tabular-nums w-12 text-emerald">{s.time}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate">{s.task}</div>
              <div className="text-[11px] text-muted-foreground">{s.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

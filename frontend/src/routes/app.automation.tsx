import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Zap, Plus, ChevronRight, Droplets, Wind, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export const Route = createFileRoute("/app/automation")({
  component: Automation,
  head: () => ({ meta: [{ title: "Automation — AgriShield AI" }] }),
});

const rules = [
  { id: 1, icon: Droplets, name: "Auto-irrigate when soil < 40%", desc: "Runs pump for 8 min · Zone A, B, C", active: true },
  { id: 2, icon: Wind, name: "Ventilate when temp > 30°C", desc: "Engages fan for 15 min", active: true },
  { id: 3, icon: Sun, name: "Grow lights on schedule", desc: "06:00 – 19:00 daily · Zone B", active: true },
  { id: 4, icon: Droplets, name: "Mist when humidity < 45%", desc: "3-minute mist cycle", active: false },
];

function Automation() {
  const [state, setState] = useState(rules);
  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div className="flex flex-wrap justify-between items-end gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation</h1>
          <p className="text-sm text-muted-foreground mt-1">Precision rules that run without you.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald to-forest text-white px-5 py-2.5 text-sm font-medium shadow-glow-emerald">
          <Plus className="h-4 w-4"/> New rule
        </button>
      </div>

      <div className="space-y-3">
        {state.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card rounded-3xl p-5 flex items-center gap-4">
            <div className={`h-11 w-11 rounded-2xl grid place-items-center ${r.active ? "bg-emerald/15 text-emerald" : "bg-muted text-muted-foreground"}`}>
              <r.icon className="h-5 w-5"/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{r.name}</div>
              <div className="text-xs text-muted-foreground truncate">{r.desc}</div>
            </div>
            <Switch checked={r.active} onCheckedChange={(v) => setState(state.map(x => x.id === r.id ? { ...x, active: v } : x))}/>
            <button className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted"><ChevronRight className="h-4 w-4"/></button>
          </motion.div>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-2 text-emerald mb-2"><Zap className="h-4 w-4"/><span className="text-xs uppercase tracking-widest font-medium">AI Suggestion</span></div>
        <div className="font-semibold">Enable predictive frost protection</div>
        <p className="text-sm text-muted-foreground mt-1 max-w-xl">Nighttime lows are forecasted at 3°C next week. Enable heater automation to protect basil yield.</p>
        <button className="mt-4 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium">Enable rule</button>
      </div>
    </div>
  );
}

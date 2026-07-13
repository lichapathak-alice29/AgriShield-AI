import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, FileText, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/reports")({
  component: Reports,
  head: () => ({ meta: [{ title: "Reports — AgriShield AI" }] }),
});

const reports = [
  { name: "Weekly performance · Wk 27", type: "Performance", size: "1.4 MB", date: "Jul 8, 2026" },
  { name: "Monthly water usage · June", type: "Sustainability", size: "980 KB", date: "Jul 1, 2026" },
  { name: "Yield forecast — Basil House", type: "Forecast", size: "2.1 MB", date: "Jun 28, 2026" },
  { name: "Sensor health audit", type: "Compliance", size: "540 KB", date: "Jun 24, 2026" },
];

function Reports() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Auto-generated insights, ready to share.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { l: "Reports generated", v: "128" },
          { l: "Avg yield vs plan", v: "+14%", icon: TrendingUp },
          { l: "Compliance score", v: "A+" },
        ].map((k) => (
          <div key={k.l} className="glass-card rounded-3xl p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{k.l}</div>
            <div className="text-3xl font-bold tracking-tight mt-1">{k.v}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-border/60 flex justify-between items-center">
          <div className="font-semibold">Recent reports</div>
          <button className="text-xs text-emerald hover:underline">View all</button>
        </div>
        <div className="divide-y divide-border/60">
          {reports.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="p-5 flex items-center gap-4 hover:bg-accent/40 transition">
              <div className="h-10 w-10 rounded-2xl bg-emerald/10 grid place-items-center">
                <FileText className="h-5 w-5 text-emerald"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.type} · {r.size} · {r.date}</div>
              </div>
              <button className="rounded-full border border-border px-4 py-1.5 text-xs font-medium hover:bg-accent inline-flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5"/> Download
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

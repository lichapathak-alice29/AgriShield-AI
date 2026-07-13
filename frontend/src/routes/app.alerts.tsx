import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, BellOff } from "lucide-react";
import { useAgrishield } from "@/hooks/useAgrishield";

export const Route = createFileRoute("/app/alerts")({
  component: Alerts,
  head: () => ({ meta: [{ title: "Alerts — AgriShield AI" }] }),
});

const alertStyles: Record<string, { border: string; bg: string; color: string; icon: React.ElementType; label: string }> = {
  HIGH_TEMP: { border: "border-amber-accent/40", bg: "bg-amber-accent/5", color: "text-amber-accent", icon: AlertTriangle, label: "High Temp Warning" },
  LOW_MOISTURE: { border: "border-critical/40", bg: "bg-critical/5", color: "text-critical", icon: AlertTriangle, label: "Dry Soil Critical" },
  LOW_WATER: { border: "border-critical/40", bg: "bg-critical/5", color: "text-critical", icon: AlertTriangle, label: "Low Water Reservoir" },
  info: { border: "border-sky-accent/40", bg: "bg-sky-accent/5", color: "text-sky-accent", icon: Info, label: "System Info" },
};

function Alerts() {
  const { activeAlerts, resolveAlert, clearAllAlerts } = useAgrishield();

  const handleResolve = (id: number) => {
    resolveAlert(id);
  };

  const getAlertTimeText = (timestampStr: string) => {
    try {
      const diffMs = Date.now() - new Date(timestampStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins === 1) return "1 min ago";
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours === 1) return "1 hr ago";
      return `${diffHours} hrs ago`;
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time system anomalies, incidents, and automated warnings.</p>
        </div>
        {activeAlerts.length > 0 && (
          <button 
            onClick={clearAllAlerts}
            className="rounded-full border border-border/80 px-4 py-2 text-xs font-semibold hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
          >
            Clear All Alerts
          </button>
        )}
      </div>

      <div className="relative">
        {activeAlerts.length > 0 && (
          <div className="absolute left-6 top-2 bottom-2 w-px bg-border"/>
        )}

        <div className="space-y-4">
          {activeAlerts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-12 glass-card rounded-3xl text-center"
            >
              <div className="h-16 w-16 bg-emerald/10 text-emerald rounded-full grid place-items-center mb-4">
                <CheckCircle2 className="h-8 w-8 animate-pulse-glow" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Greenhouse Status Nominal</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">
                No active anomalies detected. All sensors report conditions within optimal operating guidelines.
              </p>
            </motion.div>
          ) : (
            activeAlerts.map((a, i) => {
              const s = alertStyles[a.type] || alertStyles.info;
              return (
                <motion.div 
                  key={a.id} 
                  initial={{ opacity: 0, x: 12 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  className="relative pl-16"
                >
                  <div className={`absolute left-3 top-4 h-6 w-6 rounded-full grid place-items-center border-2 border-background ${s.bg} ${s.color}`}>
                    <s.icon className="h-3 w-3"/>
                  </div>
                  <div className={`glass-card rounded-2xl p-5 border ${s.border}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase tracking-widest font-bold ${s.color}`}>{s.label}</span>
                      <span className="text-xs text-muted-foreground">· {getAlertTimeText(a.timestamp)}</span>
                    </div>
                    <div className="mt-1 font-medium">{a.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">Status: Active Edge Trigger</div>
                    
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => handleResolve(a.id)}
                        className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-4 py-1.5 text-xs font-semibold"
                      >
                        Acknowledge & Resolve
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

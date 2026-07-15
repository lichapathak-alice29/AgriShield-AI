import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Wind, Droplets, Sun, Volume2, Cpu, AlertCircle } from "lucide-react";
import { useAgrishield } from "@/hooks/useAgrishield";

const iconMap: Record<string, React.ElementType> = { 
  fan: Wind, 
  pump: Droplets, 
  light: Sun, 
  buzzer: Volume2 
};

export const Route = createFileRoute("/app/devices")({
  component: Devices,
  head: () => ({ meta: [{ title: "Devices — AgriShield AI" }] }),
});

function Devices() {
  const { deviceStates, updateDevices } = useAgrishield();

  const auto = deviceStates?.mode !== "Manual"; // Default to Auto if states not loaded

  const items = [
    { id: "fan", name: "Ventilation Fan", zone: "Zone A", type: "fan", state: deviceStates?.fan === "ON" },
    { id: "pump", name: "Irrigation Pump", zone: "Zone A", type: "pump", state: deviceStates?.pump === "ON" },
    { id: "light", name: "Grow Light", zone: "Zone A", type: "light", state: deviceStates?.light === "ON" },
    { id: "buzzer", name: "Audio Buzzer", zone: "Zone A", type: "buzzer", state: deviceStates?.buzzer === "ON" },
  ];

  const handleDeviceToggle = (id: string, checked: boolean) => {
    updateDevices({ [id]: checked ? "ON" : "OFF" });
  };

  const handleModeToggle = (checked: boolean) => {
    updateDevices({ mode: checked ? "Auto" : "Manual" });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      <div className="flex flex-wrap justify-between items-end gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
          <p className="text-sm text-muted-foreground mt-1">Manual override or hand it back to AgriShield's autopilot.</p>
        </div>
        <div className="glass-card rounded-full px-4 py-2 flex items-center gap-3">
          <Cpu className="h-4 w-4 text-emerald"/>
          <span className="text-sm font-medium">{auto ? "Auto Mode" : "Manual Mode"}</span>
          <Switch checked={auto} onCheckedChange={handleModeToggle}/>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((d, i) => {
          const Icon = iconMap[d.type] ?? Cpu;
          return (
            <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-3xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={d.state && d.type === "fan" ? { rotate: 360 } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className={`h-12 w-12 rounded-2xl grid place-items-center border ${d.state ? "bg-emerald/15 border-emerald/30" : "bg-muted border-border"}`}
                  >
                    <Icon className={`h-5 w-5 ${d.state ? "text-emerald" : "text-muted-foreground"}`}/>
                  </motion.div>
                  <div>
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.zone} · {d.id}</div>
                  </div>
                </div>
                <Switch 
                  checked={d.state} 
                  disabled={auto}
                  onCheckedChange={(v) => handleDeviceToggle(d.id, v)}
                />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <Stat label="Status" value={d.state ? "Running" : "Idle"} accent={d.state}/>
                <Stat label="Power" value={d.state ? "42W" : "0W"}/>
                <Stat label="Uptime" value="99.9%"/>
              </div>
            </motion.div>
          );
        })}
      </div>

      {auto && (
        <div className="flex items-center gap-2 text-xs text-amber-500/90 mt-2 px-1">
          <AlertCircle className="h-4 w-4 shrink-0"/>
          <span>System is in Auto mode. Local edge rules are automatically controlling the relays. Toggle to Manual Mode above to override.</span>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-muted/50 py-2">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-sm font-semibold mt-0.5 ${accent ? "text-emerald" : ""}`}>{value}</div>
    </div>
  );
}

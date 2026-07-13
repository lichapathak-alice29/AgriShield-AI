import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  component: Settings,
  head: () => ({ meta: [{ title: "Settings — AgriShield AI" }] }),
});

function Settings() {
  const { theme, setTheme } = useTheme();
  const [temp, setTemp] = useState([18, 30]);
  const [soil, setSoil] = useState([40, 75]);
  const [humidity, setHumidity] = useState([55, 80]);
  const [notif, setNotif] = useState({ push: true, email: true, sms: false });
  const [lang, setLang] = useState("English");

  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure thresholds, notifications and appearance.</p>
      </div>

      <Card title="Thresholds" subtitle="AgriShield alerts when values leave your safe range.">
        <ThresholdRow label="Temperature (°C)" min={0} max={45} value={temp} onChange={setTemp} step={0.5}/>
        <ThresholdRow label="Soil moisture (%)" min={0} max={100} value={soil} onChange={setSoil}/>
        <ThresholdRow label="Humidity (%)" min={0} max={100} value={humidity} onChange={setHumidity}/>
      </Card>

      <Card title="Notifications">
        <Row label="Push notifications" desc="Real-time alerts on your device">
          <Switch checked={notif.push} onCheckedChange={(v) => setNotif({ ...notif, push: v })}/>
        </Row>
        <Row label="Email digest" desc="Daily summary at 07:00">
          <Switch checked={notif.email} onCheckedChange={(v) => setNotif({ ...notif, email: v })}/>
        </Row>
        <Row label="SMS · critical only" desc="For system-critical incidents">
          <Switch checked={notif.sms} onCheckedChange={(v) => setNotif({ ...notif, sms: v })}/>
        </Row>
      </Card>

      <Card title="Appearance">
        <Row label="Theme" desc="Choose light, dark or match your system.">
          <div className="flex rounded-full border border-border p-1">
            {[
              { k: "light", i: Sun }, { k: "dark", i: Moon }, { k: "system", i: Monitor },
            ].map(({ k, i: Icon }) => (
              <button key={k} onClick={() => k !== "system" && setTheme(k as "light"|"dark")}
                className={`h-8 w-8 grid place-items-center rounded-full transition ${theme === k ? "bg-emerald text-white" : "text-muted-foreground"}`}>
                <Icon className="h-3.5 w-3.5"/>
              </button>
            ))}
          </div>
        </Row>
        <Row label="Language" desc="Interface language">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm">
            {["English", "Español", "Français", "Kiswahili", "हिन्दी"].map((l) => <option key={l}>{l}</option>)}
          </select>
        </Row>
      </Card>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6">
      <div className="mb-5">
        <div className="font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </div>
      <div className="space-y-5">{children}</div>
    </motion.div>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function ThresholdRow({ label, min, max, value, onChange, step = 1 }: { label: string; min: number; max: number; value: number[]; onChange: (v: number[]) => void; step?: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-3">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">{value[0]} – {value[1]}</span>
      </div>
      <Slider min={min} max={max} step={step} value={value} onValueChange={onChange}/>
    </div>
  );
}

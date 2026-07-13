import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { sensorHistory, weeklyEnergy } from "@/lib/mock-data";
import { useState } from "react";
import { useAgrishield } from "@/hooks/useAgrishield";

export const Route = createFileRoute("/app/analytics")({
  component: Analytics,
  head: () => ({ meta: [{ title: "Analytics — AgriShield AI" }] }),
});

function Analytics() {
  const [range, setRange] = useState<"D" | "W" | "M">("W");
  const { history, analytics } = useAgrishield();

  // Map backend history logs to the chart model keys
  const liveChartData = history && history.length > 0
    ? history.slice(0, 24).reverse().map((r) => ({
        hour: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: r.temperature,
        humidity: r.humidity,
        soil: r.moisture,
        light: r.light,
        water: r.waterLevel,
      }))
    : sensorHistory;

  // Retrieve metrics or fallback to default views
  const avgTempText = analytics?.avgTemp 
    ? `${analytics.avgTemp.toFixed(1)}°C` 
    : "24.6°C";
  const avgHumidText = analytics?.avgHumid 
    ? `${analytics.avgHumid.toFixed(0)}%` 
    : "67%";
  const avgWaterText = analytics?.avgWater 
    ? `${analytics.avgWater.toFixed(0)}%` 
    : "78%";
  
  const tempDiffText = analytics?.maxTemp && analytics?.minTemp
    ? `Range: ${analytics.minTemp.toFixed(1)}°C - ${analytics.maxTemp.toFixed(1)}°C`
    : "+0.4 vs last week";

  const humidDiffText = analytics?.maxHumid && analytics?.minHumid
    ? `Range: ${analytics.minHumid.toFixed(0)}% - ${analytics.maxHumid.toFixed(0)}%`
    : "-2% vs last week";

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      <div className="flex flex-wrap justify-between items-end gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Environmental performance and metrics across every zone.</p>
        </div>
        <div className="flex items-center rounded-full border border-border p-1 bg-card">
          {(["D","W","M"] as const).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition ${range === r ? "bg-emerald text-white shadow-glow-emerald" : "text-muted-foreground"}`}>
              {r === "D" ? "Daily" : r === "W" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Avg Temp", v: avgTempText, d: tempDiffText },
          { l: "Avg Humidity", v: avgHumidText, d: humidDiffText },
          { l: "Avg Tank Level", v: avgWaterText, d: "Target: > 15%" },
          { l: "Uptime", v: "99.98%", d: "Rolling 30 days" },
        ].map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card rounded-3xl p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{k.l}</div>
            <div className="text-3xl font-bold mt-1 tracking-tight">{k.v}</div>
            <div className="text-xs text-muted-foreground mt-1">{k.d}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Environmental stability" subtitle="Temperature & humidity · Live 24h timeline">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={liveChartData}>
              <defs>
                <linearGradient id="t" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--emerald)" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="var(--emerald)" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="h" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--sky-accent)" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="var(--sky-accent)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="hour" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}/>
              <Area dataKey="temperature" stroke="var(--emerald)" strokeWidth={2} fill="url(#t)" name="Temp °C"/>
              <Area dataKey="humidity" stroke="var(--sky-accent)" strokeWidth={2} fill="url(#h)" name="Humidity %"/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Water & energy" subtitle="Weekly usage statistics">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyEnergy}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}/>
              <Legend wrapperStyle={{ fontSize: 11 }}/>
              <Bar dataKey="water" fill="var(--sky-accent)" radius={[6,6,0,0]} name="Water (L)"/>
              <Bar dataKey="energy" fill="var(--emerald)" radius={[6,6,0,0]} name="Energy (kWh)"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pump runtime" subtitle="Minutes per day">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyEnergy}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}/>
              <Line dataKey="pump" stroke="var(--emerald)" strokeWidth={3} dot={{ r: 4, fill: "var(--emerald)" }} activeDot={{ r: 6 }}/>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Zone soil moisture" subtitle="Soil moisture across zones · hourly">
          <div className="grid grid-rows-4 gap-1.5 h-[280px] py-2">
            {["Zone A","Zone B","Zone C","Zone D"].map((z, r) => (
              <div key={z} className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground w-14 shrink-0">{z}</div>
                <div className="grid grid-cols-12 gap-1 flex-1 h-full">
                  {Array.from({ length: 12 }).map((_, c) => {
                    const v = Math.sin((r + 1) * (c + 1) * 0.4) * 0.5 + 0.5;
                    return (
                      <div key={c} className="rounded-md" style={{ background: `oklch(0.62 0.16 155 / ${0.15 + v * 0.75})` }} title={`${Math.round(v*100)}%`}/>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

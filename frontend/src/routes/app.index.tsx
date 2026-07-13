import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Thermometer, Droplets, Waves, Sun, Container } from "lucide-react";
import { DigitalGreenhouse } from "@/components/dashboard/DigitalGreenhouse";
import { HealthGauge } from "@/components/dashboard/HealthGauge";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { sensorHistory } from "@/lib/mock-data";
import { useAgrishield } from "@/hooks/useAgrishield";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { latestReading, history, isConnected } = useAgrishield();

  // Helper to extract sparkline data (uses live history, falls back to mock design data if history is empty)
  const getSparkData = (
    key: "temperature" | "humidity" | "moisture" | "light" | "waterLevel", 
    fallbackKey: "temperature" | "humidity" | "soil" | "light" | "water"
  ) => {
    if (history && history.length > 0) {
      return history.slice(0, 12).reverse().map((r) => ({ v: r[key] }));
    }
    return sensorHistory.slice(-12).map((r) => ({ v: r[fallbackKey] }));
  };

  // Helper to compute live telemetry trends
  const getTrend = (key: "temperature" | "humidity" | "moisture" | "light" | "waterLevel", fallbackVal: number) => {
    if (history && history.length > 1) {
      const diff = history[0][key] - history[1][key];
      return parseFloat(diff.toFixed(1));
    }
    return fallbackVal;
  };

  // 1. Temperature Values
  const tempVal = latestReading?.temperature ?? 24.6;
  const tempStatus = tempVal > 35 ? "Critical" : tempVal > 30 ? "Warning" : "Optimal";
  const tempTrend = getTrend("temperature", 2);

  // 2. Humidity Values
  const humidVal = latestReading?.humidity ?? 68;
  const humidStatus = humidVal > 80 ? "High" : humidVal < 40 ? "Dry" : "Optimal";
  const humidTrend = getTrend("humidity", -1);

  // 3. Soil Moisture Values
  const moistVal = latestReading?.moisture ?? 42;
  const moistStatus = moistVal < 30 ? "Critical" : moistVal < 45 ? "Dry" : "Optimal";
  const moistTrend = getTrend("moisture", -4);

  // 4. Light Values
  const lightVal = latestReading?.light ?? 72;
  const lightStatus = lightVal > 75 ? "Peak hours" : lightVal < 25 ? "Low light" : "Optimal";
  const lightTrend = getTrend("light", 8);

  // 5. Water Tank Values
  const waterVal = latestReading?.waterLevel ?? 78;
  const waterStatus = waterVal < 15 ? "Critical" : waterVal < 30 ? "Low" : "Sufficient";
  const waterTrend = getTrend("waterLevel", -2);

  // Formatting last sync display time
  const lastSyncText = latestReading 
    ? `Last sync · ${new Date(latestReading.timestamp).toLocaleTimeString()}`
    : "Last sync · Waiting for connection";

  return (
    <div className="max-w-[1600px] mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Good morning, Amina</h1>
          <p className="text-sm text-muted-foreground mt-1">Everything looks healthy across your active greenhouse.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`rounded-full px-3 py-1.5 font-medium ${isConnected ? "bg-emerald/10 text-emerald" : "bg-amber/10 text-amber"}`}>
            ● {isConnected ? "Sensors Online" : "Server Offline"}
          </span>
          <span className="rounded-full bg-muted px-3 py-1.5 font-medium text-muted-foreground">{lastSyncText}</span>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5 min-w-0">
          {/* Sensor row */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <SensorCard 
              icon={Thermometer} 
              label="Temperature" 
              value={tempVal} 
              unit="°C" 
              status={tempStatus} 
              trend={tempTrend} 
              tint={tempStatus === "Critical" ? "amber" : "emerald"} 
              data={getSparkData("temperature", "temperature")}
            />
            <SensorCard 
              icon={Droplets} 
              label="Humidity" 
              value={humidVal} 
              unit="%" 
              status={humidStatus} 
              trend={humidTrend} 
              tint={humidStatus === "Optimal" ? "sky" : "amber"} 
              data={getSparkData("humidity", "humidity")}
            />
            <SensorCard 
              icon={Waves} 
              label="Soil Moisture" 
              value={moistVal} 
              unit="%" 
              status={moistStatus} 
              trend={moistTrend} 
              tint={moistStatus === "Optimal" ? "emerald" : moistStatus === "Dry" ? "amber" : "amber"} 
              data={getSparkData("moisture", "soil")}
            />
            <SensorCard 
              icon={Sun} 
              label="Light" 
              value={lightVal} 
              unit="%" 
              status={lightStatus} 
              trend={lightTrend} 
              tint="amber" 
              data={getSparkData("light", "light")}
            />
            <SensorCard 
              icon={Container} 
              label="Water Tank" 
              value={waterVal} 
              unit="%" 
              status={waterStatus} 
              trend={waterTrend} 
              tint={waterStatus === "Critical" ? "amber" : "sky"} 
              data={getSparkData("waterLevel", "water")}
            />
          </div>

          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
            <DigitalGreenhouse/>
            <HealthGauge score={latestReading?.healthScore ?? 92}/>
          </div>
        </div>

        <div className="space-y-5">
          <RightPanel/>
        </div>
      </div>
    </div>
  );
}

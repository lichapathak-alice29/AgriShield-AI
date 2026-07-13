import { motion } from "framer-motion";
import { Wind, Droplets, Sun, Thermometer, Zap, Power } from "lucide-react";
import { useAgrishield } from "@/hooks/useAgrishield";
import { toast } from "sonner";

export function DigitalGreenhouse() {
  const { latestReading, isConnected } = useAgrishield();

  // Read actuator statuses from live telemetry or fallback to defaults
  const isFanActive = latestReading ? latestReading.fanStatus === 'ON' : true;
  const isPumpActive = latestReading ? latestReading.pumpStatus === 'ON' : false;
  // If light sensor reads > 30% intensity, assume grow lights / sun are on
  const isLightActive = latestReading ? latestReading.light > 30 : true;

  const handleActuatorToggle = (device: string) => {
    toast.info(`${device} is currently managed autonomously by the ESP32 Edge Rules Engine.`, {
      description: "Autonomous microclimate controls prevent crop damage from manual configuration overrides.",
      duration: 3500
    });
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Digital Twin</div>
          <div className="text-sm font-medium">Live Greenhouse View</div>
        </div>
        <div className={`flex items-center gap-1.5 text-xs ${isConnected ? "text-emerald" : "text-amber"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald animate-pulse-glow" : "bg-amber"}`}/> 
          {isConnected ? "Streaming Live" : "Offline"}
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-sky-accent/10 via-background to-emerald/5 aspect-[16/10]">
        {/* grid backdrop */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}/>

        <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="ghRoof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.72 0.16 155)" stopOpacity="0.85"/>
              <stop offset="100%" stopColor="oklch(0.35 0.09 155)" stopOpacity="0.9"/>
            </linearGradient>
            <linearGradient id="ghGlass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="white" stopOpacity="0.05"/>
            </linearGradient>
          </defs>

          {/* Sun / light */}
          {isLightActive && (
            <>
              <motion.circle cx="680" cy="80" r="26" fill="oklch(0.85 0.14 75)"
                animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 3, repeat: Infinity }}/>
              <motion.circle cx="680" cy="80" r="50" fill="oklch(0.85 0.14 75)" opacity="0.15"
                animate={{ r: [50, 65, 50] }} transition={{ duration: 3, repeat: Infinity }}/>
              {/* Light rays down */}
              {[200, 320, 440, 560].map((x, i) => (
                <motion.line key={i} x1={x} y1="180" x2={x} y2="380"
                  stroke="oklch(0.85 0.14 75)" strokeWidth="1" strokeDasharray="4 6"
                  animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}/>
              ))}
            </>
          )}

          {/* Roof */}
          <polygon points="120,200 400,80 680,200" fill="url(#ghRoof)"/>
          <line x1="400" y1="80" x2="400" y2="200" stroke="oklch(0.28 0.08 155)" strokeWidth="1.5" opacity="0.5"/>

          {/* Body */}
          <rect x="120" y="200" width="560" height="220" fill="url(#ghGlass)" stroke="oklch(0.55 0.15 155)" strokeWidth="2" rx="4"/>
          {/* vertical panes */}
          {[200, 280, 360, 440, 520, 600].map((x) => (
            <line key={x} x1={x} y1="200" x2={x} y2="420" stroke="oklch(0.55 0.15 155)" strokeWidth="1" opacity="0.35"/>
          ))}
          <line x1="120" y1="310" x2="680" y2="310" stroke="oklch(0.55 0.15 155)" strokeWidth="1" opacity="0.35"/>

          {/* Soil beds */}
          <rect x="140" y="380" width="520" height="20" fill="oklch(0.35 0.06 40)" rx="4"/>

          {/* Plants */}
          {[180, 250, 320, 390, 460, 530, 600].map((x, i) => (
            <motion.g key={x}
              animate={{ y: [0, -4, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity }}>
              <path d={`M ${x} 380 Q ${x - 8} 355 ${x - 14} 335 M ${x} 380 Q ${x + 8} 355 ${x + 14} 335 M ${x} 380 L ${x} 345`}
                stroke="oklch(0.45 0.12 155)" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <ellipse cx={x - 10} cy="335" rx="10" ry="6" fill="oklch(0.62 0.16 155)" transform={`rotate(-30 ${x - 10} 335)`}/>
              <ellipse cx={x + 10} cy="335" rx="10" ry="6" fill="oklch(0.62 0.16 155)" transform={`rotate(30 ${x + 10} 335)`}/>
              <ellipse cx={x} cy="325" rx="8" ry="10" fill="oklch(0.72 0.16 155)"/>
            </motion.g>
          ))}

          {/* Pump water flow */}
          {isPumpActive && (
            <>
              <rect x="90" y="360" width="24" height="40" rx="4" fill="oklch(0.28 0.02 220)"/>
              <rect x="94" y="356" width="16" height="6" rx="2" fill="oklch(0.72 0.11 220)"/>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.circle key={i} cx="102" cy="360" r="3" fill="oklch(0.72 0.11 220)"
                  animate={{ cy: [360, 420], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, delay: i * 0.25, repeat: Infinity }}/>
              ))}
              {/* Drip lines */}
              {[200, 280, 360, 440, 520, 600].map((x, i) => (
                <motion.circle key={x} cx={x} cy="360" r="2" fill="oklch(0.72 0.11 220)"
                  animate={{ cy: [360, 380], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}/>
              ))}
            </>
          )}

          {/* Fan */}
          <g transform="translate(650, 260)">
            <circle r="22" fill="oklch(0.20 0.02 160)"/>
            <motion.g animate={isFanActive ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 1.2, repeat: isFanActive ? Infinity : 0, ease: "linear" }}>
              <ellipse rx="16" ry="4" fill="oklch(0.85 0.02 155)"/>
              <ellipse rx="4" ry="16" fill="oklch(0.85 0.02 155)"/>
            </motion.g>
            <circle r="3" fill="oklch(0.62 0.16 155)"/>
          </g>

          {/* Water tank */}
          <g transform="translate(700, 340)">
            <rect x="0" y="0" width="60" height="70" rx="6" fill="oklch(0.20 0.02 160)" opacity="0.5" stroke="oklch(0.55 0.15 155)"/>
            <motion.rect x="3" y={18 + (1 - (latestReading?.waterLevel ?? 78) / 100) * 49} width="54" height={(latestReading?.waterLevel ?? 78) / 100 * 49} rx="4" fill="oklch(0.72 0.11 220)" opacity="0.65"
              animate={{ opacity: [0.55, 0.75, 0.55] }} transition={{ duration: 3, repeat: Infinity }}/>
            <text x="30" y="88" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">Tank {latestReading?.waterLevel ?? 78}%</text>
          </g>

          {/* Sensor tags - linked to live state */}
          <SensorTag x={230} y={230} label={`${latestReading?.temperature?.toFixed(1) ?? '24.6'}°C`} sub="Air Temp"/>
          <SensorTag x={430} y={230} label={`${latestReading?.humidity?.toFixed(0) ?? '68'}%`} sub="Humidity"/>
          <SensorTag x={550} y={230} label={`${latestReading?.moisture ?? '42'}%`} sub="Soil Moisture"/>
        </svg>

        {/* Device control chips */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          <ControlChip icon={Wind} label="Fan" active={isFanActive} onClick={() => handleActuatorToggle("Ventilation Fan")}/>
          <ControlChip icon={Droplets} label="Pump" active={isPumpActive} onClick={() => handleActuatorToggle("Water Pump")}/>
          <ControlChip icon={Sun} label="Grow Light" active={isLightActive} onClick={() => handleActuatorToggle("Grow Light System")}/>
        </div>
      </div>
    </div>
  );
}

function SensorTag({ x, y, label, sub }: { x: number; y: number; label: string; sub: string }) {
  return (
    <g>
      <foreignObject x={x - 40} y={y - 22} width="80" height="44">
        <div className="rounded-xl bg-background/85 backdrop-blur border border-border/60 px-2 py-1 text-center shadow-elegant">
          <div className="text-[11px] font-semibold leading-none">{label}</div>
          <div className="text-[9px] text-muted-foreground mt-0.5 leading-none">{sub}</div>
        </div>
      </foreignObject>
    </g>
  );
}

function ControlChip({ icon: Icon, label, active, onClick }: { icon: React.ElementType; label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium backdrop-blur border transition-all ${
        active
          ? "bg-emerald text-white border-emerald shadow-glow-emerald"
          : "bg-background/70 border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${active && label === "Fan" ? "animate-spin-slow" : ""}`}/>
      {label}
      <Power className="h-3 w-3 opacity-70"/>
    </motion.button>
  );
}

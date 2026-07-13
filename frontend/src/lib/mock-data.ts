export const sensorHistory = Array.from({ length: 24 }).map((_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  temperature: 22 + Math.sin(i / 3) * 4 + Math.random() * 1.2,
  humidity: 60 + Math.cos(i / 4) * 12 + Math.random() * 2,
  soil: 45 + Math.sin(i / 5) * 10 + Math.random() * 2,
  light: Math.max(0, Math.sin((i - 6) / 24 * Math.PI) * 900 + Math.random() * 40),
  water: Math.max(20, 90 - i * 1.8 + Math.random() * 3),
}));

export const weeklyEnergy = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({
  day: d,
  water: 120 + Math.random() * 60 + i * 4,
  energy: 45 + Math.random() * 25,
  pump: 30 + Math.random() * 20,
}));

export const alerts = [
  { id: 1, level: "critical", title: "Soil moisture below threshold — Zone B", time: "2 min ago", zone: "Zone B" },
  { id: 2, level: "warning", title: "Temperature rising above 32°C", time: "18 min ago", zone: "Zone A" },
  { id: 3, level: "info", title: "Irrigation cycle completed", time: "1 hr ago", zone: "Zone A" },
  { id: 4, level: "resolved", title: "Water tank refilled", time: "3 hr ago", zone: "Tank 1" },
  { id: 5, level: "warning", title: "Humidity spike detected", time: "5 hr ago", zone: "Zone C" },
];

export const recommendations = [
  { icon: "leaf", title: "Optimal growth window", body: "Conditions ideal for tomato flowering in the next 6 hours." },
  { icon: "droplets", title: "Reduce irrigation by 12%", body: "Overnight humidity forecast is above 78%. Save ~40L today." },
  { icon: "sun", title: "Ventilate at 14:00", body: "Peak solar radiation expected. Auto-fan will engage." },
];

export const schedule = [
  { time: "06:00", task: "Morning irrigation — Zone A", duration: "12 min" },
  { time: "11:30", task: "Nutrient dosing — Zone B", duration: "6 min" },
  { time: "14:00", task: "Ventilation cycle", duration: "20 min" },
  { time: "18:30", task: "Evening irrigation — Zone C", duration: "10 min" },
];

export const devices = [
  { id: "fan-01", name: "Ventilation Fan", zone: "Zone A", state: true, type: "fan" },
  { id: "pump-01", name: "Main Water Pump", zone: "Tank 1", state: false, type: "pump" },
  { id: "light-01", name: "Grow Lights", zone: "Zone B", state: true, type: "light" },
  { id: "heat-01", name: "Heater", zone: "Zone C", state: false, type: "heat" },
  { id: "mist-01", name: "Mist System", zone: "Zone A", state: false, type: "mist" },
  { id: "shade-01", name: "Shade Curtain", zone: "Roof", state: true, type: "shade" },
];

const http = require('http');

console.log('=== AgriShield AI ESP32 Telemetry Simulator ===');
console.log('Sending mock sensor updates to http://localhost:5000/api/sensor/live...\n');

let step = 0;

// Base values that we will fluctuate
let baseTemp = 28.0;
let baseHumid = 60.0;
let baseMoist = 40;  // soil moisture %
let baseWater = 50;  // water tank %
let baseLight = 65;

const sendPayload = (payload) => {
  const data = JSON.stringify(payload);
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/sensor/live',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try {
        const responseData = JSON.parse(body);
        console.log(`[SIM ESP32] Sent telemetry - Status Code: ${res.statusCode}`);
        if (responseData.alertsTriggered && responseData.alertsTriggered.length > 0) {
          console.log('  ⚠️ Alerts changed:', JSON.stringify(responseData.alertsTriggered));
        }
      } catch (e) {
        console.log(`[SIM ESP32] Sent telemetry - Response: ${body}`);
      }
    });
  });

  req.on('error', (error) => {
    console.error(`[SIM ESP32] Transmission Error: ${error.message} (Is backend running?)`);
  });

  req.write(data);
  req.end();
};

const simulateLoop = () => {
  step++;

  // Fluctuations:
  // We'll simulate a day-night or drying cycle:
  // - Soil moisture will drop, triggering LOW_MOISTURE warning at <30%.
  // - Once it triggers low moisture, the pump will turn "ON" and moisture will increase back.
  // - Temperature will rise to trigger HIGH_TEMP warning at >35°C, then fan turns "ON" to cool it down.
  // - Water tank will slowly decrease, triggering LOW_WATER warning at <15%.

  let pumpStatus = "OFF";
  let fanStatus = "OFF";

  // Temperature logic
  if (step < 10) {
    baseTemp += 1.0; // rises up to 37°C
  } else if (step < 20) {
    fanStatus = "ON"; // simulation of fan cooling
    baseTemp -= 1.2; // cools down
  } else {
    baseTemp = 28.0 + Math.sin(step / 2) * 2;
  }

  // Soil moisture logic
  if (baseMoist > 25 && pumpStatus === "OFF" && step < 15) {
    baseMoist -= 2; // dries out
  } else {
    pumpStatus = "ON"; // simulation of irrigation
    baseMoist += 5; // gets watered
    if (baseMoist > 55) {
      baseMoist = 45; // reset drying
    }
  }

  // Water level logic
  baseWater -= 1;
  if (baseWater < 10) {
    baseWater = 95; // refill tank
  }

  // Light fluctuation
  baseLight = Math.round(50 + Math.sin(step / 3) * 30);

  // Health Score Calculation matching hardware rule
  let score = 100;
  if (baseTemp > 35.0 || baseTemp < 15.0) score -= 20;
  if (baseHumid > 80.0) score -= 15;
  if (baseMoist < 30) score -= 25;
  if (baseWater < 15) score -= 20;
  score = Math.max(0, Math.min(100, score));

  const payload = {
    temperature: parseFloat(baseTemp.toFixed(1)),
    humidity: parseFloat(baseHumid.toFixed(1)),
    moisture: Math.round(baseMoist),
    light: baseLight,
    waterLevel: baseWater,
    healthScore: score,
    pumpStatus: pumpStatus,
    fanStatus: fanStatus
  };

  console.log(`[SIM ESP32] Preparing: Temp=${payload.temperature}°C, Moist=${payload.moisture}%, Tank=${payload.waterLevel}%, Pump=${payload.pumpStatus}, Fan=${payload.fanStatus}`);
  sendPayload(payload);
};

// Start simulation immediately, then repeat every 4 seconds
simulateLoop();
setInterval(simulateLoop, 4000);

require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const AutomationRule = require('./models/AutomationRule');
const Report = require('./models/Report');

const {
  saveReading,
  getRecentReadings,
  getLatestReading,
  saveAlert,
  getAlerts,
  updateAlertStatus,
  getAnalytics,
  generateDailyReport,
  getDeviceStates,
  updateDeviceStates,
  getRules,
  saveRule,
  updateRule
} = require('./database');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'agrishield-super-secret-key-change-me';

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Create HTTP server & WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// In-memory cache of active alert types to prevent DB spamming
let activeAlertsCache = {};

// Load active alerts into cache on boot
const loadActiveAlerts = async () => {
  try {
    const alerts = await getAlerts('ACTIVE');
    alerts.forEach(alert => {
      activeAlertsCache[alert.type] = { id: alert.id, message: alert.message };
    });
    console.log('[SYSTEM] Active alerts loaded into cache:', Object.keys(activeAlertsCache));
  } catch (err) {
    console.error('[SYSTEM] Failed to load active alerts into cache:', err.message);
  }
};

// Seed default automation rules in MongoDB
const seedDefaultRules = async () => {
  try {
    const count = await AutomationRule.countDocuments();
    if (count === 0) {
      const defaultRules = [
        {
          ruleName: "Fan ON when Temperature > 35°C",
          conditionParameter: "temperature",
          operator: ">",
          value: 35.0,
          actionTarget: "fanStatus",
          actionValue: "ON"
        },
        {
          ruleName: "Pump ON when Soil Moisture < 30%",
          conditionParameter: "moisture",
          operator: "<",
          value: 30,
          actionTarget: "pumpStatus",
          actionValue: "ON"
        },
        {
          ruleName: "Alert when Tank Level < 15%",
          conditionParameter: "waterLevel",
          operator: "<",
          value: 15,
          actionTarget: "buzzerStatus",
          actionValue: "ON"
        }
      ];
      await AutomationRule.insertMany(defaultRules);
      console.log('[SYSTEM] Seeded default automation rules into MongoDB.');
    }
  } catch (err) {
    console.error('[SYSTEM] Error seeding automation rules:', err.message);
  }
};

// Helper: JWT auth middleware
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'Access denied. Authorization token missing.' });
  
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// WebSocket connection handler
wss.on('connection', async (ws) => {
  console.log('[WS] Client connected');
  
  try {
    const { mongoose } = require('./database');
    if (mongoose.connection.readyState !== 1) {
      console.log('[WS] Database connection not ready yet. Sending default offline state...');
      ws.send(JSON.stringify({
        type: 'INIT',
        data: {
          latestReading: null,
          activeAlerts: [],
          deviceStates: { pump: 'OFF', fan: 'OFF', light: 'OFF', buzzer: 'OFF', mode: 'Auto' }
        }
      }));
      return;
    }

    const latestReading = await getLatestReading();
    const activeAlerts = await getAlerts('ACTIVE');
    const deviceStates = await getDeviceStates();
    
    ws.send(JSON.stringify({
      type: 'INIT',
      data: {
        latestReading,
        activeAlerts,
        deviceStates
      }
    }));
  } catch (error) {
    console.error('[WS] Error fetching init data:', error.message);
  }

  ws.on('close', () => {
    console.log('[WS] Client disconnected');
  });
});

// Helper to broadcast JSON payload to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// --- ALERT EVALUATION RULES ENGINE ---
const processAlertRules = async (reading) => {
  const { temperature, moisture, waterLevel } = reading;
  const alertChanges = [];

  // Default thresholds
  let tempLimit = 35.0;
  let moistureLimit = 30;
  let waterLimit = 15;

  // Retrieve customized limits from MongoDB Automation Rules if configured
  try {
    const rules = await getRules();
    const tempRule = rules.find(r => r.conditionParameter === 'temperature' && r.isEnabled);
    const moistRule = rules.find(r => r.conditionParameter === 'moisture' && r.isEnabled);
    const waterRule = rules.find(r => r.conditionParameter === 'waterLevel' && r.isEnabled);

    if (tempRule) tempLimit = tempRule.value;
    if (moistRule) moistureLimit = moistRule.value;
    if (waterRule) waterLimit = waterRule.value;
  } catch (e) {
    console.warn('[RULES ENGINE] Could not load MongoDB thresholds, using defaults.');
  }

  const HYSTERESIS_TEMP = 2.0;
  const HYSTERESIS_MOISTURE = 5;
  const HYSTERESIS_WATER = 5;

  // 1. Temperature Warning
  if (temperature > tempLimit) {
    if (!activeAlertsCache['HIGH_TEMP']) {
      const msg = `Critical temperature of ${temperature.toFixed(1)}°C exceeded threshold (${tempLimit}°C).`;
      const alert = await saveAlert('HIGH_TEMP', msg);
      activeAlertsCache['HIGH_TEMP'] = { id: alert.id, message: msg };
      alertChanges.push({ type: 'HIGH_TEMP', action: 'RAISED', alert });
    }
  } else if (temperature <= (tempLimit - HYSTERESIS_TEMP)) {
    if (activeAlertsCache['HIGH_TEMP']) {
      const cacheAlert = activeAlertsCache['HIGH_TEMP'];
      await updateAlertStatus(cacheAlert.id, 'RESOLVED');
      delete activeAlertsCache['HIGH_TEMP'];
      alertChanges.push({ type: 'HIGH_TEMP', action: 'RESOLVED', id: cacheAlert.id });
    }
  }

  // 2. Soil Moisture Warning
  if (moisture < moistureLimit) {
    if (!activeAlertsCache['LOW_MOISTURE']) {
      const msg = `Soil moisture levels critically low at ${moisture}%. Minimum recommended limit is ${moistureLimit}%.`;
      const alert = await saveAlert('LOW_MOISTURE', msg);
      activeAlertsCache['LOW_MOISTURE'] = { id: alert.id, message: msg };
      alertChanges.push({ type: 'LOW_MOISTURE', action: 'RAISED', alert });
    }
  } else if (moisture >= (moistureLimit + HYSTERESIS_MOISTURE)) {
    if (activeAlertsCache['LOW_MOISTURE']) {
      const cacheAlert = activeAlertsCache['LOW_MOISTURE'];
      await updateAlertStatus(cacheAlert.id, 'RESOLVED');
      delete activeAlertsCache['LOW_MOISTURE'];
      alertChanges.push({ type: 'LOW_MOISTURE', action: 'RESOLVED', id: cacheAlert.id });
    }
  }

  // 3. Water Tank Empty Warning
  if (waterLevel < waterLimit) {
    if (!activeAlertsCache['LOW_WATER']) {
      const msg = `Water tank reservoir low at ${waterLevel}%. Refill immediately to protect pump mechanism.`;
      const alert = await saveAlert('LOW_WATER', msg);
      activeAlertsCache['LOW_WATER'] = { id: alert.id, message: msg };
      alertChanges.push({ type: 'LOW_WATER', action: 'RAISED', alert });
    }
  } else if (waterLevel >= (waterLimit + HYSTERESIS_WATER)) {
    if (activeAlertsCache['LOW_WATER']) {
      const cacheAlert = activeAlertsCache['LOW_WATER'];
      await updateAlertStatus(cacheAlert.id, 'RESOLVED');
      delete activeAlertsCache['LOW_WATER'];
      alertChanges.push({ type: 'LOW_WATER', action: 'RESOLVED', id: cacheAlert.id });
    }
  }

  return alertChanges;
};

// --- HTTP API ROUTES ---

// 1. AUTHENTICATION ENDPOINTS (Users Collection)

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  try {
    const { mongoose } = require('./database');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'MongoDB database is currently offline. Registration unavailable.' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered.' });

    const user = new User({ name, email, password, role: role || 'Farmer' });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error during user registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { mongoose } = require('./database');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'MongoDB database is currently offline. Login unavailable.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Server error.' });
  }
});

// 2. SENSOR DATA ENDPOINTS (SensorData Collection)

app.post('/api/sensor/live', async (req, res) => {
  const { temperature, humidity, moisture, light, waterLevel, healthScore, pumpStatus, fanStatus } = req.body;

  if (temperature === undefined || humidity === undefined || moisture === undefined || waterLevel === undefined) {
    return res.status(400).json({ error: 'Missing core telemetry parameters.' });
  }

  try {
    const { mongoose } = require('./database');
    console.log('[TELEMETRY] Connection state check:', mongoose.connection.readyState);
    if (mongoose.connection.readyState !== 1) {
      console.warn('[TELEMETRY] Dropped frame - MongoDB database is currently offline.');
      return res.status(503).json({ error: 'MongoDB database is not connected. Telemetry not saved.' });
    }

    const readingData = {
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      moisture: parseInt(moisture, 10),
      light: parseInt(light || 0, 10),
      waterLevel: parseInt(waterLevel, 10),
      healthScore: parseInt(healthScore || 100, 10),
      pumpStatus: pumpStatus || 'OFF',
      fanStatus: fanStatus || 'OFF'
    };

    const savedReading = await saveReading(readingData);
    const alertChanges = await processAlertRules(savedReading);
    const deviceStates = await getDeviceStates();

    broadcast({ type: 'TELEMETRY', data: savedReading });
    if (alertChanges.length > 0) {
      broadcast({ type: 'ALERTS_UPDATE', data: alertChanges });
    }

    console.log(`[TELEMETRY] Mapped payload: T:${readingData.temperature}C | S:${readingData.moisture}% | W:${readingData.waterLevel}%`);
    return res.status(201).json({ 
      success: true, 
      reading: savedReading, 
      alertsTriggered: alertChanges,
      deviceStates: {
        pump: deviceStates.pump,
        fan: deviceStates.fan,
        light: deviceStates.light,
        buzzer: deviceStates.buzzer,
        mode: deviceStates.mode
      }
    });
  } catch (error) {
    console.error('Error logging telemetry:', error);
    return res.status(500).json({ error: 'Internal server error processing telemetry.' });
  }
});

app.get('/api/sensor/latest', async (req, res) => {
  try {
    const latest = await getLatestReading();
    if (!latest) return res.status(404).json({ message: 'No telemetry records exist yet.' });
    return res.json(latest);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching latest reading.' });
  }
});

app.get('/api/sensor/history', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100;
  try {
    const history = await getRecentReadings(limit);
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching history.' });
  }
});

app.get('/api/sensor/analytics', async (req, res) => {
  try {
    const analytics = await getAnalytics();
    return res.json(analytics);
  } catch (error) {
    return res.status(500).json({ error: 'Error computing analytics.' });
  }
});

// 3. DEVICES ENDPOINTS (Devices Collection)

app.get('/api/devices', async (req, res) => {
  try {
    const states = await getDeviceStates();
    return res.json(states);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve device states.' });
  }
});

app.put('/api/devices', async (req, res) => {
  try {
    const updated = await updateDeviceStates(req.body);
    broadcast({ type: 'DEVICE_STATES_UPDATED', data: updated });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update device states.' });
  }
});

// 4. ALERTS ENDPOINTS (Alerts Collection)

app.get('/api/alerts', async (req, res) => {
  const status = req.query.status || 'ACTIVE';
  try {
    const alerts = await getAlerts(status);
    return res.json(alerts);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving alerts.' });
  }
});

app.put('/api/alerts/:id', async (req, res) => {
  const alertId = req.params.id;
  const { status } = req.body;

  if (!status || !['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid or missing alert status parameter.' });
  }

  try {
    const result = await updateAlertStatus(alertId, status);
    
    if (status === 'RESOLVED' || status === 'ACKNOWLEDGED') {
      const typeToClear = Object.keys(activeAlertsCache).find(
        key => activeAlertsCache[key].id === alertId
      );
      if (typeToClear && status === 'RESOLVED') {
        delete activeAlertsCache[typeToClear];
      }
    }

    broadcast({ type: 'ALERTS_CHANGED', data: { id: alertId, status } });
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update alert.' });
  }
});

app.post('/api/alerts/clear', async (req, res) => {
  try {
    const activeAlerts = await getAlerts('ACTIVE');
    for (const alert of activeAlerts) {
      await updateAlertStatus(alert.id, 'RESOLVED');
    }
    activeAlertsCache = {};
    broadcast({ type: 'ALERTS_CLEARED' });
    return res.json({ success: true, message: 'All active alerts resolved.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to clear alerts.' });
  }
});

// 5. AUTOMATION RULES ENDPOINTS (AutomationRules Collection)

app.get('/api/rules', async (req, res) => {
  try {
    const rules = await getRules();
    return res.json(rules);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve rules.' });
  }
});

app.post('/api/rules', async (req, res) => {
  try {
    const rule = await saveRule(req.body);
    return res.status(201).json(rule);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save automation rule.' });
  }
});

app.put('/api/rules/:id', async (req, res) => {
  try {
    const updated = await updateRule(req.params.id, req.body);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update automation rule.' });
  }
});

// 6. REPORTS ENDPOINTS (Reports Collection)

app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ date: -1 }).limit(30).lean();
    return res.json(reports);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch daily reports.' });
  }
});

app.post('/api/reports/generate', async (req, res) => {
  const { date } = req.body; // YYYY-MM-DD
  if (!date) return res.status(400).json({ error: 'Date is required (YYYY-MM-DD).' });
  try {
    const report = await generateDailyReport(date);
    if (!report) return res.status(404).json({ message: 'No telemetry logged for this date.' });
    return res.json(report);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate report.' });
  }
});

// Start Server and boot up databases
server.listen(port, () => {
  console.log(`[SYSTEM] AgriShield AI Backend listening at http://localhost:${port}`);
  
  const { mongoose } = require('./database');
  
  mongoose.connection.once('open', async () => {
    console.log('[SYSTEM] MongoDB connection established. Initializing database caches & rules...');
    await loadActiveAlerts();
    await seedDefaultRules();
  });
});

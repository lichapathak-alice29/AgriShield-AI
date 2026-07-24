# AgriShield AI Backend

A robust, enterprise-grade Node.js/Express backend API and WebSockets server for the AgriShield AI automated farming system. It collects live telemetry from ESP32/Arduino devices, runs a smart customizable rules engine, stores records in a MongoDB database with schema validation, and broadcasts real-time updates to dashboard clients.

---

## 🚀 Features

- **MongoDB Database Integration:** Schema models using Mongoose mapping to exact collection collections: `users`, `sensorData`, `devices`, `alerts`, `automationRules`, and `reports`.
- **JWT User Authentication:** Registration and Login routes with cryptographically secure passwords hashed using `bcryptjs` and session tokens signed using `jsonwebtoken`.
- **Smart Rules & Alerting Engine:** Fetches user-defined thresholds from the database on startup. Generates active alerts when parameters cross boundaries, implementing hysteresis logic to avoid alert flickering.
- **Dynamic Actuator Control:** Allows dashboard clients to check and override physical actuator statuses (Pump, Fan, Light) and operation modes (Auto/Manual).
- **Daily Reports Generator:** Aggregates and calculates daily averages, pump runtimes, and water consumption logs for historical analytics.
- **Real-Time Data Streaming:** Built-in WebSocket Server (`ws`) automatically broadcasts all live telemetry, device overrides, and alert changes to connected dashboard clients.

---

## ⚙️ Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (v6.0 or higher) running locally on port 27017, or a MongoDB Atlas Cloud Cluster.

---

## 🛠 Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create/edit the `.env` file to customize database connections and default parameters:
   ```env
   PORT=5000

   # MongoDB Database Settings
   MONGODB_URI=mongodb://localhost:27017/agrishield
   JWT_SECRET=agrishield-super-secret-key-change-me

   # Default Alert Thresholds (Seeded into DB rules on first boot)
   TEMP_CRITICAL_HIGH=35.0
   SOIL_CRITICAL_DRY=30
   WATER_TANK_EMPTY_LIMIT=15
   ```

3. Run the development server (auto-reloads on file changes using `nodemon`):
   ```bash
   npm run dev
   ```

---

## 📂 MongoDB Collections Schema

### 1. `users`
Stores user profile information.
- `_id`: ObjectId
- `name`: String
- `email`: String (Unique, Indexed)
- `password`: String (Hashed using bcrypt)
- `role`: String (`Admin` / `Farmer`)
- `createdAt` & `updatedAt`: Date

### 2. `sensorData`
Logs live telemetry frames posted from the ESP32.
- `_id`: ObjectId
- `temperature`: Number (°C)
- `humidity`: Number (%)
- `moisture`: Number (Soil moisture %)
- `light`: Number (Light intensity %)
- `waterLevel`: Number (Water tank level %)
- `healthScore`: Number
- `pumpStatus`: String (`ON` / `OFF`)
- `fanStatus`: String (`ON` / `OFF`)
- `createdAt` & `updatedAt`: Date

### 3. `devices`
Tracks current actuator state variables.
- `_id`: ObjectId
- `pump`: String (`ON` / `OFF`)
- `fan`: String (`ON` / `OFF`)
- `light`: String (`ON` / `OFF`)
- `mode`: String (`Auto` / `Manual`)
- `createdAt` & `updatedAt`: Date

### 4. `alerts`
Logs system warnings and trigger timeline events.
- `_id`: ObjectId
- `type`: String (`HIGH_TEMP`, `LOW_MOISTURE`, `LOW_WATER`)
- `message`: String
- `status`: String (`ACTIVE`, `ACKNOWLEDGED`, `RESOLVED`)
- `createdAt` & `updatedAt`: Date

### 5. `automationRules`
Stores configurable parameter limits used to govern automated triggers.
- `_id`: ObjectId
- `ruleName`: String
- `conditionParameter`: String (`temperature`, `moisture`, `waterLevel`)
- `operator`: String (`>`, `<`, `>=`, `<=`)
- `value`: Number
- `actionTarget`: String (`pumpStatus`, `fanStatus`)
- `actionValue`: String (`ON` / `OFF`)
- `isEnabled`: Boolean
- `createdAt` & `updatedAt`: Date

### 6. `reports`
Aggregated daily averages used to feed dashboard trend charts.
- `_id`: ObjectId
- `date`: String (Format: `YYYY-MM-DD`, Unique Index)
- `avgTemp`: Number
- `avgHumid`: Number
- `avgMoist`: Number
- `avgLight`: Number
- `avgWater`: Number
- `pumpRuntime`: Number (Minutes)
- `waterUsage`: Number (Liters)
- `createdAt` & `updatedAt`: Date

---

## 📡 API Reference

### 🔐 Auth Endpoints
- `POST /api/auth/register` - Create user account (returns JWT).
- `POST /api/auth/login` - Verify user password (returns JWT).
- `GET /api/auth/me` - Get profile of currently logged-in user (requires Bearer Token).

### 📈 Telemetry Endpoints
- `POST /api/sensor/live` - Upload new sensor frame (ESP32 target).
- `GET /api/sensor/latest` - Fetch most recent telemetry snapshot.
- `GET /api/sensor/history` - Fetch recent history logs (limit-able).
- `GET /api/sensor/analytics` - Fetch rolling 24h min/max/average stats.

### 🔌 Device Actuator Endpoints
- `GET /api/devices` - Fetch current pump/fan/light/mode configuration.
- `PUT /api/devices` - Override current actuator states (e.g. toggle Mode from Auto to Manual).

### 🚨 Alert Management Endpoints
- `GET /api/alerts?status=ACTIVE` - Fetch active warning logs.
- `PUT /api/alerts/:id` - Resolve or Acknowledge an alert.
- `POST /api/alerts/clear` - Set all active alerts to RESOLVED status.

### ⚙️ Automation Rule Endpoints
- `GET /api/rules` - List all configured rules.
- `POST /api/rules` - Save a new custom rule condition.
- `PUT /api/rules/:id` - Edit or toggle an existing automation rule.

### 📊 Report Endpoints
- `GET /api/reports` - Get daily average report summaries.
- `POST /api/reports/generate` - Generate daily totals for a specific date string.

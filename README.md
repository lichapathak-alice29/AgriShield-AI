# AgriShield AI — Automated IoT Greenhouse Ecosystem

AgriShield AI is an intelligent, automated IoT farming assistant and greenhouse control system. It integrates physical ESP32-based sensors and relays with a robust Node.js backend, a smart rules engine, real-time WebSocket communication, and a beautiful React/TanStack Start dashboard.

---

## 📂 Project Structure

```bash
Agrishield AI/
├── esp32/             # ESP32 C++ firmware (sensor drivers, OLED displays, automation)
├── backend/           # Node.js Express API, rules engine, WebSockets, and Mongoose schemas
├── frontend/          # React web dashboard (TanStack Router, Recharts, Framer Motion)
└── docker-compose.yml # Unified container orchestrator for production
```

---

## 🛠️ Local Development Setup

To run the complete system locally, follow these steps:

### 1. MongoDB Database
Ensure MongoDB is running locally on port `27017` (default).

### 2. Node.js Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your local environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/agrishield
   JWT_SECRET=your_development_jwt_secret
   ```
4. Start the server (auto-reloads on changes using `nodemon`):
   ```bash
   npm run dev
   ```

### 3. React Frontend Web Application
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:8080`.

### 4. Optional: Local ESP32 Sensor Simulator
If you do not have physical hardware connected, you can run the mock sensor daemon to feed simulated telemetry:
```bash
cd ../backend
node mock-esp32.js
```

---

## 🐳 Production Deployment (Docker Compose)

The application is fully containerized. A single command builds, spins up, and links the backend, frontend, and MongoDB services inside an isolated network.

1. Ensure **Docker** and **Docker Compose** are installed.
2. Build and start the containers from the workspace root:
   ```bash
   docker-compose up --build -d
   ```
3. **Production URL:** 
   - **Frontend App:** Navigate to `http://localhost` (Port 80)
   - **API Server / WebSockets:** Listens on `http://localhost:5000`
4. **Data Persistence:** Database information is saved automatically in a named Docker volume (`mongo-data`).

---

## 📡 ESP32 Hardware Integration

The ESP32 firmware located in the `esp32` folder is set up to read telemetry and perform local automation.

- **Endpoints:**
  - Pushes sensor logs to: `POST /api/sensor/live`
- **Telemetry Frame JSON Schema:**
  ```json
  {
    "temperature": 28.4,
    "humidity": 68,
    "moisture": 42,
    "light": 750,
    "waterLevel": 80
  }
  ```
- **Bidirectional IoT Handshake Response:**
  When the ESP32 uploads its telemetry, the Node.js API server queries the MongoDB database for target configurations and returns them:
  ```json
  {
    "success": true,
    "reading": { ... },
    "alertsTriggered": [ ... ],
    "deviceStates": {
      "pump": "OFF",
      "fan": "OFF",
      "light": "OFF",
      "mode": "Auto"
    }
  }
  ```
- **Dynamic Control Modes:**
  - **Auto Mode:** The ESP32 runs its own local edge automation rules (e.g. temperature-driven venting or low moisture irrigation) to keep the greenhouse safe offline.
  - **Manual Mode:** The ESP32 automatically intercepts user dashboard overrides, temporarily disabling the local edge rules to directly write manual states to the physical high-voltage relays.

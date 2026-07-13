#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <DHT.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// ==========================================
// 1. SYSTEM CONFIGURATION & PIN INITIALIZATION
// ==========================================
// Network Setup
const char* const WIFI_SSID = "YOUR_WIFI_SSID";
const char* const WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* const BACKEND_API_URL = "http://192.168.1.138:5000/api/sensor/live";

// Hardware Pins (Exact Match to Your Layout)
#define DHTPIN 4
#define SOIL_PIN 34
#define LDR_PIN 35
#define WATER_LEVEL_PIN 32
#define PUMP_RELAY_PIN 26
#define FAN_RELAY_PIN 27
#define BUZZER_PIN 25
#define OLED_SDA 21
#define OLED_SCL 22

// Hardware Configurations
#define DHTTYPE DHT22
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// Automation Edge Thresholds
const float TEMP_CRITICAL_HIGH = 35.0; // °C
const int SOIL_CRITICAL_DRY = 30;       // % Moisture
const int WATER_TANK_EMPTY_LIMIT = 15;  // % Level

// Telemetry Schedulers
unsigned long lastLocalUpdate = 0;
unsigned long lastCloudUpload = 0;
const unsigned long POLLING_INTERVAL = 2000;    // 2 Seconds for local screen updates
const unsigned long TRANSMIT_INTERVAL = 15000;  // 15 Seconds for cloud API push

// Object Instances
DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Dynamic Actuator State Cache (IoT Synchronization)
String currentMode = "Auto";
String manualPumpStatus = "OFF";
String manualFanStatus = "OFF";
String manualBuzzerStatus = "OFF";

// ==========================================
// 2. NETWORK & DRIVER SUBSYSTEMS
// ==========================================
void connectToWiFi() {
    Serial.printf("\n[NET] Attempting link to Access Point: %s\n", WIFI_SSID);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    
    int retries = 0;
    while (WiFi.status() != WL_CONNECTED && retries < 20) {
        delay(500);
        Serial.print(".");
        retries++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.printf("\n[NET] Connection Established. Assigned IP: %s\n", WiFi.localIP().toString().c_str());
    } else {
        Serial.println("\n[NET] Wifi Timeout. Running in Offline Local Automation Mode.");
    }
}

void streamTelemetryToBackend(float t, float h, int s, int l, int w, int score, String pStatus, String fStatus) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[NET] Upload aborted: Link down. Attempting background reconnect...");
        WiFi.disconnect();
        WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
        return;
    }

    HTTPClient http;
    http.begin(BACKEND_API_URL);
    http.addHeader("Content-Type", "application/json");

    // Dynamic JSON Serialization Document
    StaticJsonDocument<512> doc;
    doc["temperature"] = t;
    doc["humidity"] = h;
    doc["moisture"] = s;
    doc["light"] = l;
    doc["waterLevel"] = w;
    doc["healthScore"] = score;
    doc["pumpStatus"] = pStatus;
    doc["fanStatus"] = fStatus;

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode == 201 || httpResponseCode == 200) {
        String response = http.getString();
        
        // Parse incoming controls
        StaticJsonDocument<512> responseDoc;
        DeserializationError error = deserializeJson(responseDoc, response);
        
        if (!error && responseDoc.containsKey("deviceStates")) {
            JsonObject controls = responseDoc["deviceStates"];
            currentMode = controls["mode"] | "Auto";
            manualPumpStatus = controls["pump"] | "OFF";
            manualFanStatus = controls["fan"] | "OFF";
            manualBuzzerStatus = controls["buzzer"] | "OFF";
            
            Serial.printf("[IOT] Linked. Mode:%s | Pump:%s | Fan:%s\n", 
                          currentMode.c_str(), manualPumpStatus.c_str(), manualFanStatus.c_str());
        }
    } else {
        Serial.printf("[NET] API Post Failure: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();
}

int calculateEdgeHealthScore(float t, float h, int s, int w) {
    int score = 100;
    if (t > TEMP_CRITICAL_HIGH || t < 15.0) score -= 20;
    if (h > 80.0) score -= 15;
    if (s < SOIL_CRITICAL_DRY) score -= 25;
    if (w < WATER_TANK_EMPTY_LIMIT) score -= 20;
    return constrain(score, 0, 100);
}

void updateOLEDDisplay(float t, float h, int s, int w, String pStatus, String fStatus, int score) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0,0);
    
    display.printf("Temp: %.1fC  Hum: %.1f%%\n", t, h);
    display.printf("Soil: %d%%   Tank: %d%%\n", s, w);
    display.printf("Pump: %s   Fan: %s\n", pStatus.c_str(), fStatus.c_str());
    display.printf("---------------------\n");
    
    display.setTextSize(2);
    display.setCursor(0, 48);
    display.printf("Score: %d", score);
    display.display();
}

// ==========================================
// 3. MAIN APPLICATION SETUP & ENTRY POINT
// ==========================================
void setup() {
    Serial.begin(115200);
    Serial.println("\n====== Booting AgriShield AI Core ======");

    // Sensor Drivers
    dht.begin();
    pinMode(SOIL_PIN, INPUT);
    pinMode(LDR_PIN, INPUT);
    pinMode(WATER_LEVEL_PIN, INPUT);
    
    // Actuator Pins
    pinMode(PUMP_RELAY_PIN, OUTPUT);
    pinMode(FAN_RELAY_PIN, OUTPUT);
    pinMode(BUZZER_PIN, OUTPUT);

    // High Voltage Safety Power Reset (Active Low Relays)
    digitalWrite(PUMP_RELAY_PIN, HIGH);
    digitalWrite(FAN_RELAY_PIN, HIGH);
    digitalWrite(BUZZER_PIN, LOW);

    // Initialize I2C OLED Panel
    Wire.begin(OLED_SDA, OLED_SCL);
    if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println(F("[CRITICAL] OLED Driver Allocation Failed. Halting."));
        for(;;);
    }
    
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0,10);
    display.println("AgriShield Booting...");
    display.display();

    connectToWiFi();
    Serial.println("[SYSTEM] Startup Sequence Confirmed. Active Execution Initiated.");
}

// ==========================================
// 4. CENTRAL RUNTIME AUTOMATION LOOP
// ==========================================
void loop() {
    unsigned long currentClock = millis();

    // 4.1 Sensor Evaluation Arrays
    float currentTemp  = dht.readTemperature();
    float currentHumid = dht.readHumidity();
    
    // Capacitive Moisture Map
    int rawSoil = analogRead(SOIL_PIN);
    int currentSoil = map(rawSoil, 4095, 1200, 0, 100);
    currentSoil = constrain(currentSoil, 0, 100);

    // Light Intensity Map
    int rawLDR = analogRead(LDR_PIN);
    int currentLight = map(rawLDR, 0, 4095, 0, 100);
    currentLight = constrain(currentLight, 0, 100);

    // Submersible Water Tank Level Map
    int rawWater = analogRead(WATER_LEVEL_PIN);
    int currentWater = map(rawWater, 0, 3000, 0, 100);
    currentWater = constrain(currentWater, 0, 100);

    // Guard Check: Skip current loop cycle if core readings drop out
    if (isnan(currentTemp) || isnan(currentHumid)) {
        Serial.println("[ERROR] Check DHT22 physical hardware data connections.");
        delay(1000);
        return;
    }

    // 4.2 Edge Rules Control Matrix
    String statusFan  = "OFF";
    String statusPump = "OFF";

    if (currentMode == "Manual") {
        // Obey user cloud overrides
        statusPump = manualPumpStatus;
        statusFan = manualFanStatus;
        
        digitalWrite(PUMP_RELAY_PIN, statusPump == "ON" ? LOW : HIGH);
        digitalWrite(FAN_RELAY_PIN, statusFan == "ON" ? LOW : HIGH);
        digitalWrite(BUZZER_PIN, manualBuzzerStatus == "ON" ? HIGH : LOW);
    } else {
        // Run edge auto-rule logic
        // Automated Ventilation Control
        if (currentTemp > TEMP_CRITICAL_HIGH) {
            digitalWrite(FAN_RELAY_PIN, LOW); // Relay Active
            statusFan = "ON";
        } else {
            digitalWrite(FAN_RELAY_PIN, HIGH); // Relay Deactivated
        }

        // Automated Irrigation Control
        if (currentSoil < SOIL_CRITICAL_DRY && currentWater > WATER_TANK_EMPTY_LIMIT) {
            digitalWrite(PUMP_RELAY_PIN, LOW); // Relay Active
            statusPump = "ON";
        } else {
            digitalWrite(PUMP_RELAY_PIN, HIGH); // Relay Deactivated
        }

        // Local Audio Alert Loop
        if (currentWater < WATER_TANK_EMPTY_LIMIT) {
            digitalWrite(BUZZER_PIN, HIGH);
        } else {
            digitalWrite(BUZZER_PIN, LOW);
        }
    }

    int currentHealthScore = calculateEdgeHealthScore(currentTemp, currentHumid, currentSoil, currentWater);

    // 4.3 Asynchronous Execution Timers
    // Task 1: Refresh Local HUD Display Panel Elements
    if (currentClock - lastLocalUpdate >= POLLING_INTERVAL) {
        updateOLEDDisplay(currentTemp, currentHumid, currentSoil, currentWater, statusPump, statusFan, currentHealthScore);
        
        // Print clean structural terminal logs
        Serial.printf("[LOG] Mode:%s | T:%.1fC | H:%.1f%% | S:%d%% | W:%d%% | Score:%d\n", 
                      currentMode.c_str(), currentTemp, currentHumid, currentSoil, currentWater, currentHealthScore);
        lastLocalUpdate = currentClock;
    }

    // Task 2: Dispatch Data Payload Packets directly to React/Node.js backend API
    if (currentClock - lastCloudUpload >= TRANSMIT_INTERVAL) {
        streamTelemetryToBackend(currentTemp, currentHumid, currentSoil, currentLight, currentWater, currentHealthScore, statusPump, statusFan);
        lastCloudUpload = currentClock;
    }
}
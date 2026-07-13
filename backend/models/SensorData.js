const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  temperature: { 
    type: Number, 
    required: true 
  },
  humidity: { 
    type: Number, 
    required: true 
  },
  moisture: { 
    type: Number, 
    required: true 
  }, // Soil Moisture %
  light: { 
    type: Number, 
    required: true 
  }, // Light Intensity %
  waterLevel: { 
    type: Number, 
    required: true 
  }, // Water Level %
  healthScore: { 
    type: Number, 
    default: 100 
  },
  pumpStatus: {
    type: String,
    enum: ['ON', 'OFF'],
    default: 'OFF'
  },
  fanStatus: {
    type: String,
    enum: ['ON', 'OFF'],
    default: 'OFF'
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('SensorData', sensorDataSchema, 'sensorData');

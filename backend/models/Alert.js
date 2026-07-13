const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true // e.g. 'HIGH_TEMP', 'LOW_MOISTURE', 'LOW_WATER'
  },
  message: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'], 
    default: 'ACTIVE' 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Alert', alertSchema, 'alerts');

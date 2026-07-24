const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  pump: { 
    type: String, 
    enum: ['ON', 'OFF'], 
    default: 'OFF' 
  },
  fan: { 
    type: String, 
    enum: ['ON', 'OFF'], 
    default: 'OFF' 
  },
  light: { 
    type: String, 
    enum: ['ON', 'OFF'], 
    default: 'OFF' 
  },

  mode: { 
    type: String, 
    enum: ['Auto', 'Manual'], 
    default: 'Auto' 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Device', deviceSchema, 'devices');

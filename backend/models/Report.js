const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  date: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true // Format: YYYY-MM-DD
  },
  avgTemp: { 
    type: Number, 
    default: 0 
  },
  avgHumid: { 
    type: Number, 
    default: 0 
  },
  avgMoist: { 
    type: Number, 
    default: 0 
  },
  avgLight: { 
    type: Number, 
    default: 0 
  },
  avgWater: { 
    type: Number, 
    default: 0 
  },
  pumpRuntime: { 
    type: Number, 
    default: 0 // in minutes
  },
  waterUsage: { 
    type: Number, 
    default: 0 // in Liters
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Report', reportSchema, 'reports');

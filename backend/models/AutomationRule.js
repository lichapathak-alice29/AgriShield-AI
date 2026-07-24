const mongoose = require('mongoose');

const automationRuleSchema = new mongoose.Schema({
  ruleName: { 
    type: String, 
    required: true 
  },
  conditionParameter: { 
    type: String, 
    required: true // e.g. 'temperature', 'moisture', 'waterLevel'
  },
  operator: { 
    type: String, 
    enum: ['>', '<', '>=', '<='], 
    required: true 
  },
  value: { 
    type: Number, 
    required: true 
  },
  actionTarget: { 
    type: String, 
    required: true // e.g. 'pumpStatus', 'fanStatus'
  },
  actionValue: { 
    type: String, 
    enum: ['ON', 'OFF'], 
    required: true 
  },
  isEnabled: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('AutomationRule', automationRuleSchema, 'automationRules');

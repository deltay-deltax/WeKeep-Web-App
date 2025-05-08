const mongoose = require('mongoose');

const ServiceHistorySchema = new mongoose.Schema({
  modelNumber: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ServiceHistory', ServiceHistorySchema);

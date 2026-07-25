const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  generated_kwh: { type: Number, required: true },
  used_kwh: { type: Number, required: true },
  exported_kwh: { type: Number, required: true },
  battery_charged: { type: Number, default: 0 },
  weather: { type: String, default: 'Sunny' }
}, { timestamps: true });

module.exports = mongoose.model('Generation', generationSchema);

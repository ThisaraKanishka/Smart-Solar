const mongoose = require('mongoose');

const hourlyGenerationSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  hour: { type: String, required: true }, // e.g. "06:00", "07:00", ...
  generation_kwh: { type: Number, required: true, default: 0 },
  consumption_kwh: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('HourlyGeneration', hourlyGenerationSchema);

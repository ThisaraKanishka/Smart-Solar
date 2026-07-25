const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, unique: true },
  panel_status: { type: String, required: true },
  battery_status: { type: String, required: true },
  inverter_status: { type: String, required: true },
  last_service: { type: String, required: true },
  next_service: { type: String, required: true },
  cleaning_schedule: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);

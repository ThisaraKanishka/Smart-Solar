const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  package_id: { type: Number, required: true, unique: true },
  package_name: { type: String, required: true },
  scheme_type: { type: String, required: true, default: 'Net Accounting' },
  capacity_kw: { type: Number, required: true },
  price: { type: Number, required: true },
  rate_per_kwh: { type: Number, required: true },
  battery: { type: String, required: true },
  warranty: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);

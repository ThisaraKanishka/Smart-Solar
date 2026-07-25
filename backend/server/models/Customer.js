const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  package_id: { type: Number, required: true },
  installation_date: { type: String, required: true },
  status: { type: String, default: 'Active' },
  panel_capacity: { type: Number, required: true },
  battery_capacity: { type: Number, required: true },
  role: { type: String, default: 'customer' }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);

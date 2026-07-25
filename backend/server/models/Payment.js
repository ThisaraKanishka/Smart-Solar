const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, index: true },
  month: { type: String, required: true },
  generated_units: { type: Number, required: true },
  consumed_units: { type: Number, required: true },
  exported_units: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
  payment_status: { type: String, required: true },
  payment_date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

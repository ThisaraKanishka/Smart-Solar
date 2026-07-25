const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'unread' },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

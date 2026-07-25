const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Generation = require('../models/Generation');
const { authenticateToken } = require('../middleware/auth');

// GET /api/reports/monthly
router.get('/monthly', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { year } = req.query;

    const payments = await Payment.find({ customer_id: customerId }).sort({ _id: 1 });
    const generation = await Generation.find({ customer_id: customerId })
      .sort({ date: -1 })
      .limit(30);

    res.json({
      year: year || '2026',
      payments,
      generation
    });
  } catch (err) {
    console.error('Monthly report error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/reports/monthly
router.get('/monthly', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { year } = req.query;

    const payments = await db.query(
      `SELECT * FROM Payments WHERE customer_id = ? ORDER BY payment_id ASC`,
      [customerId]
    );

    const generation = await db.query(
      `SELECT date, generated_kwh, used_kwh, exported_kwh, weather 
       FROM Generation 
       WHERE customer_id = ? 
       ORDER BY date DESC LIMIT 30`,
      [customerId]
    );

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

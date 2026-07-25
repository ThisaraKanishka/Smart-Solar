const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/packages
router.get('/', async (req, res) => {
  try {
    const packages = await db.query(`SELECT * FROM Packages ORDER BY capacity_kw ASC`);
    res.json({ packages });
  } catch (err) {
    console.error('Packages error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

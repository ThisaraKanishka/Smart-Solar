const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// GET /api/packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find({}).sort({ capacity_kw: 1 });
    res.json({ packages });
  } catch (err) {
    console.error('Packages error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

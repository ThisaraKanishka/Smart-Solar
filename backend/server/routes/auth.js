const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Package = require('../models/Package');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await Customer.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const pkg = await Package.findOne({ package_id: user.package_id });

    const token = jwt.sign(
      {
        customer_id: user.customer_id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userPayload = user.toObject();
    delete userPayload.password;
    if (pkg) {
      userPayload.package_name = pkg.package_name;
      userPayload.rate_per_kwh = pkg.rate_per_kwh;
    }

    res.json({
      message: 'Login successful',
      token,
      user: userPayload
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await Customer.findOne({ customer_id: req.user.customer_id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pkg = await Package.findOne({ package_id: user.package_id });

    const userPayload = user.toObject();
    delete userPayload.password;
    if (pkg) {
      userPayload.package_name = pkg.package_name;
      userPayload.rate_per_kwh = pkg.rate_per_kwh;
      userPayload.pkg_capacity = pkg.capacity_kw;
    }

    res.json({ user: userPayload });
  } catch (err) {
    console.error('Me endpoint error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

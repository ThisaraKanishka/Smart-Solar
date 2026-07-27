const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Package = require('../models/Package');
const Maintenance = require('../models/Maintenance');
const Notification = require('../models/Notification');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

// POST /api/auth/register - Create / Register New Customer via Postman
router.post('/register', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      address,
      package_id,
      panel_capacity,
      battery_capacity
    } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'first_name, last_name, email, and password are required' });
    }

    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Auto-generate customer_id (e.g., CUST-1002, CUST-1003...)
    const count = await Customer.countDocuments({ role: 'customer' });
    const customer_id = `CUST-${1000 + count + 1}`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const selectedPkgId = Number(package_id) || 2;
    const pkg = await Package.findOne({ package_id: selectedPkgId });

    const newCustomer = await Customer.create({
      customer_id,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone: phone || '+94 77 000 0000',
      address: address || 'Colombo, Sri Lanka',
      package_id: selectedPkgId,
      installation_date: new Date().toISOString().split('T')[0],
      status: 'Active',
      panel_capacity: Number(panel_capacity) || pkg?.capacity_kw || 5.0,
      battery_capacity: Number(battery_capacity) || 5.0,
      role: 'customer'
    });

    // Create default Maintenance record
    await Maintenance.create({
      customer_id,
      panel_status: 'Optimal - 99.0% Efficiency',
      battery_status: 'Healthy - 100% Capacity',
      inverter_status: 'Active - 99.5% Efficiency',
      last_service: new Date().toISOString().split('T')[0],
      next_service: '2026-12-01',
      cleaning_schedule: 'Recommended in 30 Days'
    });

    // Create welcome Notification
    await Notification.create({
      customer_id,
      title: 'Welcome to Smart Solar!',
      message: `Your solar account ${customer_id} has been registered successfully.`,
      status: 'unread'
    });

    const userPayload = newCustomer.toObject();
    delete userPayload.password;

    res.status(201).json({
      message: 'Customer registered successfully in MongoDB Atlas',
      customer: userPayload
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register customer: ' + err.message });
  }
});

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

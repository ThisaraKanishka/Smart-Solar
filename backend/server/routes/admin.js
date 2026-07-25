const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Package = require('../models/Package');
const Generation = require('../models/Generation');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments({ role: 'customer' });
    
    const customers = await Customer.find({ role: 'customer' });
    let totalCap = 0;
    customers.forEach(c => { totalCap += c.panel_capacity; });

    const generations = await Generation.find({});
    let totalGen = 0;
    let totalExport = 0;
    generations.forEach(g => {
      totalGen += g.generated_kwh;
      totalExport += g.exported_kwh;
    });

    const payments = await Payment.find({ payment_status: 'Paid' });
    let totalPayouts = 0;
    payments.forEach(p => { totalPayouts += p.amount; });

    const totalCapacityMw = Number((totalCap / 1000).toFixed(2));
    const totalGenerationMwh = Number((totalGen / 1000).toFixed(1));
    const totalExportMwh = Number((totalExport / 1000).toFixed(1));

    const packages = await Package.find({});
    const packageDist = [];

    for (const pkg of packages) {
      const count = await Customer.countDocuments({ package_id: pkg.package_id, role: 'customer' });
      packageDist.push({
        package_name: pkg.package_name,
        customer_count: count
      });
    }

    res.json({
      kpis: {
        totalCustomers,
        totalCapacityMw,
        totalGenerationMwh,
        totalExportMwh,
        totalPayouts: Number(totalPayouts.toFixed(2))
      },
      packageDistribution: packageDist
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/customers
router.get('/customers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { search, package_id, status } = req.query;
    const filter = { role: 'customer' };

    if (search) {
      filter.$or = [
        { first_name: new RegExp(search, 'i') },
        { last_name: new RegExp(search, 'i') },
        { customer_id: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    if (package_id) {
      filter.package_id = Number(package_id);
    }

    if (status) {
      filter.status = status;
    }

    const customers = await Customer.find(filter).sort({ customer_id: -1 }).lean();
    const packages = await Package.find({}).lean();

    const pkgMap = {};
    packages.forEach(p => { pkgMap[p.package_id] = p; });

    const result = customers.map(c => {
      delete c.password;
      const pkg = pkgMap[c.package_id];
      return {
        ...c,
        package_name: pkg?.package_name || 'Standard',
        rate_per_kwh: pkg?.rate_per_kwh || 48.00
      };
    });

    res.json({ customers: result });
  } catch (err) {
    console.error('Admin customers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/generation
router.post('/generation', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { customer_id, date, generated_kwh, used_kwh, exported_kwh, battery_charged, weather } = req.body;

    await Generation.create({
      customer_id,
      date,
      generated_kwh,
      used_kwh,
      exported_kwh,
      battery_charged: battery_charged || 0,
      weather: weather || 'Sunny'
    });

    res.json({ message: 'Generation record saved successfully' });
  } catch (err) {
    console.error('Admin add generation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/notifications/broadcast
router.post('/notifications/broadcast', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, message, target_customer_id } = req.body;

    if (target_customer_id && target_customer_id !== 'ALL') {
      await Notification.create({
        customer_id: target_customer_id,
        title,
        message,
        status: 'unread'
      });
    } else {
      const customers = await Customer.find({ role: 'customer' });
      const docs = customers.map(c => ({
        customer_id: c.customer_id,
        title,
        message,
        status: 'unread'
      }));
      await Notification.insertMany(docs);
    }

    res.json({ message: 'Notifications broadcast successfully' });
  } catch (err) {
    console.error('Broadcast error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

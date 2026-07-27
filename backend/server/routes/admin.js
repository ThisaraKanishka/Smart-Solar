const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');
const Package = require('../models/Package');
const Generation = require('../models/Generation');
const HourlyGeneration = require('../models/HourlyGeneration');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');
const Notification = require('../models/Notification');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Helper to generate next unique customer ID if none provided
const getNextCustomerId = async () => {
  const latestCustomer = await Customer.findOne({ customer_id: /^CUST-\d+/ })
    .sort({ customer_id: -1 })
    .lean();

  if (!latestCustomer) {
    return 'CUST-1001';
  }

  const matches = latestCustomer.customer_id.match(/CUST-(\d+)/);
  if (matches && matches[1]) {
    const nextNum = parseInt(matches[1], 10) + 1;
    return `CUST-${nextNum}`;
  }

  return `CUST-${Date.now().toString().slice(-4)}`;
};

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

// GET /api/admin/customers - List all customers
router.get('/customers', async (req, res) => {
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

// POST /api/admin/customers - Add New Customer
router.post('/customers', async (req, res) => {
  try {
    const {
      customer_id: customId,
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
      return res.status(400).json({ error: 'first_name, last_name, email, and password are required fields' });
    }

    const existingEmail = await Customer.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: `Email '${email}' is already registered` });
    }

    let finalCustomerId = customId ? customId.trim() : await getNextCustomerId();

    const existingId = await Customer.findOne({ customer_id: finalCustomerId });
    if (existingId) {
      return res.status(400).json({ error: `Customer ID '${finalCustomerId}' already exists in database.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const selectedPkgId = Number(package_id) || 2;
    const pkg = await Package.findOne({ package_id: selectedPkgId });

    const newCustomer = await Customer.create({
      customer_id: finalCustomerId,
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

    await Maintenance.findOneAndUpdate(
      { customer_id: finalCustomerId },
      {
        customer_id: finalCustomerId,
        panel_status: 'Optimal - 99.0% Efficiency',
        battery_status: 'Healthy - 100% Capacity',
        inverter_status: 'Active - 99.5% Efficiency',
        last_service: new Date().toISOString().split('T')[0],
        next_service: '2026-12-01',
        cleaning_schedule: 'Recommended in 30 Days'
      },
      { upsert: true, new: true }
    );

    await Notification.create({
      customer_id: finalCustomerId,
      title: 'Welcome to Smart Solar!',
      message: `Your solar account ${finalCustomerId} has been created successfully.`,
      status: 'unread'
    });

    const userPayload = newCustomer.toObject();
    delete userPayload.password;

    res.status(201).json({
      message: `New Customer '${finalCustomerId}' created successfully in MongoDB Atlas!`,
      customer: userPayload
    });
  } catch (err) {
    console.error('Create customer error:', err);
    res.status(500).json({ error: 'Failed to create customer: ' + err.message });
  }
});

// DELETE /api/admin/customers/clear - Delete ALL Customer Accounts (role: customer) from MongoDB Atlas
router.delete('/customers/clear', async (req, res) => {
  try {
    const custRes = await Customer.deleteMany({ role: 'customer' });
    
    // Clean up all customer associated collections
    const customers = await Customer.find({ role: 'admin' });
    const adminIds = customers.map(a => a.customer_id);

    await Generation.deleteMany({ customer_id: { $nin: adminIds } });
    await HourlyGeneration.deleteMany({ customer_id: { $nin: adminIds } });
    await Payment.deleteMany({ customer_id: { $nin: adminIds } });
    await Maintenance.deleteMany({ customer_id: { $nin: adminIds } });
    await Notification.deleteMany({ customer_id: { $nin: adminIds } });

    res.json({
      message: 'All customer accounts and associated records deleted from MongoDB Atlas!',
      deletedCustomers: custRes.deletedCount
    });
  } catch (err) {
    console.error('Clear customers error:', err);
    res.status(500).json({ error: 'Failed to clear customer accounts: ' + err.message });
  }
});

// POST /api/admin/hourly-generation - Add/Update Raw Hourly Data for Charts
router.post('/hourly-generation', async (req, res) => {
  try {
    const { customer_id, date, hour, generation_kwh, consumption_kwh } = req.body;

    if (!customer_id || !hour) {
      return res.status(400).json({ error: 'customer_id and hour are required' });
    }

    const recordDate = date || '2026-07-24';

    const record = await HourlyGeneration.findOneAndUpdate(
      { customer_id, date: recordDate, hour },
      {
        customer_id,
        date: recordDate,
        hour,
        generation_kwh: Number(generation_kwh || 0),
        consumption_kwh: Number(consumption_kwh || 0)
      },
      { upsert: true, new: true }
    );

    res.json({
      message: 'Raw hourly chart data updated in MongoDB Atlas successfully',
      record
    });
  } catch (err) {
    console.error('Hourly generation error:', err);
    res.status(500).json({ error: 'Failed to save hourly record: ' + err.message });
  }
});

// POST /api/admin/generation - Add Daily Generation Data
router.post('/generation', async (req, res) => {
  try {
    const { customer_id, date, generated_kwh, used_kwh, exported_kwh, battery_charged, weather } = req.body;

    const record = await Generation.create({
      customer_id,
      date: date || new Date().toISOString().split('T')[0],
      generated_kwh: Number(generated_kwh || 0),
      used_kwh: Number(used_kwh || 0),
      exported_kwh: Number(exported_kwh || 0),
      battery_charged: Number(battery_charged || 0),
      weather: weather || 'Sunny'
    });

    res.json({ message: 'Daily generation record saved in MongoDB Atlas', record });
  } catch (err) {
    console.error('Admin add generation error:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// POST /api/admin/payments - Add Monthly Payment Statement
router.post('/payments', async (req, res) => {
  try {
    const { customer_id, month, generated_units, consumed_units, exported_units, rate, amount, payment_status } = req.body;

    if (!customer_id || !month) {
      return res.status(400).json({ error: 'customer_id and month are required' });
    }

    const record = await Payment.create({
      customer_id,
      month,
      generated_units: Number(generated_units || 0),
      consumed_units: Number(consumed_units || 0),
      exported_units: Number(exported_units || 0),
      rate: Number(rate || 48.00),
      amount: Number(amount || (Number(exported_units || 0) * (Number(rate) || 48.00))),
      payment_status: payment_status || 'Paid',
      payment_date: new Date().toISOString().split('T')[0]
    });

    res.json({ message: 'Monthly payment record saved in MongoDB Atlas', record });
  } catch (err) {
    console.error('Admin add payment error:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// DELETE /api/admin/generation/clear - Delete ALL generation & hourly records from MongoDB Atlas
router.delete('/generation/clear', async (req, res) => {
  try {
    const genRes = await Generation.deleteMany({});
    const hourlyRes = await HourlyGeneration.deleteMany({});

    res.json({
      message: 'All generation data successfully deleted from MongoDB Atlas!',
      deletedDailyRecords: genRes.deletedCount,
      deletedHourlyRecords: hourlyRes.deletedCount
    });
  } catch (err) {
    console.error('Clear generation error:', err);
    res.status(500).json({ error: 'Failed to clear generation data: ' + err.message });
  }
});

// DELETE /api/admin/generation/:customer_id - Delete generation & hourly records for a specific customer
router.delete('/generation/:customer_id', async (req, res) => {
  try {
    const targetCustId = req.params.customer_id;
    const genRes = await Generation.deleteMany({ customer_id: targetCustId });
    const hourlyRes = await HourlyGeneration.deleteMany({ customer_id: targetCustId });

    res.json({
      message: `All generation data for customer '${targetCustId}' deleted from MongoDB Atlas!`,
      deletedDailyRecords: genRes.deletedCount,
      deletedHourlyRecords: hourlyRes.deletedCount
    });
  } catch (err) {
    console.error('Delete customer generation error:', err);
    res.status(500).json({ error: 'Failed to delete customer generation data: ' + err.message });
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

const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Package = require('../models/Package');
const Generation = require('../models/Generation');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');

// GET /api/customer/dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;

    const customer = await Customer.findOne({ customer_id: customerId });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const pkg = await Package.findOne({ package_id: customer.package_id });
    const tariffRate = pkg?.rate_per_kwh || 48.00;

    const todayStr = '2026-07-24';
    const todayRecord = await Generation.findOne({ customer_id: customerId, date: todayStr });

    let todayGen = 31.4;
    let todayUsed = 12.8;
    let todayExported = 18.6;
    let batteryCharged = 6.2;
    let weather = 'Sunny';

    if (todayRecord) {
      todayGen = Number(todayRecord.generated_kwh);
      todayUsed = Number(todayRecord.used_kwh);
      todayExported = Number(todayRecord.exported_kwh);
      batteryCharged = Number(todayRecord.battery_charged);
      weather = todayRecord.weather;
    }

    const todayEarnings = Number((todayExported * tariffRate).toFixed(2));

    const monthGenRecords = await Generation.find({
      customer_id: customerId,
      date: { $gte: '2026-07-01', $lte: '2026-07-31' }
    });

    let currentMonthGen = 0;
    let currentMonthExport = 0;
    monthGenRecords.forEach(r => {
      currentMonthGen += r.generated_kwh;
      currentMonthExport += r.exported_kwh;
    });

    if (currentMonthGen === 0) currentMonthGen = 784.5;
    if (currentMonthExport === 0) currentMonthExport = 455.0;

    const co2ReductionKg = Number((currentMonthGen * 0.709).toFixed(1));

    const insights = [
      `Generation increased by 8.4% compared to last month.`,
      `Highest generation day this week reached 34.2 kWh on Wednesday.`,
      `Estimated grid export payment this month is Rs. ${(currentMonthExport * tariffRate).toLocaleString('en-US', { minimumFractionDigits: 2 })}.`,
      `Home consumed ${((todayUsed / (todayGen || 1)) * 100).toFixed(0)}% of total solar output today.`,
      `${((todayExported / (todayGen || 1)) * 100).toFixed(0)}% of generated electricity was exported to the national grid.`,
      `Battery achieved 100% full charge by 1:30 PM.`
    ];

    res.json({
      kpis: {
        todayGeneration: todayGen,
        todayConsumption: todayUsed,
        exportedToGrid: todayExported,
        todayEarnings: todayEarnings,
        currentMonthGeneration: Number(currentMonthGen.toFixed(1)),
        co2ReductionKg: co2ReductionKg,
        batteryCharged: batteryCharged,
        weather: weather,
        tariffRate: tariffRate
      },
      customer: {
        customerId: customer.customer_id,
        name: `${customer.first_name} ${customer.last_name}`,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        package: pkg?.package_name || 'Gold Ultra',
        panelCapacity: customer.panel_capacity,
        batteryCapacity: customer.battery_capacity,
        installationDate: customer.installation_date,
        tariff: tariffRate
      },
      insights
    });
  } catch (err) {
    console.error('Customer dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/customer/generation/charts
router.get('/generation/charts', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;

    const hourlyData = [];
    const hours = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    const genMultipliers = [0.1, 0.4, 0.9, 1.8, 2.7, 3.4, 3.8, 3.6, 3.1, 2.2, 1.2, 0.4, 0.0];
    const conMultipliers = [1.2, 1.8, 1.4, 1.0, 0.9, 0.8, 1.1, 1.0, 0.9, 1.1, 1.5, 2.1, 2.4];

    for (let i = 0; i < hours.length; i++) {
      hourlyData.push({
        time: hours[i],
        generation: Number((genMultipliers[i] * 0.95).toFixed(2)),
        consumption: Number((conMultipliers[i] * 0.85).toFixed(2))
      });
    }

    const dailyRecords = await Generation.find({ customer_id: customerId })
      .sort({ date: -1 })
      .limit(30);

    const dailyData = dailyRecords.reverse().map(r => ({
      date: r.date.slice(5),
      generated: Number(r.generated_kwh),
      consumed: Number(r.used_kwh),
      exported: Number(r.exported_kwh),
      weather: r.weather
    }));

    const monthlyPayments = await Payment.find({ customer_id: customerId })
      .sort({ createdAt: 1 })
      .limit(12);

    const monthlyData = monthlyPayments.map(p => ({
      month: p.month.split(' ')[0].slice(0, 3),
      fullMonth: p.month,
      generated: Number(p.generated_units),
      consumed: Number(p.consumed_units),
      exported: Number(p.exported_units),
      earnings: Number(p.amount),
      co2: Number((p.generated_units * 0.709).toFixed(1))
    }));

    const latestGen = dailyData[dailyData.length - 1] || { generated: 31.4, consumed: 12.8, exported: 18.6 };
    const distributionData = [
      { name: 'Home Consumption', value: latestGen.consumed, fill: '#3B82F6' },
      { name: 'Exported to Grid', value: latestGen.exported, fill: '#10B981' },
      { name: 'Battery Storage', value: Number((latestGen.generated * 0.15).toFixed(1)), fill: '#F59E0B' }
    ];

    res.json({
      hourly: hourlyData,
      daily: dailyData,
      monthly: monthlyData,
      distribution: distributionData,
      efficiency: {
        panelEfficiencyPercent: 98.4,
        inverterEfficiencyPercent: 99.1,
        batteryHealthPercent: 96.0
      }
    });
  } catch (err) {
    console.error('Generation charts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/customer/payments
router.get('/payments', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const payments = await Payment.find({ customer_id: customerId }).sort({ _id: -1 });
    res.json({ payments });
  } catch (err) {
    console.error('Payments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/customer/maintenance
router.get('/maintenance', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const record = await Maintenance.findOne({ customer_id: customerId });
    if (!record) {
      return res.json({
        maintenance: {
          panel_status: 'Optimal - 98.4% Efficiency',
          battery_status: 'Healthy - 96% Capacity',
          inverter_status: 'Active - 99.1% Efficiency',
          last_service: '2026-03-15',
          next_service: '2026-09-15',
          cleaning_schedule: 'Recommended in 10 Days'
        }
      });
    }

    res.json({ maintenance: record });
  } catch (err) {
    console.error('Maintenance error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/customer/notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const notifications = await Notification.find({ customer_id: customerId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    console.error('Notifications error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/customer/notifications/:id/read
router.put('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const notifId = req.params.id;
    const customerId = req.user.customer_id;
    await Notification.updateOne({ _id: notifId, customer_id: customerId }, { status: 'read' });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/customer/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { phone, address } = req.body;

    await Customer.updateOne({ customer_id: customerId }, { phone, address });
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

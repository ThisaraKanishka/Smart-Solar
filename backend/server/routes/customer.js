const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Package = require('../models/Package');
const Generation = require('../models/Generation');
const HourlyGeneration = require('../models/HourlyGeneration');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');

// Helper for case-insensitive customer_id query filter
const getCustIdFilter = (id) => new RegExp(`^${id}$`, 'i');

// GET /api/customer/dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const custFilter = getCustIdFilter(customerId);

    const customer = await Customer.findOne({ customer_id: custFilter });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const pkg = await Package.findOne({ package_id: customer.package_id });
    const tariffRate = pkg?.rate_per_kwh || 48.00;

    const todayStr = new Date().toISOString().split('T')[0];
    let todayRecord = await Generation.findOne({ customer_id: custFilter, date: todayStr });

    if (!todayRecord) {
      todayRecord = await Generation.findOne({ customer_id: custFilter }).sort({ date: -1 });
    }

    // Fallback: If no daily record, calculate today's totals from hourly records
    let todayGen = todayRecord ? Number(todayRecord.generated_kwh) : 0;
    let todayUsed = todayRecord ? Number(todayRecord.used_kwh) : 0;
    let todayExported = todayRecord ? Number(todayRecord.exported_kwh) : 0;
    let batteryCharged = todayRecord ? Number(todayRecord.battery_charged) : 0;
    let weather = todayRecord ? todayRecord.weather : 'Clear';

    if (!todayRecord) {
      const todayHourly = await HourlyGeneration.find({ customer_id: custFilter });
      todayHourly.forEach(h => {
        todayGen += Number(h.generation_kwh || 0);
        todayUsed += Number(h.consumption_kwh || 0);
      });
      todayExported = Math.max(0, todayGen - todayUsed);
      batteryCharged = Number((todayGen * 0.15).toFixed(1));
    }

    const todayEarnings = Number((todayExported * tariffRate).toFixed(2));

    const monthGenRecords = await Generation.find({ customer_id: custFilter });
    let currentMonthGen = 0;
    let currentMonthExport = 0;

    monthGenRecords.forEach(r => {
      currentMonthGen += Number(r.generated_kwh || 0);
      currentMonthExport += Number(r.exported_kwh || 0);
    });

    if (currentMonthGen === 0) {
      currentMonthGen = todayGen;
      currentMonthExport = todayExported;
    }

    const co2ReductionKg = Number((currentMonthGen * 0.709).toFixed(1));

    const insights = [
      currentMonthGen > 0 
        ? `Total solar generation logged in database is ${currentMonthGen.toFixed(1)} kWh.`
        : `No generation data currently recorded in database for account ${customerId}.`,
      todayGen > 0 
        ? `Latest solar generation logged: ${todayGen.toFixed(1)} kWh.`
        : `Awaiting daily generation logs.`,
      `Export tariff rate under ${pkg?.scheme_type || 'Net Scheme'} is Rs. ${tariffRate.toFixed(2)}/kWh.`
    ];

    res.json({
      kpis: {
        todayGeneration: Number(todayGen.toFixed(1)),
        todayConsumption: Number(todayUsed.toFixed(1)),
        exportedToGrid: Number(todayExported.toFixed(1)),
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
        package: pkg?.package_name || 'Standard Package',
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

// GET /api/customer/generation/charts - Smart Multi-Source Auto-Aggregation for All 8 Charts
router.get('/generation/charts', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const custFilter = getCustIdFilter(customerId);

    const customer = await Customer.findOne({ customer_id: custFilter });
    const pkg = customer ? await Package.findOne({ package_id: customer.package_id }) : null;
    const tariffRate = pkg?.rate_per_kwh || 48.00;

    // 1. Raw Hourly Records from MongoDB Atlas (Case Insensitive)
    const hourlyRecords = await HourlyGeneration.find({ customer_id: custFilter })
      .sort({ hour: 1 });

    const hoursOrder = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    const hourlyMap = {};
    hourlyRecords.forEach(r => {
      hourlyMap[r.hour] = {
        generation: Number(r.generation_kwh || 0),
        consumption: Number(r.consumption_kwh || 0)
      };
    });

    const hourlyData = hoursOrder.map(h => ({
      time: h,
      generation: hourlyMap[h] ? hourlyMap[h].generation : 0,
      consumption: hourlyMap[h] ? hourlyMap[h].consumption : 0
    }));

    // 2. Daily Generation Records from MongoDB Atlas (Case Insensitive)
    let dailyRecords = await Generation.find({ customer_id: custFilter })
      .sort({ date: -1 })
      .limit(30);

    let dailyData = dailyRecords.reverse().map(r => ({
      date: r.date.length >= 5 ? r.date.slice(5) : r.date,
      generated: Number(r.generated_kwh || 0),
      consumed: Number(r.used_kwh || 0),
      exported: Number(r.exported_kwh || 0),
      weather: r.weather
    }));

    // Fallback: If no daily records exist, derive daily data from hourly records
    if (dailyData.length === 0 && hourlyRecords.length > 0) {
      let sumGen = 0;
      let sumCon = 0;
      hourlyRecords.forEach(h => {
        sumGen += Number(h.generation_kwh || 0);
        sumCon += Number(h.consumption_kwh || 0);
      });
      const todayShort = new Date().toISOString().slice(5);
      dailyData = [{
        date: todayShort,
        generated: Number(sumGen.toFixed(1)),
        consumed: Number(sumCon.toFixed(1)),
        exported: Number(Math.max(0, sumGen - sumCon).toFixed(1)),
        weather: 'Sunny'
      }];
    }

    // 3. Monthly Payments & Export Earnings from MongoDB Atlas
    const monthlyPayments = await Payment.find({ customer_id: custFilter })
      .sort({ createdAt: 1 })
      .limit(12);

    let monthlyData = monthlyPayments.map(p => ({
      month: p.month ? p.month.split(' ')[0].slice(0, 3) : 'Mth',
      fullMonth: p.month || 'Month',
      generated: Number(p.generated_units || 0),
      consumed: Number(p.consumed_units || 0),
      exported: Number(p.exported_units || 0),
      earnings: Number(p.amount || 0),
      co2: Number((Number(p.generated_units || 0) * 0.709).toFixed(1))
    }));

    // Fallback: If no payment records exist, derive monthly totals from daily/hourly records
    if (monthlyData.length === 0 && dailyData.length > 0) {
      let totalGen = 0;
      let totalCon = 0;
      let totalExp = 0;
      dailyData.forEach(d => {
        totalGen += d.generated;
        totalCon += d.consumed;
        totalExp += d.exported;
      });

      const currentMonthLabel = new Date().toLocaleString('en-US', { month: 'short' });
      monthlyData = [{
        month: currentMonthLabel,
        fullMonth: `${currentMonthLabel} 2026`,
        generated: Number(totalGen.toFixed(1)),
        consumed: Number(totalCon.toFixed(1)),
        exported: Number(totalExp.toFixed(1)),
        earnings: Number((totalExp * tariffRate).toFixed(2)),
        co2: Number((totalGen * 0.709).toFixed(1))
      }];
    }

    // 4. Power Distribution Share (%) from latest raw generation record
    const latestGen = dailyData.length > 0 ? dailyData[dailyData.length - 1] : { generated: 0, consumed: 0, exported: 0 };
    const batteryValue = Number((latestGen.generated * 0.15).toFixed(1));
    const distributionData = [
      { name: 'Home Consumption', value: latestGen.consumed, fill: '#3B82F6' },
      { name: 'Exported to Grid', value: latestGen.exported, fill: '#10B981' },
      { name: 'Battery Storage', value: batteryValue, fill: '#F59E0B' }
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
    const custFilter = getCustIdFilter(customerId);
    const payments = await Payment.find({ customer_id: custFilter }).sort({ _id: -1 });
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
    const custFilter = getCustIdFilter(customerId);
    const record = await Maintenance.findOne({ customer_id: custFilter });
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
    const custFilter = getCustIdFilter(customerId);
    const notifications = await Notification.find({ customer_id: custFilter }).sort({ createdAt: -1 });
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
    const custFilter = getCustIdFilter(customerId);
    await Notification.updateOne({ _id: notifId, customer_id: custFilter }, { status: 'read' });
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
    const custFilter = getCustIdFilter(customerId);
    const { phone, address } = req.body;

    await Customer.updateOne({ customer_id: custFilter }, { phone, address });
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

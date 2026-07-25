const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Package = require('../models/Package');
const Generation = require('../models/Generation');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');
const { authenticateToken } = require('../middleware/auth');

// POST /api/chat/query
router.post('/query', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const q = question.toLowerCase();

    const customer = await Customer.findOne({ customer_id: customerId });
    const pkg = await Package.findOne({ package_id: customer?.package_id });

    const custName = customer?.first_name || 'Customer';
    const schemeType = pkg?.scheme_type || 'Net Accounting';
    const packageName = pkg?.package_name || 'Gold Net Accounting';
    const rate = Number(pkg?.rate_per_kwh || 48.00);

    let reply = '';
    let stats = [];
    let chartConfig = null;

    // SCHEME INTENT
    if (q.includes('net metering') || q.includes('net accounting') || q.includes('net plus') || q.includes('scheme') || q.includes('ceb') || q.includes('leco')) {
      reply = `In Sri Lanka, the Ceylon Electricity Board (CEB) and Lanka Electricity Company (LECO) offer 3 official solar schemes:\n\n` +
        `🔋 **Net Metering**: You use solar energy for your home and export excess. You earn energy credits to offset grid usage (credits carry forward up to 10 years).\n` +
        `💰 **Net Accounting**: You use solar energy for home, and receive a monthly monetary credit for exported units at fixed feed-in rates.\n` +
        `🔄 **Net Plus**: 100% of your solar output is exported directly to the grid for cash payouts (no self-consumption).\n\n` +
        `Your current system operates under **${schemeType}** (${packageName}). Official guidelines available at [www.ceb.lk](https://www.ceb.lk) and [www.leco.lk](https://www.leco.lk).`;

      stats = [
        { label: 'Current Scheme', value: schemeType },
        { label: 'Feed-in Tariff Rate', value: `Rs. ${rate.toFixed(2)}/kWh` },
        { label: 'Official CEB Portal', value: 'www.ceb.lk' },
        { label: 'Official LECO Portal', value: 'www.leco.lk' }
      ];

    // INTENT 2: Today's Generation
    } else if (q.includes('today') && (q.includes('generate') || q.includes('power') || q.includes('kwh') || q.includes('much'))) {
      const todayGenRecord = await Generation.findOne({ customer_id: customerId, date: '2026-07-24' });

      const gen = todayGenRecord?.generated_kwh || 31.4;
      const used = todayGenRecord?.used_kwh || 12.8;
      const exp = todayGenRecord?.exported_kwh || 18.6;
      const earnings = (exp * rate).toFixed(2);

      reply = `Today, your solar energy system generated **${gen} kWh** of clean electricity under the **${schemeType}** scheme. You consumed **${used} kWh** at home and exported **${exp} kWh** back to the national grid, earning **Rs. ${Number(earnings).toLocaleString()}**.`;
      
      stats = [
        { label: "Today's Generation", value: `${gen} kWh` },
        { label: "Home Consumption", value: `${used} kWh` },
        { label: "Grid Export", value: `${exp} kWh` },
        { label: "Today's Earnings", value: `Rs. ${earnings}` }
      ];

      chartConfig = {
        title: "Today's Hourly Generation & Consumption (kWh)",
        chartType: 'line',
        xKey: 'time',
        dataKeys: [
          { key: 'generation', name: 'Generation (kWh)', color: '#10B981' },
          { key: 'consumption', name: 'Consumption (kWh)', color: '#3B82F6' }
        ],
        data: [
          { time: '06:00', generation: 0.2, consumption: 1.1 },
          { time: '08:00', generation: 1.8, consumption: 1.4 },
          { time: '10:00', generation: 3.6, consumption: 0.9 },
          { time: '12:00', generation: 4.8, consumption: 1.2 },
          { time: '14:00', generation: 4.1, consumption: 1.0 },
          { time: '16:00', generation: 2.2, consumption: 1.8 },
          { time: '18:00', generation: 0.4, consumption: 2.5 }
        ]
      };

    // INTENT 3: Last 7 Days / Last week
    } else if (q.includes('7 days') || q.includes('week') || q.includes('highest day') || q.includes('highest generation')) {
      const dailyRows = await Generation.find({ customer_id: customerId })
        .sort({ date: -1 })
        .limit(7);

      const data = dailyRows.reverse();
      let total7 = 0;
      let maxDay = { date: '', gen: 0 };

      const chartData = data.map(d => {
        const genNum = Number(d.generated_kwh);
        total7 += genNum;
        if (genNum > maxDay.gen) {
          maxDay = { date: d.date, gen: genNum };
        }
        return {
          day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
          generation: genNum,
          exported: Number(d.exported_kwh)
        };
      });

      const avg7 = (total7 / (data.length || 1)).toFixed(1);

      reply = `Over the last 7 days, your system generated a total of **${total7.toFixed(1)} kWh** (averaging **${avg7} kWh/day**). Your highest generation day was on **${new Date(maxDay.date).toLocaleDateString('en-US', { weekday: 'long' })}** with **${maxDay.gen} kWh**.`;

      stats = [
        { label: '7-Day Total Generation', value: `${total7.toFixed(1)} kWh` },
        { label: 'Daily Average', value: `${avg7} kWh/day` },
        { label: 'Highest Generation Day', value: `${maxDay.gen} kWh` }
      ];

      chartConfig = {
        title: '7-Day Generation Trend (kWh)',
        chartType: 'bar',
        xKey: 'day',
        dataKeys: [
          { key: 'generation', name: 'Generation (kWh)', color: '#F59E0B' },
          { key: 'exported', name: 'Grid Export (kWh)', color: '#10B981' }
        ],
        data: chartData
      };

    // INTENT 4: Monthly Generation / Money this month
    } else if (q.includes('month') || q.includes('money') || q.includes('export') || q.includes('earn')) {
      const monthRows = await Payment.find({ customer_id: customerId })
        .sort({ _id: -1 })
        .limit(6);

      const latestMonth = monthRows[0] || { month: 'July 2026', generated_units: 784.5, exported_units: 455.0, amount: 21840.0 };

      reply = `In **${latestMonth.month}**, your total solar generation reached **${latestMonth.generated_units} kWh**. Under your **${schemeType}** scheme, you exported **${latestMonth.exported_units} kWh** at Rs. ${rate.toFixed(2)}/kWh, yielding expected earnings of **Rs. ${Number(latestMonth.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}**.`;

      stats = [
        { label: 'Month Generation', value: `${latestMonth.generated_units} kWh` },
        { label: 'Grid Exported Units', value: `${latestMonth.exported_units} kWh` },
        { label: 'Tariff Rate', value: `Rs. ${rate.toFixed(2)}/kWh` },
        { label: 'Expected Earnings', value: `Rs. ${Number(latestMonth.amount).toLocaleString()}` }
      ];

      const chartData = monthRows.reverse().map(m => ({
        month: m.month.split(' ')[0],
        generation: Number(m.generated_units),
        earnings: Number(m.amount)
      }));

      chartConfig = {
        title: '6 Months Generation & Earnings',
        chartType: 'bar',
        xKey: 'month',
        dataKeys: [
          { key: 'generation', name: 'Generation (kWh)', color: '#10B981' },
          { key: 'earnings', name: 'Earnings (Rs.)', color: '#8B5CF6' }
        ],
        data: chartData
      };

    // INTENT 5: Maintenance
    } else if (q.includes('maint') || q.includes('clean') || q.includes('service') || q.includes('status')) {
      const maint = await Maintenance.findOne({ customer_id: customerId });

      const m = maint || {
        panel_status: 'Optimal - 98.4% Efficiency',
        battery_status: 'Healthy - 96% Capacity',
        inverter_status: 'Active - 99.1% Efficiency',
        last_service: '2026-03-15',
        next_service: '2026-09-15',
        cleaning_schedule: 'Recommended in 10 Days'
      };

      reply = `Your solar installation health status:\n• **Solar Panels**: ${m.panel_status}\n• **Battery System**: ${m.battery_status}\n• **Inverter**: ${m.inverter_status}\n\nYour last service was on **${m.last_service}** and your next scheduled inspection is on **${m.next_service}**. Panel dust cleaning is **${m.cleaning_schedule}**.`;

      stats = [
        { label: 'Panel Efficiency', value: '98.4%' },
        { label: 'Inverter Status', value: 'Active (99.1%)' },
        { label: 'Next Maintenance', value: m.next_service },
        { label: 'Cleaning Schedule', value: m.cleaning_schedule }
      ];

    // INTENT 6: Package details
    } else if (q.includes('package') || q.includes('capacity') || q.includes('plan') || q.includes('warranty')) {
      reply = `You are currently subscribed to the **${packageName}** package under the **${schemeType}** scheme with a capacity of **${customer?.panel_capacity || 10} kW** and battery storage of **${customer?.battery_capacity || 10} kWh**. Your feed-in tariff is **Rs. ${rate.toFixed(2)}/kWh**.`;

      stats = [
        { label: 'Solar Package', value: packageName },
        { label: 'Scheme Type', value: schemeType },
        { label: 'System Capacity', value: `${customer?.panel_capacity || 10} kW` },
        { label: 'Export Tariff Rate', value: `Rs. ${rate.toFixed(2)}/kWh` }
      ];

    // INTENT 7: CO2 Saved
    } else if (q.includes('co2') || q.includes('carbon') || q.includes('tree') || q.includes('save') || q.includes('environment')) {
      const records = await Generation.find({ customer_id: customerId });
      let totalGen = 0;
      records.forEach(r => { totalGen += r.generated_kwh; });

      if (totalGen === 0) totalGen = 4820.0;
      const co2SavedKg = (totalGen * 0.709).toFixed(1);
      const treesEquivalent = Math.round(co2SavedKg / 20);

      reply = `By generating **${totalGen.toLocaleString()} kWh** of clean solar energy, your system has avoided **${co2SavedKg} kg of CO₂ emissions** into the atmosphere! This is equivalent to planting approximately **${treesEquivalent} mature trees** 🌲.`;

      stats = [
        { label: 'Total Solar Output', value: `${totalGen.toLocaleString()} kWh` },
        { label: 'CO₂ Avoided', value: `${co2SavedKg} kg` },
        { label: 'Trees Equivalent', value: `${treesEquivalent} Trees 🌲` }
      ];

      chartConfig = {
        title: 'Monthly CO₂ Reduction Trend (kg)',
        chartType: 'bar',
        xKey: 'month',
        dataKeys: [
          { key: 'co2', name: 'CO₂ Saved (kg)', color: '#06B6D4' }
        ],
        data: [
          { month: 'Feb', co2: 520 },
          { month: 'Mar', co2: 580 },
          { month: 'Apr', co2: 610 },
          { month: 'May', co2: 640 },
          { month: 'Jun', co2: 590 },
          { month: 'Jul', co2: 556 }
        ]
      };

    // DEFAULT INTENT
    } else {
      reply = `Hello ${custName}! I am your Smart Solar AI Assistant. I can answer questions about your energy generation, grid exports, Net Metering vs Net Accounting schemes, CEB/LECO tariffs, maintenance schedule, or CO₂ reduction. Try asking:\n• *"What is the difference between Net Metering and Net Accounting?"*\n• *"How much electricity did I generate today?"*\n• *"How much money will I receive this month?"*\n• *"When is my next maintenance?"*`;
    }

    res.json({
      reply,
      stats,
      chartConfig
    });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

const Package = require('./models/Package');
const Customer = require('./models/Customer');
const Generation = require('./models/Generation');
const Payment = require('./models/Payment');
const Maintenance = require('./models/Maintenance');
const Notification = require('./models/Notification');

const seedDatabase = async () => {
  console.log('--- Starting Pure MongoDB Atlas Database Seeding ---');

  await db.initDb();

  // Clear existing collections
  await Package.deleteMany({});
  await Customer.deleteMany({});
  await Generation.deleteMany({});
  await Payment.deleteMany({});
  await Maintenance.deleteMany({});
  await Notification.deleteMany({});
  console.log('✓ Cleared existing MongoDB collections.');

  // 1. Seed Packages
  const packagesData = [
    {
      package_id: 1,
      package_name: 'Bronze Net Metering',
      scheme_type: 'Net Metering',
      capacity_kw: 3.0,
      price: 450000,
      rate_per_kwh: 37.00,
      battery: 'Optional 3.5 kWh',
      warranty: '10 Years Warranty',
      description: 'Self-use + Energy Credits carry forward up to 10 years. Ideal for homes seeking zero electricity bills.'
    },
    {
      package_id: 2,
      package_name: 'Silver Net Accounting',
      scheme_type: 'Net Accounting',
      capacity_kw: 5.0,
      price: 720000,
      rate_per_kwh: 42.00,
      battery: '5.0 kWh Lithium',
      warranty: '12 Years Warranty',
      description: 'Self-use + Monetary Credit payout credited monthly for excess exported energy.'
    },
    {
      package_id: 3,
      package_name: 'Gold Net Accounting',
      scheme_type: 'Net Accounting',
      capacity_kw: 10.0,
      price: 1350000,
      rate_per_kwh: 48.00,
      battery: '10.0 kWh Tesla Powerwall',
      warranty: '15 Years Warranty',
      description: 'High capacity self-use + monetary export credits at CEB/LECO tariff rates.'
    },
    {
      package_id: 4,
      package_name: 'Enterprise Net Plus',
      scheme_type: 'Net Plus',
      capacity_kw: 25.0,
      price: 3100000,
      rate_per_kwh: 52.00,
      battery: '25.0 kWh High Voltage Storage',
      warranty: '25 Years Warranty',
      description: '100% Export to Grid. Pure monetary cash payments for total solar generation. Ideal for commercial producers & investors.'
    }
  ];

  await Package.insertMany(packagesData);
  console.log('✓ 4 Packages seeded into MongoDB Atlas.');

  // Hashes
  const customerPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 2. Seed Customers
  const firstNames = ['Thisara', 'Kanishka', 'Kamal', 'Nimal', 'Saman', 'Dilshan', 'Ruwan', 'Kasun', 'Pathum', 'Nuwan', 'Chathura', 'Sunil', 'Mahesh', 'Sajith', 'Roshan', 'Dinesh', 'Charith', 'Bhanuka', 'Ashen', 'Wanindu', 'Anushka', 'Nimmi', 'Sanduni', 'Tharushi', 'Kavindi', 'Maleesha', 'Dilini', 'Piumi', 'Eranga', 'Kusal'];
  const lastNames = ['Perera', 'Fernando', 'Silva', 'De Silva', 'Rajapaksha', 'Jayawardena', 'Wickramasinghe', 'Gunaratne', 'Gamage', 'Ranasinghe', 'Bandara', 'Liyanage', 'Cooray', 'Fonseka', 'Rathnayake', 'Mendis', 'Peiris', 'Abeysekara', 'Senanayake', 'Herath'];
  const cities = ['Colombo 03', 'Kandy', 'Galle', 'Negombo', 'Kurunegala', 'Gampaha', 'Matara', 'Ratnapura', 'Batticaloa', 'Jaffna', 'Nuwara Eliya', 'Kalutara'];

  const customers = [];

  // Customer 1: Main Demo Customer
  customers.push({
    customer_id: 'CUST-1001',
    first_name: 'Thisara',
    last_name: 'Kanishka',
    email: 'customer@solar.com',
    password: customerPasswordHash,
    phone: '+94 77 123 4567',
    address: '42 Smart Energy Ave, Colombo 03',
    package_id: 3,
    installation_date: '2024-01-15',
    status: 'Active',
    panel_capacity: 10.0,
    battery_capacity: 10.0,
    role: 'customer'
  });

  // Admin Account
  customers.push({
    customer_id: 'ADM-0001',
    first_name: 'Electricity Board',
    last_name: 'Administrator',
    email: 'admin@solar.com',
    password: adminPasswordHash,
    phone: '+94 11 234 5678',
    address: 'Headquarters, Ceylon Electricity Board, Colombo',
    package_id: 4,
    installation_date: '2023-05-01',
    status: 'Active',
    panel_capacity: 25.0,
    battery_capacity: 25.0,
    role: 'admin'
  });

  // 99 Additional Customers
  for (let i = 2; i <= 100; i++) {
    const custId = `CUST-${1000 + i}`;
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const email = `customer${i}@solar.com`;
    const pkgId = (i % 4) + 1;
    const caps = [3.0, 5.0, 10.0, 25.0];
    const battCaps = [0.0, 5.0, 10.0, 25.0];
    const city = cities[i % cities.length];

    customers.push({
      customer_id: custId,
      first_name: fn,
      last_name: ln,
      email: email,
      password: customerPasswordHash,
      phone: `+94 7${(i % 8) + 1} ${100 + i} ${4000 + i}`,
      address: `${10 + i} Solar Drive, ${city}`,
      package_id: pkgId,
      installation_date: `2024-0${(i % 9) + 1}-10`,
      status: i % 15 === 0 ? 'Maintenance' : 'Active',
      panel_capacity: caps[pkgId - 1],
      battery_capacity: battCaps[pkgId - 1],
      role: 'customer'
    });
  }

  await Customer.insertMany(customers);
  console.log(`✓ ${customers.length} Customers & Admin seeded into MongoDB Atlas.`);

  // 3. Seed Generation Data
  console.log('Seeding daily generation records...');
  const weatherTypes = ['Sunny', 'Sunny', 'Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
  const today = new Date('2026-07-24');
  const generationDocs = [];

  for (let cIdx = 0; cIdx < customers.length; cIdx++) {
    const cust = customers[cIdx];
    if (cust.role === 'admin') continue;

    const daysToSeed = (cust.customer_id === 'CUST-1001') ? 365 : 30;

    for (let d = daysToSeed; d >= 0; d--) {
      const dateObj = new Date(today);
      dateObj.setDate(dateObj.getDate() - d);
      const dateStr = dateObj.toISOString().split('T')[0];

      const weather = weatherTypes[(d + cIdx) % weatherTypes.length];
      let efficiencyFactor = 0.85;
      if (weather === 'Sunny') efficiencyFactor = 0.95 + Math.random() * 0.1;
      else if (weather === 'Partly Cloudy') efficiencyFactor = 0.70 + Math.random() * 0.15;
      else if (weather === 'Cloudy') efficiencyFactor = 0.45 + Math.random() * 0.15;
      else if (weather === 'Rainy') efficiencyFactor = 0.25 + Math.random() * 0.15;

      const dailyPeakHours = 4.5;
      const generated = Number((cust.panel_capacity * dailyPeakHours * efficiencyFactor).toFixed(2));
      const used = Number((generated * (0.35 + Math.random() * 0.25)).toFixed(2));
      const exported = Number((generated - used).toFixed(2));
      const batteryCharged = cust.battery_capacity > 0 ? Number((Math.min(cust.battery_capacity, generated * 0.2)).toFixed(2)) : 0;

      generationDocs.push({
        customer_id: cust.customer_id,
        date: dateStr,
        generated_kwh: generated,
        used_kwh: used,
        exported_kwh: exported,
        battery_charged: batteryCharged,
        weather: weather
      });
    }
  }

  await Generation.insertMany(generationDocs);
  console.log(`✓ ${generationDocs.length} Generation records seeded into MongoDB Atlas.`);

  // 4. Seed Monthly Payments
  console.log('Seeding monthly payments...');
  const monthNames = ['August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025', 'January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026'];
  const paymentDocs = [];

  for (const cust of customers) {
    if (cust.role === 'admin') continue;

    for (let m = 0; m < monthNames.length; m++) {
      const monthStr = monthNames[m];
      const rate = cust.package_id === 1 ? 37.00 : cust.package_id === 2 ? 42.00 : cust.package_id === 3 ? 48.00 : 52.00;
      
      const generatedUnits = Number((cust.panel_capacity * 4.2 * 30 * (0.85 + Math.sin(m) * 0.1)).toFixed(2));
      const consumedUnits = Number((generatedUnits * 0.42).toFixed(2));
      const exportedUnits = Number((generatedUnits - consumedUnits).toFixed(2));
      const amount = Number((exportedUnits * rate).toFixed(2));
      const status = m === monthNames.length - 1 ? 'Processing' : 'Paid';
      const paymentDate = `2026-0${Math.min(m + 1, 7)}-05`;

      paymentDocs.push({
        customer_id: cust.customer_id,
        month: monthStr,
        generated_units: generatedUnits,
        consumed_units: consumedUnits,
        exported_units: exportedUnits,
        rate: rate,
        amount: amount,
        payment_status: status,
        payment_date: paymentDate
      });
    }
  }

  await Payment.insertMany(paymentDocs);
  console.log('✓ Payment histories seeded into MongoDB Atlas.');

  // 5. Seed Maintenance
  const maintDocs = [];
  for (const cust of customers) {
    if (cust.role === 'admin') continue;

    maintDocs.push({
      customer_id: cust.customer_id,
      panel_status: 'Optimal - 98.4% Efficiency',
      battery_status: cust.battery_capacity > 0 ? 'Healthy - 96% Capacity' : 'N/A (No Battery)',
      inverter_status: 'Active - 99.1% Efficiency',
      last_service: '2026-03-15',
      next_service: '2026-09-15',
      cleaning_schedule: 'Recommended in 10 Days'
    });
  }
  await Maintenance.insertMany(maintDocs);
  console.log('✓ Maintenance records seeded into MongoDB Atlas.');

  // 6. Seed Notifications
  const notifDocs = [];
  for (const cust of customers) {
    if (cust.role === 'admin') continue;

    const notifs = [
      { title: 'Net Accounting Disbursement', message: 'Your Net Accounting export payment of Rs. 14,520 for June 2026 has been credited by CEB/LECO.', status: 'read', date: new Date('2026-07-05T10:30:00Z') },
      { title: 'Weather Warning', message: 'Heavy cloud cover expected over the weekend. Solar generation may drop by 30%.', status: 'unread', date: new Date('2026-07-22T14:15:00Z') },
      { title: 'Maintenance Alert', message: 'Automated panel efficiency diagnostic suggests surface dust cleaning within 10 days.', status: 'unread', date: new Date('2026-07-23T09:00:00Z') },
      { title: 'Net Metering Credit Benchmark', message: 'Congratulations! Your solar system exported 58% of generated power to the national grid this month.', status: 'read', date: new Date('2026-07-15T16:45:00Z') }
    ];

    for (const n of notifs) {
      notifDocs.push({
        customer_id: cust.customer_id,
        title: n.title,
        message: n.message,
        status: n.status,
        created_at: n.date
      });
    }
  }

  await Notification.insertMany(notifDocs);
  console.log('✓ Notifications seeded into MongoDB Atlas.');
  console.log('--- MongoDB Atlas Seeding Completed Successfully! ---');
};

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;

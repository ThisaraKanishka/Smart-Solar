const bcrypt = require('bcryptjs');
const db = require('./db');

const seedDatabase = async () => {
  console.log('--- Starting Database Seeding ---');

  await db.initDb();

  // Drop existing tables to ensure clean schema update
  await db.query('DROP TABLE IF EXISTS Notifications');
  await db.query('DROP TABLE IF EXISTS Maintenance');
  await db.query('DROP TABLE IF EXISTS Payments');
  await db.query('DROP TABLE IF EXISTS Generation');
  await db.query('DROP TABLE IF EXISTS Customers');
  await db.query('DROP TABLE IF EXISTS Packages');

  const createTablesSql = `
  CREATE TABLE IF NOT EXISTS Packages (
    package_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_name VARCHAR(50) NOT NULL,
    scheme_type VARCHAR(50) NOT NULL DEFAULT 'Net Accounting',
    capacity_kw DECIMAL(5,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    rate_per_kwh DECIMAL(6,2) NOT NULL,
    battery VARCHAR(50) NOT NULL,
    warranty VARCHAR(50) NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS Customers (
    customer_id VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    package_id INT NOT NULL,
    installation_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    panel_capacity DECIMAL(5,2) NOT NULL,
    battery_capacity DECIMAL(5,2) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer'
  );

  CREATE TABLE IF NOT EXISTS Generation (
    generation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    generated_kwh DECIMAL(8,2) NOT NULL,
    used_kwh DECIMAL(8,2) NOT NULL,
    exported_kwh DECIMAL(8,2) NOT NULL,
    battery_charged DECIMAL(8,2) NOT NULL,
    weather VARCHAR(30) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id VARCHAR(20) NOT NULL,
    month VARCHAR(20) NOT NULL,
    generated_units DECIMAL(8,2) NOT NULL,
    consumed_units DECIMAL(8,2) NOT NULL,
    exported_units DECIMAL(8,2) NOT NULL,
    rate DECIMAL(6,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    payment_date DATE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Maintenance (
    maintenance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id VARCHAR(20) NOT NULL,
    panel_status VARCHAR(50) NOT NULL,
    battery_status VARCHAR(50) NOT NULL,
    inverter_status VARCHAR(50) NOT NULL,
    last_service DATE NOT NULL,
    next_service DATE NOT NULL,
    cleaning_schedule VARCHAR(50) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Notifications (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `;

  await db.execScript(createTablesSql);
  console.log('✓ Tables created.');

  // 1. Seed Packages with 3 Sri Lankan Grid Schemes (Net Metering, Net Accounting, Net Plus)
  const packagesData = [
    {
      id: 1,
      name: 'Bronze Net Metering',
      scheme: 'Net Metering',
      capacity: 3.0,
      price: 450000,
      rate: 37.00,
      battery: 'Optional 3.5 kWh',
      warranty: '10 Years Warranty',
      desc: 'Self-use + Energy Credits carry forward up to 10 years. Ideal for homes seeking zero electricity bills.'
    },
    {
      id: 2,
      name: 'Silver Net Accounting',
      scheme: 'Net Accounting',
      capacity: 5.0,
      price: 720000,
      rate: 42.00,
      battery: '5.0 kWh Lithium',
      warranty: '12 Years Warranty',
      desc: 'Self-use + Monetary Credit payout credited monthly for excess exported energy.'
    },
    {
      id: 3,
      name: 'Gold Net Accounting',
      scheme: 'Net Accounting',
      capacity: 10.0,
      price: 1350000,
      rate: 48.00,
      battery: '10.0 kWh Tesla Powerwall',
      warranty: '15 Years Warranty',
      desc: 'High capacity self-use + monetary export credits at CEB/LECO tariff rates.'
    },
    {
      id: 4,
      name: 'Enterprise Net Plus',
      scheme: 'Net Plus',
      capacity: 25.0,
      price: 3100000,
      rate: 52.00,
      battery: '25.0 kWh High Voltage Storage',
      warranty: '25 Years Warranty',
      desc: '100% Export to Grid. Pure monetary cash payments for total solar generation. Ideal for commercial producers & investors.'
    }
  ];

  for (const p of packagesData) {
    await db.query(
      `INSERT INTO Packages (package_id, package_name, scheme_type, capacity_kw, price, rate_per_kwh, battery, warranty, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.name, p.scheme, p.capacity, p.price, p.rate, p.battery, p.warranty, p.desc]
    );
  }
  console.log('✓ 4 Scheme Packages seeded (Net Metering, Net Accounting, Net Plus).');

  // Password hash
  const customerPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 2. Seed Customers
  const firstNames = ['Thisara', 'Kanishka', 'Kamal', 'Nimal', 'Saman', 'Dilshan', 'Ruwan', 'Kasun', 'Pathum', 'Nuwan', 'Chathura', 'Sunil', 'Mahesh', 'Sajith', 'Roshan', 'Dinesh', 'Charith', 'Bhanuka', 'Ashen', 'Wanindu', 'Anushka', 'Nimmi', 'Sanduni', 'Tharushi', 'Kavindi', 'Maleesha', 'Dilini', 'Piumi', 'Eranga', 'Kusal'];
  const lastNames = ['Perera', 'Fernando', 'Silva', 'De Silva', 'Rajapaksha', 'Jayawardena', 'Wickramasinghe', 'Gunaratne', 'Gamage', 'Ranasinghe', 'Bandara', 'Liyanage', 'Cooray', 'Fonseka', 'Rathnayake', 'Mendis', 'Peiris', 'Abeysekara', 'Senanayake', 'Herath'];
  const cities = ['Colombo 03', 'Kandy', 'Galle', 'Negombo', 'Kurunegala', 'Gampaha', 'Matara', 'Ratnapura', 'Batticaloa', 'Jaffna', 'Nuwara Eliya', 'Kalutara'];

  const customers = [];

  // Customer 1: Main Demo Customer
  customers.push({
    id: 'CUST-1001',
    first: 'Thisara',
    last: 'Kanishka',
    email: 'customer@solar.com',
    pass: customerPasswordHash,
    phone: '+94 77 123 4567',
    address: '42 Smart Energy Ave, Colombo 03',
    packageId: 3, // Gold Net Accounting 10kW
    installDate: '2024-01-15',
    status: 'Active',
    panelCap: 10.0,
    batteryCap: 10.0,
    role: 'customer'
  });

  // Admin Account
  customers.push({
    id: 'ADM-0001',
    first: 'Electricity Board',
    last: 'Administrator',
    email: 'admin@solar.com',
    pass: adminPasswordHash,
    phone: '+94 11 234 5678',
    address: 'Headquarters, Ceylon Electricity Board, Colombo',
    packageId: 4,
    installDate: '2023-05-01',
    status: 'Active',
    panelCap: 25.0,
    batteryCap: 25.0,
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
      id: custId,
      first: fn,
      last: ln,
      email: email,
      pass: customerPasswordHash,
      phone: `+94 7${(i % 8) + 1} ${100 + i} ${4000 + i}`,
      address: `${10 + i} Solar Drive, ${city}`,
      packageId: pkgId,
      installDate: `2024-0${(i % 9) + 1}-10`,
      status: i % 15 === 0 ? 'Maintenance' : 'Active',
      panelCap: caps[pkgId - 1],
      batteryCap: battCaps[pkgId - 1],
      role: 'customer'
    });
  }

  for (const c of customers) {
    await db.query(
      `INSERT INTO Customers (customer_id, first_name, last_name, email, password, phone, address, package_id, installation_date, status, panel_capacity, battery_capacity, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.id, c.first, c.last, c.email, c.pass, c.phone, c.address, c.packageId, c.installDate, c.status, c.panelCap, c.batteryCap, c.role]
    );
  }
  console.log(`✓ ${customers.length} Customers & Admin seeded.`);

  // 3. Seed Generation Data
  console.log('Seeding daily generation records...');
  const weatherTypes = ['Sunny', 'Sunny', 'Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
  const today = new Date('2026-07-24');

  for (let cIdx = 0; cIdx < customers.length; cIdx++) {
    const cust = customers[cIdx];
    if (cust.role === 'admin') continue;

    const daysToSeed = (cust.id === 'CUST-1001') ? 365 : 30;

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
      const generated = Number((cust.panelCap * dailyPeakHours * efficiencyFactor).toFixed(2));
      const used = Number((generated * (0.35 + Math.random() * 0.25)).toFixed(2));
      const exported = Number((generated - used).toFixed(2));
      const batteryCharged = cust.batteryCap > 0 ? Number((Math.min(cust.batteryCap, generated * 0.2)).toFixed(2)) : 0;

      await db.query(
        `INSERT INTO Generation (customer_id, date, generated_kwh, used_kwh, exported_kwh, battery_charged, weather)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [cust.id, dateStr, generated, used, exported, batteryCharged, weather]
      );
    }
  }
  console.log('✓ Generation records seeded.');

  // 4. Seed Monthly Payments
  console.log('Seeding monthly payments...');
  const monthNames = ['August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025', 'January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026'];

  for (const cust of customers) {
    if (cust.role === 'admin') continue;

    for (let m = 0; m < monthNames.length; m++) {
      const monthStr = monthNames[m];
      const rate = cust.packageId === 1 ? 37.00 : cust.packageId === 2 ? 42.00 : cust.packageId === 3 ? 48.00 : 52.00;
      
      const generatedUnits = Number((cust.panelCap * 4.2 * 30 * (0.85 + Math.sin(m) * 0.1)).toFixed(2));
      const consumedUnits = Number((generatedUnits * 0.42).toFixed(2));
      const exportedUnits = Number((generatedUnits - consumedUnits).toFixed(2));
      const amount = Number((exportedUnits * rate).toFixed(2));
      const status = m === monthNames.length - 1 ? 'Processing' : 'Paid';
      const paymentDate = `2026-0${Math.min(m + 1, 7)}-05`;

      await db.query(
        `INSERT INTO Payments (customer_id, month, generated_units, consumed_units, exported_units, rate, amount, payment_status, payment_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [cust.id, monthStr, generatedUnits, consumedUnits, exportedUnits, rate, amount, status, paymentDate]
      );
    }
  }
  console.log('✓ Payment histories seeded.');

  // 5. Seed Maintenance
  console.log('Seeding Maintenance logs...');
  for (const cust of customers) {
    if (cust.role === 'admin') continue;
    
    await db.query(
      `INSERT INTO Maintenance (customer_id, panel_status, battery_status, inverter_status, last_service, next_service, cleaning_schedule)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        cust.id,
        'Optimal - 98.4% Efficiency',
        cust.batteryCap > 0 ? 'Healthy - 96% Capacity' : 'N/A (No Battery)',
        'Active - 99.1% Efficiency',
        '2026-03-15',
        '2026-09-15',
        'Recommended in 10 Days'
      ]
    );
  }

  // 6. Seed Notifications
  for (const cust of customers) {
    if (cust.role === 'admin') continue;

    const notifs = [
      { title: 'Net Accounting Disbursement', message: 'Your Net Accounting export payment of Rs. 14,520 for June 2026 has been credited by CEB/LECO.', status: 'read', date: '2026-07-05 10:30:00' },
      { title: 'Weather Warning', message: 'Heavy cloud cover expected over the weekend. Solar generation may drop by 30%.', status: 'unread', date: '2026-07-22 14:15:00' },
      { title: 'Maintenance Alert', message: 'Automated panel efficiency diagnostic suggests surface dust cleaning within 10 days.', status: 'unread', date: '2026-07-23 09:00:00' },
      { title: 'Net Metering Credit Benchmark', message: 'Congratulations! Your solar system exported 58% of generated power to the national grid this month.', status: 'read', date: '2026-07-15 16:45:00' }
    ];

    for (const n of notifs) {
      await db.query(
        `INSERT INTO Notifications (customer_id, title, message, status, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [cust.id, n.title, n.message, n.status, n.date]
      );
    }
  }
  console.log('✓ Notifications seeded.');
  console.log('--- Database Seeding Completed Successfully! ---');
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

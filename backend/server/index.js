require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const seedDatabase = require('./seed');

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const adminRoutes = require('./routes/admin');
const packageRoutes = require('./routes/packages');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Smart Solar Energy Management System Backend',
    timestamp: new Date().toISOString(),
    dbMode: db.getDbMode()
  });
});

// Start Server
const startServer = async () => {
  try {
    await db.initDb();
    
    // Check if Customers table has data, if not run auto-seeder
    try {
      const custs = await db.query('SELECT COUNT(*) as count FROM Customers');
      if (!custs || custs[0].count === 0) {
        console.log('Database empty, auto-seeding sample data...');
        await seedDatabase();
      }
    } catch (e) {
      console.log('Initial check failed, running database seeder...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`  Smart Solar Energy Backend running on port ${PORT}`);
      console.log(`  Database Mode: [${db.getDbMode().toUpperCase()}]`);
      console.log(`  Health check: http://localhost:${PORT}/api/health`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();

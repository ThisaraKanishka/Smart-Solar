require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const seedDatabase = require('./seed');
const Customer = require('./models/Customer');

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const adminRoutes = require('./routes/admin');
const packageRoutes = require('./routes/packages');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/reports');

const app = express();
let PORT = process.env.PORT || 5000;

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
    dbMode: 'MongoDB Atlas'
  });
});

// Start Server with EADDRINUSE Port Handling
const listenWithFallback = (server, port) => {
  server.listen(port, () => {
    console.log(`=================================================`);
    console.log(`  Smart Solar Energy Backend running on port ${port}`);
    console.log(`  Database Mode: [MONGODB ATLAS EXCLUSIVE]`);
    console.log(`  Health check: http://localhost:${port}/api/health`);
    console.log(`=================================================`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is occupied, trying port ${port + 1}...`);
      listenWithFallback(server, port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

const startServer = async () => {
  try {
    await db.initDb();
    
    try {
      const custCount = await Customer.countDocuments();
      if (custCount === 0) {
        console.log('MongoDB collection empty, auto-seeding sample data...');
        await seedDatabase();
      }
    } catch (e) {
      console.log('Initial MongoDB check failed, seeding Atlas database...');
      await seedDatabase();
    }

    listenWithFallback(app, PORT);
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();

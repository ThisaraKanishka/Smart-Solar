const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalCustomersRes = await db.query(`SELECT COUNT(*) as count FROM Customers WHERE role = 'customer'`);
    const totalCapRes = await db.query(`SELECT SUM(panel_capacity) as total_kw FROM Customers WHERE role = 'customer'`);
    const totalGenRes = await db.query(`SELECT SUM(generated_kwh) as total_gen, SUM(exported_kwh) as total_export FROM Generation`);
    const totalPayoutsRes = await db.query(`SELECT SUM(amount) as total_payout FROM Payments WHERE payment_status = 'Paid'`);

    const totalCustomers = totalCustomersRes[0]?.count || 0;
    const totalCapacityMw = Number(((totalCapRes[0]?.total_kw || 0) / 1000).toFixed(2));
    const totalGenerationMwh = Number(((totalGenRes[0]?.total_gen || 0) / 1000).toFixed(1));
    const totalExportMwh = Number(((totalGenRes[0]?.total_export || 0) / 1000).toFixed(1));
    const totalPayouts = Number((totalPayoutsRes[0]?.total_payout || 0).toFixed(2));

    // Active package distribution
    const packageDist = await db.query(
      `SELECT p.package_name, COUNT(c.customer_id) as customer_count 
       FROM Packages p 
       LEFT JOIN Customers c ON p.package_id = c.package_id 
       GROUP BY p.package_id`
    );

    res.json({
      kpis: {
        totalCustomers,
        totalCapacityMw,
        totalGenerationMwh,
        totalExportMwh,
        totalPayouts
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
    let sql = `SELECT c.*, p.package_name, p.rate_per_kwh 
               FROM Customers c 
               LEFT JOIN Packages p ON c.package_id = p.package_id 
               WHERE c.role = 'customer'`;
    const params = [];

    if (search) {
      sql += ` AND (c.first_name LIKE ? OR c.last_name LIKE ? OR c.customer_id LIKE ? OR c.email LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (package_id) {
      sql += ` AND c.package_id = ?`;
      params.push(package_id);
    }

    if (status) {
      sql += ` AND c.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY c.customer_id DESC`;

    const customers = await db.query(sql, params);
    // Remove password hash from response
    customers.forEach(c => delete c.password);

    res.json({ customers });
  } catch (err) {
    console.error('Admin customers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/generation
router.post('/generation', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { customer_id, date, generated_kwh, used_kwh, exported_kwh, battery_charged, weather } = req.body;

    await db.query(
      `INSERT INTO Generation (customer_id, date, generated_kwh, used_kwh, exported_kwh, battery_charged, weather)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, date, generated_kwh, used_kwh, exported_kwh, battery_charged || 0, weather || 'Sunny']
    );

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
      await db.query(
        `INSERT INTO Notifications (customer_id, title, message, status) VALUES (?, ?, ?, 'unread')`,
        [target_customer_id, title, message]
      );
    } else {
      const customers = await db.query(`SELECT customer_id FROM Customers WHERE role = 'customer'`);
      for (const c of customers) {
        await db.query(
          `INSERT INTO Notifications (customer_id, title, message, status) VALUES (?, ?, ?, 'unread')`,
          [c.customer_id, title, message]
        );
      }
    }

    res.json({ message: 'Notifications broadcast successfully' });
  } catch (err) {
    console.error('Broadcast error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

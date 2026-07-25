const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

let dbMode = 'sqlite'; // 'mysql' or 'sqlite'
let mysqlPool = null;
let sqliteDb = null;

const initDb = async () => {
  // Check if MySQL env vars are present
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
    try {
      mysqlPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      // Test connection
      const conn = await mysqlPool.getConnection();
      conn.release();
      dbMode = 'mysql';
      console.log('Connected to MySQL Database!');
      return;
    } catch (err) {
      console.warn('MySQL connection failed, falling back to SQLite:', err.message);
    }
  }

  // SQLite Fallback
  dbMode = 'sqlite';
  const dbPath = path.join(__dirname, 'smart_solar.sqlite');
  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err.message);
    } else {
      console.log('Connected to SQLite Database at:', dbPath);
    }
  });

  // Enable Foreign Keys for SQLite
  sqliteDb.run('PRAGMA foreign_keys = ON;');
};

const query = async (sqlText, params = []) => {
  if (dbMode === 'mysql' && mysqlPool) {
    const [rows, fields] = await mysqlPool.execute(sqlText, params);
    return rows;
  }

  // SQLite execution wrapper
  return new Promise((resolve, reject) => {
    if (!sqliteDb) {
      return reject(new Error('SQLite database not initialized'));
    }

    const trimmed = sqlText.trim().toUpperCase();
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA')) {
      sqliteDb.all(sqlText, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    } else {
      sqliteDb.run(sqlText, params, function (err) {
        if (err) return reject(err);
        resolve({ insertId: this.lastID, affectedRows: this.changes });
      });
    }
  });
};

const execScript = async (sqlScript) => {
  if (dbMode === 'mysql' && mysqlPool) {
    const statements = sqlScript.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of statements) {
      await mysqlPool.query(stmt);
    }
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.exec(sqlScript, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

module.exports = {
  initDb,
  query,
  execScript,
  getDbMode: () => dbMode
};

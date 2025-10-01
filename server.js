const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new sqlite3.Database('./crud_dashboard.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER
    )
  `, (err) => {
    if (err) {
      console.error('Table creation error:', err);
    } else {
      console.log('Entries table ready');
    }
  });
}

// API Routes

// GET all entries
app.get('/api/entries', (req, res) => {
  const query = req.query.search || '';
  let sql = 'SELECT * FROM entries';
  let params = [];

  if (query) {
    sql += ' WHERE name LIKE ? OR email LIKE ? OR role LIKE ?';
    const searchPattern = `%${query}%`;
    params = [searchPattern, searchPattern, searchPattern];
  }

  sql += ' ORDER BY createdAt DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// GET single entry
app.get('/api/entries/:id', (req, res) => {
  db.get('SELECT * FROM entries WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Entry not found' });
    } else {
      res.json(row);
    }
  });
});

// POST new entry
app.post('/api/entries', (req, res) => {
  const { id, name, email, role, createdAt } = req.body;

  if (!id || !name || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = 'INSERT INTO entries (id, name, email, role, createdAt) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [id, name, email, role, createdAt || Date.now()], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id, name, email, role, createdAt });
    }
  });
});

// PUT update entry
app.put('/api/entries/:id', (req, res) => {
  const { name, email, role } = req.body;
  const updatedAt = Date.now();

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = 'UPDATE entries SET name = ?, email = ?, role = ?, updatedAt = ? WHERE id = ?';
  db.run(sql, [name, email, role, updatedAt, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Entry not found' });
    } else {
      res.json({ id: req.params.id, name, email, role, updatedAt });
    }
  });
});

// DELETE entry
app.delete('/api/entries/:id', (req, res) => {
  db.run('DELETE FROM entries WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Entry not found' });
    } else {
      res.json({ message: 'Entry deleted', id: req.params.id });
    }
  });
});

// DELETE all entries
app.delete('/api/entries', (req, res) => {
  db.run('DELETE FROM entries', function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'All entries deleted', count: this.changes });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/index.html to view the app`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});

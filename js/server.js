const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const db = new Database('tisoy.db');
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // serve your existing HTML/CSS/JS

// --- DB Setup ---
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    name TEXT,
    price REAL,
    description TEXT,
    available INTEGER DEFAULT 1
  );
`);

// --- Settings (store open/close, custom message) ---
app.get('/api/settings', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
});

app.post('/api/settings', (req, res) => {
  const upsert = db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value'
  );
  for (const [key, value] of Object.entries(req.body)) {
    upsert.run(key, String(value));
  }
  res.json({ ok: true });
});

// --- Menu Items ---
app.get('/api/menu', (req, res) => {
  res.json(db.prepare('SELECT * FROM menu_items').all());
});

app.post('/api/menu', (req, res) => {
  const { category, name, price, description } = req.body;
  const result = db.prepare(
    'INSERT INTO menu_items (category, name, price, description) VALUES (?, ?, ?, ?)'
  ).run(category, name, price, description);
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/menu/:id', (req, res) => {
  const { name, price, description, available } = req.body;
  db.prepare(
    'UPDATE menu_items SET name=?, price=?, description=?, available=? WHERE id=?'
  ).run(name, price, description, available ? 1 : 0, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/menu/:id', (req, res) => {
  db.prepare('DELETE FROM menu_items WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));

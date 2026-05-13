const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database('tisoy.db');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

app.get('/api/settings', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
});

app.post('/api/settings', (req, res) => {
  const upsert = db.prepare(
    'INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value'
  );
  for (const [key, value] of Object.entries(req.body)) {
    upsert.run(key, String(value));
  }
  res.json({ ok: true });
});

app.get('/api/menu', (req, res) => {
  const row = db.prepare("SELECT value FROM settings WHERE key='tisoy_menu'").get();
  res.json(row ? JSON.parse(row.value) : {});
});

app.post('/api/menu', (req, res) => {
  db.prepare(
    'INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value'
  ).run('tisoy_menu', JSON.stringify(req.body));
  res.json({ ok: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

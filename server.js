const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(express.json({ limit: '200kb' }));
app.use(express.static(path.join(__dirname)));

// ── Supabase client (uses service-role key for server-side full access) ──────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Helpers for single-document tables (menu / settings) ─────────────────────
async function getDoc(table) {
  const { data, error } = await supabase
    .from(table)
    .select('data')
    .eq('id', 'main')
    .maybeSingle();
  if (error) throw error;
  return data?.data ?? null;
}

async function setDoc(table, payload) {
  const { error } = await supabase
    .from(table)
    .upsert({ id: 'main', data: payload }, { onConflict: 'id' });
  if (error) throw error;
}

// ── MENU ──────────────────────────────────────────────────────────────────────
app.get('/api/menu', async (req, res) => {
  try {
    const data = await getDoc('menu');
    res.json(data ?? {});
  } catch (err) {
    console.error('GET /api/menu:', err);
    res.status(500).json({ error: 'Failed to load menu' });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    await setDoc('menu', req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/menu:', err);
    res.status(500).json({ error: 'Failed to save menu' });
  }
});

// ── IMAGES ────────────────────────────────────────────────────────────────────
// POST: receive base64, store in images table, return URL
app.post('/api/image', express.json({ limit: '8mb' }), async (req, res) => {
  try {
    const { data, mimeType } = req.body;
    if (!data) return res.status(400).json({ error: 'No image data' });

    const id = 'img_' + Date.now();
    const { error } = await supabase.from('images').insert({
      id,
      data,
      mime_type: mimeType || 'image/jpeg',
      created_at: new Date().toISOString(),
    });
    if (error) throw error;
    res.json({ id, url: '/api/image/' + id });
  } catch (err) {
    console.error('POST /api/image:', err);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// GET: serve the stored image as binary
app.get('/api/image/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('data, mime_type')
      .eq('id', req.params.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).send('Not found');

    const buf = Buffer.from(data.data, 'base64');
    res.set('Content-Type', data.mime_type || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(buf);
  } catch (err) {
    console.error('GET /api/image:', err);
    res.status(500).send('Error');
  }
});

// ── SETTINGS ──────────────────────────────────────────────────────────────────
app.get('/api/settings', async (req, res) => {
  try {
    const data = await getDoc('settings');
    res.json(data ?? { store_closed: '0', store_message: '' });
  } catch (err) {
    console.error('GET /api/settings:', err);
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    await setDoc('settings', req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/settings:', err);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// ── FEEDBACK ──────────────────────────────────────────────────────────────────
// Helper: remap Supabase's `id` field to `_id` so the existing frontend
// (admin.js / app.js) keeps working without any changes.
function toClient(row) {
  if (!row) return row;
  const { id, ...rest } = row;
  return { _id: id, ...rest };
}

// Submit new feedback (public)
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!comment || !rating) return res.status(400).json({ error: 'Missing fields' });

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        name: (name || 'Anonymous').slice(0, 60),
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment: comment.slice(0, 600),
        featured: false,
      })
      .select('id')
      .single();
    if (error) throw error;
    res.json({ ok: true, id: data.id });
  } catch (err) {
    console.error('POST /api/feedback:', err);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// Get all feedback (admin)
app.get('/api/feedback/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data.map(toClient));
  } catch (err) {
    console.error('GET /api/feedback/all:', err);
    res.status(500).json({ error: 'Failed to load feedback' });
  }
});

// Get featured feedback (public strip)
app.get('/api/feedback/featured', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    res.json(data.map(toClient));
  } catch (err) {
    console.error('GET /api/feedback/featured:', err);
    res.status(500).json({ error: 'Failed to load featured feedback' });
  }
});

// Toggle featured status (admin)
app.post('/api/feedback/:id/toggle', async (req, res) => {
  try {
    const { data: existing, error: fetchErr } = await supabase
      .from('feedback')
      .select('featured')
      .eq('id', req.params.id)
      .maybeSingle();
    if (fetchErr) throw fetchErr;
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const newVal = !existing.featured;
    const { error } = await supabase
      .from('feedback')
      .update({ featured: newVal })
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true, featured: newVal });
  } catch (err) {
    console.error('POST /api/feedback/toggle:', err);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// Delete feedback (admin)
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/feedback:', err);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Tisoy Sushi Maki on port ' + PORT));

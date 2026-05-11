/* ══════════════════════════════════════
   app.js — App state, init, UI helpers
══════════════════════════════════════ */

/* ── Global State ── */
let cart      = {};
let orderType = 'delivery';
let activeCat = 'bestsellers';
let storeOpen = true;

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  loadCart();         // ← restore saved cart & order type FIRST
  buildNavs();
  buildSections();
  setActiveCat('bestsellers');
  renderCart();       // ← now renders with the restored cart
  checkStoreStatus();
  initAdmin();

  // Restore active toggle button to match saved orderType
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    const t = btn.getAttribute('onclick').match(/'(\w+)'/)?.[1];
    if (t === orderType) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Re-check store status every 60 seconds
  setInterval(checkStoreStatus, 60_000);

  // Close modals on backdrop click
  document.querySelectorAll('.overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); });
  });
});

/* ── Category nav builders ── */
function buildNavs() {
  const dc = document.getElementById('desktopCats');
  const mc = document.getElementById('mobileCats');

  categories.forEach(c => {
    // Desktop sidebar item
    const d = document.createElement('div');
    d.className = 'cat-item';
    d.id = 'dc-' + c.id;
    d.innerHTML = `<span class="cat-emoji">${c.emoji}</span>${c.label}`;
    d.onclick = () => setActiveCat(c.id);
    dc.appendChild(d);

    // Mobile scroll button
    const m = document.createElement('button');
    m.className = 'm-cat-btn';
    m.id = 'mc-' + c.id;
    m.innerHTML = `<span>${c.emoji}</span><span>${c.label}</span>`;
    m.onclick = () => setActiveCat(c.id);
    mc.appendChild(m);
  });
}

/* ── Menu section builder ── */
function buildSections() {
  const wrap = document.getElementById('menuSections');
  wrap.innerHTML = '';
  categories.forEach(c => {
    const sec = document.createElement('div');
    sec.className = 'menu-section';
    sec.id = 'sec-' + c.id;
    sec.innerHTML = `<div class="menu-grid">${menu[c.id].map(cardHTML).join('')}</div>`;
    wrap.appendChild(sec);
  });
}

/* ── Menu card HTML ── */
function cardHTML(item) {
  const tagHTML = item.tag === 'bestseller' ? `<span class="tag-best">⭐ Best Seller</span>`
                : item.tag === 'new'        ? `<span class="tag-new">✨ New</span>` : '';
  const spicy   = item.tag === 'spicy'      ? `<span class="tag-spicy">🌶️ Spicy</span>` : '';
  return `
  <div class="menu-card">
    <div class="menu-card-img">${tagHTML}${spicy}${item.emoji}</div>
    <div class="card-body">
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <div class="card-foot">
        <span class="item-price">₱${item.price}</span>
        <button class="add-btn" onclick="addToCart(${item.id},'${item.name.replace(/'/g,"\\'")}',${item.price},'${item.emoji}')">＋ Add</button>
      </div>
    </div>
  </div>`;
}

/* ── Active category ── */
function setActiveCat(id) {
  activeCat = id;
  const cat = categories.find(c => c.id === id);

  document.getElementById('secTitle').textContent = cat.emoji + ' ' + cat.label;
  document.getElementById('secDesc').textContent  = cat.desc;

  document.querySelectorAll('.menu-section').forEach(s => s.classList.remove('visible'));
  document.getElementById('sec-' + id).classList.add('visible');

  document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.m-cat-btn').forEach(el => el.classList.remove('active'));

  const dc = document.getElementById('dc-' + id);
  const mc = document.getElementById('mc-' + id);
  if (dc) dc.classList.add('active');
  if (mc) { mc.classList.add('active'); mc.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }
}

/* ── Order type toggle ── */
function setOrderType(t, btn) {
  orderType = t;
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCart();
}

/* ── Drawer ── */
function openCartDrawer()  { document.getElementById('cartDrawer').classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeCartDrawer() { document.getElementById('cartDrawer').classList.remove('open'); document.body.style.overflow = ''; }

/* ── Modals ── */
function openModal(id)  { document.getElementById(id).classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; }

/* ── Location save ── */
function saveLocation() {
  const loc     = document.getElementById('locInput').value.trim();
  const area    = document.getElementById('locArea').value;
  const display = loc || area || 'My Location';
  document.getElementById('currentLoc').textContent =
    display.length > 22 ? display.slice(0, 22) + '...' : display;
  closeModal('locationModal');
  showToast('📍 Location saved!');
}

/* ── Toast ── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

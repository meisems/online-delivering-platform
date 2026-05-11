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

<!-- ITEM DETAIL MODAL - Full Image Version -->
<div id="itemModal" class="modal">
  <div class="modal-content">
    <span class="modal-close" onclick="closeItemModal()">×</span>
    
    <!-- Full Image -->
    <div class="modal-image">
      <img id="modalImage" src="" alt="">
    </div>
    
    <div class="modal-body">
      <h2 id="modalName"></h2>
      <p id="modalDesc"></p>
      
      <div id="modalVariants"></div>
      
      <div class="modal-price" id="modalPrice"></div>
      
      <button class="add-to-cart-btn" id="modalAddBtn">
        ＋ Add to Cart
      </button>
    </div>
  </div>
</div>

/* ── Variant helpers ── */
function updateVariantPrice(itemId, sel) {
  const price = parseInt(sel.selectedOptions[0].getAttribute('data-price')) || 0;
  const el = document.getElementById('price-' + itemId);
  if (el) el.textContent = price ? '₱' + price : 'Contact us';
}
function addVariantToCart(itemId, name, emoji) {
  const sel = document.getElementById('var-' + itemId);
  if (!sel) return;
  const opt   = sel.selectedOptions[0];
  const price = parseInt(opt.getAttribute('data-price')) || 0;
  const size  = opt.text.split(' — ')[0];
  const cartKey  = itemId + '-' + sel.selectedIndex;
  const cartName = name + ' (' + size + ')';
  addToCart(cartKey, cartName, price, emoji);
}

/* ── Active category ── */
function setActiveCat(id) {
  const cat = categories.find(c => c.id === id);
  
  if (!cat) {
    console.error(`Category with id "${id}" not found in categories array!`);
    return; // Prevent crash
  }

  activeCat = id;

  // Update title and description
  document.getElementById('secTitle').textContent = cat.emoji + ' ' + cat.label;
  document.getElementById('secDesc').textContent = cat.desc;

  // Switch visible section
  document.querySelectorAll('.menu-section').forEach(s => s.classList.remove('visible'));
  const section = document.getElementById('sec-' + id);
  if (section) {
    section.classList.add('visible');
  } else {
    console.error(`Section element "sec-${id}" not found!`);
  }

  // Update active buttons
  document.querySelectorAll('.cat-item, .m-cat-btn').forEach(el => {
    el.classList.remove('active');
  });

  const dc = document.getElementById('dc-' + id);
  const mc = document.getElementById('mc-' + id);
  
  if (dc) dc.classList.add('active');
  if (mc) {
    mc.classList.add('active');
    mc.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
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
  const loc  = document.getElementById('locInput').value.trim();
  const area = document.getElementById('locArea').value;
  const display = loc || area || 'My Location';
  const locEl = document.getElementById('currentLoc');
  if (locEl) locEl.textContent = display.length > 22 ? display.slice(0, 22) + '...' : display;
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

/* ── Search ── */
function searchMenu(query) {
  const q = query.trim().toLowerCase();
  const clearBtn = document.getElementById('searchClear');
  const mobileCats = document.getElementById('mobileCats');
  const secHd = document.querySelector('.section-hd');

  clearBtn.classList.toggle('hidden', q === '');

  if (!q) {
    clearSearch();
    return;
  }

  // Hide category nav and section header while searching
  mobileCats.style.display = 'none';
  secHd.style.display = 'none';

  // Gather all matching items across every category
  const results = [];
  categories.forEach(cat => {
    menu[cat.id].forEach(item => {
      if (
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        cat.label.toLowerCase().includes(q)
      ) {
        results.push({ ...item, catLabel: cat.label });
      }
    });
  });

  // Render results into menuSections
  const wrap = document.getElementById('menuSections');
  if (results.length === 0) {
    wrap.innerHTML = `
      <div class="no-results">
        <div class="nr-icon">🍣</div>
        <p>No items found for "<strong>${query}</strong>"</p>
        <p style="font-size:0.8rem;margin-top:6px;">Try searching "maki", "salmon", or "baked"</p>
      </div>`;
  } else {
    wrap.innerHTML = `
      <div class="search-results-hd">Showing <span>${results.length}</span> result${results.length > 1 ? 's' : ''} for "<span>${query}</span>"</div>
      <div class="menu-grid">${results.map(cardHTML).join('')}</div>`;
  }
}

function clearSearch() {
  const input = document.getElementById('menuSearch');
  input.value = '';
  document.getElementById('searchClear').classList.add('hidden');
  document.getElementById('mobileCats').style.display = '';
  document.querySelector('.section-hd').style.display = '';
  buildSections();
  setActiveCat(activeCat);
}

function getFullImagePath(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/images/')) return path;
  if (path.startsWith('images/')) return '/' + path;
  return '/images/' + path.replace(/^\/+/, '');
}

/* ── Item Detail Modal ── */
let currentItem = null;

function showItemModal(item) {
  currentItem = item;
  
  // Set image
  const imgEl = document.getElementById('modalImage');
  if (item.images && item.images.length > 0) {
    imgEl.src = getFullImagePath(item.images[0]);
  } else {
    imgEl.src = '';
  }

  document.getElementById('modalName').textContent = item.name;
  document.getElementById('modalDesc').textContent = item.desc || '';

  const variantsContainer = document.getElementById('modalVariants');
  const priceEl = document.getElementById('modalPrice');

  if (item.variants && item.variants.length > 0) {
    let html = `<select id="modalVariantSelect" onchange="updateModalPrice()">`;
    item.variants.forEach((v, i) => {
      html += `<option value="${i}" data-price="${v.price}">${v.size} — ₱${v.price} ${v.note ? '· ' + v.note : ''}</option>`;
    });
    html += `</select>`;
    variantsContainer.innerHTML = html;
    updateModalPrice();
  } else {
    variantsContainer.innerHTML = '';
    priceEl.textContent = item.price ? `₱${item.price}` : 'Contact us';
  }

  // Add to cart button
  const addBtn = document.getElementById('modalAddBtn');
  addBtn.onclick = () => {
    if (item.variants && item.variants.length) {
      addVariantToCart(item.id, item.name, item.emoji);
    } else {
      addToCart(item.id, item.name, item.price, item.emoji);
    }
    closeItemModal();
  };

  document.getElementById('itemModal').style.display = 'flex';
}

function updateModalPrice() {
  const sel = document.getElementById('modalVariantSelect');
  if (!sel) return;
  const price = sel.selectedOptions[0].getAttribute('data-price');
  document.getElementById('modalPrice').textContent = `₱${price}`;
}

function closeItemModal() {
  document.getElementById('itemModal').style.display = 'none';
}

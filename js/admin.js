/* ══════════════════════════════════════
   admin.js — Store Status + Full Inline Menu Editing + Add New Item
══════════════════════════════════════ */

let isAdminMode = false;
let adminMenu = null;

async function initAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') !== 'tisoy2025') return;

  isAdminMode = true;
  window.isAdminMode = true;
  document.getElementById('adminFab').classList.add('visible');

  try {
    const res = await fetch('/api/menu');
    const data = await res.json();
    adminMenu = data && Object.keys(data).length > 0
      ? data
      : JSON.parse(JSON.stringify(menu));
  } catch (e) {
    adminMenu = JSON.parse(JSON.stringify(menu));
  }

  window.adminMenu = adminMenu;
  buildSections();
}

// ==================== STORE STATUS ====================
function toggleAdminPanel() {
  const panel = document.getElementById('adminPanel');
  panel.classList.toggle('open');
}

function toggleOwnerClosed() {
  const tog = document.getElementById('adminToggle');
  const dot = document.getElementById('adminDot');
  const area = document.getElementById('adminMsgArea');

  const isOn = tog.classList.toggle('on');
  dot.classList.toggle('off', isOn);
  area.classList.toggle('show', isOn);
}

async function applyOwnerStatus() {
  const isClosed = document.getElementById('adminToggle').classList.contains('on');
  const msg = document.getElementById('adminMsgInput').value.trim();

  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store_closed: isClosed ? '1' : '0',
        store_message: msg || 'We are temporarily unavailable.'
      })
    });
  } catch (e) {
    showToast('⚠️ Failed to save status');
    console.error(e);
  }

  document.getElementById('adminPanel').classList.remove('open');
  checkStoreStatus();
  showToast(isClosed ? '🔴 Store is now CLOSED' : '✅ Store is now OPEN');
}

// ==================== ADD NEW MENU ITEM ====================

window.addNewItem = function() {
  const catOptions = categories.map(cat => 
    `<option value="\( {cat.id}"> \){cat.emoji} ${cat.label}</option>`
  ).join('');

  const html = `
    <input type="hidden" id="isNewItem" value="true">

    <div class="fg">
      <label><strong>Category *</strong></label>
      <select id="newItemCategory" class="full-width">
        ${catOptions}
      </select>
    </div>

    <div class="fg">
      <label><strong>Item Name *</strong></label>
      <input type="text" id="newItemName" placeholder="e.g. Spicy Salmon Maki">
    </div>

    <div class="fg">
      <label>Description (optional)</label>
      <textarea id="newItemDesc" rows="3" placeholder="Fresh salmon, spicy mayo, tempura bits..."></textarea>
    </div>

    <div class="fg">
      <label>Emoji</label>
      <input type="text" id="newItemEmoji" value="🍣" maxlength="2" style="font-size:1.8rem; width:80px; text-align:center;">
    </div>

    <div class="fg">
      <label>Image URL (optional)</label>
      <input type="text" id="newItemImage" placeholder="images/new-maki.jpg or full https:// link">
    </div>

    <div class="fg">
      <label>Price Type</label>
      <select id="newItemPriceType" onchange="togglePriceFields(this.value)">
        <option value="single">Single Price</option>
        <option value="variants">Multiple Variants / Sizes</option>
      </select>
    </div>

    <!-- Single Price -->
    <div id="singlePriceGroup" class="fg">
      <label>Price (₱)</label>
      <input type="number" id="newItemPrice" placeholder="259" value="259">
    </div>

    <!-- Variants -->
    <div id="variantsGroup" class="fg" style="display:none;">
      <label>Variants (one per line)</label>
      <textarea id="newItemVariants" rows="5" placeholder="Regular | 259&#10;Large | 359 | Best for sharing&#10;Party | 899 | Serves 4-5"></textarea>
      <small>Format: Size | Price | Note (optional)</small>
    </div>

    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeAdminEditModal()">Cancel</button>
      <button class="btn-primary" onclick="saveNewItem()">✅ Add Item</button>
    </div>
  `;

  document.getElementById('editModalBody').innerHTML = html;
  document.getElementById('adminEditModal').style.display = 'flex';
  document.querySelector('#adminEditModal .modal-hd h3').textContent = '➕ Add New Item';
};

window.togglePriceFields = function(type) {
  document.getElementById('singlePriceGroup').style.display = type === 'single' ? 'block' : 'none';
  document.getElementById('variantsGroup').style.display = type === 'variants' ? 'block' : 'none';
};

window.saveNewItem = async function() {
  const categoryId = document.getElementById('newItemCategory').value;
  const name = document.getElementById('newItemName').value.trim();

  if (!name) {
    alert("Item name is required!");
    return;
  }

  const newItem = {
    id: Date.now(),
    name: name,
    desc: document.getElementById('newItemDesc').value.trim(),
    emoji: document.getElementById('newItemEmoji').value.trim() || '🍣',
    images: []
  };

  // Image
  const imageUrl = document.getElementById('newItemImage').value.trim();
  if (imageUrl) newItem.images = [imageUrl];

  // Price / Variants
  if (document.getElementById('newItemPriceType').value === 'single') {
    const price = parseInt(document.getElementById('newItemPrice').value);
    if (price) newItem.price = price;
  } else {
    const lines = document.getElementById('newItemVariants').value.trim().split('\n');
    newItem.variants = lines.map(line => {
      const parts = line.split('|').map(p => p.trim());
      return {
        size: parts[0],
        price: parseInt(parts[1]),
        note: parts[2] || ''
      };
    }).filter(v => v.size && !isNaN(v.price));
  }

  // Add to menu
  if (!adminMenu[categoryId]) adminMenu[categoryId] = [];
  adminMenu[categoryId].push(newItem);

  await saveAdminMenu();
  buildSections();
  closeAdminEditModal();
  showToast(`✅ ${name} added successfully!`);
};

// ==================== EXISTING EDIT / DELETE FUNCTIONS ====================

function getAdminItem(catId, itemId) {
  if (!adminMenu || !adminMenu[catId]) return null;
  return adminMenu[catId].find(item => item.id === itemId);
}

function editItemInline(catId, itemId) {
  const item = getAdminItem(catId, itemId);
  if (!item) return alert("Item not found");

  // ... (your existing editItemInline code remains unchanged)
  let html = `
    <input type="hidden" id="editCatId" value="${catId}">
    <input type="hidden" id="editItemId" value="${itemId}">
    
    <div class="fg">
      <label>Image URL</label>
      <input id="editImageUrl" type="text" value="${item.images && item.images[0] ? item.images[0] : ''}" placeholder="images/filename.jpg or full URL">
      <div id="imagePreview" style="margin-top:10px; text-align:center;">
        ${item.images && item.images[0] ?
          `<img src="${item.images[0]}" style="max-height:180px; max-width:100%; border-radius:12px; border:1px solid #ddd;">` :
          '<p style="color:#999;">No image yet</p>'}
      </div>
    </div>

    <div class="fg">
      <label>Item Name *</label>
      <input id="editName" type="text" value="${(item.name || '').replace(/"/g, '&quot;')}">
    </div>
    <div class="fg">
      <label>Description</label>
      <textarea id="editDesc" rows="3">${(item.desc || '')}</textarea>
    </div>`;

  if (!item.variants || item.variants.length === 0) {
    html += `
      <div class="fg">
        <label>Price (₱)</label>
        <input id="editPrice" type="number" value="${item.price || ''}">
      </div>`;
  } else {
    html += `<h4 style="margin:20px 0 12px; color:var(--primary);">Price per Size</h4>`;
    item.variants.forEach((v, i) => {
      html += `
        <div class="fg">
          <label>${v.size} \( {v.note ? `( \){v.note})` : ''}</label>
          <input type="number" class="variant-price-input" data-index="\( {i}" value=" \){v.price || ''}">
        </div>`;
    });
  }

  html += `
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeAdminEditModal()">Cancel</button>
      <button class="btn-primary" onclick="saveEditedItem()">Save Changes</button>
    </div>`;

  document.getElementById('editModalBody').innerHTML = html;
  document.getElementById('adminEditModal').style.display = 'flex';
}

async function saveEditedItem() {
  const catId = document.getElementById('editCatId').value;
  const itemId = document.getElementById('editItemId').value;
  const item = getAdminItem(catId, Number(itemId));

  if (!item) return alert("Item not found");

  item.name = document.getElementById('editName').value.trim();
  item.desc = document.getElementById('editDesc').value.trim();

  const newImageUrl = document.getElementById('editImageUrl').value.trim();
  if (newImageUrl) item.images = [newImageUrl];

  if (!item.variants || item.variants.length === 0) {
    const price = parseInt(document.getElementById('editPrice').value);
    if (!isNaN(price)) item.price = price;
  } else {
    document.querySelectorAll('.variant-price-input').forEach(input => {
      const index = parseInt(input.dataset.index);
      const price = parseInt(input.value);
      if (!isNaN(price) && item.variants[index]) {
        item.variants[index].price = price;
      }
    });
  }

  await saveAdminMenu();
  buildSections();
  closeAdminEditModal();
  showToast("✅ Changes saved successfully!");
}

function closeAdminEditModal() {
  document.getElementById('adminEditModal').style.display = 'none';
}

async function toggleItemVisibility(catId, itemId) {
  const item = getAdminItem(catId, itemId);
  if (!item) return;
  item.available = item.available === false ? true : false;
  await saveAdminMenu();
  buildSections();
}

async function deleteItemInline(catId, itemId) {
  if (!confirm("Delete this item permanently?")) return;

  if (adminMenu[catId]) {
    adminMenu[catId] = adminMenu[catId].filter(item => item.id !== itemId);
    await saveAdminMenu();
    buildSections();
    showToast("🗑️ Item deleted");
  }
}

async function saveAdminMenu() {
  try {
    await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminMenu)
    });
  } catch (e) {
    showToast('⚠️ Failed to save — check server');
    console.error(e);
  }
}

// ==================== GLOBAL ACCESS ====================
window.editItemInline = editItemInline;
window.saveEditedItem = saveEditedItem;
window.closeAdminEditModal = closeAdminEditModal;
window.toggleItemVisibility = toggleItemVisibility;
window.deleteItemInline = deleteItemInline;
window.toggleAdminPanel = toggleAdminPanel;
window.toggleOwnerClosed = toggleOwnerClosed;
window.applyOwnerStatus = applyOwnerStatus;
window.addNewItem = addNewItem;           // ← Added

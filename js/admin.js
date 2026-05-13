/* ══════════════════════════════════════
   admin.js — Store Status + Full Inline Menu Editing
══════════════════════════════════════ */

let isAdminMode = false;
let adminMenu = null;

async function initAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') !== 'tisoy2025') return;

  isAdminMode = true;
  window.isAdminMode = true;
  document.getElementById('adminFab').classList.add('visible');

  // Load saved menu from server, fall back to original data.js menu
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

// ==================== ADMIN ITEM EDITING ====================

function getAdminItem(catId, itemId) {
  if (!adminMenu || !adminMenu[catId]) return null;
  return adminMenu[catId].find(item => item.id === itemId);
}

function editItemInline(catId, itemId) {
  const item = getAdminItem(catId, itemId);
  if (!item) return alert("Item not found");

  let html = `
    <input type="hidden" id="editCatId" value="${catId}">
    <input type="hidden" id="editItemId" value="${itemId}">
    
    <!-- Image Preview & URL -->
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

  // Price Section
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
          <label>${v.size} ${v.note ? `(${v.note})` : ''}</label>
          <input type="number" class="variant-price-input" data-index="${i}" value="${v.price || ''}">
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
  const itemId = parseInt(document.getElementById('editItemId').value);
  const item = getAdminItem(catId, itemId);

  if (!item) return alert("Item not found");

  item.name = document.getElementById('editName').value.trim();
  item.desc = document.getElementById('editDesc').value.trim();

  // Update Image URL
  const newImageUrl = document.getElementById('editImageUrl').value.trim();
  if (newImageUrl) {
    item.images = [newImageUrl];
  }

  // Update Price(s)
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

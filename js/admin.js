/* ══════════════════════════════════════
   admin.js — Store Status + Full Inline Menu Editing
══════════════════════════════════════ */

let isAdminMode = false;
let adminMenu = null;

function initAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') !== 'tisoy2025') return;

  isAdminMode = true;
  window.isAdminMode = true;
  document.getElementById('adminFab').classList.add('visible');

  // Load saved menu or original
  const saved = localStorage.getItem('tisoy_menu');
  adminMenu = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(menu));
  window.adminMenu = adminMenu;

  buildSections(); // Refresh with admin data
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

function applyOwnerStatus() {
  const isClosed = document.getElementById('adminToggle').classList.contains('on');
  const msg = document.getElementById('adminMsgInput').value.trim();

  if (isClosed) {
    localStorage.setItem('tisoy_owner_status', JSON.stringify({
      closed: true,
      message: msg || 'We are temporarily unavailable.'
    }));
  } else {
    localStorage.removeItem('tisoy_owner_status');
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

function saveEditedItem() {
  const catId = document.getElementById('editCatId').value;
  const itemId = parseInt(document.getElementById('editItemId').value);
  const item = getAdminItem(catId, itemId);

  if (!item) return alert("Item not found");

  item.name = document.getElementById('editName').value.trim();
  item.desc = document.getElementById('editDesc').value.trim();

  // Update Image
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

  saveAdminMenu();
  buildSections();
  closeAdminEditModal();
  showToast("✅ Changes saved successfully!");
}
function closeAdminEditModal() {
  document.getElementById('adminEditModal').style.display = 'none';
}

function toggleItemVisibility(catId, itemId) {
  const item = getAdminItem(catId, itemId);
  if (!item) return;
  
  item.available = item.available === false ? true : false;
  saveAdminMenu();
  buildSections();
}

function deleteItemInline(catId, itemId) {
  if (!confirm("Delete this item permanently?")) return;
  
  if (adminMenu[catId]) {
    adminMenu[catId] = adminMenu[catId].filter(item => item.id !== itemId);
    saveAdminMenu();
    buildSections();
    showToast("🗑️ Item deleted");
  }
}

function saveAdminMenu() {
  localStorage.setItem('tisoy_menu', JSON.stringify(adminMenu));
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

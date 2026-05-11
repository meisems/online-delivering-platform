/* ══════════════════════════════════════
   admin.js — Store Status + Inline Menu Editing
══════════════════════════════════════ */

let isAdminMode = false;
let adminMenu = null;

function initAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') !== 'tisoy2025') return;

  isAdminMode = true;
  window.isAdminMode = true;
  document.getElementById('adminFab').classList.add('visible');

  const saved = localStorage.getItem('tisoy_menu');
  adminMenu = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(menu));
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

function applyOwnerStatus() {
  const isClosed = document.getElementById('adminToggle').classList.contains('on');
  const msg = document.getElementById('adminMsgInput').value.trim();

  if (isClosed) {
    localStorage.setItem('tisoy_owner_status', JSON.stringify({ closed: true, message: msg || 'We are temporarily unavailable.' }));
  } else {
    localStorage.removeItem('tisoy_owner_status');
  }

  document.getElementById('adminPanel').classList.remove('open');
  checkStoreStatus();
  showToast(isClosed ? '🔴 Store is now CLOSED' : '✅ Store is now OPEN');
}

// ==================== ADMIN EDITING ====================
function getAdminItem(catId, itemId) {
  if (!adminMenu || !adminMenu[catId]) return null;
  return adminMenu[catId].find(item => item.id === itemId);
}

function editItemInline(catId, itemId) {
  const item = getAdminItem(catId, itemId);
  if (!item) return alert("Item not found");

  document.getElementById('editCatId').value = catId;
  document.getElementById('editItemId').value = itemId;
  document.getElementById('editName').value = item.name || '';
  document.getElementById('editDesc').value = item.desc || '';
  document.getElementById('editPrice').value = item.price || '';

  document.getElementById('adminEditModal').style.display = 'flex';
}

function saveEditedItem() {
  const catId = document.getElementById('editCatId').value;
  const itemId = parseInt(document.getElementById('editItemId').value);
  const item = getAdminItem(catId, itemId);

  if (!item) return alert("Item not found");

  const newName = document.getElementById('editName').value.trim();
  if (!newName) return alert("Item name cannot be empty!");

  item.name = newName;
  item.desc = document.getElementById('editDesc').value.trim();

  const newPrice = parseInt(document.getElementById('editPrice').value);
  
  // Update main price
  if (!isNaN(newPrice)) item.price = newPrice;

  // Also update first variant price (important for bulk items)
  if (item.variants && item.variants.length > 0) {
    item.variants[0].price = newPrice;
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

// Global functions
window.editItemInline = editItemInline;
window.saveEditedItem = saveEditedItem;
window.closeAdminEditModal = closeAdminEditModal;
window.toggleItemVisibility = toggleItemVisibility;
window.deleteItemInline = deleteItemInline;
window.toggleAdminPanel = toggleAdminPanel;
window.toggleOwnerClosed = toggleOwnerClosed;
window.applyOwnerStatus = applyOwnerStatus;

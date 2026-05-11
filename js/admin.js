/* ══════════════════════════════════════
   admin.js — Store Status + Inline Menu Editing
══════════════════════════════════════ */

let isAdminMode = false;
let adminMenu = null;

function initAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') !== 'tisoy2025') return;

  isAdminMode = true;
  document.getElementById('adminFab').classList.add('visible');

  // Load saved menu or use original
  const saved = localStorage.getItem('tisoy_menu');
  adminMenu = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(menu));

  // Rebuild menu with admin controls
  buildSections();
}

// ==================== STORE STATUS (Original Functions) ====================

function toggleAdminPanel() {
  const panel = document.getElementById('adminPanel');
  panel.classList.toggle('open');
}

function toggleOwnerClosed() {
  const tog  = document.getElementById('adminToggle');
  const dot  = document.getElementById('adminDot');
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

// ==================== INLINE ADMIN EDITING ====================

function getAdminItem(catId, itemId) {
  if (!adminMenu || !adminMenu[catId]) return null;
  return adminMenu[catId].find(item => item.id === itemId);
}

function editItemInline(catId, itemId) {
  const item = getAdminItem(catId, itemId);
  if (!item) return alert("Item not found");

  // Fill the form
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

  if (!item) return;

  item.name = document.getElementById('editName').value.trim();
  item.desc = document.getElementById('editDesc').value.trim();
  
  const newPrice = parseInt(document.getElementById('editPrice').value);
  if (!isNaN(newPrice)) item.price = newPrice;

  saveAdminMenu();
  buildSections();
  closeAdminEditModal();
  showToast("✅ Item updated successfully");
}

function closeAdminEditModal() {
  document.getElementById('adminEditModal').style.display = 'none';
}

// Make new functions global
window.saveEditedItem = saveEditedItem;
window.closeAdminEditModal = closeAdminEditModal;

// Make all functions globally accessible
window.editItemInline = editItemInline;
window.toggleItemVisibility = toggleItemVisibility;
window.deleteItemInline = deleteItemInline;
window.toggleAdminPanel = toggleAdminPanel;
window.toggleOwnerClosed = toggleOwnerClosed;
window.applyOwnerStatus = applyOwnerStatus;

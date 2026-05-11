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

  const newName = prompt("📝 Item Name:", item.name);
  if (newName === null) return;
  item.name = newName;

  item.desc = prompt("📝 Description:", item.desc || "") || item.desc;

  if (item.price !== undefined) {
    const newPrice = prompt("💰 Price:", item.price);
    if (newPrice !== null) item.price = parseInt(newPrice) || item.price;
  }

  saveAdminMenu();
  buildSections();
  showToast("✅ Item updated successfully");
}

function toggleItemVisibility(catId, itemId) {
  const item = getAdminItem(catId, itemId);
  if (!item) return;

  item.available = item.available === false ? true : false;
  saveAdminMenu();
  buildSections();
}

function deleteItemInline(catId, itemId) {
  if (!confirm("🗑️ Delete this item permanently?")) return;

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

// Make all functions globally accessible
window.editItemInline = editItemInline;
window.toggleItemVisibility = toggleItemVisibility;
window.deleteItemInline = deleteItemInline;
window.toggleAdminPanel = toggleAdminPanel;
window.toggleOwnerClosed = toggleOwnerClosed;
window.applyOwnerStatus = applyOwnerStatus;

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

  // Load saved menu
  const saved = localStorage.getItem('tisoy_menu');
  adminMenu = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(menu));

  // Render admin menu
  buildSections();
}

// Store Status Functions (kept as before)
function toggleAdminPanel() {
  const panel = document.getElementById('adminPanel');
  panel.classList.toggle('open');
}

function toggleOwnerClosed() { /* ... existing code ... */ }
function applyOwnerStatus() { /* ... existing code ... */ }

// ==================== INLINE ADMIN EDITING ====================

function getAdminItem(catId, itemId) {
  if (!adminMenu || !adminMenu[catId]) return null;
  return adminMenu[catId].find(item => item.id === itemId);
}

function editItemInline(catId, itemId) {
  const item = getAdminItem(catId, itemId);
  if (!item) return alert("Item not found");

  const newName = prompt("Item Name:", item.name);
  if (newName === null) return;
  item.name = newName;

  item.desc = prompt("Description:", item.desc || "") || item.desc;

  if (item.price !== undefined) {
    const newPrice = prompt("Price:", item.price);
    if (newPrice !== null) item.price = parseInt(newPrice) || item.price;
  }

  saveAdminMenu();
  buildSections();           // Refresh menu
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

// Make functions global
window.editItemInline = editItemInline;
window.toggleItemVisibility = toggleItemVisibility;
window.deleteItemInline = deleteItemInline;
window.toggleAdminPanel = toggleAdminPanel;
window.toggleOwnerClosed = toggleOwnerClosed;
window.applyOwnerStatus = applyOwnerStatus;

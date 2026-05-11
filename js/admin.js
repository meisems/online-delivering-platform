/* ══════════════════════════════════════
   admin.js — Enhanced Owner Panel
   Edit / Delete / Toggle Items
══════════════════════════════════════ */

let adminMenu = null; // working copy

function initAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') !== 'tisoy2025') return;

  document.getElementById('adminFab').classList.add('visible');

  // Load saved menu or use original
  const saved = localStorage.getItem('tisoy_menu');
  adminMenu = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(menu));

  // Render admin panel with more options
  renderAdminPanel();
}

function renderAdminPanel() {
  const panel = document.getElementById('adminPanel');
  panel.innerHTML = `
    <h4>⚙️ Owner Panel</h4>
    <div style="margin:12px 0; font-size:0.9rem; color:#666;">
      <strong>Admin Mode Active</strong> — Changes saved locally
    </div>
    
    <button onclick="addNewItem()" class="admin-btn">➕ Add New Item</button>
    <button onclick="resetMenu()" class="admin-btn secondary">Reset to Original Menu</button>
    
    <div id="adminItemsList" style="max-height:400px; overflow:auto; margin-top:15px;"></div>
  `;

  renderAdminItemsList();
}

function renderAdminItemsList() {
  const container = document.getElementById('adminItemsList');
  let html = '';

  Object.keys(adminMenu).forEach(catId => {
    html += `<h5 style="margin:15px 0 8px; color:var(--primary);">${catId}</h5>`;
    
    adminMenu[catId].forEach((item, index) => {
      const isAvailable = item.available !== false;
      html += `
        <div class="admin-item-row">
          <span>${item.name}</span>
          <div>
            <button onclick="toggleItemAvailability('${catId}', ${index})" class="small-btn ${isAvailable ? 'green' : 'red'}">
              ${isAvailable ? '✅ Visible' : '🚫 Hidden'}
            </button>
            <button onclick="editItem('${catId}', ${index})" class="small-btn">Edit</button>
            <button onclick="deleteItem('${catId}', ${index})" class="small-btn danger">Delete</button>
          </div>
        </div>`;
    });
  });

  container.innerHTML = html;
}

function toggleItemAvailability(catId, index) {
  const item = adminMenu[catId][index];
  item.available = !item.available;
  saveAdminMenu();
  renderAdminItemsList();
  buildSections(); // refresh menu
}

function editItem(catId, index) {
  const item = adminMenu[catId][index];
  const newName = prompt("Item Name:", item.name);
  if (newName === null) return;

  item.name = newName;
  item.desc = prompt("Description:", item.desc || '') || item.desc;
  
  if (item.price !== undefined) {
    item.price = parseInt(prompt("Price:", item.price)) || item.price;
  }

  alert("Item updated! (Image editing coming soon)");
  saveAdminMenu();
  buildSections();
  renderAdminItemsList();
}

function deleteItem(catId, index) {
  if (!confirm("Delete this item permanently?")) return;
  adminMenu[catId].splice(index, 1);
  saveAdminMenu();
  buildSections();
  renderAdminItemsList();
}

function addNewItem() {
  const catId = prompt("Which category? (bakedsushi, maki, platters, etc.)", "bakedsushi");
  if (!adminMenu[catId]) {
    alert("Invalid category!");
    return;
  }

  const name = prompt("Item Name:");
  if (!name) return;

  const newItem = {
    id: Date.now(),
    name: name,
    desc: prompt("Description:") || "",
    emoji: "🍣",
    price: parseInt(prompt("Price (0 = Contact us):")) || 0,
    images: []
  };

  adminMenu[catId].push(newItem);
  saveAdminMenu();
  buildSections();
  renderAdminItemsList();
}

function saveAdminMenu() {
  localStorage.setItem('tisoy_menu', JSON.stringify(adminMenu));
  showToast("✅ Changes saved");
}

function resetMenu() {
  if (confirm("Reset menu to original? All changes will be lost.")) {
    localStorage.removeItem('tisoy_menu');
    location.reload();
  }
}

// Make functions global
window.toggleItemAvailability = toggleItemAvailability;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.addNewItem = addNewItem;
window.resetMenu = resetMenu;

/* ══════════════════════════════════════
   admin.js — Owner Panel (Fixed + Enhanced)
   Store Status + Edit/Delete Items
══════════════════════════════════════ */

let adminMenu = null;

function initAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') !== 'tisoy2025') return;

  document.getElementById('adminFab').classList.add('visible');

  // Load saved menu or use default
  const savedMenu = localStorage.getItem('tisoy_menu');
  adminMenu = savedMenu ? JSON.parse(savedMenu) : JSON.parse(JSON.stringify(menu));

  // Restore store status
  const ov = getOwnerOverride();
  if (ov && ov.closed) {
    document.getElementById('adminToggle').classList.add('on');
    document.getElementById('adminDot').classList.add('off');
    document.getElementById('adminMsgArea').classList.add('show');
    document.getElementById('adminMsgInput').value = ov.message || '';
  }
}

function toggleAdminPanel() {
  const panel = document.getElementById('adminPanel');
  if (!panel.innerHTML.includes('Add New Item')) {
    renderFullAdminPanel();
  }
  panel.classList.toggle('open');
}

function renderFullAdminPanel() {
  const panel = document.getElementById('adminPanel');
  panel.innerHTML = `
    <h4>⚙️ Owner Panel</h4>
    
    <!-- Store Status -->
    <div class="admin-toggle-row">
      <span><span class="admin-status-dot" id="adminDot"></span> Temporarily Closed</span>
      <div class="toggle-switch" id="adminToggle" onclick="toggleOwnerClosed()"></div>
    </div>
    <div class="admin-msg-area" id="adminMsgArea">
      <label>Custom message for customers:</label>
      <textarea id="adminMsgInput" placeholder="e.g. Closed today for a family event..."></textarea>
    </div>
    <button class="admin-apply-btn" onclick="applyOwnerStatus()">✅ Apply Store Status</button>

    <hr style="margin:20px 0; border-color:#eee">

    <!-- Menu Management -->
    <button onclick="addNewItem()" class="admin-btn">➕ Add New Item</button>
    <button onclick="resetMenu()" class="admin-btn secondary">Reset Menu to Original</button>
    
    <div id="adminItemsList" style="max-height:420px; overflow:auto; margin-top:15px; font-size:0.95rem;"></div>
  `;

  renderAdminItemsList();
}

function renderAdminItemsList() {
  const container = document.getElementById('adminItemsList');
  let html = '<strong>Menu Items (Click to manage)</strong><br><br>';

  Object.keys(adminMenu).forEach(catId => {
    html += `<h5 style="margin:12px 0 6px; color:var(--primary);">${catId.toUpperCase()}</h5>`;
    
    adminMenu[catId].forEach((item, index) => {
      const isAvailable = item.available !== false;
      html += `
        <div class="admin-item-row">
          <span>${item.name}</span>
          <div>
            <button onclick="toggleItemAvailability('${catId}', ${index})" class="small-btn ${isAvailable ? 'green' : 'red'}">
              ${isAvailable ? '✅' : '🚫'}
            </button>
            <button onclick="editItem('${catId}', ${index})" class="small-btn">✏️</button>
            <button onclick="deleteItem('${catId}', ${index})" class="small-btn danger">🗑️</button>
          </div>
        </div>`;
    });
  });

  container.innerHTML = html;
}

// ==================== ITEM MANAGEMENT ====================

function toggleItemAvailability(catId, index) {
  const item = adminMenu[catId][index];
  item.available = !item.available;
  saveAdminMenu();
  renderAdminItemsList();
  buildSections(); // refresh public menu
}

function editItem(catId, index) {
  const item = adminMenu[catId][index];
  
  const newName = prompt("📝 Item Name:", item.name);
  if (newName === null) return;
  item.name = newName;

  item.desc = prompt("📝 Description:", item.desc || '') || item.desc;
  
  if (item.price !== undefined) {
    const newPrice = prompt("💰 Price (number only):", item.price);
    if (newPrice !== null) item.price = parseInt(newPrice) || item.price;
  }

  saveAdminMenu();
  buildSections();
  renderAdminItemsList();
  showToast("✅ Item updated");
}

function deleteItem(catId, index) {
  if (!confirm("Delete this item permanently?")) return;
  
  adminMenu[catId].splice(index, 1);
  saveAdminMenu();
  buildSections();
  renderAdminItemsList();
}

function addNewItem() {
  const catId = prompt("Category ID (e.g. bakedsushi, maki, platters):", "bakedsushi");
  if (!adminMenu[catId]) {
    if (confirm("Category doesn't exist. Create it?")) {
      adminMenu[catId] = [];
    } else return;
  }

  const name = prompt("New Item Name:");
  if (!name) return;

  const newItem = {
    id: Date.now(),
    name: name,
    desc: prompt("Description (optional):") || "Fresh and delicious",
    price: parseInt(prompt("Price:", "299")) || 299,
    available: true
  };

  adminMenu[catId].push(newItem);
  saveAdminMenu();
  buildSections();
  renderAdminItemsList();
}

// ==================== SAVE & RESET ====================

function saveAdminMenu() {
  localStorage.setItem('tisoy_menu', JSON.stringify(adminMenu));
}

function resetMenu() {
  if (confirm("Reset ALL menu changes to original?")) {
    localStorage.removeItem('tisoy_menu');
    location.reload();
  }
}

// Keep original functions
function toggleOwnerClosed() {
  const tog  = document.getElementById('adminToggle');
  const dot  = document.getElementById('adminDot');
  const area = document.getElementById('adminMsgArea');
  const isOn = tog.classList.toggle('on');
  dot.classList.toggle('off', isOn);
  area.classList.toggle('show', isOn);
}

function applyOwnerStatus() {
  const isOn = document.getElementById('adminToggle').classList.contains('on');
  const msg  = document.getElementById('adminMsgInput').value.trim();

  if (isOn) {
    localStorage.setItem('tisoy_owner_status', JSON.stringify({
      closed: true,
      message: msg || 'We are temporarily unavailable.'
    }));
  } else {
    localStorage.removeItem('tisoy_owner_status');
  }

  document.getElementById('adminPanel').classList.remove('open');
  delete document.getElementById('closedOverlay').dataset.dismissed;
  checkStoreStatus();
  showToast(isOn ? '🔴 Store set to CLOSED' : '✅ Store set to OPEN');
}

// Make functions available globally
window.toggleItemAvailability = toggleItemAvailability;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.addNewItem = addNewItem;
window.resetMenu = resetMenu;
window.toggleAdminPanel = toggleAdminPanel;
window.toggleOwnerClosed = toggleOwnerClosed;
window.applyOwnerStatus = applyOwnerStatus;

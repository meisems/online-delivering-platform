/* ══════════════════════════════════════
   admin.js — Owner / Admin panel
══════════════════════════════════════ */

function initAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') === 'tisoy2025') {
    document.getElementById('adminFab').classList.add('visible');

    // Restore saved override state into the panel UI
    const ov = getOwnerOverride();
    if (ov && ov.closed) {
      document.getElementById('adminToggle').classList.add('on');
      document.getElementById('adminDot').classList.add('off');
      document.getElementById('adminMsgArea').classList.add('show');
      document.getElementById('adminMsgInput').value = ov.message || '';
    }
  }
}

function toggleAdminPanel() {
  document.getElementById('adminPanel').classList.toggle('open');
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
  const isOn = document.getElementById('adminToggle').classList.contains('on');
  const msg  = document.getElementById('adminMsgInput').value.trim();

  if (isOn) {
    localStorage.setItem('tisoy_owner_status', JSON.stringify({
      closed: true,
      message: msg || 'We are temporarily unavailable. Sorry for the inconvenience! Please message us on WhatsApp.'
    }));
  } else {
    localStorage.removeItem('tisoy_owner_status');
  }

  document.getElementById('adminPanel').classList.remove('open');
  // Reset dismissed flag so the overlay re-appears if closed
  delete document.getElementById('closedOverlay').dataset.dismissed;
  checkStoreStatus();
  showToast(isOn ? '🔴 Store set to CLOSED' : '✅ Store set to OPEN');
}

/* ══════════════════════════════════════
   checkout.js — Checkout form & order placement
══════════════════════════════════════ */

let payMethod = 'cod';
let orderSeq = 1000 + Math.floor(Math.random() * 500);

function openCheckout() {
  if (!storeOpen) { 
    showToast('🔴 Store is currently closed.'); 
    return; 
  }
  if (!cartCount()) return;

  closeCartDrawer();

  const items = cartItems();
  const tot = total();

  let html = '<h4>🍣 Order Summary</h4>';
  items.forEach(i => {
    html += `<div class="om-row"><span>${i.emoji} ${i.name} x${i.qty}</span><span>₱${i.price * i.qty}</span></div>`;
  });

  html += `<div class="om-row"><span>Delivery Fee</span><span style="color:#e67e00;font-weight:800;">Via Lalamove</span></div>`;
  html += `<div class="om-total"><span>Items Total</span><span>₱${tot}</span></div>`;

  document.getElementById('checkoutSummary').innerHTML = html;

  // Show address group only for delivery
  document.getElementById('addrGroup').style.display =
    (orderType === 'pickup' || orderType === 'dinein') ? 'none' : '';

  openModal('checkoutModal');
}

function selPay(el, method) {
  document.querySelectorAll('.pay-opt').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
  payMethod = method;
}

function placeOrder() {
  const fn = document.getElementById('fname').value.trim();
  const ln = document.getElementById('lname').value.trim();
  const ph = document.getElementById('phone').value.trim();
  const ad = document.getElementById('addr').value.trim();
  const areaSelect = document.getElementById('areaSelect'); 
  const barangay = areaSelect ? areaSelect.value : '';
  const notes = document.getElementById('notes').value.trim();

  if (!fn || !ln) { 
    showToast('⚠️ Please enter your full name'); 
    return; 
  }
  if (!ph) { 
    showToast('⚠️ Please enter your mobile number'); 
    return; 
  }
  if (orderType === 'delivery') {
    if (!ad) { 
      showToast('⚠️ Please enter your delivery address'); 
      return; 
    }
    if (!barangay) { 
      showToast('⚠️ Please select your Barangay / Area'); 
      return; 
    }
  }

  orderSeq++;
  const orderNum = '#TSM-' + orderSeq;

  // Build order message
  let msg = `🍣 *NEW ORDER — Tisoy Sushi Maki*\n\n`;
  msg += `📌 Order No.: ${orderNum}\n`;
  msg += `👤 Customer: ${fn} ${ln}\n`;
  msg += `📞 Contact: ${ph}\n`;
  
  if (orderType === 'delivery') {
    if (ad) msg += `📍 Address: ${ad}\n`;
    if (barangay) msg += `📍 Area: ${barangay}\n`;
  }

  msg += `🚚 Order Type: ${orderType === 'delivery' ? 'Delivery' : orderType === 'pickup' ? 'Pick-up' : 'Dine-in'}\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🛒 ORDER ITEMS:\n\n`;

  cartItems().forEach(i => {
    msg += `• ${i.name}\n Qty: \( {i.qty} × ₱ \){i.price} = ₱${i.price * i.qty}\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 Items Total: ₱${total()}\n`;
  msg += `🚗 Delivery Fee: Via Lalamove\n`;
  if (notes) msg += `📝 Notes: ${notes}\n`;
  msg += `💳 Payment: ${payMethod.toUpperCase()}\n`;
  msg += `⏰ Ordered via Website`;

  // Open Facebook Messenger
  const fbUrl = `https://www.facebook.com/messages/t/61556171585372?text=${encodeURIComponent(msg)}`;
  window.open(fbUrl, '_blank');

  // Clear cart & show success
  cart = {};
  renderCart();
  closeModal('checkoutModal');

  document.getElementById('orderNumEl').textContent = orderNum;
  openModal('successModal');

  showToast('✅ Order sent to Tisoy Sushi Maki!');
}

function closeSuccess() {
  closeModal('successModal');
  // Clear form fields
  ['fname', 'lname', 'phone', 'addr', 'barangay', 'notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// Expose functions globally
window.openCheckout = openCheckout;
window.selPay = selPay;
window.placeOrder = placeOrder;
window.closeSuccess = closeSuccess;

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
  if (cartCount() === 0) {
    showToast('🛒 Your cart is empty!');
    return;
  }

  closeCartDrawer();

  const items = cartItems();
  const tot = total();

  let html = `<h4>🍣 Order Summary</h4>`;

  items.forEach(i => {
    const itemTotal = i.price * i.qty;
    html += `
      <div class="om-row">
        <span>${i.emoji || '🍣'} ${i.name} × ${i.qty}</span>
        <span>₱${itemTotal}</span>
      </div>
    `;
  });

  html += `
    <div class="om-row">
      <span>Delivery Fee</span>
      <span style="color:#e67e00; font-weight:800;">Via Lalamove</span>
    </div>
    <div class="om-total">
      <span><strong>Total</strong></span>
      <span><strong>₱${tot}</strong></span>
    </div>
  `;

  document.getElementById('checkoutSummary').innerHTML = html;

  // Show/hide address section based on order type
  const addrGroup = document.getElementById('addrGroup');
  if (addrGroup) {
    addrGroup.style.display = (orderType === 'delivery') ? 'block' : 'none';
  }

  openModal('checkoutModal');
}

function selPay(el, method) {
  document.querySelectorAll('.pay-opt').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
  payMethod = method;
}

function placeOrder() {
  try {
    const fname = document.getElementById('fname')?.value.trim() || '';
    const lname = document.getElementById('lname')?.value.trim() || '';
    const phone = document.getElementById('phone')?.value.trim() || '';
    const addr = document.getElementById('addr')?.value.trim() || '';
    const areaSelect = document.getElementById('areaSelect');
    const barangay = areaSelect ? areaSelect.value : '';
    const notes = document.getElementById('notes')?.value.trim() || '';

    // Validation
    if (!fname || !lname) {
      showToast('⚠️ Please enter your full name');
      return;
    }
    if (!phone) {
      showToast('⚠️ Please enter your mobile number');
      return;
    }
    if (orderType === 'delivery') {
      if (!addr) {
        showToast('⚠️ Please enter your delivery address');
        return;
      }
      if (!barangay) {
        showToast('⚠️ Please select your area / barangay');
        return;
      }
    }

    // Create order message
    const orderNum = '#TSM-' + (Date.now().toString().slice(-6));

    let msg = `🍣 *NEW ORDER — Tisoy Sushi Maki*\n\n`;
    msg += `📌 Order No.: ${orderNum}\n`;
    msg += `👤 Customer: ${fname} ${lname}\n`;
    msg += `📞 Contact: ${phone}\n`;

    if (orderType === 'delivery') {
      msg += `📍 Address: ${addr}\n`;
      if (barangay) msg += `📍 Area: ${barangay}\n`;
    }

    msg += `🚚 Type: ${orderType.toUpperCase()}\n\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🛒 ITEMS:\n\n`;

    cartItems().forEach(item => {
      msg += `• ${item.name} × \( {item.qty} = ₱ \){item.price * item.qty}\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 Total: ₱${total()}\n`;
    msg += `💳 Payment: ${payMethod ? payMethod.toUpperCase() : 'Cash'}\n`;
    if (notes) msg += `📝 Notes: ${notes}\n`;

    // Send via Messenger
    const fbUrl = `https://www.facebook.com/messages/t/61556171585372?text=${encodeURIComponent(msg)}`;
    window.open(fbUrl, '_blank');

    // Success flow
    cart = {};
    renderCart();
    closeModal('checkoutModal');

    document.getElementById('orderNumEl').textContent = orderNum;
    openModal('successModal');

    showToast('✅ Order sent successfully!');

  } catch (err) {
    console.error("Place Order Error:", err);
    showToast('❌ Something went wrong. Check console (F12)');
  }
}

function closeSuccess() {
  closeModal('successModal');
  // Clear form fields
  ['fname', 'lname', 'phone', 'addr', 'barangay', 'notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// Make functions available globally
window.placeOrder = placeOrder;
window.openCheckout = openCheckout;
window.selPay = selPay || function(){};
window.closeSuccess = closeSuccess || function(){};

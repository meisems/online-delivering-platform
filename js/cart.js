/* ══════════════════════════════════════
   cart.js — Cart state & rendering
══════════════════════════════════════ */

/* ── Cart state (shared globals set in app.js) ──
   cart       = {}
   orderType  = 'delivery'
   storeOpen  = true
*/

/* ── Helpers ── */
const cartItems   = () => Object.values(cart);
const cartCount   = () => cartItems().reduce((a, i) => a + i.qty, 0);
const subtotal    = () => cartItems().reduce((a, i) => a + i.price * i.qty, 0);
const total       = () => subtotal(); // delivery fee is via Lalamove (TBD)

/* ── Mutations ── */
function addToCart(id, name, price, emoji) {
  if (!storeOpen) {
    showToast('🔴 Store is currently closed. Please come back during business hours.');
    return;
  }
  if (!cart[id]) cart[id] = { id, name, price, emoji, qty: 0 };
  cart[id].qty++;
  renderCart();
  showToast(`${emoji} ${name} added!`);
  const btn = document.getElementById('navCartBtn');
  btn.classList.add('pulse');
  setTimeout(() => btn.classList.remove('pulse'), 350);
}

function updateQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  renderCart();
}

function removeItem(id) {
  delete cart[id];
  renderCart();
}

/* ── Render ── */
function renderCart() {
  const items = cartItems();
  const cnt   = cartCount();
  const sub   = subtotal();
  const tot   = total();

  // Navbar badge
  const nc = document.getElementById('navCartCount');
  nc.textContent = cnt;
  nc.classList.toggle('hidden', cnt === 0);

  // Order type label
  const typeLabel = orderType === 'delivery' ? '🛵 Delivery'
                  : orderType === 'pickup'   ? '🚶 Pick Up'
                  : '🍽️ Dine-In';
  const otEl = document.getElementById('cartOrderType');
  if (otEl) otEl.textContent = typeLabel;

  // Floating cart button (mobile)
  const fb = document.getElementById('floatCart');
  if (cnt > 0) {
    fb.style.display = 'flex';
    document.getElementById('fcCount').textContent = cnt;
    document.getElementById('fcTotal').textContent = '₱' + tot;
  } else {
    fb.style.display = 'none';
  }

  // HTML blocks
  const bodyHTML = cnt === 0
    ? `<div class="cart-empty"><div class="e-icon">🍣</div><p>Your cart is empty.<br>Add your favorite sushi!</p></div>`
    : items.map(cartItemHTML).join('');
  const sumHTML = cnt > 0 ? cartSumHTML(sub, tot) : '';

  document.getElementById('desktopCartBd').innerHTML = bodyHTML;
  document.getElementById('desktopCartSum').innerHTML = sumHTML;
  document.getElementById('mobileCartBd').innerHTML  = bodyHTML;
  document.getElementById('mobileCartSum').innerHTML  = sumHTML;
}

function cartItemHTML(item) {
  return `
  <div class="cart-item">
    <div class="ci-emoji">${item.emoji}</div>
    <div class="ci-info">
      <h4>${item.name}</h4>
      <div class="ci-price">₱${item.price} each</div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="updateQty(${item.id},-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${item.id},1)">+</button>
        <button class="rm-btn" onclick="removeItem(${item.id})">🗑️</button>
      </div>
    </div>
    <div class="ci-total">₱${item.price * item.qty}</div>
  </div>`;
}

function cartSumHTML(sub, tot) {
  return `
  <div class="cart-summary">
    <div class="sum-row"><span>Subtotal</span><span>₱${sub}</span></div>
    <div class="sum-row"><span>Delivery Fee</span><span style="color:#e67e00;font-weight:800;">Via Lalamove</span></div>
    <div class="sum-row total"><span>Items Total</span><span>₱${tot}</span></div>
    <button class="checkout-btn" onclick="openCheckout()">Proceed to Checkout →</button>
    <a class="wa-order-btn" href="${buildWAMsg()}" target="_blank">
      <svg width="15" height="15" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Order via WhatsApp
    </a>
    <p class="cart-note">Delivery fee via Lalamove · Est. 30–60 min</p>
  </div>`;
}

function buildWAMsg() {
  const items = cartItems();
  if (!items.length) return 'https://wa.me/639916758883';
  let msg = 'Hi Tisoy Sushi Maki! 🍣 I would like to order:\n\n';
  items.forEach(i => msg += `• ${i.name} x${i.qty} — ₱${i.price * i.qty}\n`);
  msg += `\n*Items Total: ₱${total()}*\n*Order Type: ${orderType}*`;
  return 'https://wa.me/639916758883?text=' + encodeURIComponent(msg);
}

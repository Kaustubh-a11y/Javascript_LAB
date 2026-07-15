// Practical 05 — Cart Calculator
// Demonstrates: array methods (map, filter, reduce, forEach), objects, spread operator

const products = [
  { id: 1, name: 'Notebook', emoji: '📓', price: 120 },
  { id: 2, name: 'Pen Set', emoji: '🖊️', price: 85 },
  { id: 3, name: 'Backpack', emoji: '🎒', price: 450 },
  { id: 4, name: 'Water Bottle', emoji: '💧', price: 199 },
  { id: 5, name: 'Headphones', emoji: '🎧', price: 599 },
  { id: 6, name: 'USB Drive', emoji: '💾', price: 350 },
  { id: 7, name: 'Mouse Pad', emoji: '🖱️', price: 149 },
  { id: 8, name: 'Desk Lamp', emoji: '💡', price: 475 }
];

let cart = [];

// Discount tiers using object
const discountTiers = [
  { min: 500, pct: 15, label: '🎉 15% off on orders above ₹500!' },
  { min: 250, pct: 10, label: '🔥 10% off on orders above ₹250!' },
  { min: 100, pct: 5,  label: '✨ 5% off on orders above ₹100!' }
];

function getDiscount(subtotal) {
  // find() returns first match
  return discountTiers.find(tier => subtotal >= tier.min) || null;
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  // Using map to transform array → HTML
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="emoji">${p.emoji}</div>
      <div class="name">${p.name}</div>
      <div class="price">₹${p.price}</div>
      <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('');
}

function addToCart(productId) {
  // find() to locate product
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Check if already in cart
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    // Spread operator to copy product and add qty
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;

  // filter() to remove zero-qty items
  cart = cart.filter(i => i.qty > 0);
  renderCart();
}

function removeFromCart(productId) {
  // filter() to exclude item
  cart = cart.filter(i => i.id !== productId);
  renderCart();
}

function renderCart() {
  const cartBody = document.getElementById('cartBody');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartTableWrap = document.getElementById('cartTableWrap');
  const totalsCard = document.getElementById('totalsCard');
  const cartCount = document.getElementById('cartCount');

  // reduce() to count total items
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartTableWrap.style.display = 'none';
    totalsCard.style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  cartTableWrap.style.display = 'block';
  totalsCard.style.display = 'block';

  // map() to build table rows
  cartBody.innerHTML = cart.map(item => `
    <tr>
      <td>${item.emoji} ${item.name}</td>
      <td>₹${item.price}</td>
      <td>
        <div class="qty-control">
          <button onclick="updateQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </td>
      <td><strong>₹${(item.price * item.qty).toFixed(2)}</strong></td>
      <td><button onclick="removeFromCart(${item.id})" style="background:none;border:none;color:#EF4444;cursor:pointer;font-size:1rem;">✕</button></td>
    </tr>
  `).join('');

  // reduce() for subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = getDiscount(subtotal);

  document.getElementById('subtotalVal').textContent = `₹${subtotal.toFixed(2)}`;

  const discountRow = document.getElementById('discountRow');
  const discountBadge = document.getElementById('discountBadge');

  if (discount) {
    const discAmount = subtotal * (discount.pct / 100);
    discountRow.style.display = 'flex';
    document.getElementById('discPct').textContent = discount.pct;
    document.getElementById('discVal').textContent = `-₹${discAmount.toFixed(2)}`;
    document.getElementById('grandTotal').textContent = `₹${(subtotal - discAmount).toFixed(2)}`;
    discountBadge.innerHTML = `<span class="discount-info">${discount.label}</span>`;
  } else {
    discountRow.style.display = 'none';
    document.getElementById('grandTotal').textContent = `₹${subtotal.toFixed(2)}`;
    discountBadge.innerHTML = '<span class="discount-info">Add ₹' + (100 - subtotal).toFixed(0) + ' more for 5% off!</span>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
});

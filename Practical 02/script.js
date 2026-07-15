// Practical 02 — Billing Calculator
// Demonstrates: var, let, const, template literals, destructuring

// Using var (function-scoped) for the items array
var billItems = [];

document.addEventListener('DOMContentLoaded', () => {
  const itemNameInput = document.getElementById('itemName');
  const itemQtyInput = document.getElementById('itemQty');
  const itemPriceInput = document.getElementById('itemPrice');
  const itemsList = document.getElementById('itemsList');

  // Add Item
  document.getElementById('btnAddItem').addEventListener('click', () => {
    // Using let for block-scoped variables
    let name = itemNameInput.value.trim();
    let qty = parseInt(itemQtyInput.value) || 0;
    let price = parseFloat(itemPriceInput.value) || 0;

    if (!name || qty <= 0 || price <= 0) {
      alert('Please fill in all item fields with valid values.');
      return;
    }

    // Using const for immutable reference
    const item = { name, qty, price, total: qty * price };
    billItems.push(item);

    renderItems();

    // Clear inputs
    itemNameInput.value = '';
    itemQtyInput.value = '1';
    itemPriceInput.value = '';
    itemNameInput.focus();
  });

  function renderItems() {
    if (billItems.length === 0) {
      itemsList.innerHTML = '<p class="text-muted text-sm mt-1">No items added yet.</p>';
      return;
    }

    // Template literals for building HTML
    itemsList.innerHTML = billItems.map((item, index) => `
      <div class="item-row fade-in">
        <span>${item.name} × ${item.qty} @ ₹${item.price.toFixed(2)}</span>
        <span>
          <strong>₹${item.total.toFixed(2)}</strong>
          <button class="remove-btn" data-index="${index}" title="Remove">✕</button>
        </span>
      </div>
    `).join('');

    // Attach remove handlers
    itemsList.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        billItems.splice(idx, 1);
        renderItems();
      });
    });
  }

  renderItems();

  // Generate Bill
  document.getElementById('btnGenerate').addEventListener('click', () => {
    if (billItems.length === 0) {
      alert('Add at least one item before generating the bill.');
      return;
    }

    // Destructuring to extract values
    const { value: custName } = document.getElementById('custName');
    const { value: storeName } = document.getElementById('storeName');
    const applyGst = document.getElementById('gstToggle').checked;

    // const for calculated values
    const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
    const gstRate = 0.18;
    const gstAmount = applyGst ? subtotal * gstRate : 0;
    const grandTotal = subtotal + gstAmount;

    // Fill receipt using template literals
    document.getElementById('receiptStore').textContent = storeName || 'QuickMart';
    document.getElementById('receiptDate').textContent = `Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}`;
    document.getElementById('receiptCust').textContent = custName || 'Walk-in Customer';

    // Build receipt items
    const receiptItemsDiv = document.getElementById('receiptItems');
    receiptItemsDiv.innerHTML = billItems.map(({ name, qty, price, total }) =>
      `<div class="receipt-line">
        <span>${name} × ${qty}</span>
        <span>₹${total.toFixed(2)}</span>
      </div>`
    ).join('');

    document.getElementById('receiptSub').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('receiptGst').textContent = `₹${gstAmount.toFixed(2)}`;
    document.getElementById('receiptGstRow').style.display = applyGst ? 'flex' : 'none';
    document.getElementById('receiptTotal').textContent = `₹${grandTotal.toFixed(2)}`;

    // Show receipt
    const receipt = document.getElementById('receipt');
    receipt.classList.add('show');
    receipt.scrollIntoView({ behavior: 'smooth' });
  });
});

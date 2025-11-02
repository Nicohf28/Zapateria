
const fmt = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

// Obtener todos los productos
async function getProducts() {
  const res = await fetch('/api/products');
  return res.json();
}

// Obtener carrito, asegurando que sea un array
async function getCart() {
  const res = await fetch('/api/cart');
  const data = await res.json();
  return Array.isArray(data) ? data : data.cart || [];
}

// Actualiza el contador del carrito en todas las partes de la página
async function updateCartCount() {
  const cart = await getCart();
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = String(cart.reduce((a, i) => a + i.qty, 0));
  });
}

// Renderizar el carrito en la tabla
async function renderCart() {
  const [products, cart] = await Promise.all([getProducts(), getCart()]);
  const map = new Map(products.map(p => [p.id, p]));
  const tbody = document.getElementById('cart-body');

  let total = 0;

  tbody.innerHTML = cart.map(item => {
    const p = map.get(item.productId);
    const sub = p ? p.price * item.qty : 0;
    total += sub;
    return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${p?.image || ''}" alt="${p?.name || ''}" width="70" height="50" class="rounded">
            <div>
              <div class="fw-semibold">${p?.name || 'Producto'}</div>
              <div class="text-muted">${fmt(p?.price || 0)}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="input-group" style="max-width:160px">
            <button class="btn btn-outline-secondary btn-sm" data-action="dec" data-id="${item.productId}">-</button>
            <input class="form-control form-control-sm text-center" value="${item.qty}" readonly>
            <button class="btn btn-outline-secondary btn-sm" data-action="inc" data-id="${item.productId}">+</button>
          </div>
        </td>
        <td class="fw-semibold">${fmt(sub)}</td>
        <td><button class="btn btn-outline-danger btn-sm" data-action="remove" data-id="${item.productId}">Quitar</button></td>
      </tr>
    `;
  }).join('');

  document.getElementById('cart-total').textContent = fmt(total);

  // Actualiza contador en navbar
  updateCartCount();

  // Agregar eventos a botones
  tbody.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;

      if (action === 'remove') {
        await fetch('/api/cart/remove', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: id }) });
      } else if (action === 'inc') {
        await fetch('/api/cart/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: id, qty: 1 }) });
      } else if (action === 'dec') {
        const currentQty = (await getCart()).find(i => i.productId === id)?.qty || 0;
        await fetch('/api/cart/remove', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: id }) });
        const newQty = Math.max(0, currentQty - 1);
        if (newQty > 0) {
          await fetch('/api/cart/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: id, qty: newQty }) });
        }
      }

      renderCart(); // actualizar vista
    });
  });
}

// Botón para vaciar carrito
document.getElementById('btn-clear')?.addEventListener('click', async () => {
  await fetch('/api/cart/clear', { method: 'POST' });
  renderCart();
});

// Carga inicial del carrito
renderCart();

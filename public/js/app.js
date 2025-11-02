
// public/js/app.js

const fmt = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
let allProducts = []; // Guardamos todos los productos para filtrar

// --- CONTADOR DE CARRITO ---
// Actualiza todos los elementos con id="cart-count"
async function updateCartCount() {
  try {
    const res = await fetch('/api/cart');
    const cart = await res.json();
    const count = Array.isArray(cart)
      ? cart.reduce((acc, i) => acc + i.qty, 0)
      : (cart.cart || []).reduce((acc, i) => acc + i.qty, 0);

    document.querySelectorAll('#cart-count').forEach(el => {
      el.textContent = String(count);
    });
  } catch (error) {
    console.error("Error actualizando contador del carrito:", error);
  }
}

// --- CARGA Y RENDER DE PRODUCTOS ---
async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    allProducts = products; // Guardamos todos los productos
    renderProducts(products);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    document.getElementById('product-list').innerHTML = `
      <div class="col-12 text-center text-danger py-5">
        <p>No se pudieron cargar los productos. Intenta nuevamente más tarde.</p>
      </div>
    `;
  }
}

// --- FUNCIÓN PARA TOAST LOCAL ---
function showCartToast(btn) {
  const toast = document.createElement("div");
  toast.className = "toast align-items-center text-bg-success border-0 show position-absolute";
  toast.style.top = "-40px";
  toast.style.right = "0";
  toast.style.zIndex = "1000";
  toast.style.transition = "opacity 0.3s ease";

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body small fw-semibold">
        🛒 Producto agregado al carrito
      </div>
    </div>
  `;

  // Insertar dentro del contenedor del botón
  const parent = btn.closest(".card-body");
  parent.style.position = "relative";
  parent.appendChild(toast);

  // Desaparece después de 1.5s
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 1500);
}

// Renderiza productos en el DOM
function renderProducts(products) {
  const list = document.getElementById('product-list');

  if (!products || products.length === 0) {
    list.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">No se encontraron productos con esos criterios.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = products.map(p => `
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="card h-100 shadow-sm border-0">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column position-relative">
          <h5 class="card-title text-primary fw-semibold">${p.name}</h5>
          <p class="text-muted small mb-3 flex-grow-1">${p.description}</p>
          <p class="fw-bold text-dark mb-3">${fmt(p.price)}</p>
          <div class="mt-auto d-flex gap-2">
            <button class="btn btn-primary flex-fill" data-id="${p.id}" data-qty="1">
              Agregar
            </button>
            <a href="/cart.html" class="btn btn-outline-secondary flex-fill">
              Ver carrito
            </a>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Agregar eventos a los botones "Agregar"
  list.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const productId = Number(btn.dataset.id);
      const qty = Number(btn.dataset.qty);

      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty })
      });

      // Actualizamos el contador en todas partes
      updateCartCount();

      // ✅ Mostrar Toast local cerca del botón
      showCartToast(btn);
    });
  });

  // Actualizar contador al renderizar productos
  updateCartCount();
}

// --- FILTRO SIN RECARGAR ---
const searchInput = document.getElementById('search-name');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const filterBtn = document.getElementById('filter-btn');

filterBtn.addEventListener('click', () => {
  const nameQuery = searchInput.value.toLowerCase().trim();
  const min = Number(minPriceInput.value.replace(/[\.,]/g, '')) || 0;
  const max = Number(maxPriceInput.value.replace(/[\.,]/g, '')) || Infinity;

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(nameQuery) &&
    p.price >= min &&
    p.price <= max
  );

  renderProducts(filtered);
});

// --- CARGA INICIAL ---
loadProducts();
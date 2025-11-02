
// src/routes/cart.ts
import { Router } from "express";
import type { CartItem, Product } from "../types/index.d.js";
import { getProducts, getCart, setCart } from "../data/data.ts";

const router = Router();

// --- Tipado de sesión ---
interface CustomSession {
  cart?: CartItem[];
}

// --- Rutas del carrito ---

// Obtener el carrito
router.get("/", async (req, res) => {
  const sess = req.session as CustomSession;
  sess.cart = sess.cart || await getCart();
  res.json({ ok: true, cart: sess.cart });
});

// Agregar producto al carrito
router.post("/add", async (req, res) => {
  const rawProductId = req.body?.productId;
  const rawQty = req.body?.qty;

  const productId = Number(rawProductId);
  const qty = Number(rawQty);

  // Validar presencia y tipos
  if (!rawProductId || Number.isNaN(productId) || Number.isNaN(qty)) {
    return res.status(400).json({ error: "Datos inválidos: se requiere productId y qty numérico" });
  }

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ error: "productId inválido" });
  }

  if (!Number.isFinite(qty) || qty <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser un número positivo" });
  }

  // Verificar que el producto exista
  const allProducts = await getProducts();
  const product = allProducts.find((p: Product) => Number(p.id) === productId);
  if (!product) {
    return res.status(400).json({ error: `El producto con ID ${productId} no existe` });
  }

  // Agregar al carrito
  const sess = req.session as CustomSession;
  sess.cart = sess.cart || await getCart();

  const idx = sess.cart.findIndex(i => Number(i.productId) === productId);
  if (idx >= 0) sess.cart[idx].qty = Number(sess.cart[idx].qty) + qty;
  else sess.cart.push({ productId, qty });

  await setCart(sess.cart);
  return res.json({ ok: true, cart: sess.cart });
});

// Quitar producto del carrito
router.post("/remove", async (req, res) => {
  const rawProductId = req.body?.productId;
  const productId = Number(rawProductId);

  if (!rawProductId || Number.isNaN(productId)) {
    return res.status(400).json({ error: "productId requerido y debe ser numérico" });
  }

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ error: "productId inválido" });
  }

  // Verificar que el producto existe en el catálogo
  const allProducts = await getProducts();
  const productExists = allProducts.some((p: Product) => Number(p.id) === productId);
  if (!productExists) {
    return res.status(400).json({ error: `El producto con ID ${productId} no existe` });
  }

  const sess = req.session as CustomSession;
  sess.cart = sess.cart || await getCart();

  const existed = sess.cart.some(i => Number(i.productId) === productId);
  if (!existed) {
    return res.status(400).json({ error: `El producto con ID ${productId} no está en el carrito` });
  }

  const newCart = sess.cart.filter(i => Number(i.productId) !== productId);
  sess.cart = newCart;

  await setCart(newCart);
  return res.json({ ok: true, cart: newCart });
});

// Vaciar carrito 🔥 (restaurado)
router.post("/clear", async (req, res) => {
  const sess = req.session as CustomSession;
  sess.cart = [];
  await setCart([]); // limpiamos el JSON también
  return res.json({ ok: true, cart: [] });
});

// Obtener total del carrito
router.get("/total", async (req, res) => {
  const sess = req.session as CustomSession;
  sess.cart = sess.cart || await getCart();
  const products = await getProducts();

  const total = sess.cart.reduce((sum, item) => {
    const p = products.find(prod => prod.id === item.productId);
    return p ? sum + p.price * item.qty : sum;
  }, 0);

  res.json({ total });
});

export default router;

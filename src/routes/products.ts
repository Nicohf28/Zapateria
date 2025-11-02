
// src/routes/products.ts
import { Router } from "express";
import { getProducts } from "../data/data.ts";

const router = Router();

// Obtener todos los productos
router.get("/", async (_req, res) => {
  const products = await getProducts();
  res.json(products);
});

// Obtener producto por ID
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const products = await getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

export default router;

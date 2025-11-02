
// src/data/data.ts
import { promises as fs } from "fs";
import path from "path";
import type { CartItem } from "../types/index.d.js";
import type { Product } from "../types/index.d.js";

const DATA_FILE = path.resolve("src/data/data.json");

interface DataSchema {
  products: Product[];
  cart: CartItem[];
}

// Leer el archivo completo
async function readData(): Promise<DataSchema> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    // Si no existe, inicializamos
    const initial: DataSchema = { products: [], cart: [] };
    await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
}

// Guardar todo
async function writeData(data: DataSchema) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Productos
export async function getProducts(): Promise<Product[]> {
  const data = await readData();
  return data.products;
}

export async function setProducts(products: Product[]) {
  const data = await readData();
  data.products = products;
  await writeData(data);
}

// Carrito
export async function getCart(): Promise<CartItem[]> {
  const data = await readData();
  return data.cart;
}

export async function setCart(cart: CartItem[]) {
  const data = await readData();
  data.cart = cart;
  await writeData(data);
}

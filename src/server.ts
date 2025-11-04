// src/server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieSession from "cookie-session";

import { verificarToken } from "./middleware/auth.ts";
import loginRouter from "./routes/login.ts";
import registerRouter from "./routes/register.ts";
import productsRouter from "./routes/products.ts";
import cartRouter from "./routes/cart.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 🧱 Middlewares base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🧁 Manejo de sesión (si algún día lo usas junto a JWT)
app.use(
  cookieSession({
    name: "session",
    secret: "zapateria-secret",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 día
  })
);

// 🌐 Archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, "../public")));

// 🔐 Rutas de autenticación
app.use("/login", loginRouter);
app.use("/register", registerRouter);

// 🔒 Ruta protegida de prueba
app.get("/api/protegido", verificarToken, (req, res) => {
  res.json({ msg: "Accediste a una ruta protegida ✅" });
});

// 🛍️ API principal
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);

// 🚀 Servidor en marcha
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

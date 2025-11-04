import { Router } from "express";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUser } from "../data/users.ts";

const router = Router();
export const SECRET_KEY = "clave_secreta_super_segura";

// 🔹 Ruta base: POST /login
router.post("/", async (req: Request, res: Response) => {
  const { usuario, password } = req.body;

  const user = await findUser(usuario);
  if (!user) {
    return res.status(401).json({ ok: false, msg: "Usuario no encontrado" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
  }

  const token = jwt.sign(
    { usuario: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  console.log(`✅ Login exitoso: ${user.username}`);

  return res.json({ ok: true, token, role: user.role, usuario: user.username });
});

export default router;

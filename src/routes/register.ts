import { Router } from "express";
import type { Request, Response } from "express";
import { createUser } from "../data/users.ts";

const router = Router();

// 🔹 Ruta base: POST /register
router.post("/", async (req: Request, res: Response) => {
  const { usuario, password, role } = req.body;

  if (!usuario || !password)
    return res.status(400).json({ ok: false, msg: "Faltan datos" });

  try {
    const newUser = await createUser(usuario, password, role);
    console.log(`🟢 Usuario creado: ${newUser.username}`);
    res.status(201).json({
      ok: true,
      msg: "Usuario creado correctamente",
      user: { username: newUser.username, role: newUser.role }
    });
  } catch (err: any) {
    console.error("❌ Error al crear usuario:", err.message);
    res.status(400).json({ ok: false, msg: err.message });
  }
});

export default router;

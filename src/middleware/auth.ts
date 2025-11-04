import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../routes/login.ts";

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ ok: false, msg: "No hay token, acceso denegado" });
  }

  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    return res.status(403).json({ ok: false, msg: "Token inválido o expirado" });
  }
};

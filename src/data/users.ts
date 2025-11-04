// src/data/users.ts
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // 🔹 Importa crypto

const USERS_FILE = path.resolve("src/data/users.json");

export interface Usuario {
  id: string;
  username: string;
  password: string; // cifrada con bcrypt
  role: "user" | "admin";
}

// 🔹 Leer archivo de usuarios
async function readUsers(): Promise<Usuario[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
    return [];
  }
}

// 🔹 Guardar archivo de usuarios
async function writeUsers(users: Usuario[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// 🔹 Obtener todos
export async function getUsers(): Promise<Usuario[]> {
  return await readUsers();
}

// 🔹 Buscar por nombre
export async function findUser(username: string): Promise<Usuario | undefined> {
  const users = await readUsers();
  return users.find(u => u.username === username);
}

// 🔹 Crear usuario nuevo (encripta contraseña)
export async function createUser(username: string, password: string, role: "user" | "admin" = "user") {
  const users = await readUsers();

  if (users.some(u => u.username === username)) {
    throw new Error("El usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: Usuario = {
    id: crypto.randomUUID(),
    username,
    password: hashedPassword,
    role
  };

  users.push(newUser);
  await writeUsers(users);
  return newUser;
}

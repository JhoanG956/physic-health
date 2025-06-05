import Cookies from "js-cookie"  // Usar js-cookie en lugar de next/headers
import { verifyToken } from "./auth-service"
import { query } from "../db"
import { cookies } from "next/headers"  // Importar cookies para acceso en servidor
import "server-only"  // Mantener esta línea si sigues utilizando Server Components

// Tipos
export interface User {
  id: string
  name: string
  email: string
  password_hash: string
  role: string
  created_at: Date
  updated_at: Date
}

// Obtener la cookie de autenticación
// Usar js-cookie en el cliente y next/headers en el servidor
export async function getAuthCookie() {
  if (typeof window !== "undefined") {
    // En el cliente, usamos js-cookie
    return Cookies.get("auth_token")
  } else {
    // En el servidor, usamos next/headers
    const cookieStore = await cookies()
    return cookieStore.get("auth_token")?.value
  }
}

// Eliminar la cookie de autenticación (con js-cookie)
export async function removeAuthCookie() {
  if (typeof window !== "undefined") {
    // En el cliente, usamos js-cookie
    Cookies.remove("auth_token")
  } else {
    // Eliminar en el servidor (no necesario en este caso)
    // Eliminar la cookie en el servidor normalmente se hace enviando una respuesta con Set-Cookie
  }
}

// Obtener el usuario actual desde el token
export async function getServerUser(): Promise<User | null> {
  try {
    const token = await getAuthCookie()  // Obtener el token de las cookies (cliente o servidor)

    if (!token) {
      return null
    }

    const { valid, decoded } = await verifyToken(token)

    if (!valid || !decoded?.id) {
      return null
    }

    const userId = decoded.id

    // Consultar el usuario en la base de datos
    const result = await query(
      `SELECT id, name, email, password_hash, role, created_at, updated_at 
       FROM users 
       WHERE id = $1`,
      [userId],
    )

    if (!result || result.length === 0) {
      return null
    }

    return result[0] as User
  } catch (error) {
    console.error("Error al obtener el usuario del servidor:", error)
    return null
  }
}

// Verificar si el usuario tiene un rol específico
export async function hasRole(role: string): Promise<boolean> {
  try {
    const user = await getServerUser()
    return user?.role === role
  } catch (error) {
    return false
  }
}

// Verificar si el usuario es administrador
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin")
}

// Verificar si el usuario es terapeuta
export async function isTherapist(): Promise<boolean> {
  return hasRole("therapist")
}

import Cookies from "js-cookie"
import { SignJWT, jwtVerify } from "jose"
import type { NextRequest } from "next/server"
import crypto from "crypto"

// Función para generar un hash de contraseña seguro
export async function hashPassword(password: string): Promise<string> {
  // Generar un salt aleatorio
  const salt = crypto.randomBytes(16).toString("hex")

  // Usar PBKDF2 para generar un hash seguro
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err)
      // Formato: iteraciones:salt:hash
      resolve(`10000:${salt}:${derivedKey.toString("hex")}`)
    })
  })
}

// Función para verificar una contraseña
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    // Extraer las partes del hash almacenado
    const [iterations, salt, hash] = storedHash.split(":")
    const iterCount = Number.parseInt(iterations)

    // Verificar que el formato sea válido
    if (!salt || !hash || isNaN(iterCount)) {
      return false
    }

    // Calcular el hash de la contraseña proporcionada
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, iterCount, 64, "sha512", (err, derivedKey) => {
        if (err) reject(err)
        resolve(derivedKey.toString("hex") === hash)
      })
    })
  } catch (error) {
    console.error("Error al verificar la contraseña:", error)
    return false
  }
}

// Función para crear un token JWT
export async function createToken(payload: any, expiresIn = "7d"): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_this")

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)

  return token
}

// Función para verificar un token JWT
export async function verifyToken(token: string): Promise<{ valid: boolean; decoded: any }> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_this")
    const { payload } = await jwtVerify(token, secret)
    return { valid: true, decoded: payload }
  } catch (error) {
    console.error("Error al verificar el token:", error)
    return { valid: false, decoded: null }
  }
}

// Función para establecer la cookie de autenticación (usando js-cookie)
export async function setAuthCookie(token: string) {
  Cookies.set("auth_token", token, {
    expires: 7, // 7 días
    secure: process.env.NODE_ENV === "development", // Solo en producción
    path: "/",
    sameSite: "Lax",
  })
}

// Función para eliminar la cookie de autenticación
export async function removeAuthCookie() {
  Cookies.remove("auth_token")
}

// Función para obtener el token de la cookie de autenticación
export async function getAuthCookie() {
  return Cookies.get("auth_token")
}

// Función para obtener el token de la cookie de autenticación desde una solicitud
export function getTokenFromRequest(request: NextRequest) {
  return request.cookies.get("auth_token")?.value
}

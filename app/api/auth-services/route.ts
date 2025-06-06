import Cookies from "js-cookie";
import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

// Función para generar un hash de contraseña seguro
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}$${hashedPassword}`;
}

// Función para crear un token JWT
export async function createToken(payload: Record<string, unknown>, expiresIn = "7d"): Promise<string> {
  const secretKey = process.env.JWT_SECRET_KEY || 'default_secret';  // Asegúrate de usar una clave secreta en producción
  const jwt = await new SignJWT(payload)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(new TextEncoder().encode(secretKey));
  return jwt;
}

// Función para verificar el token JWT
export async function verifyToken(token: string): Promise<{ valid: boolean; decoded: any }> {
  const secretKey = process.env.JWT_SECRET_KEY || 'default_secret';  // Asegúrate de usar una clave secreta en producción
  try {
    const decoded = await jwtVerify(token, new TextEncoder().encode(secretKey));
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, decoded: null };
  }
}

// Función para obtener el token desde las cookies (con js-cookie)
export function getTokenFromCookies() {
  const token = Cookies.get('auth_token');
  return token ? token : null;
}

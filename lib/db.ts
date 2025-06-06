import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"


// Configuración para entornos serverless
neonConfig.fetchConnectionCache = true

// Obtener la URL de la base de datos desde las variables de entorno
const databaseUrl = process.env.DATABASE_URL || "postgres://neondb_owner:npg_a8xgwohQT0dq@ep-steep-waterfall-a4vvitq1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

console.log("DATABASE_URL:", databaseUrl);

if (!databaseUrl) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno")
}

console.log("Conectando a la base de datos...");

// Crear el cliente SQL
const sql = neon(databaseUrl)

// Crear el cliente Drizzle
export const db = drizzle(sql)

// Función para ejecutar consultas SQL directamente
export async function query(text: string, params: any[] = []) {
  try {
    const result = await sql.query(text, params)
    return result
  } catch (error) {
    console.error("Error ejecutando consulta SQL:", error)
    throw error
  }
}

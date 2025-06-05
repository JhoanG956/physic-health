import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/services/auth-service"

export async function POST() {
  try {
    // Eliminar la cookie de autenticación
    await removeAuthCookie()

    // Devolver respuesta exitosa
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getServerUser } from "@/lib/services/server-auth-service"

export async function GET() {
  try {
    // Verificar si el token está presente usando next/headers
    const token = (await cookies()).get("auth_token")?.value
    console.log("Token recibido:", token)

    if (!token) {
      console.log("Error: No se encontró el token en las cookies")
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    const user = await getServerUser()
    console.log("Usuario recuperado:", user)

    if (!user) {
      console.log("Error: Usuario no encontrado o no autenticado")
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error("Error al obtener usuario actual:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Error al obtener usuario actual" },
      { status: 500 },
    )
  }
}

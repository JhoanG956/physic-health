import { NextResponse } from "next/server"
import { loginUser, createToken, setAuthCookie } from "@/lib/services/auth-service"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validar datos
    if (!email || !password) {
      return NextResponse.json({ error: "Correo electrónico y contraseña son requeridos" }, { status: 400 })
    }

    // Iniciar sesión
    const user = await loginUser(email, password)

    // Verificar si el usuario tiene permisos de administración
    if (user.role !== "admin" && user.role !== "therapist") {
      return NextResponse.json({ error: "No tienes permisos para acceder al panel de administración" }, { status: 403 })
    }

    // Crear token JWT
    const token = await createToken(user)

    // Establecer cookie
    setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error)
    return NextResponse.json({ error: error.message || "Error al iniciar sesión" }, { status: 401 })
  }
}

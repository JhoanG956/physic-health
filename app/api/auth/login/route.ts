import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyPassword, createToken } from "@/lib/services/auth-service"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validar los datos de entrada
    if (!email || !password) {
      console.log("Error: Email o contraseña faltante");
      return NextResponse.json(
        { success: false, error: "El correo electrónico y la contraseña son obligatorios" },
        { status: 400 },
      )
    }

    // Buscar el usuario por correo electrónico
    const result = await query("SELECT * FROM users WHERE email = $1", [email])

    if (!result || result.length === 0) {
      console.log("Credenciales inválidas: Usuario no encontrado");
      return NextResponse.json({ success: false, error: "Credenciales inválidas" }, { status: 401 })
    }

    const user = result[0]
    console.log("Usuario encontrado:", user);

    // Verificar la contraseña
    const passwordValid = await verifyPassword(password, user.password_hash)

    console.log("Contraseña válida:", passwordValid);

    if (!passwordValid) {
      console.log("Credenciales inválidas: Contraseña incorrecta");
      return NextResponse.json({ success: false, error: "Credenciales inválidas" }, { status: 401 })
    }

    // Crear token JWT
    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    console.log("Token generado:", token);

    // Devolver respuesta exitosa con el token y establecer cookie
    const response = NextResponse.json({
      success: true,
      token, // Enviar el token al cliente
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error("Error en el inicio de sesión:", error)
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 })
  }
}

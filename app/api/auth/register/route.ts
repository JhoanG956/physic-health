import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword, createToken, setAuthCookie } from "@/lib/services/auth-service"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validar los datos de entrada
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Todos los campos son obligatorios" }, { status: 400 })
    }

    // Verificar si el correo electrónico ya está registrado
    const existingUser = await query("SELECT * FROM users WHERE email = $1", [email])

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ success: false, error: "El correo electrónico ya está registrado" }, { status: 409 })
    }

    // Generar hash de la contraseña
    const passwordHash = await hashPassword(password)

    // Generar ID único
    const userId = uuidv4()

    // Insertar el nuevo usuario en la base de datos
    await query(
      `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [userId, name, email, passwordHash, "user"],
    )

    // Crear token JWT
    const token = await createToken({
      id: userId,
      email,
      name,
      role: "user",
    })

    // Establecer cookie de autenticación
    await setAuthCookie(token)

    // Devolver respuesta exitosa
    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name,
        email,
        role: "user",
      },
    })
  } catch (error) {
    console.error("Error en el registro:", error)
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 })
  }
}

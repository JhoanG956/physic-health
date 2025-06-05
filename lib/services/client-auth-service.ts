export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}

// Función para iniciar sesión
export async function login(
  credentials: LoginCredentials,
): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Error al iniciar sesión",
      }
    }

    return {
      success: true,
      message: "Inicio de sesión exitoso",
      user: data.user,
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return {
      success: false,
      message: "Error al conectar con el servidor",
    }
  }
}

// Función para registrarse
export async function register(data: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: responseData.error || "Error al registrarse",
      }
    }

    return {
      success: true,
      message: "Registro exitoso",
      user: responseData.user,
    }
  } catch (error) {
    console.error("Error al registrarse:", error)
    return {
      success: false,
      message: "Error al conectar con el servidor",
    }
  }
}

// Función para cerrar sesión
export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    })

    if (!response.ok) {
      return {
        success: false,
        message: "Error al cerrar sesión",
      }
    }

    return {
      success: true,
      message: "Sesión cerrada exitosamente",
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return {
      success: false,
      message: "Error al conectar con el servidor",
    }
  }
}

// Función para obtener el usuario actual
export async function getCurrentUser(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch("/api/auth/me")

    if (!response.ok) {
      return {
        success: false,
        error: "No autenticado",
      }
    }

    const data = await response.json()

    return {
      success: true,
      user: data.user,
    }
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error)
    return {
      success: false,
      error: "Error al conectar con el servidor",
    }
  }
}

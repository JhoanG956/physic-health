import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/services/auth-service"

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard", "/chat", "/feed", "/profile", "/onboarding"]

// Rutas que requieren rol de administrador
const adminRoutes = ["/admin"]

// Rutas públicas (no requieren autenticación)
const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar si la ruta es pública
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar si la ruta es protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute || isAdminRoute) {
    // Obtener token de la cookie 'auth_token'
    const token = request.cookies.get('auth_token')?.value
    // console.log("Token in middleware:", token)

    if (!token) {
      // Redirigir a login si no hay token
      const url = new URL("/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }

    // Verificar token
    const { valid, decoded } = await verifyToken(token)

    if (!valid) {
      // Redirigir a login si el token no es válido
      const url = new URL("/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }

    // Verificar rol para rutas de administrador
    if (isAdminRoute) {
      const userRole = decoded.role as string

      if (userRole !== "admin" && userRole !== "therapist") {
        // Redirigir a unauthorized si no es admin
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

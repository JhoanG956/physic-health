"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, Menu, X, User, LogOut, Settings, LayoutDashboard } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Simularemos el estado de autenticación y los datos del usuario
// En una aplicación real, esto vendría de un contexto de autenticación o una store.
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Cambia a true para probar el estado logueado
  const [user, setUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(null)

  // Simula la carga del usuario
  useEffect(() => {
    // Para probar, puedes cambiar isAuthenticated a true después de un tiempo
    // setTimeout(() => {
    //   setIsAuthenticated(true);
    //   setUser({ name: "Ana Pérez", email: "ana.perez@example.com", avatarUrl: "/placeholder.svg?width=100&height=100" });
    // }, 2000);
  }, [])

  const login = () => {
    setIsAuthenticated(true)
    setUser({
      name: "Carlos Ruiz",
      email: "carlos.ruiz@example.com",
      avatarUrl: "/placeholder.svg?width=100&height=100",
    })
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  return { isAuthenticated, user, login, logout }
}

export default function AppHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth() // Usamos nuestro hook simulado

  useEffect(() => setMounted(true), [])

  const navItems = [
    { name: "Funcionalidades", href: "#features" },
    { name: "Beneficios", href: "#benefits" },
  ]

  const authenticatedNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { name: "Mi Perfil", href: "/profile", icon: <User className="mr-2 h-4 w-4" /> },
    { name: "Configuración", href: "/settings", icon: <Settings className="mr-2 h-4 w-4" /> },
  ]

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block text-lg text-deep-blue dark:text-sky-blue">Physio Health</span>
          </Link>
          <div className="h-8 w-8" />
        </div>
      </header>
    )
  }

  const UserAvatar = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user?.avatarUrl || "/placeholder.svg?width=32&height=32&query=avatar"}
              alt={user?.name || "Usuario"}
            />
            <AvatarFallback>{user?.name ? user.name.substring(0, 2).toUpperCase() : "PH"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {authenticatedNavItems.map((item) => (
          <DropdownMenuItem key={item.name} asChild>
            <Link href={item.href} className="flex items-center">
              {item.icon}
              {item.name}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold sm:inline-block text-lg text-deep-blue dark:text-sky-blue">Physio Health</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="nav-item text-foreground/70 hover:text-foreground dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
            >
              {item.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <UserAvatar />
          ) : (
            <>
              <Link
                href="/login"
                className="nav-item text-foreground/70 hover:text-foreground dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Button
                asChild
                size="sm"
                className="bg-deep-blue hover:bg-deep-blue/90 text-white dark:bg-sky-blue dark:hover:bg-sky-blue/90 dark:text-deep-blue"
              >
                <Link href="/register">Registrarse</Link>
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>

        <div className="md:hidden flex items-center">
          {isAuthenticated && <UserAvatar />}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9 mx-2"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {!isAuthenticated && ( // Solo mostrar menú hamburguesa si no está autenticado o si el avatar no lo reemplaza
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          {isAuthenticated &&
            !mobileMenuOpen && ( // Mostrar menú hamburguesa para opciones de usuario si está autenticado
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            )}
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40"
          >
            <nav className="flex flex-col space-y-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-item text-foreground/70 hover:text-foreground dark:text-slate-300 dark:hover:text-slate-100 transition-colors py-2 text-center rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <DropdownMenuSeparator className="my-2" />
                  {authenticatedNavItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center nav-item text-foreground/70 hover:text-foreground dark:text-slate-300 dark:hover:text-slate-100 transition-colors py-2 px-3 text-center rounded-md hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon} {item.name}
                    </Link>
                  ))}
                  <DropdownMenuSeparator className="my-2" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="nav-item text-foreground/70 hover:text-foreground dark:text-slate-300 dark:hover:text-slate-100 transition-colors py-2 text-center rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Button
                    asChild
                    size="sm"
                    className="w-full mt-2 bg-deep-blue hover:bg-deep-blue/90 text-white dark:bg-sky-blue dark:hover:bg-sky-blue/90 dark:text-deep-blue"
                  >
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      Registrarse
                    </Link>
                  </Button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

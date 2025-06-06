"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function AppHeader() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  const navItems = [
    { name: "Funcionalidades", href: "#features" },
    { name: "Beneficios", href: "#benefits" },
    { name: "Iniciar Sesión", href: "/login" },
  ]

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  if (!mounted) {
    // Avoid hydration mismatch by not rendering theme-dependent UI until mounted
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block text-lg text-deep-blue dark:text-sky-blue">Physio Health</span>
          </Link>
          <div className="h-8 w-8" /> {/* Placeholder for theme toggle to maintain layout */}
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {/* Optional: Add an icon/logo here */}
          <span className="font-bold sm:inline-block text-lg text-deep-blue dark:text-sky-blue">Physio Health</span>
        </Link>

        {/* Desktop Navigation */}
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
          <Button
            asChild
            size="sm"
            className="bg-deep-blue hover:bg-deep-blue/90 text-white dark:bg-sky-blue dark:hover:bg-sky-blue/90 dark:text-deep-blue"
          >
            <Link href="/register">Registrarse</Link>
          </Button>
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9 mr-2"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40"
          >
            <nav className="flex flex-col space-y-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-item text-foreground/70 hover:text-foreground dark:text-slate-300 dark:hover:text-slate-100 transition-colors py-2 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                asChild
                size="sm"
                className="w-full bg-deep-blue hover:bg-deep-blue/90 text-white dark:bg-sky-blue dark:hover:bg-sky-blue/90 dark:text-deep-blue"
              >
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  Registrarse
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

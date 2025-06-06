"use client"

import Link from "next/link"
import { Heart } from "lucide-react"

export default function AppFooter() {
  return (
    <footer className="border-t border-border/40 py-8 mt-20">
      <div className="container mx-auto px-4 text-center text-foreground/60 dark:text-slate-400">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Physio Health. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Link href="/terms" className="text-sm hover:text-deep-blue dark:hover:text-sky-blue transition-colors">
              Términos de Servicio
            </Link>
            <Link href="/privacy" className="text-sm hover:text-deep-blue dark:hover:text-sky-blue transition-colors">
              Política de Privacidad
            </Link>
          </div>
          <p className="text-sm flex items-center">
            Hecho con <Heart className="w-4 h-4 mx-1 text-soft-coral" /> por tu equipo de Physio Health.
          </p>
        </div>
      </div>
    </footer>
  )
}

import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { checkEnvironment } from "./env-check"

// Verificar las variables de entorno en el servidor
checkEnvironment()

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Physio Health",
  description: "Plataforma de fisioterapia inteligente",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

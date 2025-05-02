"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: theme === "dark" ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] text-deep-blue" />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: theme === "dark" ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="h-[1.2rem] w-[1.2rem] text-sky-blue" />
          </motion.div>
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-in zoom-in-90">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4 text-deep-blue" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4 text-sky-blue" />
          <span>Oscuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
          <span className="mr-2">🖥️</span>
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

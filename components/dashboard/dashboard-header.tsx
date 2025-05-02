"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { motion } from "framer-motion"

export function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row justify-between items-center mb-12 text-center md:text-left"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-deep-blue to-primary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Visualiza tu progreso y próximas actividades</p>
      </div>
      <Button className="mt-4 md:mt-0 bg-gradient-to-r from-mint to-sky-blue hover:from-sky-blue hover:to-mint text-deep-blue border-none">
        <Calendar className="mr-2 h-4 w-4" />
        Agendar cita
      </Button>
    </motion.div>
  )
}

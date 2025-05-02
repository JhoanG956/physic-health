"use client"

import { motion } from "framer-motion"

interface FeedHeaderProps {
  name: string
  date: Date
}

export function FeedHeader({ name, date }: FeedHeaderProps) {
  // Función para obtener el saludo según la hora del día
  const getGreeting = () => {
    const hour = date.getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  // Formatear la fecha
  const formattedDate = date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="mb-12 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-2 text-deep-blue dark:text-slate-100"
      >
        {getGreeting()}, {name}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground"
      >
        {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 p-6 rounded-xl bg-white dark:bg-slate-800/50 dark:subtle-border max-w-2xl mx-auto shadow-sm"
      >
        <h2 className="font-medium mb-3 text-lg">Resumen del día</h2>
        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm">
          <div className="bg-mint/10 dark:bg-slate-700/50 p-3 rounded-lg flex-1 shadow-sm">
            <p className="font-medium text-deep-blue dark:text-sky-blue">Ejercicios</p>
            <p className="text-muted-foreground dark:text-slate-300">3 recomendados para hoy</p>
          </div>
          <div className="bg-sky-blue/10 dark:bg-slate-700/50 p-3 rounded-lg flex-1 shadow-sm">
            <p className="font-medium text-deep-blue dark:text-mint">Consejos</p>
            <p className="text-muted-foreground dark:text-slate-300">2 consejos personalizados</p>
          </div>
          <div className="bg-soft-coral/10 dark:bg-slate-700/50 p-3 rounded-lg flex-1 shadow-sm">
            <p className="font-medium text-deep-blue dark:text-soft-coral">Progreso</p>
            <p className="text-muted-foreground dark:text-slate-300">Vas por buen camino</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

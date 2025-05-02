"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"

const stats = [
  {
    title: "Ejercicios completados",
    value: "24",
    description: "Esta semana",
    icon: CheckCircle,
    color: "text-mint dark:text-mint/80",
    bgColor: "bg-mint/20 dark:bg-slate-800",
    gradient: "from-mint/20 to-sky-blue/20 dark:from-slate-800 dark:to-slate-700",
  },
  {
    title: "Tiempo de actividad",
    value: "3.5h",
    description: "Esta semana",
    icon: Clock,
    color: "text-sky-blue dark:text-sky-blue/80",
    bgColor: "bg-sky-blue/20 dark:bg-slate-800",
    gradient: "from-sky-blue/20 to-mint/20 dark:from-slate-800 dark:to-slate-700",
  },
  {
    title: "Nivel de actividad",
    value: "Medio",
    description: "Basado en tu historial",
    icon: Activity,
    color: "text-soft-coral dark:text-soft-coral/80",
    bgColor: "bg-soft-coral/20 dark:bg-slate-800",
    gradient: "from-soft-coral/20 to-sky-blue/20 dark:from-slate-800 dark:to-slate-700",
  },
]

export function DashboardStats() {
  return (
    <>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
        >
          <Card className="border dark:border-slate-800">
            <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-slate-100">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-slate-100">{stat.value}</div>
              <p className="text-sm text-muted-foreground dark:text-slate-400">{stat.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  )
}

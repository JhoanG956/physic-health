"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

const weeklyProgress = [
  { day: "Lun", value: 80 },
  { day: "Mar", value: 60 },
  { day: "Mié", value: 90 },
  { day: "Jue", value: 40 },
  { day: "Vie", value: 70 },
  { day: "Sáb", value: 50 },
  { day: "Dom", value: 30 },
]

export function DashboardProgress() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="col-span-1 border dark:border-slate-800">
        <div className="h-1 w-full bg-gradient-to-r from-mint/30 to-sky-blue/30 dark:from-mint/20 dark:to-sky-blue/20" />
        <CardHeader>
          <CardTitle className="dark:text-slate-100">Progreso semanal</CardTitle>
          <CardDescription className="dark:text-slate-400">Seguimiento de tus ejercicios y actividades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyProgress.map((day, index) => (
              <motion.div
                key={day.day}
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              >
                <div className="w-10 text-sm font-medium dark:text-slate-300">{day.day}</div>
                <div className="w-full mx-2">
                  <Progress
                    value={day.value}
                    className="h-2 dark:bg-slate-700"
                    indicatorClassName="bg-gradient-to-r from-mint/70 to-sky-blue/70 dark:from-mint/50 dark:to-sky-blue/50"
                  />
                </div>
                <div className="w-10 text-sm text-right dark:text-slate-300">{day.value}%</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t dark:border-slate-700">
            <h4 className="text-sm font-medium mb-4 dark:text-slate-300">Ejercicios completados por categoría</h4>
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <div className="text-xs text-muted-foreground dark:text-slate-400">Estiramiento</div>
                <Progress
                  value={75}
                  className="h-2 dark:bg-slate-700"
                  indicatorClassName="bg-mint/70 dark:bg-mint/50"
                />
                <div className="text-xs text-right dark:text-slate-400">75%</div>
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <div className="text-xs text-muted-foreground dark:text-slate-400">Fortalecimiento</div>
                <Progress
                  value={60}
                  className="h-2 dark:bg-slate-700"
                  indicatorClassName="bg-sky-blue/70 dark:bg-sky-blue/50"
                />
                <div className="text-xs text-right dark:text-slate-400">60%</div>
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <div className="text-xs text-muted-foreground dark:text-slate-400">Movilidad</div>
                <Progress
                  value={45}
                  className="h-2 dark:bg-slate-700"
                  indicatorClassName="bg-deep-blue/70 dark:bg-deep-blue/50"
                />
                <div className="text-xs text-right dark:text-slate-400">45%</div>
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <div className="text-xs text-muted-foreground dark:text-slate-400">Equilibrio</div>
                <Progress
                  value={30}
                  className="h-2 dark:bg-slate-700"
                  indicatorClassName="bg-soft-coral/70 dark:bg-soft-coral/50"
                />
                <div className="text-xs text-right dark:text-slate-400">30%</div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

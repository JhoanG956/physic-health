"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Video } from "lucide-react"
import { motion } from "framer-motion"

const appointments = [
  {
    id: "1",
    title: "Sesión de fisioterapia",
    date: "2025-05-05T10:00:00",
    type: "Presencial",
    therapist: "Dr. García",
  },
  {
    id: "2",
    title: "Evaluación de progreso",
    date: "2025-05-08T15:30:00",
    type: "Virtual",
    therapist: "Dra. Martínez",
  },
  {
    id: "3",
    title: "Terapia de movilidad",
    date: "2025-05-12T11:00:00",
    type: "Presencial",
    therapist: "Dr. López",
  },
]

export function DashboardAppointments() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="col-span-1 border dark:border-slate-800">
        <div className="h-1 w-full bg-gradient-to-r from-sky-blue/30 to-mint/30 dark:from-sky-blue/20 dark:to-mint/20" />
        <CardHeader>
          <CardTitle className="dark:text-slate-100">Próximas citas</CardTitle>
          <CardDescription className="dark:text-slate-400">Tus sesiones programadas con especialistas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment, index) => {
              const date = new Date(appointment.date)
              return (
                <motion.div
                  key={appointment.id}
                  className="flex items-start p-4 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-sm transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      appointment.type === "Virtual"
                        ? "bg-sky-blue/20 dark:bg-slate-700"
                        : "bg-mint/20 dark:bg-slate-700"
                    } mr-3`}
                  >
                    {appointment.type === "Virtual" ? (
                      <Video className="h-5 w-5 text-sky-blue dark:text-sky-blue/80" />
                    ) : (
                      <CalendarDays className="h-5 w-5 text-mint dark:text-mint/80" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium dark:text-slate-200">{appointment.title}</h4>
                      <Badge
                        variant={appointment.type === "Virtual" ? "outline" : "default"}
                        className={
                          appointment.type === "Virtual"
                            ? "border-sky-blue/30 text-sky-blue dark:border-sky-blue/30 dark:text-sky-blue/80"
                            : "bg-mint/20 text-deep-blue dark:bg-mint/10 dark:text-mint/80 border-none"
                        }
                      >
                        {appointment.type}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                      Con {appointment.therapist}
                    </div>
                    <div className="mt-2 flex items-center text-xs text-muted-foreground dark:text-slate-400">
                      <CalendarDays className="mr-1 h-3 w-3 text-mint dark:text-mint/60" />
                      <span>
                        {date.toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                      <Clock className="ml-3 mr-1 h-3 w-3 text-sky-blue dark:text-sky-blue/60" />
                      <span>
                        {date.toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

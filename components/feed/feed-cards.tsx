"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ArrowRight, Clock, Dumbbell, Heart, Lightbulb, Play } from "lucide-react"

// Datos de ejemplo para las tarjetas
const feedItems = [
  {
    id: "1",
    type: "exercise",
    title: "Estiramiento de isquiotibiales",
    description: "Este ejercicio ayuda a mejorar la flexibilidad de las piernas y prevenir lesiones.",
    duration: "10 minutos",
    difficulty: "Fácil",
    icon: Dumbbell,
    color: "from-mint/40 to-sky-blue/40",
    iconColor: "text-deep-blue dark:text-sky-blue",
  },
  {
    id: "2",
    type: "tip",
    title: "Mantén una buena postura",
    description: "Recuerda mantener la espalda recta mientras trabajas para evitar dolores y tensiones musculares.",
    icon: Lightbulb,
    color: "from-sky-blue/40 to-mint/40",
    iconColor: "text-deep-blue dark:text-mint",
  },
  {
    id: "3",
    type: "exercise",
    title: "Fortalecimiento de core",
    description: "Serie de ejercicios para fortalecer los músculos abdominales y lumbares.",
    duration: "15 minutos",
    difficulty: "Medio",
    icon: Dumbbell,
    color: "from-mint/40 to-soft-coral/40",
    iconColor: "text-deep-blue dark:text-soft-coral",
  },
  {
    id: "4",
    type: "health",
    title: "Beneficios de la hidratación",
    description: "Beber suficiente agua mejora la recuperación muscular y el rendimiento físico general.",
    icon: Heart,
    color: "from-soft-coral/40 to-sky-blue/40",
    iconColor: "text-deep-blue dark:text-sky-blue",
  },
  {
    id: "5",
    type: "exercise",
    title: "Movilidad de hombros",
    description: "Ejercicios para mejorar el rango de movimiento y prevenir lesiones en los hombros.",
    duration: "8 minutos",
    difficulty: "Fácil",
    icon: Dumbbell,
    color: "from-sky-blue/40 to-mint/40",
    iconColor: "text-deep-blue dark:text-mint",
  },
]

export function FeedCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {feedItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -3 }}
          className="card-hover"
        >
          <Card className="h-full overflow-hidden border dark:border-slate-800">
            <div className={`h-1 w-full bg-gradient-to-r ${item.color} dark:opacity-50`} />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ${item.color} dark:bg-slate-800 dark:bg-opacity-50`}
                >
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                {item.type === "exercise" && (
                  <Badge
                    variant="outline"
                    className="ml-auto border-mint/30 dark:border-slate-700 dark:text-slate-200 bg-transparent"
                  >
                    {item.difficulty}
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-4 text-xl">{item.title}</CardTitle>
              <CardDescription className="text-base dark:text-slate-300">{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {item.type === "exercise" && item.duration && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4 text-mint dark:text-mint/70" />
                  <span>{item.duration}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-mint/30 dark:border-slate-700 hover:bg-mint/10 dark:hover:bg-slate-800"
              >
                {item.type === "exercise" ? (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Ver ejercicio
                  </>
                ) : (
                  <>
                    Leer más <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

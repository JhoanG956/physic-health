// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, MessageSquare, BarChart3, Newspaper, Sparkles, Heart, Activity } from "lucide-react"
import { motion } from "framer-motion"
import AppHeader from "@/components/layout/app-header"
import AppFooter from "@/components/layout/app-footer"

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-6"
          >
            <div className="absolute -top-10 -right-10 h-20 w-20 blob-shape bg-mint/30 dark:bg-mint/10 animate-float" />
            <div
              className="absolute -bottom-8 -left-8 h-16 w-16 blob-shape bg-sky-blue/30 dark:bg-sky-blue/10 animate-float"
              style={{ animationDelay: "1s" }}
            />
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl mb-4 text-deep-blue dark:text-slate-100">
              Physio Health
            </h1>
            <div className="flex justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Heart className="h-8 w-8 text-soft-coral dark:text-soft-coral/70" />
              </motion.div>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground dark:text-slate-300 max-w-2xl"
          >
            Tu plataforma conversacional de fisioterapia inteligente, personalizada y adaptativa.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-deep-blue hover:bg-deep-blue/90 text-white dark:bg-sky-blue dark:hover:bg-sky-blue/90 dark:text-deep-blue px-8 py-3 text-lg"
            >
              <Link href="/register">Comenzar Ahora</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg border-deep-blue text-deep-blue hover:bg-deep-blue/5 dark:border-sky-blue dark:text-sky-blue dark:hover:bg-sky-blue/10"
            >
              <Link href="#features">Saber Más</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          id="features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <FeatureCard
            title="Chat Inteligente"
            description="Interactúa con nuestro asistente de IA para recibir recomendaciones personalizadas."
            icon={<MessageSquare className="h-8 w-8 text-deep-blue dark:text-sky-blue" />}
            href="/chat"
            delay={0}
          />
          <FeatureCard
            title="Feed Personalizado"
            description="Accede a ejercicios, consejos y reportes diarios adaptados a tu progreso."
            icon={<Newspaper className="h-8 w-8 text-deep-blue dark:text-mint" />}
            href="/feed"
            delay={0.2}
          />
          <FeatureCard
            title="Dashboard"
            description="Visualiza tu progreso, ejercicios realizados y próximas actividades."
            icon={<BarChart3 className="h-8 w-8 text-deep-blue dark:text-soft-coral" />}
            href="/dashboard"
            delay={0.4}
          />
        </motion.div>

        <motion.div
          id="benefits"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-deep-blue dark:text-slate-100">¿Por qué elegir Physio Health?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-10">
            <BenefitCard
              icon={<Sparkles className="h-8 w-8 text-white" />}
              title="Personalizado"
              description="Recomendaciones adaptadas a tu condición física y objetivos personales."
              delay={0}
            />
            <BenefitCard
              icon={<Activity className="h-8 w-8 text-white" />}
              title="Seguimiento continuo"
              description="Monitoreo de tu progreso y ajustes en tiempo real para optimizar resultados."
              delay={0.2}
            />
            <BenefitCard
              icon={<Heart className="h-8 w-8 text-white" />}
              title="Profesional"
              description="Respaldado por fisioterapeutas expertos y tecnología de vanguardia."
              delay={0.4}
            />
          </div>
        </motion.div>
      </main>
      <AppFooter />
    </>
  )
}

function FeatureCard({
  title,
  description,
  icon,
  href,
  delay,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 + delay }}
      whileHover={{ y: -5, scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden shadow-xl bg-gradient-to-br from-mint/20 to-sky-blue/20 dark:from-mint/10 dark:to-sky-blue/10 border border-slate-200 dark:border-slate-700 flex flex-col">
        <CardHeader className="p-6 flex-grow">
          <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-full shadow-md mb-5 inline-block">{icon}</div>
          <CardTitle className="text-2xl font-bold text-deep-blue dark:text-sky-blue mb-2">{title}</CardTitle>
          <CardDescription className="text-slate-700 dark:text-slate-300 text-sm">{description}</CardDescription>
        </CardHeader>
        <CardFooter className="p-6 pt-0">
          <Button
            asChild
            className="w-full bg-deep-blue hover:bg-deep-blue/90 dark:bg-sky-blue dark:hover:bg-sky-blue/90 dark:text-deep-blue text-white font-semibold"
          >
            <Link href={href}>
              Acceder <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function BenefitCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 + delay }}
      className="h-full flex flex-col items-center p-6 rounded-xl shadow-xl bg-gradient-to-tl from-warm-gray/60 to-white dark:from-slate-800/80 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700"
      whileHover={{ y: -5, scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 bg-gradient-to-br from-mint to-sky-blue rounded-full shadow-lg mb-5">{icon}</div>
      <h3 className="text-xl font-bold text-deep-blue dark:text-sky-blue mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 text-center flex-grow">{description}</p>
    </motion.div>
  )
}

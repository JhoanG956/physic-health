"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, MessageSquare, BarChart3, Newspaper, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const routes = [
  {
    name: "Chat",
    path: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Feed",
    path: "/feed",
    icon: Newspaper,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: BarChart3,
  },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-mint to-sky-blue">
              <Heart className="h-5 w-5 text-deep-blue" />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-mint to-sky-blue opacity-75"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-deep-blue to-primary bg-clip-text text-transparent">
              Physio Health
            </span>
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-medium">
            {routes.map((route) => {
              const isActive = pathname === route.path
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "nav-item flex items-center gap-x-2 transition-colors hover:text-foreground/80",
                    isActive ? "text-foreground" : "text-foreground/60",
                  )}
                  data-active={isActive}
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.name}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-mint"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 gradient-bg">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Heart className="h-5 w-5 text-deep-blue" />
              </div>
              <span className="font-bold text-xl text-deep-blue">Physio Health</span>
            </Link>
            <nav className="flex flex-col space-y-6">
              {routes.map((route) => {
                const isActive = pathname === route.path
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={cn(
                      "flex items-center gap-x-2 text-base font-medium transition-colors rounded-lg p-3",
                      isActive ? "bg-white text-deep-blue" : "text-deep-blue hover:bg-white/50",
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    <span>{route.name}</span>
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-mint to-sky-blue">
                <Heart className="h-4 w-4 text-deep-blue" />
              </div>
              <span className="font-bold bg-gradient-to-r from-deep-blue to-primary bg-clip-text text-transparent">
                Physio Health
              </span>
            </Link>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

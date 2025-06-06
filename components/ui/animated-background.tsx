"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export const AnimatedBackground = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      ref.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Define colors based on theme to ensure visibility
  const bgColor1 = theme === "dark" ? "bg-sky-blue/10" : "bg-mint/20"
  const bgColor2 = theme === "dark" ? "bg-mint/5" : "bg-sky-blue/10"
  const bgColor3 = theme === "dark" ? "bg-slate-700/20" : "bg-warm-gray/30"

  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden transition-transform duration-100">
      <div
        className={`absolute w-[600px] h-[600px] ${bgColor1} rounded-full opacity-50 top-[-100px] left-[-100px] animate-float-slow`}
      ></div>
      <div
        className={`absolute w-[500px] h-[500px] ${bgColor2} rounded-full opacity-40 top-[300px] left-[60%] animate-float-slower`}
      ></div>
      <div
        className={`absolute w-[400px] h-[400px] ${bgColor3} rounded-full opacity-40 top-[600px] left-[20%] animate-float-medium`}
      ></div>
    </div>
  )
}

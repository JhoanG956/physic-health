"use client"

import { useEffect, useRef } from "react"

export const AnimatedBackground = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      if (ref.current) {
        ref.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden transition-transform duration-100">
      <div className="absolute w-[600px] h-[600px] bg-green-100 rounded-full opacity-30 top-[-100px] left-[-100px] animate-float-slow"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-100 rounded-full opacity-20 top-[300px] left-[60%] animate-float-slower"></div>
      <div className="absolute w-[400px] h-[400px] bg-white rounded-full opacity-25 top-[600px] left-[20%] animate-float-medium"></div>
    </div>
  )
}
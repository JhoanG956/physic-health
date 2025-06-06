"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings } from "lucide-react"

interface PromptEditorProps {
  defaultPrompt: string
  onSave: (prompt: string) => void
}

export function PromptEditor({ defaultPrompt, onSave }: PromptEditorProps) {
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    onSave(prompt)
    setOpen(false)
  }

  const handleReset = () => {
    setPrompt(defaultPrompt)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full focus-visible:outline-none focus-visible:ring-2">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Configurar asistente</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Configuración del asistente</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Personaliza el comportamiento del asistente de fisioterapia modificando su prompt del sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe el prompt del sistema..."
            className="min-h-[200px] font-mono text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Este prompt orienta al modelo sobre cómo debe comportarse y qué tipo de respuestas debe dar.
          </p>
        </div>
        <DialogFooter className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={handleReset}>
            Restablecer
          </Button>
          <Button onClick={handleSave} className="bg-mint text-white hover:bg-mint/90 dark:bg-mint/70 dark:hover:bg-mint/80">
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

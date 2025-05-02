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
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Configurar asistente</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configuración del asistente</DialogTitle>
          <DialogDescription>
            Personaliza el comportamiento del asistente de fisioterapia modificando su prompt del sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
            placeholder="Escribe el prompt del sistema..."
          />
          <p className="text-xs text-muted-foreground mt-2">
            Este prompt orienta al modelo sobre cómo debe comportarse y qué tipo de respuestas debe dar.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Restablecer
          </Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

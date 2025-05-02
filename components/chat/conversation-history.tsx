"use client"

import type React from "react"

import { useState } from "react"
import { type Conversation, getPatientConversations, deleteConversation } from "@/lib/services/conversation-service"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Trash2, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Patient } from "@/lib/data/patients"

interface ConversationHistoryProps {
  patient: Patient | null
  onSelectConversation: (conversationId: string) => void
}

export function ConversationHistory({ patient, onSelectConversation }: ConversationHistoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])

  // Cargar conversaciones cuando se abre el diálogo
  const handleOpenChange = (open: boolean) => {
    if (open && patient) {
      const patientConversations = getPatientConversations(patient.id)
      setConversations(patientConversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()))
    }
    setIsDialogOpen(open)
  }

  const handleSelectConversation = (conversationId: string) => {
    onSelectConversation(conversationId)
    setIsDialogOpen(false)
  }

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation()
    if (window.confirm("¿Estás seguro de que deseas eliminar esta conversación?")) {
      deleteConversation(conversationId)
      setConversations(conversations.filter((conv) => conv.id !== conversationId))
    }
  }

  // Función para obtener un resumen de la conversación
  const getConversationSummary = (conversation: Conversation): string => {
    const userMessages = conversation.messages.filter((msg) => msg.role === "user")
    if (userMessages.length > 0) {
      return userMessages[0].content.slice(0, 50) + (userMessages[0].content.length > 50 ? "..." : "")
    }
    return "Conversación sin mensajes"
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex justify-between items-center border-mint/30 dark:border-slate-700 mt-2"
          disabled={!patient}
        >
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4 text-sky-blue dark:text-sky-blue/70" />
            <span>Historial de conversaciones</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Historial de conversaciones</DialogTitle>
          <DialogDescription>
            {patient ? `Conversaciones previas con ${patient.name}` : "Selecciona un paciente para ver su historial"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4 mt-4">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-muted-foreground">
                      {format(conversation.createdAt, "d 'de' MMMM, yyyy - HH:mm", { locale: es })}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                  <p className="text-sm line-clamp-2">{getConversationSummary(conversation)}</p>
                  <div className="text-xs text-muted-foreground mt-2">{conversation.messages.length} mensajes</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay conversaciones previas con este paciente
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

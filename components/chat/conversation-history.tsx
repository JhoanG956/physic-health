"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

interface ConversationHistoryProps {
  patientId: string
  onSelectConversation: (conversationId: string) => void
}

export function ConversationHistory({ patientId, onSelectConversation }: ConversationHistoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleConversationDate = (dateString: string) => {
    if (!dateString) return null
    try {
      const date = parseISO(dateString.split(".")[0] + "Z")
      return isNaN(date.getTime()) ? null : date
    } catch {
      return null
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (open && patientId) {
      loadConversations()
    }
    setIsDialogOpen(open)
  }

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/conversations?patientId=${patientId}`)
      const data = await response.json()
      const conversationsData = Array.isArray(data) ? data : data.conversations || []
      const grouped = conversationsData.reduce((acc: any[], c: any) => {
        const { message_id, content, message_created_at, ...rest } = c
        const existing = acc.find((conv) => conv.id === rest.id)
        if (existing) {
          existing.messages.push({ message_id, content, created_at: message_created_at })
        } else {
          acc.push({ ...rest, messages: [{ message_id, content, created_at: message_created_at }] })
        }
        return acc
      }, [])
      setConversations(grouped)
    } catch (error) {
      console.error("Error al cargar conversaciones:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectConversation = (conversationId: string) => {
    onSelectConversation(conversationId)
    setIsDialogOpen(false)
  }

  const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation()
    if (window.confirm("¿Deseas eliminar esta conversación?")) {
      try {
        const response = await fetch(`/api/conversations/${conversationId}`, { method: "DELETE" })
        if (response.ok) {
          setConversations(conversations.filter((conv) => conv.id !== conversationId))
        }
      } catch (error) {
        console.error("Error al eliminar conversación:", error)
      }
    }
  }

  const handleCreateNewConversation = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      })
      const data = await response.json()
      onSelectConversation(data.conversationId)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error al crear nueva conversación:", error)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Historial de conversaciones</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Historial de conversaciones</DialogTitle>
          <DialogDescription>Selecciona una conversación previa o crea una nueva.</DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <Button onClick={handleCreateNewConversation} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Nueva conversación
          </Button>
        </div>

        <ScrollArea className="h-[400px] pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint" />
            </div>
          ) : conversations.length > 0 ? (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-4 border rounded-xl bg-white dark:bg-slate-800 cursor-pointer hover:bg-accent/50 transition-colors shadow-sm"
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-muted-foreground">
                      {handleConversationDate(conversation.created_at || conversation.updated_at)
                        ? format(
                            handleConversationDate(conversation.created_at || conversation.updated_at)!,
                            "d 'de' MMMM, yyyy - HH:mm",
                            { locale: es }
                          )
                        : "Fecha no válida"}
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
                  <p className="text-sm font-medium line-clamp-2">
                    {conversation.title || "Sin título"}
                  </p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {conversation.messages ? conversation.messages.length : 0} mensajes
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay conversaciones previas.
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
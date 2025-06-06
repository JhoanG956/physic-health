"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface ConversationSidebarProps {
  patientId: string
  onSelectConversation: (conversationId: string) => void
  currentConversationId?: string
}

export function ConversationSidebar({
  patientId,
  onSelectConversation,
  currentConversationId,
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (patientId) loadConversations()
  }, [patientId])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/conversations?patientId=${patientId}`)
      const data = await response.json()
      setConversations(data.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
    } catch (error) {
      console.error("Error al cargar conversaciones:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation()
    if (window.confirm("¿Estás seguro de que deseas eliminar esta conversación?")) {
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
      await loadConversations()
    } catch (error) {
      console.error("Error al crear nueva conversación:", error)
    }
  }

  const getConversationSummary = (conversation: any): string => {
    const userMessages = conversation.messages?.filter((msg: any) => msg.role === "user") || []
    if (userMessages.length > 0) {
      return userMessages[0].content.slice(0, 50) + (userMessages[0].content.length > 50 ? "..." : "")
    }
    return "Conversación sin mensajes"
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button onClick={handleCreateNewConversation} className="w-full flex items-center justify-center">
          <Plus className="h-4 w-4 mr-2" /> Nueva conversación
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint" />
          </div>
        ) : conversations.length > 0 ? (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group p-3 h-[100px] rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-start shadow-sm",
                  currentConversationId === conversation.id && "bg-mint/10 dark:bg-mint/5"
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-mint/20 dark:bg-mint/10 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-mint dark:text-mint/70" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs text-muted-foreground truncate">
                      {format(new Date(conversation.createdAt), "d MMM, yyyy", { locale: es })}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                  <p className="text-sm line-clamp-2 font-medium max-h-[3.5rem] overflow-hidden">{getConversationSummary(conversation)}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {conversation.messages?.length || 0} mensajes
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>No hay conversaciones previas</p>
            <p className="text-xs mt-1">Inicia una nueva conversación</p>
          </div>
        )}
      </div>
    </div>
  )
}

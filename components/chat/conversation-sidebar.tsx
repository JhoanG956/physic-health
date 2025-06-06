"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, MessageSquare, Trash2, UserCircle } from "lucide-react" // Añadido UserCircle
import type { Conversation } from "@/lib/services/conversation-service" // Asegúrate que la ruta es correcta
import Link from "next/link" // Para el botón de perfil

interface ConversationSidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onCreateConversation: () => void
  onDeleteConversation: (id: string) => void
  isLoading: boolean
}

export function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  isLoading,
}: ConversationSidebarProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="w-full md:w-72 lg:w-80 border-r bg-muted/40 p-4 flex flex-col">
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded w-full mb-4"></div>
          <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-muted rounded w-full mb-2"></div>
          <div className="h-8 bg-muted rounded w-5/6 mb-2"></div>
        </div>
      </div>
    )
  }

  return (
    <aside className="w-full md:w-72 lg:w-80 border-r bg-muted/40 p-4 flex flex-col">
      <Button
        onClick={onCreateConversation}
        disabled={isLoading}
        className="w-full mb-4 bg-deep-blue hover:bg-deep-blue/90 dark:bg-sky-blue dark:hover:bg-sky-blue/90"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Nueva Conversación
      </Button>

      {/* Botón para ir al perfil médico/onboarding */}
      <Link href="/onboarding" passHref legacyBehavior>
        <Button variant="outline" className="w-full mb-4">
          <UserCircle className="mr-2 h-5 w-5" />
          Mi Perfil Médico
        </Button>
      </Link>

      <h2 className="text-lg font-semibold mb-2 text-foreground">Historial</h2>
      {isLoading && conversations.length === 0 ? (
        <div className="text-center text-muted-foreground py-4">Cargando conversaciones...</div>
      ) : conversations.length === 0 ? (
        <div className="text-center text-muted-foreground py-4">No hay conversaciones aún.</div>
      ) : (
        <ScrollArea className="flex-grow">
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
                  ${currentConversationId === conv.id ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="flex items-center truncate">
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate text-sm">
                    {conv.title || new Date(conv.created_at).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 opacity-0 group-hover:opacity-100 ${currentConversationId === conv.id ? "opacity-100" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteConversation(conv.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </aside>
  )
}

"use client"

import type { Message } from "@/hooks/use-chat"
import { Avatar } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll al final cuando se añaden nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Filtrar mensajes de sistema y mensajes vacíos
  const visibleMessages = messages.filter((msg) => msg.role !== "system" && msg.content.trim() !== "")

  return (
    <div className="space-y-6">
      {visibleMessages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <Avatar className="h-8 w-8">
              <div
                className={`flex h-full w-full items-center justify-center rounded-full ${
                  message.role === "user"
                    ? "bg-deep-blue dark:bg-deep-blue/80 text-white"
                    : "bg-mint/70 dark:bg-mint/30 text-deep-blue dark:text-white"
                }`}
              >
                {message.role === "user" ? "U" : "AI"}
              </div>
            </Avatar>
            <div
              className={`rounded-xl p-4 ${
                message.role === "user"
                  ? "bg-deep-blue dark:bg-deep-blue/80 text-white"
                  : "bg-white dark:bg-slate-800 shadow-sm dark:text-slate-100"
              }`}
            >
              {message.role === "user" ? (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div className="text-sm markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Personalizar los componentes de Markdown
                      h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-3" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-md font-bold my-2" {...props} />,
                      p: ({ node, ...props }) => <p className="my-2" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                      li: ({ node, ...props }) => <li className="my-1" {...props} />,
                      a: ({ node, ...props }) => (
                        <a className="text-sky-blue underline hover:text-sky-blue/80" {...props} />
                      ),
                      strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                      em: ({ node, ...props }) => <em className="italic" {...props} />,
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-xs" {...props} />
                        ) : (
                          <code
                            className="block bg-slate-100 dark:bg-slate-700 p-2 rounded text-xs my-2 overflow-x-auto"
                            {...props}
                          />
                        ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-mint pl-4 italic my-2" {...props} />
                      ),
                      hr: ({ node, ...props }) => (
                        <hr className="my-4 border-slate-200 dark:border-slate-700" {...props} />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              <div
                className={`text-xs mt-1 ${
                  message.role === "user" ? "text-white/70" : "text-muted-foreground dark:text-slate-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {isLoading && !messages.some((msg) => msg.role === "assistant" && msg.content === "") && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
          <div className="flex gap-3 max-w-[80%]">
            <Avatar className="h-8 w-8">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-mint/70 dark:bg-mint/30 text-deep-blue dark:text-white">
                AI
              </div>
            </Avatar>
            <div className="rounded-xl p-4 bg-white dark:bg-slate-800 shadow-sm flex items-center dark:text-slate-100">
              <Loader2 className="h-4 w-4 animate-spin mr-2 text-mint dark:text-mint/70" />
              <p className="text-sm">Escribiendo respuesta...</p>
            </div>
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

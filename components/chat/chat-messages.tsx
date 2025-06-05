"use client"

import type { Message } from "@/hooks/use-chat"
import { Avatar } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function parseMessageContent(content: string): string {
  if (content.startsWith('"') && content.endsWith('"')) {
    try {
      content = JSON.parse(content)
    } catch {
      content = content.slice(1, -1)
    }
  }

  return content
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/(\d+)\.\s*\n(?!\n)/g, "$1. ")
    .replace(/\*\s*\n+(?=\*\*|\w)/g, "* ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/([^\n])\n(?=[^\n*])/g, "$1 $2")
    .replace(/(?<!\n)\n(?=\d+\.\s)/g, "\n\n")
    .replace(/(?<!\n)\n(?=\*\s)/g, "\n\n")
    .trim()
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const visibleMessages = messages.filter((msg) => msg.role !== "system" && msg.content.trim() !== "")

  return (
    <div className="space-y-4 px-2 md:px-6 py-4 overflow-y-auto">
      {visibleMessages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`flex items-end gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <Avatar className="h-9 w-9">
              <div
                className={`flex h-full w-full items-center justify-center rounded-full font-semibold text-sm shadow-inner ${
                  message.role === "user"
                    ? "bg-deep-blue dark:bg-deep-blue/80 text-white"
                    : "bg-mint/70 dark:bg-mint/30 text-deep-blue dark:text-white"
                }`}
              >
                {message.role === "user" ? "U" : "AI"}
              </div>
            </Avatar>
            <div
              className={`rounded-2xl px-4 py-3 shadow-sm text-sm ${
                message.role === "user"
                  ? "bg-deep-blue text-white dark:bg-deep-blue/90 ml-auto"
                  : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              }`}
            >
              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
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
                    code: ({ node, ...props }) => (
                      <code className="bg-slate-200 dark:bg-slate-700 rounded-md px-1" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-mint pl-4 italic my-2" {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="my-4 border-slate-200 dark:border-slate-700" {...props} />
                    ),
                  }}
                >
                  {parseMessageContent(message.content)}
                </ReactMarkdown>
              </div>
              <div
                className={`text-[11px] mt-1 ${
                  message.role === "user"
                    ? "text-white/70 text-right"
                    : "text-muted-foreground dark:text-slate-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {isLoading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
          <div className="flex gap-3 max-w-[85%] items-end">
            <Avatar className="h-9 w-9">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-mint/70 dark:bg-mint/30 text-deep-blue dark:text-white text-sm font-semibold shadow-inner">
                AI
              </div>
            </Avatar>
            <div className="rounded-2xl px-4 py-3 bg-white dark:bg-slate-800 shadow-sm flex items-center text-sm dark:text-slate-100">
              <Loader2 className="h-4 w-4 animate-spin mr-2 text-mint dark:text-mint/70" />
              <p>Escribiendo respuesta...</p>
            </div>
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
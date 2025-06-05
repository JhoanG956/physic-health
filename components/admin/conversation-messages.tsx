import { Avatar } from "@/components/ui/avatar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ConversationMessagesProps {
  messages: Array<{
    id: string
    role: string
    content: string
    timestamp: string
  }>
}

export function ConversationMessages({ messages }: ConversationMessagesProps) {
  // Filtrar mensajes de sistema y ordenar por timestamp
  const visibleMessages = messages
    .filter((msg) => msg.role !== "system")
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-800">
      <div className="p-4 border-b bg-slate-50 dark:bg-slate-700">
        <h2 className="font-medium">Mensajes ({visibleMessages.length})</h2>
      </div>

      <div className="p-4 space-y-6">
        {visibleMessages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay mensajes en esta conversación</p>
          </div>
        ) : (
          visibleMessages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
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
                      : "bg-slate-50 dark:bg-slate-700 shadow-sm dark:text-slate-100"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="text-sm markdown-content">
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
                          code: ({ node, inline, ...props }) =>
                            inline ? (
                              <code className="bg-slate-100 dark:bg-slate-600 px-1 py-0.5 rounded text-xs" {...props} />
                            ) : (
                              <code
                                className="block bg-slate-100 dark:bg-slate-600 p-2 rounded text-xs my-2 overflow-x-auto"
                                {...props}
                              />
                            ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-mint pl-4 italic my-2" {...props} />
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
                    {format(new Date(message.timestamp), "dd/MM/yyyy HH:mm", { locale: es })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

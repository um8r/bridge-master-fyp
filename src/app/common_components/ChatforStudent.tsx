"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import * as signalR from "@microsoft/signalr"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare, Send, X, User } from "lucide-react"

interface ChatForStudentProps {
  studentId: string // Current student's userId
  expertId: string // Expert's userId
  expertName?: string // Optional: Expert's name
}

interface Message {
  id?: string
  senderId: string
  recipientId: string
  content: string
  timeSent: string
}

const ChatForStudent: React.FC<ChatForStudentProps> = ({ studentId, expertId, expertName }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState("")
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
  const [showChat, setShowChat] = useState(false) // Toggle chat modal
  const [isConnecting, setIsConnecting] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Establish SignalR connection
  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      setConnectionError("No JWT token found in localStorage.")
      setIsConnecting(false)
      return
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/chathub?userId=${studentId}`, {
        // Pass studentId in query string
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    setConnection(newConnection)

    return () => {
      if (newConnection) newConnection.stop().catch((err) => console.error("Error stopping SignalR connection:", err))
    }
  }, [studentId, expertId])

  // Start SignalR connection and set up listeners
  useEffect(() => {
    if (!connection) return

    setIsConnecting(true)
    connection
      .start()
      .then(() => {
        console.log("SignalR connected for student.")
        setIsConnecting(false)
        setConnectionError(null)

        connection.on("ReceiveMessage", (senderId: string, message: string, timeSent: string) => {
          const newMessage: Message = {
            senderId,
            recipientId: studentId,
            content: message,
            timeSent,
          }
          setMessages((prev) => [...prev, newMessage])
        })
      })
      .catch((error) => {
        console.error("SignalR connection failed:", error)
        setIsConnecting(false)
        setConnectionError("Failed to connect to chat server. Please try again later.")
      })

    return () => {
      connection.stop().catch((err) => console.error("Error stopping SignalR connection:", err))
    }
  }, [connection, studentId, expertId])

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) return

      try {
        const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/chats/message-history/${studentId}/${expertId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data: Message[] = await response.json()
          setMessages(data)
        } else {
          console.error("Failed to fetch message history")
        }
      } catch (error) {
        console.error("Error fetching message history:", error)
      }
    }

    fetchMessages()
  }, [studentId, expertId])

  // Scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (showChat && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [showChat])

  // Send a new message
  const sendMessage = async () => {
    if (!newMsg.trim() || !connection) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const timeSent = new Date().toISOString()
      await connection.invoke("SendMessageToUser", expertId, studentId, newMsg, timeSent)
      const newMessage: Message = {
        senderId: studentId,
        recipientId: expertId,
        content: newMsg,
        timeSent,
      }
      setMessages((prev) => [...prev, newMessage])
      setNewMsg("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div>
      {/* Floating Action Button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition z-50"
        title="Open Chat"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 w-full max-w-lg rounded-lg shadow-xl overflow-hidden border border-gray-700"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between bg-blue-900 p-4 text-white">
                <div className="flex items-center">
                  <div className="bg-blue-700 rounded-full p-2 mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold">Chat with {expertName || "Expert"}</h2>
                </div>
                <button onClick={() => setShowChat(false)} className="rounded-full hover:bg-blue-800 p-2 transition">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Messages */}
              {isConnecting ? (
                <div className="p-8 flex items-center justify-center bg-gray-900 h-80">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-400">Connecting to chat...</p>
                  </div>
                </div>
              ) : connectionError ? (
                <div className="p-8 flex items-center justify-center bg-gray-900 h-80">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-900/30 mb-4">
                      <X className="h-6 w-6 text-red-500" />
                    </div>
                    <p className="text-red-400 font-medium mb-2">Connection Error</p>
                    <p className="text-gray-400">{connectionError}</p>
                  </div>
                </div>
              ) : (
                <div ref={chatContainerRef} className="p-4 h-80 overflow-y-auto bg-gray-900">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500 italic">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isSelf = msg.senderId === studentId
                      const formattedDate =
                        msg.timeSent && !isNaN(new Date(msg.timeSent).getTime())
                          ? new Date(msg.timeSent).toLocaleString()
                          : ""

                      return (
                        <div key={index} className={`mb-3 flex ${isSelf ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`p-3 rounded-lg max-w-xs break-words ${
                              isSelf ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            <p>{msg.content}</p>
                            {formattedDate && (
                              <div className={`text-xs mt-1 ${isSelf ? "text-blue-200" : "text-gray-400"}`}>
                                {formattedDate}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}

              {/* Chat Input */}
              <div className="flex gap-2 p-4 bg-gray-800 border-t border-gray-700">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isConnecting || !!connectionError}
                  className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={isConnecting || !!connectionError}
                  className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatForStudent

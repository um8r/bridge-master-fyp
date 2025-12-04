"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import * as signalR from "@microsoft/signalr"

interface Message {
  id?: string
  senderId: string
  recipientId: string
  content: string
  timeSent: string
}

interface ChatForIndustryProps {
  expertId: string // Industry expert's ID
  studentId: string // Student's ID
}

const ChatForIndustry: React.FC<ChatForIndustryProps> = ({ expertId, studentId }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState("")
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Establish SignalR connection
  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      setConnectionError("No JWT token found in localStorage.")
      setIsConnecting(false)
      return
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/chathub?userId=${expertId}`, {
        // Pass expertId in query string
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    setConnection(newConnection)

    return () => {
      if (newConnection) newConnection.stop().catch((err) => console.error("Error stopping SignalR connection:", err))
    }
  }, [expertId, studentId])

  // Start SignalR connection and set up listeners
  useEffect(() => {
    if (!connection) return

    setIsConnecting(true)
    connection
      .start()
      .then(() => {
        console.log("SignalR connected for industry.")
        setIsConnecting(false)
        setConnectionError(null)

        connection.on("ReceiveMessage", (senderId: string, message: string, timeSent: string) => {
          const newMessage: Message = {
            senderId,
            recipientId: expertId,
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
  }, [connection, expertId, studentId])

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
  }, [expertId, studentId])

  // Scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Send a new message
  const sendMessage = async () => {
    if (!newMsg.trim() || !connection) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const timeSent = new Date().toISOString()
      await connection.invoke("SendMessageToUser", studentId, expertId, newMsg, timeSent)
      const newMessage: Message = {
        senderId: expertId,
        recipientId: studentId,
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
    <div className="flex flex-col h-[500px] bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-blue-50">
        <h2 className="text-lg font-bold text-gray-800">Chat with Student</h2>
      </div>

      {isConnecting ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Connecting to chat...</p>
          </div>
        </div>
      ) : connectionError ? (
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-1">Connection Error</p>
            <p className="text-gray-600">{connectionError}</p>
          </div>
        </div>
      ) : (
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 italic">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isSelf = msg.senderId === expertId
              const formattedDate =
                msg.timeSent && !isNaN(new Date(msg.timeSent).getTime()) ? new Date(msg.timeSent).toLocaleString() : ""

              return (
                <div key={index} className={`flex ${isSelf ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-3 rounded-lg max-w-xs break-words ${
                      isSelf ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{msg.content}</p>
                    {formattedDate && (
                      <div className={`text-xs mt-1 ${isSelf ? "text-blue-100" : "text-gray-500"}`}>
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

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isConnecting || !!connectionError}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={isConnecting || !!connectionError}
            className="bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatForIndustry

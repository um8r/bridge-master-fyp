"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { IoMdSend } from "react-icons/io"
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"
import { FiLoader } from "react-icons/fi"

// Store predefined responses
const promptsAndResponses: { [key: string]: string } = {
  "Who are you?":
    "I am the BridgeIT chatbot, here to help you connect with academia and industry professionals in Pakistan.",
  "What is BridgeIT?":
    "BridgeIT is a collaborative platform designed to bridge the gap between academia and industry in Pakistan. It connects students, faculty, and industry professionals through real-world projects and mentorship opportunities.",
  "How does BridgeIT work?":
    "BridgeIT allows students to find industry-relevant projects, faculty to guide projects with real-world applications, and professionals to post and collaborate on projects. Would you like help getting started?",
  "What can I do on this platform?":
    "On BridgeIT, you can explore industry projects, connect with mentors, and collaborate on real-world solutions. Whether you're a student, faculty member, or industry professional, the platform has resources for you.",
  "Is BridgeIT free to use?":
    "Yes, BridgeIT is free for students and faculty to explore projects and find mentors. Industry professionals may use certain premium features based on the project scope.",
  "How can I find projects?":
    'You can browse industry projects by using filters like technology, industry, or required skills. Simply visit the "Projects" section to get started.',
  "What kinds of projects are available?":
    "BridgeIT offers projects across various disciplines, including Computer Science, Engineering, Design, and more. You can filter projects based on your interests.",
  "Can I post a project?":
    "Industry professionals and faculty members can post projects on BridgeIT. You can specify project details, required skills, budget, and deadlines.",
  "How do I apply for a project?":
    "Students can apply for projects by browsing through available listings and submitting their profile and proposal for consideration.",
  "What is the success rate for projects on BridgeIT?":
    "Many projects have led to internships, job offers, and successful collaborations between students and industry professionals. Would you like to see some success stories?",
  "How can faculty members use BridgeIT?":
    "Faculty members can create profiles, collaborate with industry professionals, and guide students on real-world projects. You can also stay updated on industry trends through the platform.",
  "Can I list projects as a faculty member?":
    "Yes, faculty members can list projects, connect with industry professionals, and guide students on final-year projects that align with real-world needs.",
  "How can faculty members collaborate with industry professionals?":
    "Faculty members can connect with industry professionals by collaborating on listed projects, sharing expertise, and contributing to industry-academia partnerships.",
  "Who are youu?": "I am the BridgeIT chatbot.",
}

// Define message type
interface Message {
  sender: "user" | "ai"
  text: string
}

const ChatWidget: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Add welcome message when chat is opened
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([
        {
          sender: "ai",
          text: "Hello! I'm the BridgeIT chatbot. How can I help you today?",
        },
      ])
    }
  }, [isChatOpen, messages.length])

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isChatOpen])

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  // Check if we have a predefined response
  const checkPredefinedResponse = (input: string): string | null => {
    // Case insensitive search
    const normalizedInput = input.trim().toLowerCase()

    for (const [question, answer] of Object.entries(promptsAndResponses)) {
      if (question.toLowerCase() === normalizedInput) {
        return answer
      }
    }

    return null
  }

  const send_prompt = async (prompt: string): Promise<string> => {
    try {
      // First check if we have a predefined response
      const predefinedResponse = checkPredefinedResponse(prompt)
      if (predefinedResponse) {
        return predefinedResponse
      }

      // Otherwise, call the API
      const response = await fetch(
        "https://api-bridgeit-chatbot-hjczfjcrgjgrd6ct.canadacentral-01.azurewebsites.net/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: prompt,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.answer.trim()
    } catch (error) {
      console.error("Error:", error)
      return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment."
    }
  }

  const handleUserInput = async () => {
    if (!userInput.trim()) return

    const userMessage = userInput.trim()
    setUserInput("")

    // Add user message immediately
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }])

    // Show loading state
    setIsLoading(true)

    try {
      const answer = await send_prompt(userMessage)

      // Add AI response
      setMessages((prev) => [...prev, { sender: "ai", text: answer }])
    } catch (error) {
      console.error("Error handling user input:", error)
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative z-50">
      {/* Floating Action Button */}
      <button
        aria-label="Open chat"
        className="fixed bottom-5 left-5 flex items-center justify-center w-14 h-14 rounded-full 
                   bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 text-white 
                   shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 
                   focus:outline-none focus:ring-4 focus:ring-purple-300"
        onClick={toggleChat}
      >
        <IoChatbubbleEllipsesOutline size={28} />
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fadeIn">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white flex justify-between items-center p-3">
            <h3 className="text-lg font-semibold">Chat with BridgeIT</h3>
            <button
              aria-label="Close chat"
              onClick={toggleChat}
              className="text-white font-bold focus:outline-none hover:opacity-80 transition-opacity"
            >
              &#10005;
            </button>
          </div>

          <div className="p-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Chat messages */}
            {messages.map((msg, index) => {
              const isUser = msg.sender === "user"
              return (
                <div key={index} className={`my-2 flex ${isUser ? "justify-end" : "justify-start"} animate-messageIn`}>
                  <div
                    className={`
                      px-4 py-2 max-w-[75%] rounded-xl 
                      ${
                        isUser
                          ? "bg-gradient-to-bl from-blue-200 to-blue-300 text-gray-800 shadow-sm"
                          : "bg-gradient-to-bl from-gray-200 to-gray-300 text-gray-800 shadow-sm"
                      }
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start my-2 animate-messageIn">
                <div className="px-4 py-2 bg-gradient-to-bl from-gray-200 to-gray-300 text-gray-800 rounded-xl shadow-sm flex items-center">
                  <FiLoader className="animate-spin mr-2" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="p-3 border-t border-gray-200 bg-white flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? handleUserInput() : null)}
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <button
              aria-label="Send message"
              className={`px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium 
                         shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-400 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleUserInput}
              disabled={isLoading}
            >
              <IoMdSend />
            </button>
          </div>
        </div>
      )}

      {/* Add animations to global styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-messageIn {
          animation: messageIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default ChatWidget

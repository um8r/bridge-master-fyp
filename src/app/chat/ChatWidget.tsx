"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { IoMdSend } from "react-icons/io"
import { IoChatbubbleEllipsesOutline } from "react-icons/io5"
import { FiLoader } from "react-icons/fi"

// Store detailed predefined responses (all lowercase keys for matching)
const promptsAndResponses: { [key: string]: string } = {
  "who are you":
    "I m the BridgeIT assistant. I guide students, faculty, and industry partners on how to find, post, or collaborate on real-world projects across Pakistan.",
  "what is bridgeit":
    "BridgeIT is a collaboration hub that connects students, faculty, and industry professionals. It helps teams find projects, co-mentor students, and deliver solutions aligned to real industry needs.",
  "how does bridgeit work":
    "BridgeIT matches roles to actions: students browse and apply to industry-backed projects, faculty co-mentor and align coursework, and industry professionals post challenges and review proposals. Everything is organized so teams can start quickly with clear scopes.",
  "what can i do on this platform":
    "You can browse active projects, post new project briefs, apply or propose solutions, and collaborate with mentors or industry partners. Tell me your role and goal, and I ll outline your next steps.",
  "is bridgeit free to use":
    "Students and faculty can explore and apply to projects for free. Industry partners can post projects and may choose premium options if they need extended support or faster sourcing.",
  "how can i find projects":
    "Open the Projects section, then filter by technology, industry, skills, duration, or difficulty. Shortlist matches and read the brief to confirm scope, timeline, and deliverables before you apply.",
  "what kinds of projects are available":
    "You ll find software, data, engineering, design, research, and interdisciplinary briefs. Each project lists skills, timelines, and expected outcomes—filter to the stack or domain you prefer.",
  "can i post a project":
    "Yes. Draft a clear brief with problem statement, context, expected outcomes, required skills, timeline, and review cadence. Post it, then review incoming proposals and chat with shortlisted teams.",
  "how do i apply for a project":
    "Open a project, click apply, and submit a concise proposal: your skills, past work, your plan, a rough timeline, and communication cadence. Tailor it to the problem and keep it clear and realistic.",
  "what is the success rate for projects on bridgeit":
    "Strong matches do well: clear briefs, realistic timelines, and active check-ins lead to internships, offers, or published results. I can share tips to improve your proposal if you tell me your profile.",
  "how can faculty members use bridgeit":
    "Faculty can co-post or co-mentor projects, align them with coursework, supervise students, and connect with industry partners for feedback and assessment.",
  "can i list projects as a faculty member":
    "Yes—faculty can list projects directly or co-list with industry partners. Include learning objectives, deliverables, and assessment criteria to set clear expectations.",
  "how can faculty members collaborate with industry professionals":
    "They can co-create briefs, co-mentor student teams, run milestone reviews, and ensure academic rigor while delivering industry-relevant outcomes.",
  "who are youu":
    "I m the BridgeIT assistant. I can direct you to projects, mentors, or posting flows based on your role.",
}

// Define message type
interface Message {
  sender: "user" | "ai"
  text: string
}

const suggestedPrompts = [
  { label: "Who are you?", value: "who are you" },
  { label: "What is BridgeIT?", value: "what is bridgeit" },
  { label: "How does BridgeIT work?", value: "how does bridgeit work" },
  { label: "How can I find projects?", value: "how can i find projects" },
  { label: "Can I post a project?", value: "can i post a project" },
  { label: "How do I apply for a project?", value: "how do i apply for a project" },
  { label: "Faculty collaboration", value: "how can faculty members collaborate with industry professionals" },
  { label: "Payment guidance", value: "payment guidance" },
]

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
    const normalizedInput = input.trim().toLowerCase()
    return promptsAndResponses[normalizedInput] ?? null
  }

  // Lightweight local responder to avoid external APIs (no vague fallbacks)
  const generateLocalAnswer = (input: string): string => {
    const normalized = input.toLowerCase()

    const isStudent =
      normalized.includes("student") ||
      normalized.includes("apply") ||
      normalized.includes("enroll") ||
      normalized.includes("join")
    const isFaculty =
      normalized.includes("faculty") ||
      normalized.includes("mentor") ||
      normalized.includes("professor") ||
      normalized.includes("supervisor")
    const isIndustry =
      normalized.includes("industry") ||
      normalized.includes("company") ||
      normalized.includes("sponsor") ||
      normalized.includes("partner")
    const isProject = normalized.includes("project")
    const isPost = normalized.includes("post") || normalized.includes("create")
    const isPayment =
      normalized.includes("payment") ||
      normalized.includes("pay") ||
      normalized.includes("invoice") ||
      normalized.includes("history")

    if (isPayment) {
      return [
        "Payment guidance:",
        "• Students: open Payment History to review past transactions; for new payments, follow the payment CTA on your active project dashboard.",
        "• Industry partners: if you need invoicing or receipts, check the billing section of your organization profile or contact support with your project ID.",
        "• If something looks off, capture the transaction ID and reach out via support; we’ll reconcile it for you.",
      ].join(" ")
    }

    if (isIndustry && isPost) {
      return [
        "Posting as an industry partner:",
        "1) Draft a brief: problem statement, context, required skills, timeline, deliverables, and review cadence.",
        "2) Post it in the Projects area; enable messaging so applicants can clarify scope.",
        "3) Shortlist proposals that show a clear plan and feasible timeline; schedule a quick call for alignment.",
        "4) Run milestones: kickoff, midpoint check, final review, and outcome handoff.",
      ].join(" ")
    }

    if (isIndustry) {
      return [
        "How industry partners work here:",
        "• Post a project with scope, success criteria, and timeline.",
        "• Review proposals, shortlist, and co-mentor with faculty if needed.",
        "• Use milestone reviews to keep delivery on track and provide timely feedback.",
      ].join(" ")
    }

    if (isFaculty && isPost) {
      return [
        "Posting or co-mentoring as faculty:",
        "• Co-create a brief with industry or post your own applied project.",
        "• Add learning objectives, assessment criteria, and communication cadence.",
        "• Host milestone reviews (proposal, midpoint, final) to keep students on track.",
      ].join(" ")
    }

    if (isFaculty) {
      return [
        "Faculty guidance:",
        "• Co-mentor projects with industry partners and supervise student teams.",
        "• Align projects with coursework and set clear rubrics for assessment.",
        "• Encourage students to submit concise proposals and hold regular check-ins.",
      ].join(" ")
    }

    if (isStudent && isPost) {
      return [
        "Students cannot post projects, but you can propose solutions to posted briefs.",
        "Pick a project, then submit a clear proposal with your plan, timeline, and relevant work.",
      ].join(" ")
    }

    if (isStudent) {
      return [
        "Applying as a student:",
        "1) Open Projects, filter by your skills or target tech stack.",
        "2) Read the brief; note deliverables, timeline, and required tools.",
        "3) Apply with a concise proposal: your plan, milestones, communication cadence, and links to past work.",
        "4) After acceptance, attend kickoff, share weekly updates, and prep a final demo with results.",
      ].join(" ")
    }

    if (isProject || isPost) {
      return [
        "Working with projects here:",
        "• Posting: include problem, context, skills, timeline, deliverables, and review cadence.",
        "• Applying: tailor a short proposal with your approach, milestones, and relevant portfolio.",
        "• Delivery: run milestone reviews (kickoff, midpoint, final) and keep updates concise.",
      ].join(" ")
    }

    // General catch-all but still actionable (no vague fallback)
    return [
      "I can help you act quickly. Tell me your role (student, faculty, industry) and your goal (apply, post, or review payments), and I’ll lay out exact steps.",
      "If you’re unsure, start with Projects: pick a brief, read scope and timeline, then propose a clear plan with milestones.",
    ].join(" ")
  }

  const send_prompt = async (prompt: string): Promise<string> => {
    const predefined = checkPredefinedResponse(prompt)
    if (predefined) return predefined
    return generateLocalAnswer(prompt)
  }

  const askPrompt = async (prompt: string) => {
    if (!prompt.trim()) return
    const userMessage = prompt.trim()

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

  const handleUserInput = async () => {
    // Manual input is disabled; rely on suggested prompts only
    return
  }

  const handleSuggestedClick = (prompt: string) => {
    if (isLoading) return
    askPrompt(prompt)
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
        <div className="fixed bottom-24 right-6 w-[26rem] max-w-[90vw] h-[34rem] bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fadeIn">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white flex justify-between items-center px-4 py-3.5">
            <h3 className="text-xl font-semibold">Chat with BridgeIT</h3>
            <button
              aria-label="Close chat"
              onClick={toggleChat}
              className="text-white font-bold focus:outline-none hover:opacity-80 transition-opacity"
            >
              &#10005;
            </button>
          </div>

          <div className="px-4 py-3 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* Chat messages */}
            {messages.map((msg, index) => {
              const isUser = msg.sender === "user"
              return (
                <div key={index} className={`my-2 flex ${isUser ? "justify-end" : "justify-start"} animate-messageIn`}>
                  <div
                    className={`
                      px-4 py-3 max-w-[82%] rounded-xl text-[15px] leading-relaxed
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

          {/* Suggested prompts only */}
          <div className="border-t border-gray-200 bg-white px-4 py-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Quick questions (tap to ask)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {suggestedPrompts.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleSuggestedClick(item.value)}
                  disabled={isLoading}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-left font-medium transition-all duration-150 ${
                    isLoading
                      ? "cursor-not-allowed opacity-60 border-gray-200 bg-gray-50 text-gray-400"
                      : "border-blue-100 bg-blue-50 text-blue-900 hover:border-blue-200 hover:bg-blue-100 hover:-translate-y-[1px]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
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

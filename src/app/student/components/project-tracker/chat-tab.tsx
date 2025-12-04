import { MessageSquare } from "lucide-react"
import ChatForStudent from "@/app/common_components/ChatforStudent"

interface ChatTabProps {
  studentId: string
  expertId: string
  expertName?: string
}

const ChatTab = ({ studentId, expertId, expertName }: ChatTabProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Chat with Expert</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 flex items-center">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {expertName ? `Chat with ${expertName}` : "Expert Chat"}
          </h3>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Use the chat button in the bottom right corner to communicate with your industry expert.
          </p>
          <ChatForStudent studentId={studentId} expertId={expertId} expertName={expertName} />
        </div>
      </div>
    </div>
  )
}

export default ChatTab

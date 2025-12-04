import type React from "react"

interface ErrorDisplayProps {
  error: string | null
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="text-red-500 text-2xl">{error}</div>
    </div>
  )
}

export default ErrorDisplay

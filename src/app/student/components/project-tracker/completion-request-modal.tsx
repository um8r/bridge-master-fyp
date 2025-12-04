"use client"

import { motion } from "framer-motion"
import { CheckCircle, LinkIcon } from "lucide-react"
import { toast } from "react-toastify"

interface CompletionRequestModalProps {
  deploymentLink: string
  setDeploymentLink: (link: string) => void
  onClose: () => void
  onSubmit: () => void
}

const CompletionRequestModal = ({
  deploymentLink,
  setDeploymentLink,
  onClose,
  onSubmit,
}: CompletionRequestModalProps) => {
  const handleSubmit = () => {
    // Validate the link
    if (!deploymentLink.trim()) {
      toast.error("Please enter a deployment link")
      return
    }

    // Simple URL validation
    try {
      new URL(deploymentLink)
      onSubmit()
    } catch (e) {
      toast.error("Please enter a valid URL (include http:// or https://)")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 w-full max-w-md rounded-lg shadow-xl border border-gray-200"
      >
        <h3 className="text-xl font-bold text-blue-600 mb-4">Request Project Completion</h3>

        <p className="text-gray-600 mb-4">
          Before requesting project completion, please provide the deployment link for your project.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deployment Link <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <div className="bg-gray-100 flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300">
                <LinkIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="url"
                placeholder="https://your-project-url.com"
                value={deploymentLink}
                onChange={(e) => setDeploymentLink(e.target.value)}
                className="w-full p-3 bg-white rounded-r-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Once you submit this request, the industry expert will review your project and
              approve the completion. Make sure your project is fully ready for review.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white flex items-center"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Submit Request
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default CompletionRequestModal

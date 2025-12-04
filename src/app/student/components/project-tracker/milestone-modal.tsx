"use client"

import { motion } from "framer-motion"

interface MilestoneModalProps {
  editItemId: string | null
  itemFormData: {
    title: string
    description: string
    achievementDate: string
  }
  setItemFormData: (data: {
    title: string
    description: string
    achievementDate: string
  }) => void
  onClose: () => void
  onSave: () => void
}

const MilestoneModal = ({ editItemId, itemFormData, setItemFormData, onClose, onSave }: MilestoneModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 w-full max-w-md rounded-lg shadow-xl border border-gray-200"
      >
        <h3 className="text-xl font-bold text-blue-600 mb-4">{editItemId ? "Edit Milestone" : "Add Milestone"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Complete Research Phase"
              value={itemFormData.title}
              onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
              className="w-full p-3 bg-white rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Describe what needs to be accomplished"
              value={itemFormData.description}
              onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
              className="w-full p-3 bg-white rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={itemFormData.achievementDate}
              onChange={(e) => setItemFormData({ ...itemFormData, achievementDate: e.target.value })}
              className="w-full p-3 bg-white rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700">
            Cancel
          </button>
          <button onClick={onSave} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">
            {editItemId ? "Update" : "Save"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default MilestoneModal

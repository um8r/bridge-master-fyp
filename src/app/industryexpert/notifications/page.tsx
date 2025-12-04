"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ProposalDetailsModal from "../industrycomponents/PropossalDetails"
import { Bell, FileText, User, Clock } from "lucide-react"

interface Proposal {
  id: string
  projectTitle: string
  studentName: string
  studentUserId: string
  proposal: string // Base64 encoded proposal
  status: string
}

const NotificationsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const router = useRouter()

  // Fetch proposals on component load
  useEffect(() => {
    const fetchProposals = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!profileResponse.ok) throw new Error("Failed to fetch profile")

        const profileData = await profileResponse.json()
        const userId = profileData.userId

        const expertResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!expertResponse.ok) throw new Error("Failed to fetch expert profile")

        const expertData = await expertResponse.json()
        const expertId = expertData.indExptId

        const proposalsResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-proposals/get-proposal-for-expert/${expertId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (proposalsResponse.ok) {
          const proposalsData = await proposalsResponse.json()
          // Map API response to match Proposal interface
          const mappedProposals = proposalsData.map((p: any) => ({
            id: p.id,
            projectTitle: p.projectTitle,
            studentName: p.studentName,
            studentUserId: p.studentId,
            proposal: p.proposal, // base64 string
            status: p.status,
          }))
          setProposals(mappedProposals)
        } else {
          setProposals([])
        }
      } catch (error) {
        setError("Failed to fetch proposals")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [router])

  const handleSeeDetails = (proposal: Proposal) => {
    setSelectedProposal(proposal)
    setShowModal(true)
  }

  const handleViewStudentProfile = (studentUserId: string) => {
    router.push(`/industryexpert/notifications/student/${studentUserId}`)
  }

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const token = localStorage.getItem("jwtToken")
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-proposals/accept-proposal/${proposalId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("Proposal accepted successfully!")
        setProposals(
          (prev) => prev.filter((proposal) => proposal.id !== proposalId), // Remove proposal after accepting
        )
        setShowModal(false) // Close the modal
      } else {
        toast.error("Failed to accept proposal.")
      }
    } catch (error) {
      toast.error("Error accepting proposal.")
      console.error("Error accepting proposal:", error)
    }
  }

  const handleRejectProposal = async (proposalId: string) => {
    try {
      const token = localStorage.getItem("jwtToken")
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-proposals/reject-proposal/${proposalId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("Proposal rejected successfully!")
        setProposals((prev) => prev.filter((proposal) => proposal.id !== proposalId))
        setShowModal(false)
      } else {
        toast.error("Failed to reject proposal.")
      }
    } catch (error) {
      toast.error("Error rejecting proposal.")
      console.error("Error rejecting proposal:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading notifications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center border border-red-100">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
        <div className="mb-6 bg-blue-50 p-6 rounded-full">
          <Bell className="w-16 h-16 text-blue-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">No Notifications</h1>
        <p className="text-gray-600 mt-2 max-w-md text-center">
          You donot have any new proposals at the moment. Check back later!
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Bell className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold text-gray-800">{proposal.projectTitle}</h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{proposal.status}</span>
              </div>

              <div className="flex items-center mb-3">
                <div className="bg-gray-100 p-2 rounded-full mr-2">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <p className="text-gray-700">
                  From:{" "}
                  <button
                    onClick={() => handleViewStudentProfile(proposal.studentUserId)}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
                  >
                    {proposal.studentName}
                  </button>
                </p>
              </div>

              <div className="flex items-center mb-3">
                <div className="bg-gray-100 p-2 rounded-full mr-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                </div>
                <p className="text-gray-700">New proposal document</p>
              </div>

              <div className="flex items-center mb-4">
                <div className="bg-gray-100 p-2 rounded-full mr-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
                <p className="text-gray-600 text-sm">Awaiting your review</p>
              </div>

              <button
                className="w-full mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                onClick={() => handleSeeDetails(proposal)}
              >
                See Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedProposal && (
        <ProposalDetailsModal
          proposal={selectedProposal}
          onAccept={() => handleAcceptProposal(selectedProposal.id)}
          onReject={() => handleRejectProposal(selectedProposal.id)}
          onClose={() => setShowModal(false)}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  )
}

export default NotificationsPage

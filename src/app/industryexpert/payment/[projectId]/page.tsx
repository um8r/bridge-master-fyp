"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ArrowLeft, RefreshCw, CreditCard, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  studentName: string
  budget: number
  status: string
}

const PaymentPage = () => {
  const { projectId } = useParams()
  const router = useRouter()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProject = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      toast.error("Please log in to continue.")
      router.push("/auth/login-user")
      return
    }

    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch project")
      }
      const data = await res.json()
      setProject(data)
      if (data.status.toLowerCase() !== "paymentpending") {
        toast.warning("Project is not in Payment Pending status. Please refresh or verify completion request.")
      }
    } catch (err: any) {
      setError(err.message || "Could not load project details.")
      toast.error(err.message || "Could not load project details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) fetchProject()
  }, [projectId, router])

  const handlePayment = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) {
      toast.error("Unauthorized or missing project ID")
      return
    }

    setProcessing(true)

    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/payments/create-checkout-session/${projectId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.Error || errorData.Details || "Failed to create checkout session")
      }

      const { checkoutUrl } = await res.json()
      console.log("Redirecting to Stripe Checkout URL:", checkoutUrl)
      window.location.href = checkoutUrl
    } catch (err: any) {
      console.error("Payment error:", err)
      toast.error(`Payment failed: ${err.message || "Unknown error"}`)
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center text-gray-800">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="bg-gray-50 text-gray-800 min-h-screen p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-red-100 p-3 rounded-full mr-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Error</h1>
          </div>
          <p className="text-gray-600 mb-6">{error || "Project not found."}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setLoading(true)
                setError(null)
                fetchProject()
              }}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
            <button
              onClick={() => router.push(`/industryexpert/projects/milestone/${projectId}`)}
              className="py-2 px-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center">
              <CreditCard className="h-6 w-6 mr-2" />
              Confirm Payment
            </h1>
            <p className="text-blue-100 mt-1">Review project details before proceeding with payment</p>
          </div>

          {/* Project Details */}
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{project.title}</h2>
                <p className="text-gray-600">{project.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Student</p>
                  <p className="text-gray-800">{project.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Budget</p>
                  <p className="text-gray-800">${project.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status.toLowerCase() === "paymentpending"
                        ? "bg-blue-100 text-blue-800"
                        : project.status.toLowerCase() === "completed"
                          ? "bg-green-100 text-green-800"
                          : project.status.toLowerCase() === "pendingcompletion"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status.toLowerCase() === "paymentpending" && <Clock className="h-3 w-3 mr-1" />}
                    {project.status.toLowerCase() === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {project.status}
                  </span>
                </div>
              </div>
            </div>

            {project.status.toLowerCase() !== "paymentpending" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">Payment Not Ready</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      This project is not ready for payment. Please ensure the project is in Payment Pending status by
                      approving the completion request.
                    </p>
                    <button
                      onClick={() => {
                        setLoading(true)
                        fetchProject()
                      }}
                      className="mt-2 py-1.5 px-3 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition text-sm flex items-center"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      Refresh Status
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                disabled={processing || project.status.toLowerCase() === "completed"}
                className={`w-full py-3 text-white rounded-lg transition flex items-center justify-center ${
                  processing || project.status.toLowerCase() === "completed"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Make Payment
                  </>
                )}
              </button>

              <button
                onClick={() => router.push(`/industryexpert/projects/milestone/${projectId}`)}
                className="w-full py-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Project
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default PaymentPage

"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, ArrowLeft, FileText } from "lucide-react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [projectDetails, setProjectDetails] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const projectId = searchParams.get("project_id")

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!sessionId || !projectId) {
        setError("Missing payment information")
        setLoading(false)
        return
      }

      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Fetch the bought FYP details
        const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/bought-fyp/by-id/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setProjectDetails(data)
        } else {
          // If we can't get the bought FYP details yet, at least show a success message
          console.log("Payment successful, but details not yet available")
        }
      } catch (err) {
        console.error("Error fetching payment details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentDetails()
  }, [sessionId, projectId, router])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 text-lg mb-8">
              Thank you for your purchase. Your transaction has been completed successfully.
            </p>

            {projectDetails ? (
              <div className="bg-gray-50 rounded-lg p-6 text-left mb-8 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Purchase Details</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Project Title</p>
                    <p className="text-gray-800 font-medium">{projectDetails.fypTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="text-green-600 font-medium">{projectDetails.price.toLocaleString()} PKR</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="text-gray-800">{sessionId}</p>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center mb-8 border border-gray-200">
                <p className="text-gray-600">Loading purchase details...</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center mb-8 border border-gray-200">
                <p className="text-gray-600">
                  Your payment has been processed successfully. The project details will be available shortly.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/industryexpert/projects")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="h-5 w-5" />
                View My Projects
              </button>
              <button
                onClick={() => router.push("/industryexpert")}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} theme="light" />
    </div>
  )
}

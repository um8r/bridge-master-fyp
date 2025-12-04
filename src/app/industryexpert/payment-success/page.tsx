"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Home, FileText, ArrowLeft } from "lucide-react"

const PaymentSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projectTitle, setProjectTitle] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusUpdated, setStatusUpdated] = useState(false)

  useEffect(() => {
    // Get project ID from URL parameters if available
    const id = searchParams.get("project_id")
    const title = searchParams.get("title")

    if (id) setProjectId(id)
    if (title) setProjectTitle(decodeURIComponent(title))

    // Check if user is authenticated
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    // Update project status to Completed if payment was successful
    if (id && token) {
      console.log("Payment successful, updating project status to Completed")
      completeProject(id, token)
    }
  }, [router, searchParams])

  const completeProject = async (id: string, token: string) => {
    setLoading(true)
    try {
      console.log("Calling project complete endpoint for project:", id)

      // Call the dedicated complete project endpoint
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/${id}/complete`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        console.log("Project successfully marked as completed")
        setStatusUpdated(true)
      } else {
        const errorText = await res.text()
        console.error("Failed to complete project:", res.status, errorText)
      }
    } catch (err) {
      console.error("Error completing project:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6 text-gray-800">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <div className="flex flex-col items-center text-center">
          {loading ? (
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-4"></div>
          ) : (
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
          )}

          <h1 className="text-3xl font-bold text-blue-600 mb-4">Payment Successful!</h1>

          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. Thank you for completing the transaction.
            {projectTitle && (
              <span>
                {" "}
                The payment for project <strong className="text-gray-800">{projectTitle}</strong> has been recorded.
              </span>
            )}
          </p>

          <div className="bg-gray-50 p-6 rounded-lg w-full mb-8 border border-gray-200">
            <h3 className="font-semibold text-blue-700 mb-3">Payment Details:</h3>
            <ul className="space-y-3 text-left text-gray-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Status: <span className="text-green-600 font-medium ml-1">Completed</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Date: <span className="ml-1">{new Date().toLocaleDateString()}</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Time: <span className="ml-1">{new Date().toLocaleTimeString()}</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Payment Method: <span className="ml-1">Credit/Debit Card</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Project Status:{" "}
                <span className={`font-medium ml-1 ${statusUpdated ? "text-green-600" : "text-amber-600"}`}>
                  {statusUpdated ? "Updated to Completed" : "Updating..."}
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href="/industryexpert"
              className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-center transition flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>

            {projectId && (
              <>
                <Link
                  href={`/industryexpert/projects/milestone/${projectId}`}
                  className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Project
                </Link>
                <Link
                  href={`/industryexpert/payment-receipt/${projectId}`}
                  className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg text-center transition flex items-center justify-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Receipt
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage

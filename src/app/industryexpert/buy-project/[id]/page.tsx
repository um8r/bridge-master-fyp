"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  ArrowLeft,
  DollarSign,
  Loader2,
  FileText,
  CheckCircle,
  Users,
  CreditCard,
  Lock,
  AlertCircle,
} from "lucide-react"

interface FYP {
  id: string
  title: string
  description: string
  fypId: string
  members: number
  facultyName?: string
  technology?: string
  yearOfCompletion?: number
  students?: {
    id: string
    name: string
    email?: string
  }[]
}

export default function BuyProjectPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fyp, setFyp] = useState<FYP | null>(null)
  const [price, setPrice] = useState<number>(20000) // Default price in PKR
  const [industryExpertId, setIndustryExpertId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showAgreement, setShowAgreement] = useState(false)

  const router = useRouter()
  const params = useParams()
  const fypId = params.id as string

  useEffect(() => {
    const fetchFypDetails = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Step 1: Get user info
        const userResponse = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!userResponse.ok) throw new Error("Failed to authenticate user")

        const userData = await userResponse.json()
        const userId = userData.userId

        // Step 2: Get industry expert details
        const expertResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!expertResponse.ok) throw new Error("Failed to fetch industry expert details")

        const expertData = await expertResponse.json()
        setIndustryExpertId(expertData.indExptId)

        // Step 3: Fetch FYP details
        const fypResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${fypId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!fypResponse.ok) {
          throw new Error("Failed to fetch FYP details")
        }

        const fypData = await fypResponse.json()
        setFyp(fypData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchFypDetails()
  }, [fypId, router])

  const handleProceedToPayment = async () => {
    if (!industryExpertId || !fyp) {
      toast.error("Missing required information")
      return
    }

    setSubmitting(true)
    const token = localStorage.getItem("jwtToken")

    if (!token) {
      router.push("/auth/login-user")
      return
    }

    try {
      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/payments/create-checkout-session/fyp/${fyp.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            indExpertId: industryExpertId,
            price: price,
          }),
        },
      )

      if (response.ok) {
        const data = await response.json()

        // Redirect to Stripe checkout
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        } else {
          toast.error("No checkout URL received")
        }
      } else {
        const errorData = await response.text()
        toast.error(`Failed to create checkout session: ${errorData}`)
      }
    } catch (err) {
      toast.error("An error occurred while creating checkout session")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-xl text-gray-300">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !fyp) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900/20 p-6 rounded-lg border border-red-700 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300">{error || "Failed to load project details"}</p>
          <button
            onClick={() => router.push("/industryexpert/approved-requests")}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-200"
          >
            Return to Approved Requests
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-green-400">Buy Project</h1>
          <p className="text-gray-400 mt-2">{fyp.title}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Description */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Project Description</h2>
              <p className="text-gray-300">{fyp.description}</p>
            </div>

            {/* Payment Section */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                Payment Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Project Price (PKR)</label>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-500 absolute ml-3" />
                    <input
                      type="number"
                      className="w-full p-2 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      min={1000}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Enter the amount youore willing to pay for this project</p>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Project Price:</span>
                    <span className="text-white font-medium">{price.toLocaleString()} PKR</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Platform Fee (5%):</span>
                    <span className="text-white font-medium">{(price * 0.05).toLocaleString()} PKR</span>
                  </div>
                  <div className="border-t border-gray-600 my-2 pt-2 flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Total:</span>
                    <span className="text-green-400 font-bold">{(price * 1.05).toLocaleString()} PKR</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowAgreement(true)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    View Agreement
                  </button>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={submitting || price <= 0}
                    className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md transition-colors flex items-center gap-2 disabled:bg-green-900 disabled:cursor-not-allowed"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                    Proceed to Payment
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2 justify-center">
                  <Lock className="h-3 w-3" />
                  <span>Secure payment processed by Stripe</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Payment Information</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-200">What happens after payment?</p>
                    <p className="text-gray-400 mt-1">
                      Once your payment is processed, youoll receive a confirmation email with details about your
                      purchase. The project files and documentation will be made available to you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-200">Intellectual Property Rights</p>
                    <p className="text-gray-400 mt-1">
                      By purchasing this project, you acquire the intellectual property rights as specified in the
                      purchase agreement. Youoll be able to use, modify, and implement the project according to the
                      terms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-200">Need Help?</p>
                    <p className="text-gray-400 mt-1">
                      If you have any questions about the payment process or the project, please contact our support
                      team at support@bridgeit.com.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Project Title</p>
                  <p className="text-gray-200 font-medium">{fyp.title}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Project ID</p>
                  <p className="text-gray-200">{fyp.fypId}</p>
                </div>

                {fyp.members && (
                  <div>
                    <p className="text-sm text-gray-400">Team Size</p>
                    <p className="text-gray-200">{fyp.members} members</p>
                  </div>
                )}

                {fyp.yearOfCompletion && (
                  <div>
                    <p className="text-sm text-gray-400">Year of Completion</p>
                    <p className="text-gray-200">{fyp.yearOfCompletion}</p>
                  </div>
                )}

                {fyp.technology && (
                  <div>
                    <p className="text-sm text-gray-400">Technologies</p>
                    <p className="text-gray-200">{fyp.technology}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Student Team */}
            {fyp.students && fyp.students.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400" />
                  Student Team
                </h2>

                <div className="space-y-3">
                  {fyp.students.map((student) => (
                    <div key={student.id} className="bg-gray-700/30 p-3 rounded-lg">
                      <p className="font-medium text-gray-200">{student.name}</p>
                      {student.email && <p className="text-gray-400 text-sm">{student.email}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agreement Modal */}
      {showAgreement && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full border border-gray-700 shadow-xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Purchase Agreement</h2>

              <div className="bg-gray-700/50 rounded-lg p-4 mb-6 max-h-80 overflow-y-auto">
                <h3 className="font-semibold text-gray-200 mb-3">Project: {fyp.title}</h3>

                <div className="text-gray-300 space-y-3 text-sm">
                  <p>By proceeding with this purchase, I agree to the following terms:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      I acknowledge that I am purchasing the intellectual property rights to this Final Year Project.
                    </li>
                    <li>
                      I agree to respect the copyright of the original creators and will provide appropriate attribution
                      when using this project.
                    </li>
                    <li>
                      I understand that I will not publicly share or distribute the source code or proprietary elements
                      of this project without proper authorization.
                    </li>
                    <li>
                      I agree to use this project in accordance with the universityos intellectual property policies.
                    </li>
                    <li>
                      I understand that the final terms of purchase will be determined upon approval by the university
                      administration.
                    </li>
                    <li>I acknowledge that this purchase is final and non-refundable once processed.</li>
                  </ol>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowAgreement(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

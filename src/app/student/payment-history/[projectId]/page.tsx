"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface PaymentDetail {
  id: string
  projectId: string
  studentName: string
  projectOwnerName: string
  projectName: string
  paidAt: string
  amount?: number
}

const PaymentHistoryPage = () => {
  const router = useRouter()
  const [payments, setPayments] = useState<PaymentDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        const res = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/payment-details/payment-details",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!res.ok) {
          throw new Error(`Failed to fetch payment history: ${res.status}`)
        }

        const data = await res.json()
        
        // Transform the data to match our interface if needed
        const formattedPayments = Array.isArray(data) ? data.map((payment: any) => ({
          id: payment.id,
          projectId: payment.projectId,
          studentName: payment.project?.student?.user?.firstName + " " + payment.project?.student?.user?.lastName || "Unknown Student",
          projectOwnerName: payment.project?.indExpert?.user?.firstName + " " + payment.project?.indExpert?.user?.lastName || "Unknown Expert",
          projectName: payment.project?.title || "Unknown Project",
          paidAt: payment.paidAt,
          amount: payment.project?.budget || 0
        })) : []
        
        setPayments(formattedPayments)
      } catch (err: any) {
        console.error("Error fetching payment history:", err)
        setError(err.message || "Failed to load payment history")
        toast.error(err.message || "Failed to load payment history")
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentHistory()
  }, [router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading payment history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">Payment History</h1>
          <Link
            href="/industryexpert"
            className="py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {error ? (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        ) : null}

        {payments.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-400 text-lg">No payment records found.</p>
            <p className="text-gray-500 mt-2">When you make payments for completed projects, they will appear here.</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Project
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{payment.projectName}</div>
                        <div className="text-sm text-gray-400">ID: {payment.projectId.substring(0, 8)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{payment.studentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{formatDate(payment.paidAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-400">
                          ${payment.amount ? (payment.amount / 100).toFixed(2) : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/industryexpert/payment-receipt/${payment.projectId}`}
                          className="text-green-400 hover:text-green-300 mr-4"
                        >
                          View Receipt
                        </Link>
                        <Link
                          href={`/industryexpert/projects/milestone/${payment.projectId}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View Project
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">Payment Information</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              <strong>Payment Processing:</strong> All payments are securely processed through Stripe. Your payment
              information is never stored on our servers.
            </p>
            <p>
              <strong>Receipts:</strong> Digital receipts are generated for all transactions and can be accessed at any
              time from this page.
            </p>
            <p>
              <strong>Project Status:</strong> Once payment is completed, the project status is automatically updated to
              Completed and both you and the student will be notified.
            </p>
            <p>
              <strong>Need Help?</strong> If you have any questions about payments or need assistance, please contact
              our support team at support@bridgeit.com.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default PaymentHistoryPage
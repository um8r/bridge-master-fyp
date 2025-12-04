// File: /app/industryexpert/payment-history/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Download, Calendar, DollarSign, Search, Filter, SortDesc, SortAsc } from 'lucide-react'

interface PaymentRecord {
  id: string
  amount: number
  date: string
  status: string
  projectId?: string
  projectTitle?: string
  transactionId: string
  paymentMethod: string
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<"date" | "amount">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  
  const router = useRouter()

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Get user info to get the industry expert ID
        const userResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!userResponse.ok) throw new Error("Failed to authenticate user")

        const userData = await userResponse.json()
        const userId = userData.userId

        // Get industry expert details
        const expertResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!expertResponse.ok) throw new Error("Failed to fetch industry expert details")

        const expertData = await expertResponse.json()
        const indExpertId = expertData.indExptId

        // Fetch payment history
        const paymentsResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/payments/expert-history/${indExpertId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!paymentsResponse.ok) throw new Error("Failed to fetch payment history")

        const paymentsData = await paymentsResponse.json()
        setPayments(paymentsData)
      } catch (error) {
        console.error("Error fetching payment history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentHistory()
  }, [router])

  const handleDownloadReceipt = async (paymentId: string) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/payments/receipt/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to download receipt")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt-${paymentId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading receipt:", error)
    }
  }

  const filteredPayments = payments
    .filter(payment => {
      // Apply search filter
      const matchesSearch = 
        payment.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Apply status filter
      const matchesStatus = filterStatus ? payment.status === filterStatus : true
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortField === "date") {
        return sortDirection === "asc" 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return sortDirection === "asc" 
          ? a.amount - b.amount
          : b.amount - a.amount
      }
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-xl text-gray-700">Loading payment history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/industryexpert")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
          <p className="text-gray-600 mt-2">View and manage all your payment transactions</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Total Spent</h3>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()} PKR
            </p>
            <p className="text-sm text-gray-500 mt-1">Lifetime spending</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Total Transactions</h3>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{payments.length}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Last Payment</h3>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {payments.length > 0 
                ? new Date(payments.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                  )[0].date).toLocaleDateString() 
                : "N/A"}
            </p>
            <p className="text-sm text-gray-500 mt-1">Most recent transaction</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by project or transaction ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={filterStatus || ""}
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSortField("date")
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }}
                  className={`p-2 rounded-lg border ${
                    sortField === "date" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  {sortDirection === "asc" ? (
                    <SortAsc className="h-5 w-5 text-gray-700" />
                  ) : (
                    <SortDesc className="h-5 w-5 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.projectTitle ? (
                          <button
                            onClick={() => router.push(`/industryexpert/purchased-projects/${payment.projectId}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            {payment.projectTitle}
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.amount.toLocaleString()} PKR
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                          payment.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDownloadReceipt(payment.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-lg">No payment records found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
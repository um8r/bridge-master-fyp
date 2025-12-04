"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Printer, Download, ArrowLeft } from 'lucide-react'

interface PaymentDetail {
  id: string
  projectId: string
  studentName: string
  projectOwnerName: string
  projectName: string
  studentEmail: string
  studentPaymentAccountId: string
  paidAt: string
  receipt: string
  studentId: string
  projectOwnerId: string
  amount?: number
}

const PaymentReceiptPage = () => {
  const { projectId } = useParams()
  const router = useRouter()
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

  // Simple print function that uses the browser's print functionality
  const handlePrint = () => {
    window.print()
  }

  // Function to download as PDF (browser print to PDF)
  const handleDownload = () => {
    window.print()
  }

  const completeProject = async (token: string) => {
    try {
      console.log("Ensuring project is marked as completed:", projectId)

      // Check current project status
      const projectRes = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!projectRes.ok) {
        throw new Error("Failed to fetch project details")
      }

      const projectData = await projectRes.json()
      console.log("Current project status:", projectData.status)

      // If project is not already completed, update it using the dedicated endpoint
      if (projectData.status !== "Completed") {
        console.log("Calling project complete endpoint")
        const completeRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/${projectId}/complete`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!completeRes.ok) {
          const errorText = await completeRes.text()
          console.warn("Failed to complete project:", completeRes.status, errorText)
        } else {
          console.log("Project successfully marked as completed")
        }
      } else {
        console.log("Project is already marked as Completed")
      }
    } catch (err) {
      console.error("Error completing project:", err)
    }
  }

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // First, ensure the project is marked as completed
        console.log("Payment receipt loaded, ensuring project is completed")
        await completeProject(token)

        // Then fetch payment details
        const res = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/payment-details/payment-details/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!res.ok) {
          throw new Error("Failed to fetch payment details")
        }

        const data = await res.json()
        setPaymentDetail(data)
      } catch (err: any) {
        console.error("Error fetching payment details:", err)
        setError(err.message || "Failed to load payment details")
        toast.error(err.message || "Failed to load payment details")
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchPaymentDetails()
    }
  }, [projectId, router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error || !paymentDetail) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-red-400 mb-6">Error</h1>
          <p>{error || "Payment details not found."}</p>
          <div className="mt-4">
            <button
              onClick={() => router.back()}
              className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header - Hidden when printing */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-green-400">Payment Receipt</h1>
          <div className="space-x-4">
            <button
              onClick={handlePrint}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition flex items-center"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Receipt
            </button>
            <button
              onClick={handleDownload}
              className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-500 transition flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </button>
            <button
              onClick={() => router.push(`/industryexpert/projects/milestone/${projectId}`)}
              className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition"
            >
              Return to Project
            </button>
          </div>
        </div>

        {/* Receipt Content - This will be printed */}
        <div
          ref={receiptRef}
          className="bg-white text-gray-800 p-8 rounded-lg shadow-lg border border-gray-300 print:shadow-none print:border-none print:p-0"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-green-600">BridgeIT</h2>
              <p className="text-gray-600">Connecting Students with Industry Experts</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-gray-800">Payment Receipt</h3>
              <p className="text-gray-600">Receipt ID: {paymentDetail.id.substring(0, 8).toUpperCase()}</p>
            </div>
          </div>

          <div className="border-t border-b border-gray-300 py-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-1">Paid To</h4>
                <p className="font-medium">{paymentDetail.studentName}</p>
                <p className="text-gray-600">{paymentDetail.studentEmail}</p>
                <p className="text-gray-600">Student ID: {paymentDetail.studentId.substring(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-1">Paid By</h4>
                <p className="font-medium">{paymentDetail.projectOwnerName}</p>
                <p className="text-gray-600">Industry Expert</p>
                <p className="text-gray-600">Expert ID: {paymentDetail.projectOwnerId.substring(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Payment Details</h4>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Project Name</p>
                  <p className="font-medium">{paymentDetail.projectName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Project ID</p>
                  <p className="font-medium">{paymentDetail.projectId.substring(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Date</p>
                  <p className="font-medium">{formatDate(paymentDetail.paidAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium text-green-600">
                    ${paymentDetail.amount ? paymentDetail.amount.toFixed(2) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-medium text-green-600">Completed</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">Credit/Debit Card</p>
                </div>
              </div>
            </div>
          </div>

          {paymentDetail.receipt && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2">Transaction Receipt</h4>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm break-all font-mono">{paymentDetail.receipt}</p>
              </div>
            </div>
          )}

          <div className="text-center text-gray-600 text-sm mt-12">
            <p>This is an automatically generated receipt. No signature is required.</p>
            <p className="mt-1">
              For any questions regarding this payment, please contact BridgeIT support at support@bridgeit.com
            </p>
          </div>
        </div>

        {/* Footer - Hidden when printing */}
        <div className="mt-8 text-center text-gray-400 print:hidden">
          <p>
            A copy of this receipt has been sent to both the student and industry expert via email. You can print this
            receipt for your records.
          </p>
        </div>
      </div>
      <ToastContainer />

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white;
            color: black;
          }
          
          @page {
            size: A4;
            margin: 1.5cm;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:bg-white {
            background-color: white !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:border-none {
            border: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default PaymentReceiptPage
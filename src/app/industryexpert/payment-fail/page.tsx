"use client"

import { useRouter } from "next/navigation"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"

export default function PaymentFailurePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Failed</h1>
            <p className="text-gray-600 text-lg mb-8">
              We are sorry, but your payment could not be processed. Please try again or contact support if the issue
              persists.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Possible Reasons</h2>
              <ul className="text-left list-disc pl-5 space-y-2 text-gray-600">
                <li>Insufficient funds in your account</li>
                <li>Card declined by your bank</li>
                <li>Incorrect payment information</li>
                <li>Connection issues during the payment process</li>
                <li>Temporary issues with the payment gateway</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Try Again
              </button>
              <button
                onClick={() => router.push("/industryexpert/dashboard")}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

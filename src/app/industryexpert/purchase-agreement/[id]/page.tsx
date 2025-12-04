"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ArrowLeft, Loader2, Download, Upload, FileText, Check, X, Calendar, User, Users, BookOpen, DollarSign, CreditCard, Lock, Info, CheckCircle } from 'lucide-react'

interface FYP {
  id: string
  title: string
  description: string
  fypId: string
  members: number
  facultyName?: string
  technology?: string
  yearOfCompletion?: number
  batch?: string
  status?: string
  faculty?: {
    name: string
    department?: string
  }
  students?: {
    name: string
    department?: string
  }[]
}

export default function PurchaseAgreementPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fyp, setFyp] = useState<FYP | null>(null)
  const [industryExpertId, setIndustryExpertId] = useState<string | null>(null)
  const [industryExpertName, setIndustryExpertName] = useState<string>("")

  const [agreementFile, setAgreementFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [agreementText, setAgreementText] = useState<string>("")
  const [price, setPrice] = useState<number>(10000) // Default price in PKR

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
        const userResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })

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
        setIndustryExpertName(`${expertData.firstName} ${expertData.lastName}`)

        // Step 3: Fetch FYP details
        const fypResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${fypId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!fypResponse.ok) throw new Error("Failed to fetch FYP details")

        const fypData = await fypResponse.json()
        setFyp(fypData)

        // Generate agreement text
        generateAgreementText(fypData, `${expertData.firstName} ${expertData.lastName}`)
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

  const generateAgreementText = (fypData: FYP, expertName: string) => {
    const currentDate = new Date().toLocaleDateString()
    const text = `
PURCHASE AGREEMENT

This Purchase Agreement ("Agreement") is entered into on ${currentDate} by and between:

INDUSTRY EXPERT:
${expertName} ("Buyer")

AND

UNIVERSITY:
${fypData.faculty?.department || "University Department"} ("Seller")

AND

STUDENTS:
${fypData.students?.map((s) => s.name).join(", ") || "Student Team"} ("Creators")

REGARDING THE FINAL YEAR PROJECT:
"${fypData.title}" (Project ID: ${fypData.fypId})

1. PURPOSE
The purpose of this Agreement is to establish the terms and conditions under which the Buyer will purchase the intellectual property rights to the Final Year Project created by the Creators.

2. PURCHASE DETAILS
The Buyer agrees to purchase the project for the agreed-upon price to be paid through the platform's payment system.

3. INTELLECTUAL PROPERTY TRANSFER
Upon successful payment:
- The Buyer receives exclusive rights to use, modify, and commercialize the project
- The Creators retain the right to include the project in their portfolio for demonstration purposes only
- The University retains the right to showcase the project for educational purposes

4. WARRANTIES
The Creators warrant that:
- The project is their original work
- They have the right to transfer the intellectual property
- The project does not infringe on any third-party rights

5. CONFIDENTIALITY
All parties agree to maintain the confidentiality of proprietary information shared during the transaction.

6. GOVERNING LAW
This Agreement shall be governed by the laws of the jurisdiction where the University is located.

By proceeding with this purchase, all parties acknowledge their agreement to these terms and conditions.
`
    setAgreementText(text)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAgreementFile(file)

      // Create a preview URL for PDF files
      if (file.type === "application/pdf") {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        setPreviewUrl(null)
        toast.error("Please upload a PDF file")
      }
    }
  }

  const handleGenerateAgreement = () => {
    // Create a Blob from the agreement text
    const blob = new Blob([agreementText], { type: "text/plain" })

    // Create a link element and trigger download
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${fyp?.title}-purchase-agreement.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Updated convertFileToBase64 function
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file) // Use readAsDataURL instead of readAsArrayBuffer
      reader.onload = () => {
        if (reader.result) {
          // The result will be a data URL like "data:application/pdf;base64,XXXX"
          // We need to extract just the base64 part
          const base64String = reader.result.toString()
          const base64Content = base64String.split(',')[1] // Remove the data:application/pdf;base64, part
          resolve(base64Content)
        } else {
          reject(new Error("Failed to convert file to base64"))
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  // Updated handleSubmit function
  const handleSubmit = async () => {
    if (!agreementFile || !industryExpertId || !fyp) {
      toast.error("Please upload a signed agreement document")
      return
    }

    setSubmitting(true)
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      toast.error("Authentication token not found. Please log in again.")
      router.push("/auth/login-user")
      return
    }

    try {
      // Convert file to base64
      const base64 = await convertFileToBase64(agreementFile)
      
      // Store the agreement in localStorage for later use after payment
      localStorage.setItem(`agreement_${fyp.id}`, base64)
      
      // Create checkout session for payment
      const checkoutResponse = await fetch(
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
        }
      )

      if (checkoutResponse.ok) {
        const { checkoutUrl } = await checkoutResponse.json()
        // Redirect to Stripe checkout
        window.location.href = checkoutUrl
      } else {
        const errorText = await checkoutResponse.text()
        console.error("Checkout error:", errorText)
        toast.error(`Failed to create payment: ${errorText}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while processing your request"
      toast.error(errorMessage)
      console.error("Submit error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-xl text-gray-700">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !fyp) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error || "Failed to load project details"}</p>
          <button
            onClick={() => router.push("/industryexpert/approved-requests")}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          >
            Return to Approved Requests
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/industryexpert/approved-requests")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Approved Requests
          </button>

          <h1 className="text-3xl font-bold text-gray-800">Purchase Agreement</h1>
          <p className="text-gray-600 mt-2">Review and complete the purchase agreement for {fyp.title}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Details */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Project Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{fyp.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">{fyp.fypId}</div>
                    {fyp.status && (
                      <div className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
                        Status: {fyp.status}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-600">{fyp.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fyp.faculty?.name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4 text-blue-500" />
                      <span>Faculty: {fyp.faculty.name}</span>
                    </div>
                  )}

                  {fyp.members && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{fyp.members} Members</span>
                    </div>
                  )}

                  {fyp.technology && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span>Technology: {fyp.technology}</span>
                    </div>
                  )}

                  {fyp.yearOfCompletion && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Completed in: {fyp.yearOfCompletion}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Purchase Price</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Enter the amount you re willing to pay (PKR)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="number"
                      className="w-full pl-10 p-2 bg-white border border-gray-300 rounded-md text-gray-800"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      min={1000}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Project Price:</span>
                    <span className="text-gray-800 font-medium">{price.toLocaleString()} PKR</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Platform Fee (5%):</span>
                    <span className="text-gray-800 font-medium">{(price * 0.05).toLocaleString()} PKR</span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Total:</span>
                    <span className="text-green-600 font-bold">{(price * 1.05).toLocaleString()} PKR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement Text */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Purchase Agreement</h2>
                <button
                  onClick={handleGenerateAgreement}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  <Download className="h-4 w-4" />
                  Download Agreement
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap text-gray-700">
                {agreementText}
              </div>
            </div>

            {/* Upload Agreement */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Signed Agreement</h2>

              <div className="space-y-4">
                <p className="text-gray-600">Please download the agreement, sign it, and upload the signed document.</p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="agreement-upload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {!agreementFile ? (
                    <label
                      htmlFor="agreement-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-blue-400 mb-2" />
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-gray-500 text-sm">PDF (max. 10MB)</p>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div className="text-left">
                          <p className="text-gray-800 font-medium">{agreementFile.name}</p>
                          <p className="text-gray-600 text-sm">{(agreementFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAgreementFile(null)
                          setPreviewUrl(null)
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {previewUrl && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2 text-gray-800">Document Preview</h3>
                    <iframe
                      src={previewUrl}
                      className="w-full h-96 border border-gray-200 rounded-lg"
                      title="Agreement Preview"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Complete Purchase</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      price > 0 ? "bg-green-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {price > 0 && <Check className="h-3 w-3" />}
                  </div>
                  <span className={price > 0 ? "text-gray-800" : "text-gray-500"}>Price set</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      agreementText ? "bg-green-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {agreementText && <Check className="h-3 w-3" />}
                  </div>
                  <span className={agreementText ? "text-gray-800" : "text-gray-500"}>Agreement generated</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      agreementFile ? "bg-green-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {agreementFile && <Check className="h-3 w-3" />}
                  </div>
                  <span className={agreementFile ? "text-gray-800" : "text-gray-500"}>Signed agreement uploaded</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !agreementFile || price <= 0}
                className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 mt-3 text-xs text-gray-500">
                <Lock className="h-3 w-3" />
                <span>Secure payment processed by Stripe</span>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-medium text-gray-800 mb-2">Payment Information</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Your payment is secure and encrypted</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>You ll receive a confirmation email after successful payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Project files will be available for download after purchase</span>
                </li>
              </ul>
            </div>

            {/* Additional Information */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">Important Note</h3>
                  <p className="text-sm text-gray-600">
                    By proceeding with this purchase, you agree to the terms outlined in the purchase agreement. Make
                    sure to review all details before continuing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  )
}
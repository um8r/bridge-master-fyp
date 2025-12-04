"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Download, Printer, Share2, ArrowLeft, Award, Shield, CheckCircle, Linkedin } from 'lucide-react'
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface ProjectDetails {
  id: string
  title: string
  description: string
  status: string
  endDate: string
  expertName: string
  studentName: string
}

const ProjectCertificate = () => {
  const { projectId } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const certificateRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    if (!certificateRef.current) return

    try {
      toast.info("Preparing your certificate for download...")
      
      // Capture the certificate DOM element as a canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Increase resolution for better quality
        useCORS: true, // Handle cross-origin issues if any
      })

      // Convert canvas to an image
      const imgData = canvas.toDataURL("image/png")

      // Create a new PDF document (A4 size: 210mm x 297mm)
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      // Calculate dimensions to fit the canvas into the A4 page
      const pageWidth = 297 // A4 width in landscape in mm
      const pageHeight = 210 // A4 height in landscape in mm
      const imgWidth = 277 // Width of the PDF page content (leaving some margin)
      const imgHeight = (canvas.height * imgWidth) / canvas.width // Maintain aspect ratio
      const marginTop = (pageHeight - imgHeight) / 2
      const marginLeft = (pageWidth - imgWidth) / 2

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", marginLeft, marginTop, imgWidth, imgHeight)

      // Download the PDF
      pdf.save(`${project?.studentName}_Certificate_${projectId}.pdf`)
      toast.success("Certificate downloaded successfully!")
    } catch (err) {
      console.error("Error generating PDF:", err)
      toast.error("Failed to download certificate")
    }
  }

  useEffect(() => {
    const fetchProjectData = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        const res = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        if (!res.ok) {
          throw new Error("Failed to fetch project details")
        }
        
        const projectData = await res.json()
        
        if (projectData.status !== "Completed") {
          toast.error("Certificate is only available for completed projects")
          router.push(`/student/projects/milestone/${projectId}`)
          return
        }
        
        setProject(projectData)
      } catch (err) {
        console.error("Error fetching project data:", err)
        setError("Failed to load project data")
        toast.error("Failed to load project data")
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProjectData()
    }
  }, [projectId, router])

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Generating your certificate...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-6">Error</h1>
          <p className="text-gray-700">{error || "Project not found"}</p>
          <button
            onClick={() => router.push("/student")}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/student/projects/detail/${projectId}`)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Project Completion Certificate</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Certificate Preview */}
        <div className="max-w-5xl mx-auto mb-8 bg-white rounded-lg shadow-lg p-4">
          <div
            ref={certificateRef}
            className="bg-white p-8 rounded-lg relative overflow-hidden"
            style={{ 
              backgroundImage: `url(https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            {/* BridgeIT Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="text-9xl font-bold text-gray-900 transform -rotate-12">BridgeIT</div>
            </div>
            
            <div className="border-8 border-double border-blue-600 p-8 relative">
              {/* Top decorative elements */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-blue-600"></div>
              <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-blue-600"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-blue-600"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-blue-600"></div>
              
              <div className="text-center relative">
                {/* Header with logo */}
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-blue-600 text-white p-3 rounded-full">
                    <Award className="w-12 h-12" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <h2 className="text-5xl font-bold text-blue-800 mb-2 font-serif">Certificate of Completion</h2>
                  <div className="h-1 w-32 bg-blue-600 mx-auto"></div>
                  <p className="text-xl text-gray-700 mt-2 font-serif">BridgeIT Industry Project</p>
                </div>

                <div className="my-12 relative z-10">
                  <p className="text-lg text-gray-700 mb-4 font-serif">This is to certify that</p>
                  <p className="text-4xl font-bold text-blue-800 mb-4 font-serif tracking-wide">{project.studentName}</p>
                  <p className="text-lg text-gray-700 mb-8 font-serif">has successfully completed the project</p>
                  <p className="text-2xl font-bold text-blue-800 mb-4 font-serif">{project.title}</p>
                  <p className="text-lg text-gray-700 mb-8 font-serif">under the guidance of</p>
                  <p className="text-xl font-semibold text-blue-700 mb-8 font-serif">{project.expertName}</p>
                  <p className="text-lg text-gray-700 font-serif">
                    Completed on <span className="font-semibold">{formatDate(project.endDate)}</span>
                  </p>
                </div>

                <div className="mt-16 flex justify-between items-end">
                  {/* Student Signature */}
                  <div className="text-center">
                    <div className="w-40 border-t-2 border-gray-400 mx-auto"></div>
                    <p className="mt-2 text-gray-600 font-serif">Student Signature</p>
                  </div>
                  
                  {/* Official Seal/Stamp */}
                  <div className="absolute bottom-16 right-1/2 transform translate-x-1/2">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-2 border-blue-800 flex items-center justify-center opacity-80">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-dashed"></div>
                        <div className="text-center">
                          <div className="text-xs font-bold text-blue-800">OFFICIAL</div>
                          <div className="text-xs font-bold text-blue-800">BRIDGEIT</div>
                          <div className="w-12 h-12 mx-auto my-1">
                            <svg viewBox="0 0 24 24" fill="none" className="text-blue-800">
                              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="text-xs font-bold text-blue-800">CERTIFIED</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expert Signature */}
                  <div className="text-center">
                    <div className="w-40 border-t-2 border-gray-400 mx-auto"></div>
                    <p className="mt-2 text-gray-600 font-serif">Industry Expert Signature</p>
                  </div>
                </div>

                <div className="mt-24 pt-8 border-t border-gray-300 flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-sm text-gray-500 font-serif">
                      Certificate ID: {project.id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                  
                  {/* QR Code Placeholder */}
                  <div className="bg-white p-1 border border-gray-300">
                    <div className="w-16 h-16 bg-gray-800 flex items-center justify-center">
                      <div className="text-xs text-white">QR Code</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-sm text-gray-500 font-serif">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Info */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Download className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Download Options</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Download your certificate in PDF format for high-quality printing and sharing.
            </p>
            <button
              onClick={handleDownload}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Share2 className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Share Certificate</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Share your achievement with your network on social media or via email.
            </p>
            <div className="flex space-x-2">
              <button className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button className="p-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button className="p-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition flex-1">
                Email
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Printer className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Print Certificate</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Print a physical copy of your certificate for your portfolio or to display.
            </p>
            <button
              onClick={handlePrint}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Certificate
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-5xl mx-auto mt-8 bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">About This Certificate</h2>
          <p className="text-gray-600 mb-4">
            This certificate confirms the successful completion of an industry project through the BridgeIT
            platform, connecting students with industry experts for real-world project experience.
          </p>
          <p className="text-gray-600 mb-4">
            The skills and knowledge demonstrated in completing this project are valuable additions to your
            professional portfolio and can be shared with potential employers.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Certificate Verification</h3>
              <p className="text-blue-700 text-sm mt-1">
                This certificate can be verified using the Certificate ID: {project.id.substring(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}

export default ProjectCertificate

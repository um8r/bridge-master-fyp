"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaArrowLeft, FaSpinner, FaUser, FaUsers, FaCode, FaGraduationCap } from "react-icons/fa"

interface StudentDTO {
  id: string
  name: string
  department?: string
  rollNumber?: string
  cvLink?: string
  skills?: string
}

interface FacultyDTO {
  id: string
  name: string
  interest?: string
  department?: string
  post?: string
}

interface DetailedFYP {
  id: string
  title?: string
  members?: number
  batch?: string
  technology?: string
  description?: string
  status?: string
  faculty?: FacultyDTO
  students?: StudentDTO[]
  fypId?: string
}

const FypDetailsPage: React.FC = () => {
  const [fyp, setFyp] = useState<DetailedFYP | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const fypId = params.id as string

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")

    if (!token) {
      router.push("/auth/login-user")
      return
    }

    const fetchFypDetails = async () => {
      try {
        const response = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${fypId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!response.ok) throw new Error("Failed to fetch FYP details")

        const fypData = await response.json()
        setFyp(fypData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(`Error: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    fetchFypDetails()
  }, [fypId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-xl text-gray-500">Loading FYP details...</p>
        </div>
      </div>
    )
  }

  if (error || !fyp) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-md">
          <h2 className="text-2xl font-bold text-red-300 mb-2">Error</h2>
          <p className="text-gray-500 mb-4">{error || "FYP not found"}</p>
          <button
            onClick={() => router.push("/uni-admin/fyp-requests")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>Back to Requests</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 text-white py-10 px-4 relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-full opacity-20 blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <button
          onClick={() => router.push("/uni-admin/fyp-requests")}
          className="flex items-center space-x-2 text-gray-500 hover:text-white mb-6 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Requests</span>
        </button>

        <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden border border-gray-700 mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{fyp.title}</h1>
                {fyp.fypId && (
                  <div className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded inline-block">ID: {fyp.fypId}</div>
                )}
              </div>
              {fyp.status && (
                <div className="mt-4 md:mt-0 bg-blue-900/50 text-blue-300 px-3 py-1.5 rounded">
                  Status: {fyp.status}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {fyp.members && (
                <InfoCard
                  icon={<FaUsers className="text-blue-400 text-2xl" />}
                  title="Team Size"
                  content={`${fyp.members} members`}
                />
              )}
              {fyp.batch && (
                <InfoCard
                  icon={<FaGraduationCap className="text-green-400 text-2xl" />}
                  title="Batch"
                  content={fyp.batch}
                />
              )}
              {fyp.technology && (
                <InfoCard
                  icon={<FaCode className="text-purple-400 text-2xl" />}
                  title="Technologies"
                  content={fyp.technology}
                />
              )}
            </div>

            <div className="bg-gray-100/50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Project Description</h2>
              <p className="text-gray-300 whitespace-pre-line">{fyp.description}</p>
            </div>

            {fyp.faculty && (
              <div className="bg-gray-100/50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Faculty Supervisor</h2>
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-600 rounded-full p-3">
                    <FaUser className="text-2xl text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{fyp.faculty.name}</h3>
                    {fyp.faculty.post && <p className="text-gray-500">{fyp.faculty.post}</p>}
                    {fyp.faculty.department && (
                      <p className="text-gray-500 mt-1">Department: {fyp.faculty.department}</p>
                    )}
                    {fyp.faculty.interest && (
                      <div className="mt-2">
                        <p className="text-gray-500 font-medium">Research Interests:</p>
                        <p className="text-gray-500">{fyp.faculty.interest}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {fyp.students && fyp.students.length > 0 && (
              <div className="bg-gray-100/50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Student Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fyp.students.map((student) => (
                    <div
                      key={student.id}
                      className="bg-gray-100 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-100 rounded-full p-2 mt-1">
                          <FaUser className="text-lg text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{student.name}</h3>
                          {student.department && <p className="text-gray-500 text-sm">{student.department}</p>}
                          {student.rollNumber && (
                            <p className="text-gray-500 text-sm">Roll Number: {student.rollNumber}</p>
                          )}
                          {student.skills && (
                            <div className="mt-2">
                              <p className="text-gray-500 text-xs">Skills:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {student.skills.split(",").map((skill, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs">
                                    {skill.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {student.cvLink && (
                            <a
                              href={student.cvLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                            >
                              View CV
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  )
}

const InfoCard: React.FC<{ icon: JSX.Element; title: string; content: string }> = ({ icon, title, content }) => {
  return (
    <div className="bg-gray-100/50 rounded-lg p-4 flex items-center space-x-3">
      {icon}
      <div>
        <h3 className="font-medium text-gray-500">{title}</h3>
        <p className="text-white">{content}</p>
      </div>
    </div>
  )
}

export default FypDetailsPage

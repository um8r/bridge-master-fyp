"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface StudentData {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  universityName: string
}

interface FacultyData {
  id: string
  userId: string
  firstName: string
  lastName: string
  post: string
  email: string
}

interface FypFormData {
  fyp_id: string
  title: string
  members: number
  batch: string
  technology: string
  description: string
  facultyId: string
  yearOfCompletion?: number
}

interface AgreementModalProps {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

// Simple Agreement Modal Component
const AgreementModal: React.FC<AgreementModalProps> = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full border border-gray-200 shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">FYP Registration Agreement</h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-80 overflow-y-auto border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Terms and Conditions</h3>

            <div className="text-gray-700 space-y-3 text-sm">
              <p>By registering this Final Year Project, I agree to the following terms:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  I confirm that this project is original work and does not infringe on any intellectual property
                  rights.
                </li>
                <li>
                  I understand that the project will be reviewed by faculty and may be rejected if it does not meet
                  academic standards.
                </li>
                <li>I agree to follow all university guidelines regarding Final Year Projects.</li>
                <li>
                  I understand that the project details may be shared with relevant faculty members and industry
                  experts.
                </li>
                <li>I commit to completing the project by the specified year of completion.</li>
              </ol>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              I Agree & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const RegisterFypPage: React.FC = () => {
  const router = useRouter()

  // Data & form state
  const [showAgreement, setShowAgreement] = useState(false)
  const [student, setStudent] = useState<StudentData | null>(null)
  const [faculties, setFaculties] = useState<FacultyData[]>([])
  const [formData, setFormData] = useState<FypFormData>({
    fyp_id: "",
    title: "",
    members: 0,
    batch: "",
    technology: "",
    description: "",
    facultyId: "",
    yearOfCompletion: undefined,
  })

  
  const [initializing, setInitializing] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Calculate default year of completion when batch changes
  useEffect(() => {
    if (formData.batch && !formData.yearOfCompletion) {
      const batchYear = Number.parseInt(formData.batch, 10)
      if (!isNaN(batchYear)) {
        setFormData((prev) => ({
          ...prev,
          yearOfCompletion: batchYear + 4,
        }))
      }
    }
  }, [formData.batch])

  // Fetch student + faculty list
  useEffect(() => {
    const fetchStudentAndFaculties = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // 1) Auth info
        const authResp = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (authResp.status === 401 || authResp.status === 403) {
          router.push("/unauthorized")
          return
        }
        if (!authResp.ok) throw new Error("Could not verify user.")
        const { userId } = await authResp.json()

        // 2) Student profile
        const studentResp = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (studentResp.status === 401 || studentResp.status === 403) {
          router.push("/unauthorized")
          return
        }
        if (!studentResp.ok) {
          throw new Error("Failed to fetch your student profile.")
        }
        const studentData: StudentData = await studentResp.json()
        setStudent(studentData)
        localStorage.setItem("studentId", studentData.id)

        // 3) Faculties list
        const facResp = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculties", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (facResp.status === 401 || facResp.status === 403) {
          router.push("/unauthorized")
          return
        }
        if (!facResp.ok) {
          throw new Error("Failed to load faculty list.")
        }
        const facList: FacultyData[] = await facResp.json()
        setFaculties(facList)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "An unexpected error occurred.")
      } finally {
        setInitializing(false)
      }
    }

    fetchStudentAndFaculties()
  }, [router])

  // Handle field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Special handling for batch to auto-calculate year of completion
    if (name === "batch") {
      const batchYear = Number.parseInt(value, 10)
      if (!isNaN(batchYear)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          yearOfCompletion: batchYear + 4,
        }))
        return
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "members" || name === "yearOfCompletion" ? Number.parseInt(value, 10) || undefined : value,
    }))
  }

  // Submission logic (called after agreement)
  const submitForm = async () => {
    setError(null)
    setSuccess(null)

    if (formData.members <= 0) {
      setError("Members must be at least 1.")
      return
    }
    if (!formData.facultyId) {
      setError("Please select a faculty member.")
      return
    }

    const token = localStorage.getItem("jwtToken")
    const studentId = localStorage.getItem("studentId")
    if (!token || !studentId) {
      setError("You must be logged in to submit.")
      return
    }

    setSubmitting(true)
    try {
      const payload: any = {
        fyp_id: formData.fyp_id,
        Title: formData.title,
        Members: formData.members,
        Batch: formData.batch,
        Technology: formData.technology,
        Description: formData.description,
        FacultyId: formData.facultyId,
      }

      // Always include yearOfCompletion if available
      if (formData.yearOfCompletion) {
        payload.YearOfCompletion = formData.yearOfCompletion
      }

      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/register-fyp?studentId=${studentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (res.status === 401 || res.status === 403) {
        router.push("/unauthorized")
        return
      }

      if (res.ok) {
        setSuccess("FYP registered successfully and is awaiting approval.")
        setFormData({
          fyp_id: "",
          title: "",
          members: 0,
          batch: "",
          technology: "",
          description: "",
          facultyId: "",
          yearOfCompletion: undefined,
        })
      } else {
        const errText = await res.text()
        try {
          const errJson = JSON.parse(errText)
          setError(errJson.message || "Failed to register FYP.")
        } catch {
          setError(errText || "Failed to register FYP.")
        }
      }
    } catch (err: any) {
      console.error(err)
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Open the agreement modal
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowAgreement(true)
  }

  if (initializing) {
    return <div className="text-center text-gray-600 p-8">Loading data…</div>
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Register Your FYP</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-center mb-4">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md text-center mb-4">
              {success}
            </div>
          )}

          {student && (
            <p className="text-center mb-6 text-gray-700">
              Welcome, {student.firstName} {student.lastName} from {student.universityName}!
            </p>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* FYP ID */}
            <div>
              <label htmlFor="fyp_id" className="block text-sm font-medium text-gray-700 mb-1">
                FYP ID
              </label>
              <input
                id="fyp_id"
                name="fyp_id"
                placeholder="e.g. FYP-12345"
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.fyp_id}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Project Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                id="title"
                name="title"
                placeholder="e.g. AI in Healthcare"
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Members */}
            <div>
              <label htmlFor="members" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Members
              </label>
              <input
                id="members"
                name="members"
                type="number"
                min="1"
                placeholder="e.g. 3"
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.members || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Batch */}
            <div>
              <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
                Batch
              </label>
              <input
                id="batch"
                name="batch"
                placeholder="e.g. 2024"
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.batch}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the starting year of your batch (e.g., 2024 for 2024-2028 batch)
              </p>
            </div>

            {/* Technology */}
            <div>
              <label htmlFor="technology" className="block text-sm font-medium text-gray-700 mb-1">
                Technology
              </label>
              <input
                id="technology"
                name="technology"
                placeholder="e.g. Python, TensorFlow"
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.technology}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Brief project description…"
                className="w-full p-2 h-24 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Year of Completion */}
            <div>
              <label htmlFor="yearOfCompletion" className="block text-sm font-medium text-gray-700 mb-1">
                Year of Completion
              </label>
              <input
                id="yearOfCompletion"
                name="yearOfCompletion"
                type="number"
                min={new Date().getFullYear()}
                placeholder="e.g. 2028"
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.yearOfCompletion || ""}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-calculated as batch + 4 years. You can adjust if needed.
              </p>
            </div>

            {/* Assign Faculty */}
            <div>
              <label htmlFor="facultyId" className="block text-sm font-medium text-gray-700 mb-1">
                Assign Faculty
              </label>
              <select
                id="facultyId"
                name="facultyId"
                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.facultyId}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select a Faculty --</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.firstName} {f.lastName} — {f.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2 px-4 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                submitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {submitting ? "Submitting…" : "Submit Proposal"}
            </button>
          </form>
        </div>
      </div>

      {/* Agreement Modal */}
      <AgreementModal
        isOpen={showAgreement}
        onCancel={() => setShowAgreement(false)}
        onConfirm={() => {
          setShowAgreement(false)
          submitForm()
        }}
      />
    </>
  )
}

export default RegisterFypPage

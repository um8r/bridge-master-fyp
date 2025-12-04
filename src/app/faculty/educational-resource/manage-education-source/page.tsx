"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface EducationalResource {
  id: string
  title: string
  content: string
  sourceLink: string
  facultyId: string
  facultyName: string
  facultyPost: string
  facultyDepartment: string
  universityId: string
  universityName: string
  universityLocation: string
}

const ManageEducationalResources: React.FC = () => {
  const router = useRouter()
  const [resources, setResources] = useState<EducationalResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [facultyId, setFacultyId] = useState<string | null>(null)

  // For editing
  const [editMode, setEditMode] = useState(false)
  const [editingResource, setEditingResource] = useState<EducationalResource | null>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    sourceLink: "",
  })

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("jwtToken")
        if (!token) {
          router.push("/auth/login-user")
          return
        }

        // Get profile
        const profileRes = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (!profileRes.ok) throw new Error("Failed to fetch user profile")
        const { userId } = await profileRes.json()

        // Get faculty
        const facultyRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (!facultyRes.ok) throw new Error("Failed to fetch faculty details")
        const { id } = await facultyRes.json()
        setFacultyId(id)

        // Get resources
        const resourcesRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/educational-resources/get-by-id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (resourcesRes.status === 404) {
          setResources([])
        } else if (!resourcesRes.ok) {
          throw new Error("Failed to fetch educational resources")
        } else {
          setResources(await resourcesRes.json())
        }
      } catch (e) {
        console.error(e)
        setError(e instanceof Error ? e.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return
    try {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/educational-resources/delete/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error("Failed to delete resource")
      setResources((prev) => prev.filter((r) => r.id !== id))
      toast.success("Resource deleted successfully")
    } catch (e) {
      console.error(e)
      toast.error(`Failed to delete resource: ${e instanceof Error ? e.message : "Unknown error"}`)
    }
  }

  const handleEdit = (resource: EducationalResource) => {
    setEditingResource(resource)
    setEditForm({
      title: resource.title,
      content: resource.content,
      sourceLink: resource.sourceLink || "",
    })
    setEditMode(true)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingResource) return
    try {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/educational-resources/update/${editingResource.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      )
      if (!res.ok) throw new Error("Failed to update resource")
      setResources((prev) =>
        prev.map((r) =>
          r.id === editingResource.id
            ? { ...r, title: editForm.title, content: editForm.content, sourceLink: editForm.sourceLink }
            : r
        )
      )
      toast.success("Resource updated successfully")
      setEditMode(false)
      setEditingResource(null)
    } catch (e) {
      console.error(e)
      toast.error(`Failed to update resource: ${e instanceof Error ? e.message : "Unknown error"}`)
    }
  }

  const cancelEdit = () => {
    setEditMode(false)
    setEditingResource(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading resources...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-800 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Error</h1>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          >
            Try Again
          </button>
        </div>
        <ToastContainer position="bottom-right" theme="light" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Manage Educational Resources</h1>
          <button
            onClick={() => router.push("/faculty/add-educational-resource")}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition shadow"
          >
            + New Resource
          </button>
        </header>

        {editMode && editingResource && (
          <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Edit Resource</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Content</label>
                <textarea
                  name="content"
                  value={editForm.content}
                  onChange={handleEditChange}
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Source Link</label>
                <input
                  name="sourceLink"
                  value={editForm.sourceLink}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        )}

        {resources.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No resources found.</p>
            <button
              onClick={() => router.push("/faculty/add-educational-resource")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
            >
              Add Your First Resource
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res) => (
              <div key={res.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold mb-2">{res.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{res.content}</p>
                {res.sourceLink && (
                  <a
                    href={res.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mb-4 inline-block"
                  >
                    View Source
                  </a>
                )}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleEdit(res)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" theme="light" />
    </div>
  )
}

export default ManageEducationalResources

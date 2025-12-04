"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Import components
import Sidebar from "./components/Sidebar"
import AdminProfileCard from "./components/AdminProfileCard"
import UniversityStats from "./components/UniversityStats"
import SearchSection from "./components/SearchSection"
import LoadingSpinner from "./components/LoadingSpinner"
import ErrorDisplay from "./components/ErrorDisplay"
import type { Event } from "./components/EventsComponent"
import EventCountdown from "./components/event-countdown"
import AllProjectsList from "./components/AllProjectsList"
import EventNotificationManager from "./components/event-notification-manager"
import Loading from "../loading/page"
import StudentProjectsList from "./components/AllProjectsList"

// ------------ Interfaces ------------
interface AdminProfile {
  firstName: string
  lastName: string
  email: string
  officeAddress: string
  contact: string
  university: string
  profileImage: string
}

interface SearchResult {
  userId: string
  firstName: string
  lastName: string
  email: string
  description: string
  imageData: string | null
  department?: string
}

// For your student projects
interface StudentProject {
  id: string
  title: string
  status: string // "Ongoing", "Completed", etc.
  studentName: string
  expertName: string
  endDate: string
  universityName: string
  // ...anything else returned by the API
}

const UniAdminDashboard: React.FC = () => {
  const router = useRouter()

  // ------------------- Admin-related States -------------------
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true) // for the overall page
  const [error, setError] = useState<string | null>(null)

  // ------------------- University Stats -------------------
  const [studentsCount, setStudentsCount] = useState(0)
  const [facultiesCount, setFacultiesCount] = useState(0)

  // ------------------- Searching -------------------
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState("")

  // ------------------- Projects States -------------------
  const [studentProjects, setStudentProjects] = useState<StudentProject[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  // ------------------- Events States -------------------
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    const fetchAdminData = async () => {
      try {
        // Step A: Validate user & role
        const profileRes = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!profileRes.ok) {
          console.error("Profile response not OK:", await profileRes.text())
          throw new Error("Failed to fetch authorized user info")
        }

        const profileData = await profileRes.json()
        console.log("Profile data:", profileData)

        if (profileData.role !== "UniversityAdmin") {
          toast.error("You are not authorized to access this page.")
          router.push("/unauthorized")
          return
        }

        // Step B: Fetch this Admin's profile
        const adminResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-uni-admins/admins-by-id/${profileData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )

        if (!adminResponse.ok) {
          console.error("Admin response not OK:", await adminResponse.text())
          throw new Error("Failed to fetch University Admin profile")
        }

        const adminData = await adminResponse.json()
        console.log("Admin data:", adminData)

        setAdminProfile({
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          officeAddress: adminData.officeAddress,
          contact: adminData.contact,
          university: adminData.university,
          profileImage: adminData.profileImage,
        })

        // Step C: Fetch university-wide stats
        const [studentsRes, facultyRes] = await Promise.all([
          fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-university/${adminData.university}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-university/${adminData.university}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ])

        if (!studentsRes.ok) {
          console.error("Students response not OK:", await studentsRes.text())
        }

        if (!facultyRes.ok) {
          console.error("Faculty response not OK:", await facultyRes.text())
        }

        if (!studentsRes.ok || !facultyRes.ok) {
          throw new Error("Failed to fetch university data")
        }

        const [studentsData, facultiesData] = await Promise.all([studentsRes.json(), facultyRes.json()])
        console.log("Students data:", studentsData)
        console.log("Faculty data:", facultiesData)

        setStudentsCount(studentsData.length)
        setFacultiesCount(facultiesData.length)

        // Step E: Fetch events
        await fetchEvents(token)
      } catch (err) {
        console.error("Error in fetchAdminData:", err)
        setError("Failed to load profile or university data")
        toast.error("An error occurred while fetching data.")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [router])

  const fetchEvents = async (token: string) => {
    try {
      const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/Events/get-events", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        console.error("Failed to fetch events")
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    router.push("/auth/login-user")
  }

  // Updated handleSearch function based on the API documentation
  const handleSearch = async (query: string, searchType: string) => {
    if (!adminProfile) {
      console.error("Admin profile not loaded yet")
      toast.error("Please wait for profile to load before searching")
      return
    }

    console.log(`Starting search for ${searchType}: ${query} in university ${adminProfile.university}`)
    setSearchLoading(true)
    setSearchError("")
    setResults([])

    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    try {
      let res: Response

      if (searchType === "student") {
        let url = ""
        const isNumeric = !isNaN(Number(query))

        if (!isNumeric) {
          // Search by name
          url = `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-name/${encodeURIComponent(query)}`
        } else {
          // Search by ID
          url = `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-student-id/${encodeURIComponent(query)}`
        }

        console.log("Fetching from URL:", url)

        res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      } else {
        let url = ""
        const isNumeric = !isNaN(Number(query))

        if (!isNumeric) {
          // Search by name
          url = `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-name/${encodeURIComponent(query)}`
        } else {
          // Search by ID
          url = `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-faculty-id/${encodeURIComponent(query)}`
        }

        console.log("Fetching from URL:", url)

        res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      }

      // Log the raw response for debugging
      const responseText = await res.text()
      console.log("Raw response:", responseText)

      if (!res.ok) {
        throw new Error(`Search failed: ${res.status} ${responseText || "Unknown error"}`)
      }

      // Parse the response text as JSON
      let data
      try {
        data = JSON.parse(responseText)
        console.log("Parsed data:", data)
      } catch (e) {
        console.error("Error parsing JSON:", e)
        throw new Error("Invalid response format from server")
      }

      // Filter results by university if needed
      if (Array.isArray(data)) {
        // Filter by university if needed
        const filteredData = adminProfile.university
          ? data.filter((item) => item.universityName === adminProfile.university)
          : data

        if (filteredData.length === 0) {
          setSearchError("No results found")
        } else {
          setResults(filteredData)
        }
      } else if (data && typeof data === "object") {
        // If the response is a single object, check if it belongs to the university
        if (!adminProfile.university || data.universityName === adminProfile.university) {
          setResults([data])
        } else {
          setSearchError("No results found")
        }
      } else {
        console.error("Expected array or object but got:", typeof data)
        setSearchError("Invalid response format from server")
      }
    } catch (err: any) {
      console.error("Search error:", err)
      setSearchError(err.message || "An error occurred")
    } finally {
      setSearchLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }
  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-700">
      {/* Sidebar */}
      <Sidebar
        handleLogout={handleLogout}
        dueEvents={events.filter((event) => {
          const eventDate = new Date(event.eventDate)
          const now = new Date()
          const threeDaysFromNow = new Date(now)
          threeDaysFromNow.setDate(now.getDate() + 3)
          return eventDate > now && eventDate <= threeDaysFromNow
        })}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Profile Card */}
          <AdminProfileCard adminProfile={adminProfile} />

          {/* University Stats */}
          <UniversityStats studentsCount={studentsCount} facultiesCount={facultiesCount} />
          

          {/* Search Section */}
          <SearchSection
            universityName={adminProfile?.university}
            onSearch={handleSearch}
            searchLoading={searchLoading}
            searchError={searchError}
            results={results}
          />

           {/* Ongoing Projects Section */}
         <div className="col-span-1 md:col-span-2 lg:col-span-3">
   <h2 className="text-2xl font-semibold mb-4">Ongoing Projects</h2>
   <AllProjectsList />
 </div>

          {/* Event Countdown */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <EventCountdown events={events} />
          </div>

          {/* Events Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              {/* Header section */}
              <div className="relative z-10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">University Events</h2>
                  <p className="text-blue-100 mt-1">Stay updated with the latest campus activities</p>
                </div>
                <button
                  onClick={() => router.push("/uniadmin/events")}
                  className="mt-4 md:mt-0 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg backdrop-blur-sm transition-all flex items-center text-sm font-medium"
                >
                  View All Events
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Notification Manager */}
      <EventNotificationManager events={events} />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

export default UniAdminDashboard

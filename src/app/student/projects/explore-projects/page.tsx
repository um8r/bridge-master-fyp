"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ProfileCard from "./ProfileCard"
import ProjectCard from "./ExploreProjectCard"
import { ToastContainer } from "react-toastify" // to display toasts
import { SearchIcon, Filter, ChevronDown, Sparkles, Clock, Briefcase, Lightbulb, TrendingUp, Zap } from "lucide-react"
import ProjectDetailsPanel from "../[id]/ProjectDetailsPanel"

// Interfaces
interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  role: string
  email: string
  universityName: string
  address: string
  rollNumber: string
  imageData: string
  skills?: string[]
}

interface ExpertProject {
  id: string
  title: string
  description: string
  stack?: string
  status?: string
  expertName?: string
  studentName?: string
  budget?: number
  companyName?: string
  matchScore?: number
  createdAt?: string
  isRequested?: boolean
}

interface Proposal {
  id: string
  projectId: string
  studentId: string
  status: string // "Pending", "Accepted", "Rejected"
}

const ExploreProjects: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // States
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [expertProjects, setExpertProjects] = useState<ExpertProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ExpertProject[]>([])
  const [studentProposals, setStudentProposals] = useState<Proposal[]>([])

  const [selectedFilter, setSelectedFilter] = useState("Most Recent")
  const [searchQuery, setSearchQuery] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Project details
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<ExpertProject | null>(null)

  // Motivational quotes
  const motivationalQuotes = [
    "Your project will be accepted if you work hard. Keep pushing!",
    "Success comes to those who are willing to put in the effort.",
    "Every expert was once a beginner. Keep learning!",
    "The best way to predict your future is to create it.",
    "Your skills are your superpower. Use them wisely!",
  ]

  const [currentQuote, setCurrentQuote] = useState("")

  useEffect(() => {
    // Set a random motivational quote
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    setCurrentQuote(motivationalQuotes[randomIndex])
  }, [])

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // 1) Fetch user info
        const profileRes = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!profileRes.ok) {
          router.push("/unauthorized")
          return
        }
        const profileData = await profileRes.json()
        const userId = profileData.userId

        // 2) Fetch extended student data
        const studentRes = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!studentRes.ok) {
          router.push("/unauthorized")
          return
        }
        const studentData = await studentRes.json()

        setUserProfile({
          userId: studentData.userId,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          role: profileData.role,
          email: studentData.email,
          universityName: studentData.universityName,
          address: studentData.address,
          rollNumber: studentData.rollNumber,
          imageData: studentData.imageData,
          skills: studentData.skills,
        })

        // 3) Fetch the student's proposals
        const proposalsRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-proposals/get-proposal-for-student/${studentData.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (proposalsRes.ok) {
          const proposalsData = await proposalsRes.json()
          setStudentProposals(proposalsData)
        } else {
          console.log("No proposals or could not fetch proposals")
        }

        // 4) Fetch Expert Projects
        const projectsRes = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-expert-projects", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!projectsRes.ok) {
          setError("Failed to load projects.")
          return
        }
        const projectsData = await projectsRes.json()

        // 5) For each project, optionally call Python /predict to compute matchScore
        const updatedProjects: ExpertProject[] = []
        for (const proj of projectsData) {
          const projectObj: ExpertProject = {
            id: proj.id,
            title: proj.title,
            description: proj.description,
            stack: proj.stack,
            status: proj.currentStatus,
            expertName: proj.name,
            studentName: proj.studentName,
            budget: proj.budget,
            companyName: proj.companyName,
            matchScore: 0,
            createdAt: proj.createdAt,
            isRequested: proj.isRequested,
          }

          // (optional) Python skill prediction
          try {
            const pythonResp = await fetch(
              `http://127.0.0.1:5000/predict?project_title=${encodeURIComponent(projectObj.title)}`,
            )
            if (pythonResp.ok) {
              const result = await pythonResp.json()
              const predictedSkills: string[] = result.skills || []
              // Compare with student's known skills
              const studentSkillsSet = new Set(studentData.skills?.map((s: string) => s.toLowerCase()) || [])
              const overlap = predictedSkills.filter((skill: string) => studentSkillsSet.has(skill.toLowerCase()))
              projectObj.matchScore = overlap.length
            }
          } catch (err) {
            console.error("Error calling Python API for project:", proj.title, err)
          }
          updatedProjects.push(projectObj)
        }

        setExpertProjects(updatedProjects)
        setFilteredProjects(updatedProjects)
      } catch (err) {
        console.error("An error occurred:", err)
        setError("Failed to load projects.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Filter logic
  useEffect(() => {
    filterProjects()
  }, [selectedFilter, searchQuery, expertProjects])

  const filterProjects = () => {
    let sorted = [...expertProjects]

    // Searching
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      sorted = sorted.filter(
        (proj) =>
          proj.title.toLowerCase().includes(q) ||
          proj.description.toLowerCase().includes(q) ||
          (proj.companyName && proj.companyName.toLowerCase().includes(q)),
      )
    }

    // Sorting
    switch (selectedFilter) {
      case "Most Recent":
        sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        break
      case "Best Matches":
        sorted.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        break
      default:
        break
    }

    // Optionally exclude isRequested
    sorted = sorted.filter((p) => !p.isRequested)

    setFilteredProjects(sorted)
  }

  // Check for pending proposals
  function hasPendingProposal(projectId: string): boolean {
    return studentProposals.some((proposal) => proposal.projectId === projectId && proposal.status === "Pending")
  }

  // Handle project selection
  useEffect(() => {
    const idFromUrl = searchParams.get("projectId")
    if (idFromUrl) {
      setSelectedProjectId(idFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    if (selectedProjectId) {
      const found = expertProjects.find((p) => p.id === selectedProjectId)
      setSelectedProjectDetails(found || null)
    } else {
      setSelectedProjectDetails(null)
    }
  }, [selectedProjectId, expertProjects])

  const handleProjectClick = (id: string) => {
    setSelectedProjectId(id)
    router.push(`?projectId=${id}`)
    // If you want to open a proposal modal, do it here
  }

  // Render
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-white to-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-blue-600 text-xl font-medium">Loading amazing projects...</p>
          <p className="text-blue-500 text-sm mt-2">Get ready to showcase your skills!</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-white to-white">
        <div className="bg-white p-8 rounded-xl shadow-md border border-red-200">
          <p className="text-red-600 text-xl font-medium">{error}</p>
          <p className="text-gray-600 mt-2">Donot give up! Technical difficulties happen to everyone.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 text-gray-800">
      {/* Hero Banner */}
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="AI Projects Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/50 to-white opacity-90"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Explore Projects</h1>
          <p className="text-xl text-blue-100 max-w-2xl drop-shadow-md">
            Discover cutting-edge AI and CS projects that match your skills and launch your career
          </p>

          {/* Motivational Quote */}
          <div className="mt-6 bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full border border-white/50 flex items-center">
            <Lightbulb className="text-blue-800 w-5 h-5 mr-2" />
            <p className="text-blue-900 font-medium">{currentQuote}</p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white/70 backdrop-blur-sm border-y border-blue-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center">
              <TrendingUp className="text-green-600 w-5 h-5 mr-2" />
              <div>
                <p className="text-green-600 font-bold text-lg">{expertProjects.length}</p>
                <p className="text-xs text-gray-500">Available Projects</p>
              </div>
            </div>
            <div className="flex items-center">
              <Zap className="text-amber-600 w-5 h-5 mr-2" />
              <div>
                <p className="text-amber-600 font-bold text-lg">
                  {expertProjects.filter((p) => p.matchScore && p.matchScore > 0).length}
                </p>
                <p className="text-xs text-gray-500">Skill Matches</p>
              </div>
            </div>
            <div className="flex items-center">
              <Sparkles className="text-blue-600 w-5 h-5 mr-2" />
              <div>
                <p className="text-blue-600 font-bold text-lg">
                  {studentProposals.filter((p) => p.status === "Accepted").length}
                </p>
                <p className="text-xs text-gray-500">Accepted Proposals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar with Profile */}
        <aside className="hidden lg:block lg:w-1/5 xl:w-1/6 bg-white/70 backdrop-blur-sm p-6 border-r border-blue-100">
          {userProfile && (
            <div className="space-y-6">
              <ProfileCard
                imageData={`data:image/jpeg;base64,${userProfile.imageData}`}
                firstName={userProfile.firstName}
                lastName={userProfile.lastName}
                role={userProfile.role}
                skills={userProfile.skills}
              />

              <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <h3 className="text-blue-700 font-medium mb-2">Your Progress</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proposals Sent:</span>
                    <span className="text-gray-900 font-medium">{studentProposals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending:</span>
                    <span className="text-amber-600 font-medium">
                      {studentProposals.filter((p) => p.status === "Pending").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accepted:</span>
                    <span className="text-green-600 font-medium">
                      {studentProposals.filter((p) => p.status === "Accepted").length}
                    </span>
                  </div>
                </div>

                {/* Motivational Text */}
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <p className="text-xs text-blue-700 italic">
                    Work hard on your proposals and showcase your unique skills to stand out!
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex">
          <div className={`p-6 ${selectedProjectDetails ? "w-full lg:w-1/2" : "w-full"}`}>
            {/* Search & Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="relative w-full lg:w-2/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-blue-600" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:bg-gray-50 border border-blue-200"
                />
              </div>

              <div className="relative w-full lg:w-1/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-blue-600" />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-full bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:bg-gray-50 border border-blue-200"
                >
                  <option value="Most Recent">Most Recent</option>
                  <option value="Best Matches">Best Matches</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Filter Indicators */}
            <div className="mt-4 flex items-center">
              <div className="flex items-center mr-4">
                {selectedFilter === "Most Recent" ? (
                  <Clock className="h-4 w-4 text-blue-600 mr-1" />
                ) : (
                  <Sparkles className="h-4 w-4 text-blue-600 mr-1" />
                )}
                <span className="text-sm text-blue-700">
                  {selectedFilter === "Most Recent" ? "Showing newest first" : "Showing best matches"}
                </span>
              </div>
              {searchQuery && (
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-700">Search results for {searchQuery}</span>
                </div>
              )}
            </div>

            {/* Motivational Text */}
            <div className="mt-6 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-lg font-medium text-blue-700 mb-1">Ready to showcase your talent?</h3>
              <p className="text-sm text-gray-700">
                These projects are your opportunity to work with industry experts and build your portfolio. Submit
                compelling proposals that highlight your unique skills and passion!
              </p>
            </div>

            {/* Projects Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => {
                  const pending = hasPendingProposal(project.id)
                  return (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      title={project.title}
                      description={project.description}
                      stack={project.stack}
                      status={project.status}
                      expertName={project.expertName}
                      studentName={project.studentName}
                      budget={project.budget}
                      hasPending={pending}
                      onClick={() => {
                        if (!pending) {
                          handleProjectClick(project.id)
                          // e.g., open a <ProposalModal /> here
                        }
                      }}
                    />
                  )
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-blue-100">
                  <img
                    src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="No projects"
                    className="w-40 h-40 object-cover rounded-full mb-4 opacity-80"
                  />
                  <p className="text-gray-600 text-lg font-medium">No projects available.</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria.</p>
                  <p className="text-blue-600 text-sm mt-4 max-w-md text-center">
                    The best opportunities often come when you least expect them. Keep checking back for new projects!
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Inspiration */}
            {filteredProjects.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200 text-center">
                <p className="text-indigo-700 font-medium">
                  Your next big opportunity is waiting. Apply now and make it happen!
                </p>
              </div>
            )}
          </div>

          {/* Project Details Panel */}
          {selectedProjectDetails && (
            <div className="w-full lg:w-1/2 p-6 bg-white/70 backdrop-blur-sm overflow-auto border-l border-blue-100">
              <ProjectDetailsPanel
                project={selectedProjectDetails}
                onClose={() => {
                  setSelectedProjectId(null)
                  router.push("")
                }}
              />
            </div>
          )}
        </main>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-blue-100 py-4 text-center text-sm text-gray-600">
        <p>© 2023 Project Explorer | Connect with industry experts and build your future</p>
        <p className="mt-1 text-blue-600">
          The difference between ordinary and extraordinary is that little extra. — Jimmy Johnson
        </p>
      </footer>
    </div>
  )
}

export default ExploreProjects

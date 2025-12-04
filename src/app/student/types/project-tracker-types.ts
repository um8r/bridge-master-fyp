// Project Tracker Types

export interface ProgressUpdate {
  id: string
  content: string
  date: string
}

export interface ProgressItem {
  id: string
  title: string
  description: string
  achievementDate: string
  isCompleted?: boolean
  updates?: ProgressUpdate[]
}

export interface ProjectDetails {
  id: string
  title: string
  description: string
  status: string
  endDate: string
  expertName: string
  indExpertId: string
  iExptUserId: string
}

export interface MilestoneComment {
  id: string
  comment: string
  commentDate: string
  commenterName: string
  commenter_id: string
  milestone_id: string
}

export interface TaskItem {
  id: string
  projectId: string
  task: string
  description: string
  taskStatus: string
}

export interface Review {
  id: string
  review: string
  rating: number
  datePosted: string
  reviewerName: string
}

// This interface extends project details with student info
export interface ProjectDetailsExtended extends ProjectDetails {
  studentId: string
  stdUserId: string
  studentName: string
}

// Milestone Page Types

export interface IndustryExpertProfile {
  userId: string
  indExptId: string
  firstName: string
  lastName: string
  email: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  achievementDate: string
  isCompleted?: boolean
}

export interface StudentDetails {
  studentId: string
  firstName: string
  lastName: string
  stdUserId: string
}

export interface Comment {
  id: string
  comment: string
  commenterName: string
  commentDate: string
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

export interface ProjectDetailsExtended {
  id: string
  studentId: string
  stdUserId: string
  studentName: string
  status?: string
  title: string
  description: string
  endDate: string
  expertName: string
  indExpertId: string
  iExptUserId: string
  budget?: number
  link?: string
}

export interface CompletionRequest {
  id: string
  projectId: string
  projectTitle: string
  studentName: string
  requestDate: string
  status: string
}

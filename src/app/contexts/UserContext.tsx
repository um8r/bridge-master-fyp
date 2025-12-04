"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  role: string
  imageData: string
}

interface UserContextType {
  userProfile: UserProfile | null
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
  updateProfileImage: (newImageData: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const updateProfileImage = (newImageData: string) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        imageData: newImageData,
      })
    }
  }

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, updateProfileImage }}>{children}</UserContext.Provider>
  )
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}


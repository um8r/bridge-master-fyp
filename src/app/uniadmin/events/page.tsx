"use client"

import type React from "react"
import EventsComponent from "../components/EventsComponent"

const UniversityEventsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <EventsComponent showTitle={true} />
    </div>
  )
}

export default UniversityEventsPage

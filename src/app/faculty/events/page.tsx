"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, User, MapPin, Eye, EyeOff } from "lucide-react";

const UniversityEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showPreviousEvents, setShowPreviousEvents] = useState(false); // Toggle state
  const router = useRouter();

  interface Event {
    id: string;
    title: string;
    speakerName: string;
    eventDate: string;
    venue: string;
  }

  useEffect(() => {
    async function fetchEvents() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        const response = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/Events/get-events",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, [router]);

  const currentDate = new Date();

  // Filtered Events
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDate);
    return showPreviousEvents
      ? eventDate < currentDate // Show previous events
      : eventDate >= currentDate; // Show upcoming events
  });

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 p-6">
    <h1 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
      {showPreviousEvents ? "Previous University Events" : "Upcoming University Events"}
    </h1>

    {/* Toggle Button */}
    <div className="flex justify-center mb-8">
      <button
        onClick={() => setShowPreviousEvents(!showPreviousEvents)}
        className="flex items-center px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium rounded-full shadow-lg transition-all duration-300"
      >
        {showPreviousEvents ? <EyeOff className="mr-2" /> : <Eye className="mr-2" />}
        {showPreviousEvents ? "Show Upcoming Events" : "Show Previous Events"}
      </button>
    </div>

    {/* Event Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => (
          <div
            key={event.id}
            className="relative p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300"
          >
            <div className="absolute inset-0 bg-gray-100 opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h2>
              <div className="space-y-3">
                <p className="text-gray-800 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-700" />
                  <span className="font-semibold mr-2">Speaker:</span> {event.speakerName}
                </p>
                <p className="text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="font-semibold mr-2">Date:</span>{" "}
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
                <p className="text-gray-800 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="font-semibold mr-2">Venue:</span> {event.venue}
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white bg-opacity-20 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white bg-opacity-20 rounded-full blur-xl"></div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">
          No {showPreviousEvents ? "previous" : "upcoming"} events available.
        </p>
      )}
    </div>
  </div>
);
};

export default UniversityEventsPage;

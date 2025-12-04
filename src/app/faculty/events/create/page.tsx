"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateEventPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [speakerName, setSpeakerName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchFacultyId() {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/auth/login-user');
        return;
      }

      try {
        // Fetch the user's information
        const userResponse = await fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.userId;

          // Fetch the faculty details using the userId
          const facultyResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (facultyResponse.ok) {
            const facultyData = await facultyResponse.json();
            const facultyId = facultyData.id;

            // Store the facultyId in local storage
            localStorage.setItem('facultyId', facultyId);
            setLoading(false);
          } else {
            console.error('Failed to fetch faculty details.');
            router.push('/unauthorized');
          }
        } else {
          console.error('Failed to authorize user.');
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        router.push('/unauthorized');
      }
    }

    fetchFacultyId();
  }, [router]);

  const handleCreateEvent = async () => {
    const facultyId = localStorage.getItem('facultyId');
    const token = localStorage.getItem('jwtToken');

    if (!facultyId || !token) {
      console.error('Faculty ID or token is missing');
      return;
    }

    try {
      const response = await fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/Events/add-event', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          speakerName,
          eventDate,
          venue,
          facultyId, // Automatically include facultyId in the event creation request
        }),
      });

      if (response.ok) {
        console.log('Event created successfully');
        router.push('/faculty'); // Redirect back to the faculty dashboard after event creation
      } else {
        const errorText = await response.text();
        console.error('Failed to create event:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Event</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Event Title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Event Description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Speaker Name</label>
          <input
            type="text"
            value={speakerName}
            onChange={(e) => setSpeakerName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Speaker Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Event Date</label>
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Venue</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Event Venue"
          />
        </div>
        <button
          onClick={handleCreateEvent}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-200"
        >
          Create Event
        </button>
      </div>
    </div>
  );
};

export default CreateEventPage;

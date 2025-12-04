"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Request {
  id: string;
  ideaId: string;
  studentId: string;
  facultyId: string;
  stdUserId: string;
  facUserId: string;
  ideaName: string;
  studentName: string;
  studentDept: string;
}

interface IdeaRequests {
  ideaId: string;
  ideaName: string;
  requests: Request[];
}

const IdeaNotificationsPage: React.FC = () => {
  const [requests, setRequests] = useState<IdeaRequests[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // keep track of all IDs we've handled
  const [handledIds, setHandledIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("handledRequests");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [meetingPlace, setMeetingPlace] = useState("");
  const [meetingTime, setMeetingTime] = useState<string>("");

  // Fetch and filter
  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Please log in to access this page.", { position: "top-center" });
        router.push("/auth/login-user");
        return;
      }
      try {
        const profileRes = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!profileRes.ok) throw new Error("Auth failed");
        const { userId } = await profileRes.json();

        const facultyRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!facultyRes.ok) throw new Error("Faculty not found");
        const { id: facultyId } = await facultyRes.json();

        const reqRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/interested-for-idea/get-interested-students-requests/${facultyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!reqRes.ok) {
          const txt = await reqRes.text();
          throw new Error(txt || "Failed to fetch requests.");
        }
        const data: IdeaRequests[] = await reqRes.json();

        const filtered = data.map((idea) => ({
          ...idea,
          requests: idea.requests.filter((r) => !handledIds.includes(r.id)),
        }));
        setRequests(filtered);
      } catch (err) {
        toast.error((err as Error).message, { position: "top-center", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [router, handledIds]);

  const markHandled = (id: string) => {
    setHandledIds((prev) => {
      const next = [...prev, id];
      localStorage.setItem("handledRequests", JSON.stringify(next));
      return next;
    });
  };

  const openAcceptModal = (requestId: string) => {
    setSelectedRequestId(requestId);
    setMeetingPlace("");
    setMeetingTime("");
    setAcceptModalOpen(true);
  };

  const confirmAccept = async () => {
    if (!selectedRequestId) return;
    const token = localStorage.getItem("jwtToken");
    const payload = { meetPlace: meetingPlace, meetTime: meetingTime };
    const res = await fetch(
      `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/interested-for-idea/accept-request/${selectedRequestId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const txt = await res.text();
      toast.error(txt || "Failed to accept.");
    } else {
      toast.success("Request accepted.", { position: "top-center" });
      markHandled(selectedRequestId);
      setRequests((prev) =>
        prev.map((idea) => ({
          ...idea,
          requests: idea.requests.filter((r) => r.id !== selectedRequestId),
        }))
      );
    }
    setAcceptModalOpen(false);
  };

  const handleReject = async (requestId: string) => {
    const token = localStorage.getItem("jwtToken");
    const res = await fetch(
      `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/interested-for-idea/reject-request/${requestId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) {
      const txt = await res.text();
      toast.error(txt || "Failed to reject.");
    } else {
      toast.success("Request rejected.", { position: "top-center" });
      markHandled(requestId);
      setRequests((prev) =>
        prev.map((idea) => ({
          ...idea,
          requests: idea.requests.filter((r) => r.id !== requestId),
        }))
      );
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading requests...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-300 text-blue-900 p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Idea Notifications</h1>
      {requests.length === 0 && <p className="text-blue-600">No requests found.</p>}
      {requests.map((idea) => (
        <div key={idea.ideaId} className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Idea: {idea.ideaName}
          </h2>
          {idea.requests.map((r) => (
            <div
              key={r.id}
              className="p-4 bg-gray-100 border border-gray-300 rounded-lg mb-4"
            >
              <p>
                <strong>Student:</strong> {r.studentName}
              </p>
              <p>
                <strong>Department:</strong> Computer Science
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => openAcceptModal(r.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(r.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Accept Modal */}
      {acceptModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-100 p-6 w-full max-w-md rounded-lg">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Schedule Meeting</h3>

            <label className="block text-gray-700 mb-1">Meeting Place</label>
            <input
              type="text"
              value={meetingPlace}
              onChange={(e) => setMeetingPlace(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Enter meeting place"
            />

            <label className="block text-gray-700 mb-1">Meeting Date/Time</label>
            <input
              type="datetime-local"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={confirmAccept}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setAcceptModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-blue-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default IdeaNotificationsPage;

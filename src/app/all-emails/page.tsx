"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllEmailsPage: React.FC = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch all emails from the API
    const fetchEmails = async () => {
      try {
        const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/register-user/get-all-emails");

        if (response.ok) {
          const data = await response.json();
          setEmails(data);
        } else {
          toast.error("Failed to fetch emails. Please try again later.", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
        toast.error("An error occurred while fetching emails.", {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold text-green-400 mb-6">All Registered Emails</h1>

      {loading ? (
        <p className="text-gray-400">Loading emails...</p>
      ) : emails.length > 0 ? (
        <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
          <ul className="divide-y divide-gray-700">
            {emails.map((email, index) => (
              <li
                key={index}
                className="p-4 text-gray-200 hover:bg-gray-700 transition-all duration-200 rounded"
              >
                {email}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-400">No emails found.</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default AllEmailsPage;

"use client";
import React, { useState } from "react";
import { toast } from "react-toastify"; // We'll display success/fail messages
import { FaTimes, FaEdit } from "react-icons/fa";

interface ProposalModalProps {
  projectId: string;
  studentId: string;
  onClose: () => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({
  projectId,
  studentId,
  onClose,
}) => {
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = [".doc", ".docx", ".pdf"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (fileExtension && validExtensions.includes(`.${fileExtension}`)) {
        setProposalFile(file);
      } else {
        toast.error("Please select a valid .doc, .docx, or .pdf file.", {
          icon: false, // No icon for error if you want
        });
      }
    } else {
      toast.error("Please select a valid file.", {
        icon: false,
      });
    }
  };

  // Convert file to Base64
  const toBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64File = reader.result as string;
        const base64Data = base64File.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
    });
  };

  // Submit the proposal
  const handleSubmitProposal = async () => {
    if (!proposalFile) {
      toast.error("Please select a proposal file.", {
        icon: false,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const base64File = await toBase64(proposalFile);

      // Data to send
      const data = {
        studentId,
        projectId,
        proposal: base64File,
      };

      const resp = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-proposals/send-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (resp.ok) {
        // SUCCESS toast but without the big checkmark icon
        toast.success("Proposal submitted successfully!", {
          icon: false, // This removes the default check icon
        });
        onClose();
      } else {
        const errData = await resp.json();
        toast.error(errData.message || "Failed to submit proposal. Please try again.", {
          icon: false,
        });
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("An error occurred while submitting the proposal.", {
        icon: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white text-gray-500 p-8 shadow-2xl w-full max-w-lg relative">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-200 transition-colors"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-3xl font-bold text-green-400 mb-6 flex items-center">
          <FaEdit className="mr-2 text-green-400" />
          Submit Your Proposal Here
        </h2>

        {/* File Input */}
        <input
          type="file"
          accept=".doc,.docx,.pdf"
          onChange={handleFileChange}
          className="w-full p-4 rounded-md bg-white-200 text-gray-400  focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-300"
        />

        {/* Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            className={`
              px-6 py-3 rounded-full font-medium text-white shadow-lg transform transition-all duration-300 
              ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"}
            `}
            onClick={handleSubmitProposal}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Proposal"}
          </button>

          <button
            className="px-6 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-500 shadow-lg transition duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalModal;

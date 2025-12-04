// app/components/ProposalDetailsModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ProposalDetailsModalProps {
  proposal: {
    id: string;
    projectTitle: string;
    studentName: string;
    proposal: string; // Base64 encoded file
    status: string;
    proposalFile?: string | null; // e.g. "proposal.docx", "proposal.pdf", etc.
  };
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}

const ProposalDetailsModal: React.FC<ProposalDetailsModalProps> = ({
  proposal,
  onAccept,
  onReject,
  onClose,
}) => {
  const [decodedFileUrl, setDecodedFileUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("proposal.pdf"); // Default filename
  const [mimeType, setMimeType] = useState<string>("application/pdf"); // Default MIME type

  useEffect(() => {
    if (proposal.proposal) {
      // Determine the filename and extension
      let fileExt = "pdf"; // default
      let fileName = `${proposal.projectTitle}_Proposal.pdf`; // default name

      if (proposal.proposalFile) {
        fileName = proposal.proposalFile; // use provided filename
        const parts = proposal.proposalFile.split(".");
        fileExt = parts[parts.length - 1].toLowerCase();
      }

      // Determine MIME type based on the file extension
      let type = "application/octet-stream";
      switch (fileExt) {
        case "pdf":
          type = "application/pdf";
          break;
        case "doc":
          type = "application/msword";
          break;
        case "docx":
          type =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        // Add more cases if needed
        default:
          type = "application/octet-stream";
          break;
      }

      setFilename(fileName);
      setMimeType(type);

      // Convert Base64 to Blob
      const fileBlob = base64ToBlob(proposal.proposal, type);
      const fileUrl = URL.createObjectURL(fileBlob);
      setDecodedFileUrl(fileUrl);
    }
  }, [proposal]);

  // Function to convert Base64 string to a Blob
  const base64ToBlob = (base64: string, type: string) => {
    try {
      const byteCharacters = atob(base64);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        byteArrays.push(new Uint8Array(byteNumbers));
      }
      return new Blob(byteArrays, { type });
    } catch (error) {
      console.error("Error converting Base64 to Blob:", error);
      return new Blob([], { type });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-gray-50 p-6 rounded-lg shadow-lg text-gray-500 w-full max-w-lg">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
          onClick={onClose}
          aria-label="Close Proposal Details Modal"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-2xl font-bold text-green-500 mb-4">Proposal Details</h2>

        <p>
          <strong>Project:</strong> {proposal.projectTitle}
        </p>
        <p>
          <strong>Student:</strong> {proposal.studentName}
        </p>
        <p>
          <strong>Status:</strong> {proposal.status}
        </p>

        <div className="mt-4">
          {decodedFileUrl ? (
            <div>
              <p className="mb-2 text-sm text-gray-400">
                Click the link below to download the proposal document.
              </p>
              <a
                href={decodedFileUrl}
                download={filename}
                className="text-blue-500 hover:underline"
              >
                Download Proposal Document
              </a>
            </div>
          ) : (
            <p className="text-sm text-red-400">No document available.</p>
          )}
        </div>

        <div className="mt-4 flex justify-between">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
            onClick={onAccept}
          >
            Accept
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
            onClick={onReject}
          >
            Reject
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsModal;

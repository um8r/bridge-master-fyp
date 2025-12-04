"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentModal from "@/app/components/PaymentModal";
import ProposalDetailsModal from "../industrycomponents/PropossalDetails";

interface Proposal {
  id: string;
  projectTitle: string;
  studentName: string;
  studentUserId: string;
  proposal: string;
  status: string;
}

interface PaymentIntentResponse {
  message: string;
  paymentClientSecret: string;
}

interface ErrorResponse {
  Error: string;
  Details?: string;
}

const NotificationsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const router = useRouter();

  // Base URL for the backend API
  const BACKEND_URL = "https://localhost:7053";

  // --------------------------------------------------
  // 1) Fetch proposals on component mount
  // --------------------------------------------------
  useEffect(() => {
    const fetchProposals = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        router.push("/auth/login-user");
        return;
      }

      try {
        // 1. Fetch authorized user info
        const profileResponse = await fetch(`${BACKEND_URL}/api/auth/authorized-user-info`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          const errorData: ErrorResponse = await profileResponse.json();
          throw new Error(errorData.Error || "Failed to fetch profile.");
        }

        const profileData = await profileResponse.json();
        const userId = profileData.userId;

        // 2. Fetch industry expert info
        const expertResponse = await fetch(
          `${BACKEND_URL}/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!expertResponse.ok) {
          const errorData: ErrorResponse = await expertResponse.json();
          throw new Error(errorData.Error || "Failed to fetch expert profile.");
        }

        const expertData = await expertResponse.json();
        const expertId = expertData.indExptId;

        // 3. Fetch proposals for the expert
        const proposalsResponse = await fetch(
          `${BACKEND_URL}/api/project-proposals/get-proposal-for-expert/${expertId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (proposalsResponse.ok) {
          const proposalsData = await proposalsResponse.json();
          const mappedProposals: Proposal[] = proposalsData.map((p: any) => ({
            id: p.id,
            projectTitle: p.projectTitle,
            studentName: p.studentName,
            studentUserId: p.studentId,
            proposal: p.proposal,
            status: p.status,
          }));
          setProposals(mappedProposals);
        } else {
          const errorData: ErrorResponse = await proposalsResponse.json();
          throw new Error(errorData.Error || "Failed to fetch proposals.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        toast.error(err.message || "An unexpected error occurred.");
        console.error("Fetch Proposals Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [router]);

  // --------------------------------------------------
  // 2) Utility Handlers
  // --------------------------------------------------
  const handleSeeDetails = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowModal(true);
  };

  const handleViewStudentDetails = (studentUserId: string) => {
    router.push(`/industryexpert/notifications/student/${studentUserId}`);
  };

  // --------------------------------------------------
  // 3) Accept (creates PaymentIntent + marks accepted)
  // --------------------------------------------------
  const initiatePaymentForProposal = async (proposalId: string) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        router.push("/auth/login-user");
        return;
      }

      // Call your AcceptProposal endpoint
      const response = await fetch(
        `${BACKEND_URL}/api/project-proposals/accept-proposal/${proposalId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data: PaymentIntentResponse = await response.json();
        const clientSecret = data.paymentClientSecret;

        // The backend has ALREADY set status to "Accepted" in the DB
        if (clientSecret) {
          // Prompt user for payment
          setPaymentClientSecret(clientSecret);
          setShowPaymentModal(true);

          // Set selected proposal in local state
          const found = proposals.find((p) => p.id === proposalId) || null;
          setSelectedProposal(found);

          // Let the user know they need to complete payment
          toast.info("Please complete the payment to finish acceptance.");
        } else {
          toast.warning("Payment client secret not provided by backend.");
        }
      } else {
        const errorData: ErrorResponse = await response.json();
        toast.error(errorData.Error || "Failed to initiate payment.");
      }
    } catch (err: any) {
      console.error("Error initiating payment:", err);
      toast.error("An unexpected error occurred while initiating payment.");
    }
  };

  // --------------------------------------------------
  // 4) PaymentModal callbacks
  // --------------------------------------------------

  // If payment is successful on Stripe, just show success toast and update UI
  // (Backend has already set proposal to "Accepted")
  const handlePaymentSuccess = async () => {
    if (!selectedProposal) {
      toast.error("No proposal selected.");
      return;
    }

    // Optional: update local proposals array so the user sees it as accepted
    setProposals((prev) =>
      prev.map((proposal) =>
        proposal.id === selectedProposal.id
          ? { ...proposal, status: "Accepted" }
          : proposal
      )
    );

    toast.success("Payment successful! Proposal is accepted.");
    setShowPaymentModal(false);
    setPaymentClientSecret(null);
    setSelectedProposal(null);
  };

  // If payment fails, just show an error. We do NOT automatically reject the proposal here
  // because the backend has already set it to "Accepted". (If that’s undesirable,
  // see notes below on a two-step approach.)
  const handlePaymentFailure = () => {
    toast.error("Payment failed. Try again or contact support.");
    setShowPaymentModal(false);
    setPaymentClientSecret(null);
    setSelectedProposal(null);
  };

  // If user closes the payment modal, we do not automatically reject
  const handlePaymentClose = () => {
    toast.info("Payment was cancelled. You can retry anytime.");
    setShowPaymentModal(false);
    setPaymentClientSecret(null);
    setSelectedProposal(null);
  };

  // --------------------------------------------------
  // 5) Reject the Proposal
  // --------------------------------------------------
  const handleRejectProposal = async (proposalId: string) => {
    const confirmReject = window.confirm("Are you sure you want to reject this proposal?");
    if (!confirmReject) return;

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        router.push("/auth/login-user");
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/project-proposals/reject-proposal/${proposalId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Proposal rejected successfully!");
        // Remove it or mark it as rejected
        setProposals((prev) => prev.filter((proposal) => proposal.id !== proposalId));
        setShowModal(false);
      } else {
        const errorData: ErrorResponse = await response.json();
        toast.error(errorData.Error || "Failed to reject proposal.");
      }
    } catch (err: any) {
      console.error("Error rejecting proposal:", err);
      toast.error("An unexpected error occurred while rejecting the proposal.");
    }
  };

  // --------------------------------------------------
  // 6) Render
  // --------------------------------------------------
  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="mb-6">
          {/* Optional image/graphic */}
        </div>
        <h1 className="text-2xl font-semibold">No Notifications</h1>
        <p className="text-gray-400 mt-2">
          You don&apos;t have any new proposals at the moment. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-green-500 mb-6">Notifications</h1>
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-gray-800 rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold text-white mb-2">
                {proposal.projectTitle}
              </h2>
              <p className="text-gray-400">From: {proposal.studentName}</p>
              <p className="text-gray-300 mb-2">
                You have a new proposal document.
              </p>
              <p className="text-gray-400">Status: {proposal.status}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  className="text-gray-900 bg-green-400 rounded py-2 px-4 hover:bg-green-500 transition duration-200"
                  onClick={() => handleSeeDetails(proposal)}
                >                  See Details
                </button>
                <button
                  className="text-gray-900 bg-blue-400 rounded py-2 px-4 hover:bg-blue-500 transition duration-200"
                  onClick={() => handleViewStudentDetails(proposal.studentUserId)}
                >
                  View Student
                </button>

                <button
                  className="text-gray-900 bg-yellow-400 rounded py-2 px-4 hover:bg-yellow-500 transition duration-200"
                  onClick={() => initiatePaymentForProposal(proposal.id)}
                >
                  Accept
                </button>

                <button
                  className="text-gray-900 bg-red-400 rounded py-2 px-4 hover:bg-red-500 transition duration-200"
                  onClick={() => handleRejectProposal(proposal.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedProposal && (
        <ProposalDetailsModal
          proposal={selectedProposal}
          onAccept={() => initiatePaymentForProposal(selectedProposal.id)}
          onReject={() => handleRejectProposal(selectedProposal.id)}
          onClose={() => setShowModal(false)}
        />
      )}

      {showPaymentModal && paymentClientSecret && selectedProposal && (
        <PaymentModal
          clientSecret={paymentClientSecret}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          onClose={handlePaymentClose}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default NotificationsPage;

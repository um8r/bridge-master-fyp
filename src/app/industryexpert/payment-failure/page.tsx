"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentFailurePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id");

  return (
    <div className="bg-white text-white min-h-screen p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Payment Failed</h1>
      <p className="mb-4 text-gray-400">Unfortunately, your payment could not be processed.</p>
      <button
        onClick={() =>
          router.push(projectId ? `/industryexpert/payment/${projectId}` : "/industryexpert/projects")
        }
        className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded text-white"
      >
        Try Again
      </button>
      <ToastContainer />
    </div>
  );
};

export default PaymentFailurePage;

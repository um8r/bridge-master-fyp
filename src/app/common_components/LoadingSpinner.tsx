import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-400"></div>
    </div>
  );
}

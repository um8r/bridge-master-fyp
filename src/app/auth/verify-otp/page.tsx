// src/app/auth/verify-otp/page.tsx
import React, { Suspense } from "react";
import VerifyOtp from "./VerifyOtp"; // assuming the component is in same folder

const Page = () => {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <VerifyOtp />
    </Suspense>
  );
};

export default Page;

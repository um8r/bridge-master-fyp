// app/components/StripeProvider.tsx
"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    console.error("Stripe publishable key is not set.");
    return <>{children}</>;
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;

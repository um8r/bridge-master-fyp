// app/components/PaymentModal.tsx
"use client";

import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

interface PaymentModalProps {
  clientSecret: string;
  onSuccess: () => void;
  onFailure: () => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  clientSecret,
  onSuccess,
  onFailure,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again later.");
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details not found.");
      setLoading(false);
      onFailure(); // Notify the parent about the failure
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed.");
        setLoading(false);
        onFailure(); // Notify the parent about the failure
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setLoading(false);
        onSuccess();
      } else {
        setError("Payment failed.");
        setLoading(false);
        onFailure(); // Notify the parent about the failure
      }
    } catch (err: any) {
      console.error("Stripe Payment Error:", err);
      setError("An unexpected error occurred during payment.");
      setLoading(false);
      onFailure();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
          onClick={() => {
            onClose();
            onFailure(); // Optional: Treat closing as failure
          }}
          aria-label="Close Payment Modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-green-500 mb-4">Payment Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#fff",
                    "::placeholder": {
                      color: "#bbb",
                    },
                  },
                  invalid: {
                    color: "#e74c3c",
                  },
                },
              }}
            />
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <button
            type="submit"
            className={`w-full bg-green-500 text-white py-2 px-4 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
            } transition duration-200`}
            disabled={!stripe || loading}
          >
            {loading ? "Processing..." : "Pay"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;

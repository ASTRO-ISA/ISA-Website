import { useEffect, useState } from "react";
import api from "@/lib/api";

const PaymentStatus = () => {
  const [status, setStatus] = useState("loading"); // "loading", "success", "failed", "pending"
  const [message, setMessage] = useState("");

  // Get transactionId from URL
  const queryParams = new URLSearchParams(window.location.search);
  const transactionId = queryParams.get("orderId");
  const item_type = queryParams.get("itemType");

  useEffect(() => {
    if (!transactionId) {
      setStatus("failed");
      setMessage("Transaction ID not found!");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await api(
          `/phonepe/status/${item_type}/${transactionId}`
        );
        const data = await res.data;
        console.log(data)

        if (data.data.state === "COMPLETED") {
          setStatus("success");
          setMessage("Payment successful!");
        } else if (data.data.state === "PENDING") {
          setStatus("pending");
          setMessage("Payment is pending. Please wait...");
        } else {
          setStatus("failed");
          setMessage("Payment failed. Try again!");
        }
      } catch (err) {
        console.error(err);
        setStatus("failed");
        setMessage("Error verifying payment.");
      }
    };

    verifyPayment();
  }, [transactionId]);

  // Tailwind classes for status box
  const statusClasses = () => {
    if (status === "success") return "bg-green-100 text-green-800 border border-green-300";
    if (status === "failed") return "bg-red-100 text-red-800 border border-red-300";
    if (status === "pending") return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    return "";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">Payment Status</h1>

      {status === "loading" && <p className="text-gray-600">Checking payment status...</p>}

      {status !== "loading" && (
        <div className={`p-6 rounded-lg mb-6 w-full max-w-md text-center ${statusClasses()}`}>
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}

      {status === "success" && (
        <a
          href="/events"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </a>
      )}

      {/* {status === "failed" && (
        <a
          href="/checkout"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </a>
      )} */}
    </div>
  );
};

export default PaymentStatus;
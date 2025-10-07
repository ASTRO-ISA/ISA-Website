import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";


const PaymentStatus = () => {
  const [status, setStatus] = useState("loading"); // "loading", "success", "failed", "pending"
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(60);

  // Get transactionId from URL
  const queryParams = new URLSearchParams(window.location.search);
  const transactionId = queryParams.get("orderId");
  const itemType = queryParams.get("itemType");
  const itemId = queryParams.get("itemId");

  useEffect(() => {
    if (!transactionId) {
      setStatus("failed");
      setMessage("Transaction ID not found!");
      return;
    }
  
    const verifyPayment = async () => {
      try {
        const res = await api.get(`/phonepe/status/${itemType}/${transactionId}`);
        const data = res.data;
        console.log(data);
  
        if (data?.data?.state === "COMPLETED") {
          setStatus("success");
          setMessage("Payment successful!");
  
          // Automatically register the user based on itemType
          try {
            let apiUrl = "";
            switch (itemType) {
              case "event":
                apiUrl = `/events/register/${itemId}/${userInfo.user._id}`;
                break;
              case "webinar":
                apiUrl = `/webinars/register/${itemId}/${userInfo.user._id}`;
                break;
              case "course":
                apiUrl = `/courses/register/${itemId}/${userInfo.user._id}`;
                break;
              default:
                throw new Error("Unknown item type");
            }
  
            await api.patch(apiUrl);
            toast({
              title: "Registration Complete",
              description: `You are now registered for this ${itemType}!`,
            });
          } catch (regErr) {
            console.error("Registration failed:", regErr);
            toast({
              title: "Registration Error",
              description: "Payment successful but registration failed. Contact support.",
              variant: "destructive",
            });
          }
  
        } else if (data?.data?.state === "PENDING") {
          setStatus("pending");
          setMessage("Payment is pending. Please wait...");
        } else {
          setStatus("failed");
          setMessage("Payment failed. Try again!");
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        setStatus("failed");
        setMessage("Error verifying payment.");
      }
    };
  
    verifyPayment();
  }, [transactionId]);

  useEffect(() => {
    if (status === "success") {
      // Countdown interval
      const countdown = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            navigate("/events");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [status]);

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
        <>
        <p className="mt-3 text-gray-500 text-sm">Confirmation mail is send to you!</p>
          <a
          href="/events"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Home
        </a>

        <p className="mt-3 text-gray-500 text-sm">
          Redirecting to home automatically in{" "}
          <span className="font-semibold text-blue-600">{secondsLeft}</span>{" "}
          seconds...
        </p>
        </>
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
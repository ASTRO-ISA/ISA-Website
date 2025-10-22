import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "./ui/Spinner";

const PaymentStatus = () => {
  const [status, setStatus] = useState("loading"); // "loading", "success", "failed", "pending"
  const [log, setLog] = useState("Verifying payment...");
  const { toast } = useToast();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const transactionId = queryParams.get("orderId");
  const itemType = queryParams.get("itemType");
  const itemId = queryParams.get("itemId");

  const verifyPayment = useCallback(async () => {
    if (!transactionId || !itemType) {
      setStatus("failed");
      setLog("Invalid payment details.");
      return;
    }

    try {
      setLog("Verifying payment...");
      const res = await api.get(`/phonepe/status/${itemType}/${transactionId}`, {
        timeout: 10000,
      });

      const state = res?.data?.data?.state;

      switch (state) {
        case "COMPLETED":
          setStatus("success");
          setLog("Payment successful. Registering...");
          try {
            let apiUrl = "";
            switch (itemType) {
              case "event":
                apiUrl = `/events/register/${itemId}/${userInfo?.user?._id}`;
                break;
              case "webinar":
                apiUrl = `/webinars/register/${itemId}/${userInfo?.user?._id}`;
                break;
              case "course":
                apiUrl = `/courses/register/${itemId}/${userInfo?.user?._id}`;
                break;
              default:
                throw new Error("Unknown item type");
            }

            await api.patch(apiUrl);
            toast({
              title: "Registration Complete",
              description: `You are now registered for this ${itemType}.`,
            });

            // Redirect immediately to respective page
            navigate(`/${itemType}s`);
          } catch (regErr) {
            setStatus("failed");
            setLog("Payment succeeded but registration failed.");
            toast({
              title: "Registration Issue",
              description:
                "Payment succeeded, but registration couldn’t be completed. Please contact support.",
              variant: "destructive",
            });
          }
          break;

        case "PENDING":
          setStatus("pending");
          setLog("Payment is still processing...");
          break;

        default:
          setStatus("failed");
          setLog("Payment failed. Please try again.");
      }
    } catch (err) {
      setStatus("failed");
      setLog("Unable to verify payment. Check your network.");
    }
  }, [transactionId, itemType, itemId, userInfo, toast, navigate]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  useEffect(() => {
    if (status !== "pending") return;
    const interval = setInterval(() => verifyPayment(), 10000);
    return () => clearInterval(interval);
  }, [status, verifyPayment]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <Spinner className="w-8 h-8 mb-4" color="text-black" />
      <p className="text-sm font-medium text-gray-600">{log}</p>
      {status === "failed" && (
        <p className="text-xs text-red-500 mt-2">
          Payment failed or invalid. Please try again.
        </p>
      )}
    </div>
  );
};

export default PaymentStatus;
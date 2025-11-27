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

  // to redirect the user after successful payment
  const queryParams = new URLSearchParams(window.location.search);
  const transactionId = queryParams.get("orderId");
  const itemType = queryParams.get("itemType");
  const itemId = queryParams.get("itemId");
  const itemSlug = queryParams.get("itemSlug");

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
            if(itemType == "event"){
              navigate(`/${itemType}s/${itemSlug}`);
            } else {
              navigate(`/${itemType}s`);
            }
          } catch (regErr) {
            setStatus("failed");
            setLog("Payment succeeded, but registration couldn’t be completed.");
          }
          break;

        case "PENDING":
          setStatus("pending");
          setLog("Payment is still processing...");
          break;

        default:
          setStatus("failed");
          setLog("Looks like the payment didn’t go through. If any amount was deducted, it will be refunded automatically.");
      }
    } catch (err) {
      setStatus("failed");
      setLog("Looks like the payment didn’t go through. If any amount was deducted, it will be refunded automatically.");
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

  // Redirect if failure
  useEffect(() => {
    if (status !== "failed") return;

    const timeout = setTimeout(() => {
      navigate(`/${itemType}s`);
    }, 7000);

    return () => clearTimeout(timeout);
  }, [status, navigate, itemType, itemId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      {(status === "loading" || status === "pending") && (
        <Spinner className="w-8 h-8 mb-4" color="text-black" />
      )}

      <p className="text-sm font-medium text-gray-600">{log}</p>

      {status === "failed" && (
        <p className="text-xs text-red-500 mt-2">
          Redirecting you shortly… Please don’t refresh or press back during this process.
        </p>
      )}
    </div>
  );
};

export default PaymentStatus;
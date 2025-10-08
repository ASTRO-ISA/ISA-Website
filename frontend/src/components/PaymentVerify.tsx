// import { useEffect, useState } from "react";
// import api from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/context/AuthContext";
// import { useNavigate } from "react-router-dom";


// const PaymentStatus = () => {
//   const [status, setStatus] = useState("loading"); // "loading", "success", "failed", "pending"
//   const [message, setMessage] = useState("");
//   const { toast } = useToast();
//   const { userInfo } = useAuth();
//   const navigate = useNavigate();
//   const [secondsLeft, setSecondsLeft] = useState(60);

//   // Get transactionId from URL
//   const queryParams = new URLSearchParams(window.location.search);
//   const transactionId = queryParams.get("orderId");
//   const itemType = queryParams.get("itemType");
//   const itemId = queryParams.get("itemId");

//   useEffect(() => {
//     if (!transactionId) {
//       setStatus("failed");
//       setMessage("Transaction ID not found!");
//       return;
//     }
  
//     const verifyPayment = async () => {
//       try {
//         const res = await api.get(`/phonepe/status/${itemType}/${transactionId}`);
//         const data = res.data;
//         console.log(data);
  
//         if (data?.data?.state === "COMPLETED") {
//           setStatus("success");
//           setMessage("Payment successful!");
  
//           // Automatically register the user based on itemType
//           try {
//             let apiUrl = "";
//             switch (itemType) {
//               case "event":
//                 apiUrl = `/events/register/${itemId}/${userInfo.user._id}`;
//                 break;
//               case "webinar":
//                 apiUrl = `/webinars/register/${itemId}/${userInfo.user._id}`;
//                 break;
//               case "course":
//                 apiUrl = `/courses/register/${itemId}/${userInfo.user._id}`;
//                 break;
//               default:
//                 throw new Error("Unknown item type");
//             }
  
//             await api.patch(apiUrl);
//             toast({
//               title: "Registration Complete",
//               description: `You are now registered for this ${itemType}!`,
//             });
//           } catch (regErr) {
//             console.error("Registration failed:", regErr);
//             toast({
//               title: "Registration Error",
//               description: "Payment successful but registration failed. Contact support.",
//               variant: "destructive",
//             });
//           }
  
//         } else if (data?.data?.state === "PENDING") {
//           setStatus("pending");
//           setMessage("Payment is pending. Please wait...");
//         } else {
//           setStatus("failed");
//           setMessage("Payment failed. Try again!");
//         }
//       } catch (err) {
//         console.error("Error verifying payment:", err);
//         setStatus("failed");
//         setMessage("Error verifying payment.");
//       }
//     };
  
//     verifyPayment();
//   }, [transactionId]);

//   useEffect(() => {
//     if (status === "success") {
//       // Countdown interval
//       const countdown = setInterval(() => {
//         setSecondsLeft((prev) => {
//           if (prev <= 1) {
//             clearInterval(countdown);
//             navigate("/events");
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => clearInterval(countdown);
//     }
//   }, [status]);

//   // Tailwind classes for status box
//   const statusClasses = () => {
//     if (status === "success") return "bg-green-100 text-green-800 border border-green-300";
//     if (status === "failed") return "bg-red-100 text-red-800 border border-red-300";
//     if (status === "pending") return "bg-yellow-100 text-yellow-800 border border-yellow-300";
//     return "";
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen font-sans bg-gray-50 p-4">
//       <h1 className="text-3xl font-bold mb-6">Payment Status</h1>

//       {status === "loading" && <p className="text-gray-600">Checking payment status...</p>}

//       {status !== "loading" && (
//         <div className={`p-6 rounded-lg mb-6 w-full max-w-md text-center ${statusClasses()}`}>
//           <p className="text-lg font-medium">{message}</p>
//         </div>
//       )}

//       {status === "success" && (
//         <>
//         <p className="mt-3 text-gray-500 text-sm">Confirmation mail is send to you!</p>
//           <a
//           href="/"
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//         >
//           Go to Home
//         </a>

//         <p className="mt-3 text-gray-500 text-sm">
//           Redirecting to home automatically in{" "}
//           <span className="font-semibold text-blue-600">{secondsLeft}</span>{" "}
//           seconds...
//         </p>
//         </>
//       )}

//       {/* {status === "failed" && (
//         <a
//           href="/checkout"
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//         >
//           Try Again
//         </a>
//       )} */}
//     </div>
//   );
// };

// export default PaymentStatus;


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
  const [secondsLeft, setSecondsLeft] = useState(30);

  // Get transactionId from URL
  const queryParams = new URLSearchParams(window.location.search);
  const transactionId = queryParams.get("orderId");
  const itemType = queryParams.get("itemType");
  const itemId = queryParams.get("itemId");

  // ✅ Timer key for persistence
  const TIMER_KEY = `payment_timer_${transactionId}`;

  // ✅ Timer initialization logic (type-safe)
  const initTimer = () => {
    const TIMER_KEY = "timer_start";
    let startTime: number | null = null;

    // Load from localStorage if it exists
    const storedStartTime = localStorage.getItem(TIMER_KEY);
    if (storedStartTime) {
      startTime = Number(storedStartTime); // Convert string → number
    }

    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem(TIMER_KEY, String(startTime)); // Convert number → string
    }

    // Now safe to do arithmetic:
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    return elapsed;
  };

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
        console.log("Payment verification result:", data);

        if (data?.data?.state === "COMPLETED") {
          setStatus("success");
          setMessage("Payment successful!");

          // Register user automatically
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

  // ✅ Handle redirect countdown for all statuses
  useEffect(() => {
    if (status === "loading") return;

    // ✅ Success case → redirect after 60 seconds
    if (status === "success") {
      const countdown = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }

    // ✅ Failed or pending case → persistent 30-second timer
    if (status === "failed" || status === "pending") {
      const storedStartTime = localStorage.getItem(TIMER_KEY);
      let startTime: number;

      if (storedStartTime) {
        startTime = Number(storedStartTime);
      } else {
        startTime = Date.now();
        localStorage.setItem(TIMER_KEY, String(startTime));
      }

      const countdown = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(30 - elapsed, 0);
        setSecondsLeft(remaining);

        if (remaining <= 0) {
          clearInterval(countdown);
          localStorage.removeItem(TIMER_KEY);
          navigate("/");
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [status]);

  const statusClasses = () => {
    if (status === "success") return "bg-green-100 text-green-800 border border-green-300";
    if (status === "failed") return "bg-red-100 text-red-800 border border-red-300";
    if (status === "pending") return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    return "";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>

      {status === "loading" && (
        <p className="text-gray-600 text-center">Checking payment status...</p>
      )}

      {status !== "loading" && (
        <div className={`p-5 rounded-lg mb-5 w-full max-w-md text-center ${statusClasses()}`}>
          <p className="text-base font-medium">{message}</p>
        </div>
      )}

      {status === "success" && (
        <>
          <p className="text-sm text-gray-600 mb-4">
            A confirmation mail has been sent to your registered email.
          </p>
          <a
            href="/"
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
          >
            Go to Home
          </a>
          <p className="mt-3 text-gray-500 text-sm">
            Redirecting automatically in{" "}
            <span className="font-semibold text-blue-600">{secondsLeft}</span> seconds...
          </p>
        </>
      )}

      {(status === "failed" || status === "pending") && (
        <div className="text-center">
          {status === "failed" && (
            <p className="text-sm text-gray-600 mb-3">
              Don’t worry — no money has been deducted from your bank account.
            </p>
          )}
          <p className="text-gray-500 text-sm mb-4">
            Redirecting to home in{" "}
            <span className="font-semibold text-blue-600">{secondsLeft}</span> seconds...
          </p>
          <p className="text-gray-500 text-sm">
            If not automatically redirected,&nbsp;
            <a href="/" className="underline text-blue-600">
              click here
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
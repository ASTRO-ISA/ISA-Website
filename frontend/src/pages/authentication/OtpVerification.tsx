import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";
import { Helmet } from "react-helmet-async";

const OtpVerification = () => {
  const { refetchUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { email } = useParams();
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(90);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    setCanResend(false);
    const interval = setInterval(
      () => setResendTimer((prev) => prev - 1),
      1000
    );
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    try {
      await api.post("/auth/resend-otp", { email });
      toast({ description: "OTP sent to your registered email.", variant: "success" });
      setResendTimer(90);
    } catch {
      toast({
        description: "Failed to resend OTP",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");

    const newOtp = [...otp];
    if (value === "") {
      newOtp[index] = "";
    } else {
      newOtp[index] = value.slice(-1);
      // Move to next input only if a digit was entered
      if (index < 5) e.target.nextSibling?.focus();
    }
    setOtp(newOtp);
  };

  const handleKeyDown = (e, index) => {
    const newOtp = [...otp];

    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          newOtp[index - 1] = "";
          setOtp(newOtp);
          e.target.previousSibling?.focus();
        }
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!paste) return;

    const newOtp = [...otp];
    for (let i = 0; i < paste.length; i++) {
      newOtp[i] = paste[i];
    }
    setOtp(newOtp);

    // Focus the next empty input (if any)
    const nextIndex = paste.length < 6 ? paste.length : 5;
    document.querySelectorAll("input")[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    setVerifying(true);
    if (code.length !== 6) {
      setVerifying(false);
      toast({
        description: "Enter all 6 digits",
        variant: "destructive",
      });
      return;
    }
  

    try {
      await api.post("/auth/verify-otp", { email, otp: code });
      setVerifying(false);
      toast({
        title: "Email Verified",
        description: "Welcome aboard explorer, your journey through the cosmos begins now!",
      });
      await refetchUser();
      navigate("/");
    } catch (err) {
      setVerifying(false);
      toast({
        title: "Verification failed",
        description: err.response?.data?.message || "Invalid or expired OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white flex flex-col">
      <Helmet>
        <title>OTP Verification | ISA-India</title>
        <meta name="description" content="Verify your OTP to create an account with ISA-India." />
      </Helmet>
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-16">
        <form
          onSubmit={handleSubmit}
          className="bg-space-purple/10 p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Verify OTP</h2>
          <p className="text-center text-gray-400 mb-6">
            Enter the 6-digit code sent to{" "}
            <span className="text-space-accent">{email}</span>
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined} // only first input handles paste
                className="w-12 h-12 text-center text-lg bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
              />
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex justify-center bg-space-accent hover:bg-space-accent/80 text-white font-semibold py-2 rounded-md transition-colors"
          >
            {verifying ? <Spinner /> : "Verify"}
          </button>

          {/* Resend */}
          <p className="mt-4 text-sm text-center text-gray-400">
            Didn’t get the code?{" "}
            <button
              type="button"
              disabled={!canResend}
              onClick={handleResend}
              className={`text-space-accent hover:underline ${
                !canResend ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Resend {!canResend && `in ${resendTimer}s`}
            </button>
          </p>
        </form>
      </main>
    </div>
  );
};

export default OtpVerification;

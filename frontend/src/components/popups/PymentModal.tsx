import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import Spinner from "@/components/ui/Spinner";

const PaymentModal = ({ event, userId, onClose }) => {
  const { toast } = useToast();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!event) return null;

  const itemType = event.item_type || "event"; // fallback to 'event' if not provided

  const handlePayment = async () => {
    if (!agreeToTerms) {
      return toast({
        title: "Please agree to the Terms and Conditions",
        variant: "destructive",
      });
    }

    setLoading(true);
    try {
      const res = await api.post(`/phonepe/payment/initiate/${event._id}`, {
        amount: event.fee,
        item_type: itemType,
      });

      if (res.data?.redirect_url) {
        window.location.href = res.data.redirect_url;
      } else {
        toast({
          title: "Payment Error",
          description: res.data.message || "Could not initiate payment.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Payment initiation failed:", err.message);
      toast({
        title: "Payment Error",
        description: err.message || "Something went wrong. Try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-space-dark border border-gray-800 rounded-2xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
        <p className="text-gray-300 mb-4">
          You’re about to register for{" "}
          <span className="font-semibold text-white">{event.title}</span>.
        </p>
        <p className="text-gray-400 mb-4">
          Registration Fee:{" "}
          <span className="text-space-accent font-semibold">₹{event.fee}</span>
        </p>

        {/* <div className="flex items-start mb-4 space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="mt-1 accent-space-accent"
          />
          <label htmlFor="terms" className="text-gray-400 text-sm">
            I agree to the{" "}
            <Link
              to="/terms-and-conditions"
              className="text-space-accent underline hover:text-space-accent/80"
            >
              Terms and Conditions
            </Link>
            .
          </label>
        </div> */}
<div className="flex flex-col mb-4">
  {/* Refund policy note */}
  <div className="bg-gray-800/40 border border-gray-700 rounded-md p-2 mb-3">
    <p className="text-xs text-gray-400 leading-relaxed">
      ⚠️ The registration fee is{" "}
      <span className="text-red-400 font-semibold">non-refundable</span>.  
      Please review all details before proceeding with the payment.
    </p>
  </div>

  {/* Terms and conditions checkbox */}
  <div className="flex items-start space-x-2">
    <input
      type="checkbox"
      id="terms"
      checked={agreeToTerms}
      onChange={(e) => setAgreeToTerms(e.target.checked)}
      className="mt-1 accent-space-accent"
    />
    <label htmlFor="terms" className="text-gray-400 text-sm leading-snug">
      I agree to the{" "}
      <Link
        to="/terms-and-conditions"
        className="text-space-accent underline hover:text-space-accent/80"
      >
        Terms and Conditions
      </Link>
      .
    </label>
  </div>
</div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
  onClick={handlePayment}
  disabled={!agreeToTerms || loading}
  className={`px-4 py-2 rounded-md text-gray-400 font-medium w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg inline-flex items-center justify-center ${
    agreeToTerms
      ? "bg-space-accent hover:bg-space-accent/80 text-white"
      : "bg-gray-800 cursor-not-allowed"
  }`}
>
  {/* Invisible text preserves button width */}
  <span className="invisible absolute">{loading ? "Proceed to Payment" : ""}</span>

  {loading ? <Spinner /> : "Proceed to Payment"}
</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
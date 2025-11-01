import Spinner from "@/components/ui/Spinner";

const RegisterButton = ({
  event,
  userInfo,
  loadingEventId,
  handleRegister,
  handleUnregister,
  handlePaidRegister,
  toast,
}) => {
  const alreadyRegistered = event.registeredUsers.some(
    (e) => e.user === userInfo?.user?._id
  );

  // Check if registration is closed
  if (!event.isRegistrationOpen) {
    return (
      <button
        disabled
        className="w-full md:w-auto px-6 py-3 rounded-md transition text-white font-semibold flex justify-center bg-gray-700 cursor-not-allowed"
      >
        Registration Closed
      </button>
    );
  }

  // Handle click logic
  const handleClick = () => {
    if (alreadyRegistered) {
      // Allow unregister if free event
      if (event.isFree) {
        handleUnregister(userInfo?.user?._id, event._id);
      }
    } else {
      if (
        event.seatCapacity &&
        event.registeredUsers.length >= event.seatCapacity
      ) {
        toast({
          title: "Sold Out",
          description: "This event has reached maximum capacity.",
          variant: "destructive",
        });
      } else if (event.isFree) {
        handleRegister(userInfo?.user?._id, event._id);
      } else {
        handlePaidRegister(userInfo?.user?._id, event);
      }
    }
  };

  // Decide button style
  const buttonClass = alreadyRegistered
    ? event.isFree
      ? "bg-space-purple/30 hover:bg-space-purple/50"
      : "bg-gray-500 cursor-not-allowed"
    : event.seatCapacity && event.registeredUsers.length >= event.seatCapacity
    ? "bg-gray-600 cursor-not-allowed"
    : "bg-space-accent hover:bg-space-accent/80";

  // Decide if button should be disabled
  const buttonDisabled =
    (!event.isFree && alreadyRegistered) ||
    (event.seatCapacity &&
      event.registeredUsers.length >= event.seatCapacity &&
      !alreadyRegistered);

  // Button label logic
  const getButtonLabel = () => {
    if (loadingEventId === event._id) return <Spinner />;
    if (alreadyRegistered)
      return event.isFree ? "Unregister" : "Registered";
    if (
      event.seatCapacity &&
      event.registeredUsers.length >= event.seatCapacity
    )
      return "Sold Out";
    return event.isFree
      ? "Register for this Event"
      : `Register - ₹${event.fee}`;
  };

  return (
    <button
      onClick={handleClick}
      disabled={buttonDisabled}
      className={`w-full md:w-auto px-6 py-3 rounded-md transition text-white font-semibold flex justify-center ${buttonClass}`}
    >
      {getButtonLabel()}
    </button>
  );
};

export default RegisterButton;
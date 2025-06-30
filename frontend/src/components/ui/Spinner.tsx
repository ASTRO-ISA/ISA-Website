import React from "react";

interface SpinnerProps {
  size?: number; // Tailwind size (in px)
  color?: string; // Tailwind color class
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = "text-white",
  className = "",
}) => {
  return (
    <div>
      <svg
        className={`animate-spin ${color} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        width={size}
        height={size}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M12 2a10 10 0 00-10 10h4a6 6 0 016-6V2z"
        />
      </svg>
    </div>
  );
};

export default Spinner;

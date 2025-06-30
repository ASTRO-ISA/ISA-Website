import React from "react";
import Spinner from "./Spinner"; // your spinner component

interface SpinnerOverlayProps {
  show: boolean;
  children: React.ReactNode;
}

const SpinnerOverlay: React.FC<SpinnerOverlayProps> = ({ show, children }) => {
  return (
    <div className="relative">
      <div className={show ? "blur-sm pointer-events-none" : ""}>
        {children}
      </div>

      {show && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
          <Spinner size={36} />
        </div>
      )}
    </div>
  );
};

export default SpinnerOverlay;

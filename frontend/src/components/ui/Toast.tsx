import React, { useEffect } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
  duration?: number; // ms
}

const typeStyles = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};

export const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg z-50 transition-all animate-in fade-in ${typeStyles[type]}`}
      role="alert"
    >
      {message}
      {onClose && (
        <button className="ml-4 font-bold" onClick={onClose} aria-label="Close">&times;</button>
      )}
    </div>
  );
};

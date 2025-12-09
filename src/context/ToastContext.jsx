import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`
          fixed top-6 left-1/2 -translate-x-1/2 z-50
          px-6 py-3 rounded shadow-lg
          text-white font-semibold
          ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}
        `}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};
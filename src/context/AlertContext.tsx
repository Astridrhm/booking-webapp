'use client'

import Alert from "@/components/ui/alert/Alert";
import React, { createContext, useContext, useState, ReactNode } from "react";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertState {
  visible: boolean;
  variant: AlertVariant;
  title: string;
  message: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
}

interface AlertContextProps {
  showAlert: (options: Omit<AlertState, "visible">) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (options: Omit<AlertState, "visible">) => {
    setAlert({ ...options, visible: true });

    // Auto hide after 3 seconds
    setTimeout(() => setAlert(null), 3000);
  };

  const hideAlert = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert?.visible && (
        <div className="fixed bottom-5 right-5 z-99999">
          <Alert {...alert} />
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
};

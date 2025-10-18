"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    id: number;
  } | null>(null);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
  {children}

  {notification && (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end space-y-2">
      <div
        className={`
          px-4 py-3 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] backdrop-blur-sm
          text-sm font-medium text-white
          animate-fade-in-down
          transition-all duration-300
          ${getAlertClass(notification.type)}
        `}
      >
        <span>{notification.message}</span>
      </div>
    </div>
  )}
</NotificationContext.Provider>

  );
}

function getAlertClass(type: NotificationType): string {
  switch (type) {
    case "success":
      return "alert-success";
    case "error":
      return "alert-error";
    case "warning":
      return "alert-warning";
    case "info":
      return "alert-info";
    default:
      return "alert-info";
  }
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
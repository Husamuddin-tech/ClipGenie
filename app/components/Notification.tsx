'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

// interface Notification {
//   message: string;
//   type: NotificationType;
// }

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
          flex items-center gap-2 px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm
          text-sm font-medium text-white
          animate-slide-up-fade
          transition-all duration-500 transform
          ${getAlertClass(notification.type)}
        `}
            style={{ animationFillMode: 'forwards' }}
          >
            {/* Icon per type */}
            {notification.type === 'success' && (
              <span className="text-white">✅</span>
            )}
            {notification.type === 'error' && (
              <span className="text-white">❌</span>
            )}
            {notification.type === 'warning' && (
              <span className="text-white">⚠️</span>
            )}

            {notification.type === 'info' && (
              <span className="text-white">ℹ️</span>
            )}

            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

function getAlertClass(type: NotificationType) {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-r from-green-400 via-green-500 to-green-600';
    case 'error':
      return 'bg-gradient-to-r from-red-400 via-red-500 to-red-600';
    case 'info':
      return 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600';
    case 'warning':
      return 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600';
    default:
      return 'bg-gray-400';
  }
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
}

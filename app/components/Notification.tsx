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
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end space-y-2 sm:space-y-3">
          <div
            className={`
          max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
          w-auto flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-4 rounded-3xl 
          shadow-lg backdrop-blur-md
          text-sm sm:text-base font-medium
          animate-slide-up-fade transition-all duration-500 transform
          ${getAlertClass(notification.type)}
        `}
            style={{ animationFillMode: 'forwards' }}
          >
            {/* Icon per type */}
            <span className="flex-shrink-0 text-lg sm:text-xl">
              {notification.type === 'success' && '✅'}
              {notification.type === 'error' && '❌'}
              {notification.type === 'warning' && '⚠️'}
              {notification.type === 'info' && 'ℹ️'}
            </span>

            {/* Message */}
            <span className="break-words text-sm sm:text-base text-white">
              {notification.message}
            </span>
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

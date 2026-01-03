/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../redux/store.ts';
import { removeNotification } from '../redux/uiSlice.ts';

const NotificationItem: React.FC<{ notification: any }> = ({ notification }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 5000);
    return () => clearTimeout(timer);
  }, [dispatch, notification.id]);

  const styles = {
    success: "border-green-100 bg-green-50 text-green-800",
    error: "border-pink-200 bg-pink-50 text-pink-800",
    info: "border-blue-100 bg-blue-50 text-blue-800",
  };

  const icons = {
    success: (
      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 text-soft-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-center p-4 mb-3 border-2 rounded-2xl shadow-lg backdrop-blur-sm animate-in slide-in-from-right-full duration-300 w-80 sm:w-96 ${styles[notification.type as keyof typeof styles]}`}>
      <div className="flex-shrink-0 mr-3">
        {icons[notification.type as keyof typeof icons]}
      </div>
      <div className="flex-1 text-sm font-medium">
        {notification.message}
      </div>
      <button 
        onClick={() => dispatch(removeNotification(notification.id))}
        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications } = useSelector((state: RootState) => state.ui);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;


import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store.ts';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-soft-pink rounded-full mb-4"></div>
            <p className="text-soft-pink font-medium">LunaFlow is loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

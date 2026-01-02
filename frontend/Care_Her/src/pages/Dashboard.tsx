
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice.ts';
import type { AppDispatch, RootState } from '../redux/store.ts';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-soft-pink rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-800">LunaFlow</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button 
            onClick={() => dispatch(logout())}
            className="text-sm font-medium text-gray-500 hover:text-soft-pink transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hello, {user?.name?.split(' ')[0] || 'there'}! ✨</h1>
          <p className="text-gray-600 mb-8">Welcome to your cycle dashboard. We're getting your data ready.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-pink-50 border border-pink-100">
              <p className="text-xs font-bold text-soft-pink uppercase tracking-wider mb-2">Current Cycle</p>
              <p className="text-3xl font-bold text-gray-800">Day 14</p>
              <p className="text-sm text-gray-500 mt-1">Ovulation window</p>
            </div>
            <div className="p-6 rounded-2xl bg-pink-50 border border-pink-100">
              <p className="text-xs font-bold text-soft-pink uppercase tracking-wider mb-2">Next Period</p>
              <p className="text-3xl font-bold text-gray-800">12 Days</p>
              <p className="text-sm text-gray-500 mt-1">Predicted for Dec 28</p>
            </div>
            <div className="p-6 rounded-2xl bg-pink-50 border border-pink-100">
              <p className="text-xs font-bold text-soft-pink uppercase tracking-wider mb-2">Mood Today</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-2xl">😊</span>
                <span className="text-lg font-semibold text-gray-700">Balanced</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

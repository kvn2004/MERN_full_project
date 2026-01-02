
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fff9fa]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-soft-pink rounded-full flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-pink-50">
          {children}
        </div>
      </div>
      
      <p className="mt-8 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} LunaFlow System. Your health, your flow.
      </p>
    </div>
  );
};

export default Layout;
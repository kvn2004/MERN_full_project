
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className={`appearance-none block w-full px-4 py-3 border rounded-2xl shadow-sm placeholder-gray-400 
        focus:outline-none focus:ring-2 focus:ring-soft-pink focus:border-soft-pink sm:text-sm transition-all
        ${error ? 'border-red-300' : 'border-gray-200'}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;

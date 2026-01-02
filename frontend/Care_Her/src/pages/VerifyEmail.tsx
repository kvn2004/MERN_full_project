
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout.tsx';
import Button from '../components/Button.tsx';
import { verifyEmail, clearMessages } from '../redux/authSlice.ts';
import type { AppDispatch, RootState } from '../redux/store.ts';

const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newCode = [...code];
    pasteData.forEach((char, i) => {
      if (i < 6 && /^\d$/.test(char)) {
        newCode[i] = char;
      }
    });
    setCode(newCode);
    
    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      dispatch(verifyEmail(fullCode));
    }
  };

  useEffect(() => {
    if (code.every(digit => digit !== '') && !loading && !successMessage) {
      handleSubmit();
    }
  }, [code]);

  return (
    <Layout title="Verify Your Account" subtitle="Enter the 6-digit code we sent to your email">
      <div className="text-center">
        {successMessage ? (
          <div className="flex flex-col items-center py-4">
            <div className="mb-6 h-20 w-20 bg-green-50 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h3>
            <p className="text-gray-600 mb-8">{successMessage}</p>
            {/* Redirect to onboarding flow after verification */}
            <Button onClick={() => navigate('/onboarding')}>Complete Your Profile</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 sm:gap-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-full h-14 sm:h-16 text-center text-2xl font-bold border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-soft-pink focus:border-soft-pink transition-all
                  ${error ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}
                />
              ))}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button 
                type="submit" 
                loading={loading} 
                disabled={code.some(d => d === '')}
              >
                Verify Account
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              Didn't receive the code?{' '}
              <button 
                type="button"
                className="font-semibold text-soft-pink hover:underline"
              >
                Resend Code
              </button>
            </p>
            
            <Link to="/signup" className="block text-sm font-medium text-gray-400 hover:text-gray-600 mt-4">
              &larr; Use a different email
            </Link>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default VerifyEmail;

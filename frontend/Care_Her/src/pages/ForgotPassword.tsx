
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout.tsx';
import Input from '../components/Input.tsx';
import Button from '../components/Button.tsx';
import { forgotPassword, clearMessages } from '../redux/authSlice.ts';
import type { AppDispatch, RootState } from '../redux/store.ts';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setFieldError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldError('Invalid email format');
      return;
    }
    setFieldError('');
    dispatch(forgotPassword(email));
  };

  if (successMessage) {
    return (
      <Layout title="Email Sent!" subtitle="Please check your inbox">
        <div className="text-center">
          <div className="mb-6 mx-auto h-20 w-20 bg-pink-50 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-soft-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-8">{successMessage}</p>
          <Link to="/login" className="w-full inline-block">
            <Button variant="secondary">Return to Login</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Forgot Password" subtitle="We'll send you a link to reset your password">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldError}
        />

        <div className="pt-2">
          <Button type="submit" loading={loading}>
            Send Reset Link
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm font-semibold text-soft-pink hover:text-[#ff6293]">
          &larr; Back to login
        </Link>
      </div>
    </Layout>
  );
};

export default ForgotPassword;

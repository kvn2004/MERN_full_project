/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout.tsx';
import Input from '../components/Input.tsx';
import Button from '../components/Button.tsx';
import { resetPassword, clearMessages } from '../redux/authSlice.ts';
import type { AppDispatch, RootState } from '../redux/store.ts';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fieldErrors, setFieldErrors] = useState<any>({});
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('code');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
    return () => {
      dispatch(clearMessages());
    };
  }, [token, navigate, dispatch]);

  const validate = () => {
    const errors: any = {};
    if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      dispatch(resetPassword({ token, password }));
    }
  };

  if (successMessage) {
    return (
      <Layout title="Password Reset!" subtitle="You can now log in with your new password">
        <div className="text-center">
          <div className="mb-6 mx-auto h-20 w-20 bg-green-50 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600 mb-8">{successMessage}</p>
          <Button onClick={() => navigate('/login')}>Login Now</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Reset Password" subtitle="Choose a strong new password for your account">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="password"
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />

        <Input
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
        />

        <div className="pt-2">
          <Button type="submit" loading={loading}>
            Update Password
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default ResetPassword;

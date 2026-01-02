/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout.tsx';
import Input from '../components/Input.tsx';
import Button from '../components/Button.tsx';
import { signup, clearMessages } from '../redux/authSlice.ts';
import type { AppDispatch, RootState } from '../redux/store.ts';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });

  const [errors, setErrors] = useState<any>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';

    if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.gender) newErrors.gender = 'Please select your gender';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      dispatch(
        signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender, // ✅ IMPORTANT
        })
      );
    }
  };

  if (successMessage) {
    return (
      <Layout title="Account Created!" subtitle="Check your email for verification">
        <div className="text-center">
          <div className="mb-6 mx-auto h-20 w-20 bg-green-50 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600 mb-8">{successMessage}</p>
          <Button onClick={() => navigate('/login')}>Return to Login</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Join CareHer" subtitle="Start your journey to better health tracking">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          label="Full Name"
          type="text"
          placeholder="Jane Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        {/* Gender Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>

          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 
            ${errors.gender ? 'border-red-400 ring-red-200' : 'border-gray-300 focus:ring-soft-pink'}`}>
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>

          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        <div className="pt-2">
          <Button type="submit" loading={loading}>
            Create Account
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-soft-pink hover:text-[#ff6293]">
            Log in here
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Signup;

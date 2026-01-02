
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout.tsx';
import Input from '../components/Input.tsx';
import Button from '../components/Button.tsx';
import { login, clearMessages } from '../redux/authSlice.ts';
import type { AppDispatch, RootState } from '../redux/store.ts';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearMessages());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const validate = () => {
    const newErrors: any = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <Layout title="Welcome Back" subtitle="Log in to CareHer to track your cycle">
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
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-soft-pink hover:text-[#ff6293]">
            Forgot your password?
          </Link>
        </div>

        <div className="pt-2">
          <Button type="submit" loading={loading}>
            Sign In
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-soft-pink hover:text-[#ff6293]">
            Start tracking for free
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Login;

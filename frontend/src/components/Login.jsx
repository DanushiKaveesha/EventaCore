import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { setCurrentUser } from '../utils/getCurrentUser';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [formData, setFormData] = useState({
    loginIdentifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submits credentials to the auth API and redirects intelligently based on assigned user role
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData
      );

      setCurrentUser(data);
      setUser(data);

      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500 blur-3xl mix-blend-multiply animate-pulse"></div>
        <div
          className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-purple-500 blur-3xl mix-blend-multiply animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute -bottom-40 left-1/2 w-96 h-96 rounded-full bg-indigo-500 blur-3xl mix-blend-multiply animate-pulse"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-white font-bold text-3xl"
            >
              <img src={logo} alt="EventraCore Logo" className="w-10 h-10 object-contain" />
              <span className="tracking-tight">EventraCore</span>
            </Link>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-[28px] shadow-2xl border border-white/20 p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-700 mb-4">
                Welcome to EventaCore
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Sign In
              </h1>
              <p className="mt-3 text-gray-500 text-base font-semibold">
                Access your personalized dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="loginIdentifier"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Username or Email
                </label>
                <input
                  id="loginIdentifier"
                  type="text"
                  name="loginIdentifier"
                  value={formData.loginIdentifier}
                  onChange={handleChange}
                  placeholder="Enter your username or email"
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 pr-20 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 font-semibold text-sm hover:text-blue-700"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-black text-white transition ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-indigo-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? 'Validating Nodes...' : 'Sign In To Console'}
                {!loading && <ArrowRightIcon className="w-5 h-5" />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Sign Up Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
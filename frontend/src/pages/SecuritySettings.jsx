import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  CalendarIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '../utils/getCurrentUser';

export default function SecuritySettings() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const inputClass =
    'w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-gray-900 outline-none transition hover:bg-white hover:border-indigo-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 font-medium';

  const labelClass = 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2';

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[28px] bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 p-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            No user logged in
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        'Password must be 8+ characters, with one uppercase letter, one number, and one symbol.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await axios.put(
        'http://localhost:5000/api/users/profile',
        { password },
        config
      );

      setMessage('Password successfully changed.');

      setTimeout(() => {
        navigate('/settings');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
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
      </div>

      <div className="relative z-10 px-4 py-8 sm:py-12">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-white font-bold text-3xl hover:text-indigo-200 transition-colors"
            >
              <img src={logo} alt="EventraCore Logo" className="w-10 h-10 object-contain" />
              <span className="tracking-tight">EventraCore</span>
            </Link>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-indigo-900/50 border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-800 px-8 py-10 text-white relative flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Security Settings
                </h1>
                <p className="mt-1 text-indigo-200 text-sm font-medium">
                  Update your account password
                </p>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} pr-20`}
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-sm hover:text-indigo-700"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Must be at least 8 characters long, containing 1 capital letter, 1 number, and 1 symbol.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Confirm New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {message}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`inline-flex items-center justify-center rounded-2xl px-6 py-3.5 font-bold text-white transition shadow-sm hover:shadow-md ${
                      submitting
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 transform hover:-translate-y-0.5'
                    }`}
                  >
                    {submitting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

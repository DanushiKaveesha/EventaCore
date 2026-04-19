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

      setMessage('Password successfully changed. A security confirmation has been sent to your notifications.');

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
    <div className="min-h-screen bg-[#312e81] flex flex-col items-center justify-center py-12 px-4 font-sans">
      
      <div className="w-full max-w-xl">
        {/* Header Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="bg-white p-1 rounded-lg shadow-sm">
            <img src={logo} alt="EventraCore Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-white font-bold text-3xl tracking-tight">EventraCore</span>
        </div>

        {/* Main Card */}
        <div className="bg-[#f8fafc] rounded-3xl shadow-xl overflow-hidden">
          
          {/* Purple Gradient Header */}
          <div className="bg-gradient-to-r from-[#6b21a8] to-[#5b21b6] px-8 py-10 flex items-center gap-6 text-white">
            <div className="w-16 h-16 rounded-2xl border border-white/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-1">
                Security Settings
              </h1>
              <p className="text-white/80 text-sm font-medium">
                Update your account password
              </p>
            </div>
          </div>

          {/* Form Body */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Hidden field for accessibility/pass managers */}
              <input type="text" name="email" value={currentUser?.email || ''} readOnly autoComplete="username" className="hidden" />

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full rounded-2xl border border-slate-200 bg-transparent px-5 py-4 text-slate-900 font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-sm"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Must be at least 8 characters long, containing 1 capital letter, 1 number, and 1 symbol.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-slate-200 bg-transparent px-5 py-4 text-slate-900 font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                  {message}
                </div>
              )}

              <div className="flex items-center justify-end gap-6 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-2 font-bold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`rounded-xl px-6 py-4 font-bold text-white transition-opacity ${
                    submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                  style={{ backgroundColor: submitting ? '' : '#4f46e5' }}
                >
                  {submitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Decorative Blur Orbs */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-48 -left-48 w-[40rem] h-[40rem] rounded-full bg-blue-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 -right-48 w-[40rem] h-[40rem] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Centered Header Logo */}
        <div className="text-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-4 text-white font-black text-4xl tracking-tight hover:opacity-90 transition-all drop-shadow-2xl"
          >
            <img src={logo} alt="EventraCore Logo" className="w-12 h-12 object-contain bg-white rounded-xl p-1 shadow-lg shadow-white/10" />
            <span className="tracking-tighter">EventraCore</span>
          </Link>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-black/30 border border-white/10 overflow-hidden transform transition-all hover:shadow-indigo-500/10">
          {/* Card Header with Gradient */}
          <div className="bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7] px-10 py-12 text-white relative">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/30 shadow-xl shadow-black/10">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none mb-2">
                  Security Settings
                </h1>
                <p className="text-indigo-100 text-base font-bold opacity-90">
                  Update your account password
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-10 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Added hidden field for browser password managers to identify the user */}
              <input
                type="text"
                name="email"
                value={currentUser?.email || ''}
                readOnly
                autoComplete="username"
                className="hidden"
              />

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">New Password</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-5 text-slate-900 font-bold outline-none transition-all group-hover:bg-white group-hover:border-indigo-200 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 placeholder:text-slate-300"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-600 font-black text-sm tracking-wide hover:text-indigo-700 transition-colors uppercase"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p className="mt-4 text-[11px] font-bold text-slate-400 leading-relaxed max-w-xs">
                    Must be at least 8 characters long, containing 1 capital letter, 1 number, and 1 symbol.
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-5 text-slate-900 font-bold outline-none transition-all hover:bg-white hover:border-indigo-200 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 placeholder:text-slate-300"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-sm font-bold text-red-600 flex items-center gap-4 animate-shake">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-5 text-sm font-bold text-emerald-700 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-10 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="flex items-center justify-center gap-3 font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest text-xs py-2 px-4 rounded-xl group"
                >
                  <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`min-w-[200px] rounded-2xl px-10 py-5 font-black text-sm uppercase tracking-[0.1em] text-white transition-all shadow-xl shadow-indigo-600/20 active:scale-95 ${
                    submitting
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-[#4f46e5] hover:bg-[#4338ca] hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-600/30'
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
  );
}

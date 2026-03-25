import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '../utils/getCurrentUser';

const Settings = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [deactivating, setDeactivating] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to deactivate your account permanently? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setDeactivating(true);
      setError('');

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      await axios.delete('http://localhost:5000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      localStorage.removeItem('userInfo');
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to deactivate your account.'
      );
    } finally {
      setDeactivating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[28px] bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 p-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            No user logged in
          </h2>
          <p className="text-gray-500 mb-6">
            Please log in to view your settings.
          </p>
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

      <div className="relative z-10 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium transition"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-[30px] shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-10 text-white flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                <Cog6ToothIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Account Settings
                </h1>
                <p className="mt-2 text-slate-300 text-lg">
                  Manage your preferences and security
                </p>
              </div>
            </div>

            <div className="p-8 md:p-10">
              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition hover:border-blue-200">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Edit Profile Info
                    </h3>
                    <p className="text-gray-500">
                      Update your personal information such as name and email address.
                    </p>
                  </div>
                  <Link
                    to="/edit-account"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition whitespace-nowrap"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                    Edit Profile
                  </Link>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition hover:border-indigo-200">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Security & Passwords
                    </h3>
                    <p className="text-gray-500">
                      Update your password to keep your account secure.
                    </p>
                  </div>
                  <Link
                    to="/security"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition whitespace-nowrap"
                  >
                    <ShieldCheckIcon className="w-5 h-5" />
                    Security
                  </Link>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition hover:border-gray-200">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Session Management
                    </h3>
                    <p className="text-gray-500">
                      Log out from your current device session securely.
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition whitespace-nowrap"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    Logout
                  </button>
                </div>

                <div className="mt-12 rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                        <h3 className="text-xl font-bold text-red-700">
                          Deactivate Account
                        </h3>
                      </div>
                      <p className="text-red-700/80 leading-relaxed max-w-xl">
                        This will permanently remove your account and all associated data from the system. 
                        This action cannot be undone. You will be logged out and redirected to the home page immediately.
                      </p>
                    </div>
                    <button
                      onClick={handleDeactivateAccount}
                      disabled={deactivating}
                      className={`inline-flex items-center justify-center rounded-2xl px-6 py-3.5 font-bold text-white transition whitespace-nowrap ${
                        deactivating
                          ? 'bg-red-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {deactivating ? 'Deactivating...' : 'Deactivate Account'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

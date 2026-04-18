import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { CalendarIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const inputClass =
    'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

  const labelClass = 'block text-sm font-semibold text-gray-800 mb-2';

  const handleRequestCode = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email }
      );
      setMessage(data.message || 'Reset code sent successfully.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/reset-password',
        { email, code, password }
      );

      setMessage(
        (data.message || 'Password reset successful.') +
          ' Redirecting to login...'
      );

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
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
              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <KeyIcon className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Forgot Password
              </h1>
              <p className="mt-3 text-gray-500 text-base">
                {step === 1
                  ? 'Enter your email to receive a password reset code.'
                  : 'Enter the code and your new password.'}
              </p>
            </div>

            <form
              onSubmit={step === 1 ? handleRequestCode : handleResetPassword}
              className="space-y-5"
            >
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  readOnly={step === 2}
                  className={`${inputClass} ${
                    step === 2 ? 'bg-gray-100' : ''
                  }`}
                />
              </div>

              {step === 2 && (
                <>
                  <div>
                    <label className={labelClass}>Verification Code</label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                      }
                      required
                      className={`${inputClass} text-center tracking-[0.35em]`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-2xl px-5 py-3.5 text-base font-bold text-white transition ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading
                  ? step === 1
                    ? 'Sending...'
                    : 'Resetting...'
                  : step === 1
                  ? 'Send Reset Code'
                  : 'Reset Password'}
              </button>

              {step === 2 && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleRequestCode}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Didn&apos;t receive a code? Resend it.
                  </button>
                </div>
              )}
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Back to{' '}
              <Link
                to="/login"
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
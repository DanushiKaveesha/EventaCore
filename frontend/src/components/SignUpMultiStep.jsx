import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  CalendarIcon,
  PhotoIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { GoogleLogin } from '@react-oauth/google';
import { setCurrentUser } from '../utils/getCurrentUser';

const srilankaData = {
  Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  Eastern: ['Ampara', 'Batticaloa', 'Trincomalee'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  Northern: ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  'North Western': ['Kurunegala', 'Puttalam'],
  Sabaragamuwa: ['Kegalle', 'Ratnapura'],
  Southern: ['Galle', 'Hambantota', 'Matara'],
  Uva: ['Badulla', 'Monaragala'],
  Western: ['Colombo', 'Gampaha', 'Kalutara'],
};

const provinces = Object.keys(srilankaData);

export default function SignUpMultiStep() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const todayDate = new Date();
  const maxDateStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    contactNumber: '',
    address: '',
    profileImageURL: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [addressParts, setAddressParts] = useState({
    province: '',
    city: '',
    zone: '',
    addressLine: '',
  });

  const [cities, setCities] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [tempVerificationData, setTempVerificationData] = useState(null);

  const [emailVerified, setEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const inputClass =
    'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

  const labelClass = 'block text-sm font-semibold text-gray-800 mb-2';

  const primaryButtonClass =
    'w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition';

  const secondaryButtonClass =
    'w-full inline-flex items-center justify-center rounded-2xl px-5 py-3.5 text-base font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 transition';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTextOnlyChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.replace(/[^a-zA-Z\s]/g, ''),
    }));
  };

  const handleNumbersOnlyChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...addressParts, [name]: value };

    if (name === 'province') {
      updated.city = '';
      setCities(srilankaData[value] || []);
    }

    setAddressParts(updated);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    processFile(e.target.files[0]);
  };

  const sendVerificationCode = async () => {
    setVerificationLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/send-email-verification',
        { email: formData.email }
      );

      setTempVerificationData(data.tempData);
      setMessage(data.message || 'Verification code sent successfully.');
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to send verification code.'
      );
      return false;
    } finally {
      setVerificationLoading(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setVerificationLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/verify-email-code',
        {
          email: formData.email,
          code: verificationCode,
          tempData: tempVerificationData,
        }
      );

      setEmailVerified(true);
      setMessage(data.message || 'Email verified successfully.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code.');
    } finally {
      setVerificationLoading(false);
    }
  };

  const nextFromStep1 = async () => {
    const requiredFields = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.dob,
      formData.contactNumber,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    const todayDateObj = new Date();
    const todayStr = `${todayDateObj.getFullYear()}-${String(todayDateObj.getMonth() + 1).padStart(2, '0')}-${String(todayDateObj.getDate()).padStart(2, '0')}`;
    if (formData.dob > todayStr) {
      setError('Date of birth cannot be in the future.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setError('Please enter a valid 10-digit phone number starting with 0.');
      return;
    }

    setError('');
    setMessage('');

    if (!emailVerified) {
      const success = await sendVerificationCode();

      if (success) {
        setStep(1.5);
      }
    } else {
      setStep(2);
    }
  };

  const nextFromStep2 = () => {
    const requiredAddressFields = [
      addressParts.province,
      addressParts.city,
      addressParts.zone,
      addressParts.addressLine,
    ];

    if (requiredAddressFields.some((field) => !field.trim())) {
      setError('Please fill in all address fields.');
      return;
    }

    const combinedAddress = [
      addressParts.addressLine,
      addressParts.zone,
      addressParts.city,
      addressParts.province,
    ]
      .filter(Boolean)
      .join(', ');

    setFormData((prev) => ({ ...prev, address: combinedAddress }));
    setError('');
    setMessage('');
    setStep(3);
  };

  const prevStep = () => {
    setError('');
    setMessage('');
    setPasswordError('');

    if (step === 1.5) setStep(1);
    else if (step === 2) setStep(1.5);
    else if (step === 3) setStep(2);
  };

  const validatePassword = () => {
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return false;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must be 8+ characters, with one uppercase letter, one number, and one symbol.'
      );
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setLoading(true);
    setError('');
    setMessage('');

    let uploadedImagePath = '';

    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('profileImage', imageFile);

      try {
        const { data } = await axios.post(
          'http://localhost:5000/api/upload',
          uploadFormData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        uploadedImagePath = data.filePath;
      } catch (uploadError) {
        setError('Image upload failed. Please try again.');
        setLoading(false);
        return;
      }
    }

    try {
      const registrationData = {
        ...formData,
        profileImageURL: uploadedImagePath,
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/auth/register',
        registrationData
      );

      setCurrentUser(data);
      setMessage('Account created successfully! Redirecting to dashboard...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (regError) {
      setError(regError.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/google',
        { credential: credentialResponse.credential }
      );

      setCurrentUser(data);
      setMessage('Account linked securely! Redirecting...');

      setTimeout(() => {
        if (!data.dob || !data.contactNumber || !data.address) {
          navigate('/complete-profile');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed.');
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
        <div className="w-full max-w-2xl">
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
                Create Account
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Join EventraCore
              </h1>
              <p className="mt-3 text-gray-500">
                Step {step === 1.5 ? '1.5' : step} of 3
              </p>
            </div>

            <div className="mb-8">
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
                  style={{
                    width:
                      step === 1
                        ? '33%'
                        : step === 1.5
                        ? '50%'
                        : step === 2
                        ? '66%'
                        : '100%',
                  }}
                ></div>
              </div>
            </div>

            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="mx-auto w-32 h-32 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-blue-400 transition"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-500">
                        <PhotoIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs font-medium">Upload Image</span>
                      </div>
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <div className="mb-6 flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500 font-bold uppercase tracking-wider text-[10px]">Fast Signup</span>
                    </div>
                  </div>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google authentication failed.')}
                    theme="filled_blue"
                    shape="pill"
                    text="signup_with"
                    size="large"
                  />
                  <div className="relative w-full pt-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-400 font-medium">Or manually register below</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleTextOnlyChange}
                      placeholder="First name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleTextOnlyChange}
                      placeholder="Last name"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={inputClass}
                      max={maxDateStr}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleNumbersOnlyChange}
                      placeholder="07XXXXXXXX"
                      className={inputClass}
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                    {message}
                  </div>
                )}

                <button
                  type="button"
                  onClick={nextFromStep1}
                  disabled={verificationLoading}
                  className={`mt-6 ${
                    verificationLoading
                      ? 'w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-bold text-white bg-gray-400 cursor-not-allowed'
                      : primaryButtonClass
                  }`}
                >
                  {verificationLoading ? 'Checking...' : 'Next'}
                  {!verificationLoading && <ArrowRightIcon className="w-5 h-5" />}
                </button>
              </div>
            )}

            {step === 1.5 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Verify Your Email
                  </h2>
                  <p className="mt-2 text-gray-500">
                    We sent a 6-digit code to
                  </p>
                  <p className="mt-1 font-bold text-blue-600">
                    {formData.email}
                  </p>
                </div>

                <div className="mb-6">
                  <label className={labelClass}>Verification Code</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, '').slice(0, 6)
                      )
                    }
                    placeholder="Enter 6-digit code"
                    className={`${inputClass} text-center tracking-[0.35em]`}
                  />
                </div>

                {error && (
                  <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                    {message}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={secondaryButtonClass}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={verifyEmailCode}
                    disabled={verificationLoading || verificationCode.length !== 6}
                    className={`w-full inline-flex items-center justify-center rounded-2xl px-5 py-3.5 text-base font-bold text-white transition ${
                      verificationLoading || verificationCode.length !== 6
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {verificationLoading ? 'Verifying...' : 'Verify Email'}
                  </button>
                </div>

                <div className="text-center mt-5">
                  <button
                    type="button"
                    onClick={sendVerificationCode}
                    disabled={verificationLoading}
                    className="text-blue-600 font-semibold hover:text-blue-700"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Province</label>
                  <select
                    name="province"
                    value={addressParts.province}
                    onChange={handleAddressChange}
                    className={inputClass}
                  >
                    <option value="">Select Province</option>
                    {provinces.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>City / District</label>
                  <select
                    name="city"
                    value={addressParts.city}
                    onChange={handleAddressChange}
                    disabled={!addressParts.province}
                    className={`${inputClass} ${
                      !addressParts.province ? 'bg-gray-100' : ''
                    }`}
                  >
                    <option value="">Select City / District</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Zone / Postal Code</label>
                  <input
                    type="text"
                    name="zone"
                    value={addressParts.zone}
                    onChange={handleAddressChange}
                    placeholder="Enter postal code"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Address Line</label>
                  <input
                    type="text"
                    name="addressLine"
                    value={addressParts.addressLine}
                    onChange={handleAddressChange}
                    placeholder="Enter address line"
                    className={inputClass}
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={secondaryButtonClass}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextFromStep2}
                    className={primaryButtonClass}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className={`${inputClass} pr-20`}
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

                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className={inputClass}
                  />
                </div>

                {passwordError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {passwordError}
                  </div>
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

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={secondaryButtonClass}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full inline-flex items-center justify-center rounded-2xl px-5 py-3.5 text-base font-bold text-white transition ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </button>
                </div>
              </form>
            )}

            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{' '}
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
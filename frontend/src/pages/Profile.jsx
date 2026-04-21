import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import {
  CalendarIcon,
  UserCircleIcon,
  IdentificationIcon,
  HomeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '../utils/getCurrentUser';

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

const Profile = () => {
  const localUser = getCurrentUser();

  const [user, setUser] = useState(localUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!userInfo?.token) {
          setError('No user logged in.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(
          'http://localhost:5000/api/users/profile',
          config
        );

        setUser(data);

        const updatedUserInfo = {
          ...userInfo,
          ...data,
        };

        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load profile information.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex items-center justify-center px-4">
        <div className="text-white text-lg font-semibold animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[28px] bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 p-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            No user logged in
          </h2>
          <p className="text-gray-500 mb-6">
            Please log in to view your profile.
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

  const profileImage =
    user.profileImageURL && user.profileImageURL.startsWith('/uploads')
      ? `http://localhost:5000${user.profileImageURL}`
      : user.profileImageURL || '';

  const parseAddress = (addressStr) => {
    if (!addressStr) return { province: '', city: '', zone: '', addressLine: '' };

    const parts = addressStr.split(',').map((part) => part.trim());
    let province = '';
    let provinceIndex = -1;

    for (let i = parts.length - 1; i >= 0; i--) {
      if (provinces.includes(parts[i])) {
        province = parts[i];
        provinceIndex = i;
        break;
      }
    }

    if (province) {
      let city = '';
      let cityIndex = -1;

      if (provinceIndex > 0) {
        for (let i = provinceIndex - 1; i >= 0; i--) {
          if (srilankaData[province] && srilankaData[province].includes(parts[i])) {
            city = parts[i];
            cityIndex = i;
            break;
          }
        }
      }

      let zone = '';
      if (city && cityIndex > 0) {
        zone = parts[cityIndex - 1];
      } else if (provinceIndex > 0) {
        zone = parts[provinceIndex - 1];
      }

      let addressLine = '';
      if (zone) {
        const zoneIndex = parts.indexOf(zone);
        if (zoneIndex > 0) addressLine = parts.slice(0, zoneIndex).join(', ');
      } else if (city) {
        const ci = parts.indexOf(city);
        if (ci > 0) addressLine = parts.slice(0, ci).join(', ');
      } else if (provinceIndex > 0) {
        addressLine = parts.slice(0, provinceIndex).join(', ');
      }

      return { province, city, zone, addressLine };
    }

    return { province: '', city: '', zone: '', addressLine: addressStr };
  };

  const addressDetails = user ? parseAddress(user.address) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Background Ornaments */}
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

      <div className="relative z-10 px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-white font-bold text-3xl hover:text-blue-200 transition-colors"
            >
              <img src={logo} alt="EventraCore Logo" className="w-10 h-10 object-contain" />
              <span className="tracking-tight">EventraCore</span>
            </Link>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-blue-900/50 border border-white/20 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white overflow-hidden flex items-center justify-center shadow-lg flex-shrink-0">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-20 h-20 text-white/80" />
                  )}
                </div>

                <div>
                  <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                    {user.role === 'admin' ? 'Administrator Profile' : 'User Profile'}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
                    {user.firstName || user.username || 'User'}{' '}
                    {user.lastName || ''}
                  </h1>
                  <p className="mt-3 text-blue-100 text-lg font-medium">
                    This is your digital identity on EventraCore.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              {error && (
                <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                  {error}
                </div>
              )}

              {/* Personal Information */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <IdentificationIcon className="w-6 h-6 text-blue-600" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">First Name</p>
                    <p className="text-gray-900 font-semibold text-lg">{user.firstName || 'Not provided'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Last Name</p>
                    <p className="text-gray-900 font-semibold text-lg">{user.lastName || 'Not provided'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</p>
                    <p className="text-gray-900 font-semibold text-lg">
                      {user.dob ? new Date(user.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Number</p>
                    <p className="text-gray-900 font-semibold text-lg">{user.contactNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Location & Address */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <MapPinIcon className="w-6 h-6 text-blue-600" />
                  Location Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 sm:col-span-2 lg:col-span-3 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address Line</p>
                    <p className="text-gray-900 font-semibold text-lg">{addressDetails?.addressLine || 'Not provided'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Zone / Postal Code</p>
                    <p className="text-gray-900 font-semibold text-lg">{addressDetails?.zone || 'Not provided'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">City / District</p>
                    <p className="text-gray-900 font-semibold text-lg">{addressDetails?.city || 'Not provided'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Province</p>
                    <p className="text-gray-900 font-semibold text-lg">{addressDetails?.province || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <UserCircleIcon className="w-6 h-6 text-blue-600" />
                  Account Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Username</p>
                    <p className="text-gray-900 font-semibold text-lg">{user.username || 'Not provided'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-gray-900 font-semibold text-lg">{user.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 transition transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                >
                  <HomeIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
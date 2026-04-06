import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  CalendarIcon,
  PhotoIcon,
  ArrowLeftIcon,
  IdentificationIcon,
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

export default function EditAccount() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    contactNumber: '',
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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const inputClass =
    'w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-gray-900 outline-none transition hover:bg-white hover:border-blue-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium';

  const labelClass = 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const { data } = await axios.get(
          'http://localhost:5000/api/users/profile',
          config
        );

        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          contactNumber: data.contactNumber || '',
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
        });

        setImagePreview(
          data.profileImageURL ? `http://localhost:5000${data.profileImageURL}` : ''
        );

        if (data.address) {
          const parts = data.address.split(',').map((part) => part.trim());

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
                if (srilankaData[province].includes(parts[i])) {
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
              addressLine = parts.slice(0, zoneIndex).join(', ');
            } else if (city) {
              const ci = parts.indexOf(city);
              addressLine = parts.slice(0, ci).join(', ');
            } else {
              addressLine = parts.slice(0, provinceIndex).join(', ');
            }

            setAddressParts({
              addressLine,
              zone,
              city,
              province,
            });

            setCities(srilankaData[province] || []);
          } else {
            setAddressParts({
              addressLine: data.address,
              zone: '',
              city: '',
              province: '',
            });
          }
        }
      } catch (err) {
        setError('Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleTextOnlyChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.replace(/[^a-zA-Z\s]/g, ''),
    });
  };

  const handleNumbersOnlyChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.replace(/[^0-9]/g, '').slice(0, 10),
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    if (name === 'province') {
      setCities(srilankaData[value] || []);
      setAddressParts((prev) => ({
        ...prev,
        province: value,
        city: '',
      }));
      return;
    }

    setAddressParts((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!formData.firstName?.trim()) {
      setError('First name is required.');
      return;
    }
    if (!formData.lastName?.trim()) {
      setError('Last name is required.');
      return;
    }
    if (!formData.dob) {
      setError('Date of birth is required.');
      return;
    }

    const todayDate = new Date();
    const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
    if (formData.dob > todayStr) {
      setError('Date of birth cannot be in the future.');
      return;
    }

    if (!formData.contactNumber?.trim()) {
      setError('Contact number is required.');
      return;
    }
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setError('Please enter a valid 10-digit phone number starting with 0.');
      return;
    }
    if (!addressParts.province) {
      setError('Province is required.');
      return;
    }
    if (!addressParts.city) {
      setError('City / District is required.');
      return;
    }
    if (!addressParts.zone?.trim()) {
      setError('Zone / Postal Code is required.');
      return;
    }
    if (!addressParts.addressLine?.trim()) {
      setError('Address line is required.');
      return;
    }

    setSubmitting(true);

    let uploadedImagePath = '';
    let finalData = { ...formData };

    if (imageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('profileImage', imageFile);

      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const uploadConfig = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.post(
          'http://localhost:5000/api/upload',
          uploadFormData,
          uploadConfig
        );

        uploadedImagePath = data.filePath;
        finalData.profileImageURL = uploadedImagePath;
      } catch (uploadError) {
        setError('Image upload failed. Please try again.');
        setSubmitting(false);
        return;
      }
    }

    finalData.address = [
      addressParts.addressLine,
      addressParts.zone,
      addressParts.city,
      addressParts.province,
    ]
      .filter(Boolean)
      .join(', ');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile',
        finalData,
        config
      );

      const updatedUserInfo = {
        ...userInfo,
        ...data,
        ...finalData,
      };

      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setMessage('Profile updated successfully.');

      setTimeout(() => {
        navigate(isAdmin ? '/admin' : '/settings');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const todayDate = new Date();
  const maxDateStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex items-center justify-center px-4 text-white text-lg font-semibold animate-pulse">
        Loading account details...
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

          <div className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-blue-900/50 border border-white/20 p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 mb-4 shadow-sm">
                Edit Profile
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                Update Your Profile
              </h1>
              <p className="mt-3 text-gray-500 font-medium text-lg">
                Ensure your EventraCore identity is up to date
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="group relative w-36 h-36 rounded-full border-4 border-white shadow-lg bg-gray-50 flex items-center justify-center overflow-hidden hover:border-blue-200 transition-all transform hover:-translate-y-1"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                      <PhotoIcon className="w-10 h-10 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wide">Upload Photo</span>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold uppercase tracking-wide">Change</span>
                    </div>
                  )}
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="mt-4 text-sm text-gray-400 font-medium">Click to change profile picture</p>
              </div>

              <div className="border border-gray-100 rounded-3xl p-6 sm:p-8 bg-gray-50/30">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <IdentificationIcon className="w-6 h-6 text-blue-600" />
                  Personal Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleTextOnlyChange}
                      className={inputClass}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleTextOnlyChange}
                      className={inputClass}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className={inputClass}
                      placeholder="0xxxxxxxxx"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-3xl p-6 sm:p-8 bg-gray-50/30">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 text-blue-600" />
                  Location Specifics
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          !addressParts.province ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>
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

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate(isAdmin ? '/admin' : '/settings')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`inline-flex items-center justify-center rounded-2xl px-8 py-3.5 font-bold text-white transition shadow-sm hover:shadow-md ${
                    submitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5'
                  }`}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
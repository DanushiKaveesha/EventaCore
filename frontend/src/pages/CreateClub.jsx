import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClub } from '../services/clubService';
import {
  XMarkIcon,
  PhotoIcon,
  BuildingOfficeIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  DocumentTextIcon,
  TagIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
  CalendarIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UsersIcon,
  ChevronRightIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  EyeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const CreateClub = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    contact_information: '',
    president: '',
    email: '',
    phone: '',
    establishedYear: '',
    meetingDays: '',
    campus: '',
    building: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});  // SLIIT Campus Locations & Suggestions
  const sliitCampuses = [
    { 
      id: 'malabe', 
      name: 'SLIIT Malabe Campus', 
      address: 'New Kandy Rd, Malabe',
      suggestions: ['Main Building', 'Computing Building', 'Business Building', 'Engineering Building', 'FOSS Lab', 'Aero Lab', 'Library']
    },
    { 
      id: 'metro', 
      name: 'SLIIT Metro Campus', 
      address: 'Colombo 03',
      suggestions: ['Main Hall', 'Computer Lab 1', 'Auditorium', 'Student Lounge']
    },
    { 
      id: 'kandy', 
      name: 'SLIIT Kandy Campus', 
      address: 'Kandy',
      suggestions: ['Academic Block', 'IT Center', 'Admin Office']
    }
  ];

  const categories = [
    { value: 'Academic', label: 'Academic', icon: '📚', color: 'bg-blue-100 text-blue-700', gradient: 'from-blue-500 to-blue-600' },
    { value: 'Sports', label: 'Sports', icon: '⚽', color: 'bg-green-100 text-green-700', gradient: 'from-green-500 to-green-600' },
    { value: 'Arts', label: 'Arts', icon: '🎨', color: 'bg-pink-100 text-pink-700', gradient: 'from-pink-500 to-pink-600' },
    { value: 'Community Service', label: 'Community Service', icon: '🤝', color: 'bg-orange-100 text-orange-700', gradient: 'from-orange-500 to-orange-600' },
    { value: 'Technology', label: 'Technology', icon: '💻', color: 'bg-purple-100 text-purple-700', gradient: 'from-purple-500 to-purple-600' },
    { value: 'Other', label: 'Other', icon: '🎯', color: 'bg-gray-100 text-gray-700', gradient: 'from-gray-500 to-gray-600' }
  ];

  useEffect(() => {
    // Auto-detect if user is on SLIIT campus
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const getDistance = (lat1, lon1, lat2, lon2) => {
          const R = 6371;
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        const nearSliit = sliitCampuses.some(campus => {
          const distance = getDistance(userLat, userLng, campus.lat, campus.lng);
          return distance < 1; // Within 1km
        });

        if (nearSliit) {
          setMessage({ type: 'info', text: '🎓 You are near SLIIT Campus! You can easily select your location below.' });
        }
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validations
    if (name === 'phone') {
      if (value && !/^\d+$/.test(value)) {
        setErrors(prev => ({ ...prev, phone: 'Only numbers are allowed' }));
      } else {
        setErrors(prev => { const newErr = { ...prev }; delete newErr.phone; return newErr; });
      }
    }
    
    if (name === 'email') {
      if (value && !value.endsWith('@gmail.com')) {
        setErrors(prev => ({ ...prev, email: 'Email must strictly be a @gmail.com address' }));
      } else {
        setErrors(prev => { const newErr = { ...prev }; delete newErr.email; return newErr; });
      }
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      setMessage({ type: 'error', text: 'Please resolve the validation errors before submitting' });
      return;
    }

    if (formData.email && !formData.email.endsWith('@gmail.com')) {
      setErrors(prev => ({ ...prev, email: 'Email must strictly be a @gmail.com address' }));
      setMessage({ type: 'error', text: 'Please resolve the validation errors before submitting' });
      return;
    }

    if (formData.phone && !/^\d+$/.test(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: 'Only numbers are allowed' }));
      setMessage({ type: 'error', text: 'Please resolve the validation errors before submitting' });
      return;
    }

    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Please enter club name' });
      return;
    }

    if (!formData.location) {
      setMessage({ type: 'error', text: 'Please select or enter a location' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'socialMedia') {
        submitData.append('socialMedia', JSON.stringify(formData.socialMedia));
      } else if (key === 'phone' || key === 'email' || key === 'campus' || key === 'building') {
        // Skip individual fields that are combined or internal
        return;
      } else if (formData[key]) {
        submitData.append(key, formData[key]);
      }
    });

    // Combine contact information
    const contactInfo = `Email: ${formData.email || 'N/A'}, Phone: ${formData.phone || 'N/A'}`;
    submitData.append('contact_information', contactInfo);



    if (image) submitData.append('image', image);

    try {
      await createClub(submitData);
      setMessage({ type: 'success', text: 'Club created successfully! 🎉 Redirecting...' });
      setTimeout(() => navigate('/admin/clubs'), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (value) => {
    const category = categories.find(c => c.value === value);
    return category?.icon || '🎯';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Animation */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl mb-4 relative group">
            <SparklesIcon className="w-10 h-10 text-white animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Create New Club
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Launch your club and connect with like-minded students at SLIIT
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Tab Navigation */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex space-x-2 overflow-x-auto">
            {[
              { id: 'basic', label: 'Basic Info', icon: BuildingOfficeIcon },
              { id: 'location', label: 'Location', icon: MapPinIcon },
              { id: 'social', label: 'Social Media', icon: GlobeAltIcon },
              { id: 'media', label: 'Media', icon: PhotoIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-md border border-gray-200'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 lg:p-8">
            {/* Message Alert */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-start space-x-3 animate-slideIn ${message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : message.type === 'info'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-red-50 border border-red-200'
                }`}>
                {message.type === 'success' ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                ) : message.type === 'info' ? (
                  <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                ) : (
                  <ExclamationCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <p className={`text-sm ${message.type === 'success' ? 'text-green-800' :
                  message.type === 'info' ? 'text-blue-800' : 'text-red-800'
                  }`}>
                  {message.text}
                </p>
              </div>
            )}

            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-5">
                    {/* Club Name */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <BuildingOfficeIcon className="inline w-4 h-4 mr-1 text-blue-500" />
                        Club Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none
                          ${focusedField === 'name'
                            ? 'border-blue-500 ring-4 ring-blue-100 transform scale-[1.01]'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                        placeholder="e.g., Leo Club, Tech Society"
                      />
                    </div>

                    {/* President */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <UserIcon className="inline w-4 h-4 mr-1 text-blue-500" />
                        President / Leader <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="president"
                        required
                        value={formData.president}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="Full name of the club president"
                      />
                    </div>

                    {/* Established Year */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <CalendarIcon className="inline w-4 h-4 mr-1 text-blue-500" />
                        Established Year
                      </label>
                      <input
                        type="number"
                        name="establishedYear"
                        value={formData.establishedYear}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="e.g., 2024"
                        min="1900"
                        max="2024"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <TagIcon className="inline w-4 h-4 mr-1 text-blue-500" />
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${formData.category === cat.value
                              ? `${cat.color} border-current shadow-md scale-[1.02]`
                              : 'border-gray-100 bg-white hover:border-gray-200 text-gray-600'
                              }`}
                          >
                            <span className="text-2xl">{cat.icon}</span>
                            <span className="font-bold text-sm">{cat.label}</span>
                            {formData.category === cat.value && (
                              <CheckCircleIcon className="w-5 h-5 ml-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Meeting Days */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <CalendarIcon className="inline w-4 h-4 mr-1 text-blue-500" />
                        Regular Meeting Days
                      </label>
                      <input
                        type="text"
                        name="meetingDays"
                        value={formData.meetingDays}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="e.g., Every Wednesday, 3:00 PM"
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <PhoneIcon className="inline w-4 h-4 mr-1 text-blue-500" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${errors.phone ? 'border-red-500 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'}`}
                          placeholder="e.g. 0712345678"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-bold animate-fadeIn">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <BuildingOfficeIcon className="inline w-4 h-4 mr-1 text-blue-500" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${errors.email ? 'border-red-500 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'}`}
                          placeholder="club@gmail.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1.5 font-bold animate-fadeIn">{errors.email}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DocumentTextIcon className="inline w-4 h-4 mr-1 text-blue-500" />
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                    placeholder="Describe what this club is about, its mission, activities, and benefits for members..."
                  />
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>{formData.description.length} characters</span>
                    <span>Minimum 50 characters recommended</span>
                  </div>
                </div>
              </div>
            )}

            {/* Location Selection Tab */}
            {activeTab === 'location' && (
              <div className="animate-fadeIn max-w-4xl mx-auto py-4">
                {/* Campus Selection */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl border border-blue-100 shadow-sm mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg text-white">
                      <BuildingOfficeIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Select Your Campus</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {sliitCampuses.map((campus) => (
                      <button
                        key={campus.id}
                        type="button"
                        onClick={() => {
                          setFormData(prev => {
                            const newBuilding = prev.campus === campus.name ? prev.building : '';
                            return { 
                              ...prev, 
                              campus: campus.name,
                              building: newBuilding,
                              location: newBuilding ? `${campus.name} | ${newBuilding}` : campus.name
                            };
                          });
                        }}
                        className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden
                          ${formData.campus === campus.name
                            ? 'border-blue-600 bg-white shadow-xl scale-[1.02]'
                            : 'bg-white/50 border-transparent hover:border-blue-200 hover:bg-white hover:scale-[1.01]'
                          }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors
                          ${formData.campus === campus.name ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                          <AcademicCapIcon className="w-6 h-6" />
                        </div>
                        <p className={`font-bold leading-tight mb-1 text-base ${formData.campus === campus.name ? 'text-blue-900' : 'text-gray-800'}`}>
                          {campus.name}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">{campus.address}</p>
                        
                        {formData.campus === campus.name && (
                          <div className="absolute top-4 right-4 animate-scaleIn">
                            <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Location Search / Suggestions */}
                {formData.campus && (
                  <div className="animate-fadeInUp space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-purple-600 p-2.5 rounded-xl shadow-lg text-white">
                          <MapPinIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Where in {formData.campus.split(' ')[1]}?</h3>
                      </div>

                      {/* Suggestions Grid */}
                      <div className="mb-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Quick Suggestions</p>
                        <div className="flex flex-wrap gap-2">
                          {sliitCampuses.find(c => c.name === formData.campus)?.suggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  building: suggestion,
                                  location: `${prev.campus} | ${suggestion}`
                                }));
                              }}
                              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 
                                ${formData.building === suggestion
                                  ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-50'
                                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                                }`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Input */}
                      <div className="relative group">
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                          Refined Location / Room Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="building"
                            value={formData.building}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                building: val,
                                location: val ? `${prev.campus} | ${val}` : prev.campus
                              }));
                            }}
                            className="block w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 font-bold placeholder-gray-400"
                            placeholder="e.g., Main Building, Room 301, FOSS Lab..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview Selection */}
                    <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-[80px] opacity-20 -mr-10 -mt-10"></div>
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Final Club Location</p>
                          <h4 className="text-2xl font-black text-white tracking-tight">
                            {formData.location || 'Not Selected Yet'}
                          </h4>
                        </div>
                        <div className="hidden sm:block">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                            <SparklesIcon className="w-6 h-6 text-blue-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!formData.campus && (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <MapPinIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Please select a campus first to continue</p>
                  </div>
                )}
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="animate-fadeIn space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="mr-2">📘</span> Facebook
                    </label>
                    <input
                      type="url"
                      name="socialMedia.facebook"
                      value={formData.socialMedia.facebook}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      placeholder="https://facebook.com/yourclub"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="mr-2">📸</span> Instagram
                    </label>
                    <input
                      type="url"
                      name="socialMedia.instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      placeholder="https://instagram.com/yourclub"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="mr-2">🔗</span> LinkedIn
                    </label>
                    <input
                      type="url"
                      name="socialMedia.linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      placeholder="https://linkedin.com/company/yourclub"
                    />
                  </div>
                </div>

                {/* Preview Card */}
                <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-3">Social Media Preview</h3>
                  <div className="flex space-x-4">
                    {formData.socialMedia.facebook && (
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">📘</div>
                    )}
                    {formData.socialMedia.instagram && (
                      <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white text-xl">📸</div>
                    )}
                    {formData.socialMedia.linkedin && (
                      <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white text-xl">🔗</div>
                    )}
                    {!formData.socialMedia.facebook && !formData.socialMedia.instagram && !formData.socialMedia.linkedin && (
                      <p className="text-gray-500 text-sm">No social media links added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="animate-fadeIn">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-all bg-gradient-to-br from-gray-50 to-white">
                  <input
                    type="file"
                    id="club-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {preview ? (
                    <div className="relative inline-block">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full h-48 rounded-xl object-cover shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => { setImage(null); setPreview(null); }}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="club-image" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg animate-pulse">
                          <CloudArrowUpIcon className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">Click to upload club logo</p>
                          <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      </div>
                    </label>
                  )}
                </div>

                {/* Image Tips */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Image Guidelines</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Use a clear, high-quality logo or image that represents your club.
                        Recommended size: 500x500 pixels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/clubs')}
                className="px-6 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <div className="flex space-x-3">
                {activeTab !== 'media' && (
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = ['basic', 'location', 'social', 'media'];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl text-blue-600 border-2 border-blue-600 hover:bg-blue-50 font-medium transition-all duration-200"
                  >
                    Next <ChevronRightIcon className="inline w-4 h-4 ml-1" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 flex items-center space-x-2
                    ${loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Creating Club...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      <span>Create Club</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <UsersIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">50+</p>
            <p className="text-xs text-gray-500">Active Clubs</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <AcademicCapIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">1000+</p>
            <p className="text-xs text-gray-500">Members</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <CalendarIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">30+</p>
            <p className="text-xs text-gray-500">Events/Year</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <ChartBarIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">4.8</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClub;
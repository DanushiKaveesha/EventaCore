import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClubById, updateClub } from '../services/clubService';
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
  ArrowPathIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  PencilSquareIcon,
  InformationCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const EditClub = () => {
  const { id } = useParams();
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
    socialMedia: { facebook: '', instagram: '', linkedin: '' },
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [focusedField, setFocusedField] = useState(null);

  const sliitCampuses = [
    {
      id: 'malabe',
      name: 'SLIIT Malabe Campus',
      address: 'New Kandy Rd, Malabe',
      suggestions: ['Main Building', 'Computing Building', 'Business Building', 'Engineering Building', 'FOSS Lab', 'Aero Lab', 'Library'],
    },
    {
      id: 'metro',
      name: 'SLIIT Metro Campus',
      address: 'Colombo 03',
      suggestions: ['Main Hall', 'Computer Lab 1', 'Auditorium', 'Student Lounge'],
    },
    {
      id: 'kandy',
      name: 'SLIIT Kandy Campus',
      address: 'Kandy',
      suggestions: ['Academic Block', 'IT Center', 'Admin Office'],
    },
  ];

  const categories = [
    { value: 'Academic', label: 'Academic', icon: '📚', color: 'bg-blue-100 text-blue-700' },
    { value: 'Sports', label: 'Sports', icon: '⚽', color: 'bg-green-100 text-green-700' },
    { value: 'Arts', label: 'Arts', icon: '🎨', color: 'bg-pink-100 text-pink-700' },
    { value: 'Community Service', label: 'Community Service', icon: '🤝', color: 'bg-orange-100 text-orange-700' },
    { value: 'Technology', label: 'Technology', icon: '💻', color: 'bg-purple-100 text-purple-700' },
    { value: 'Other', label: 'Other', icon: '🎯', color: 'bg-gray-100 text-gray-700' },
  ];

  useEffect(() => {
    fetchClubData();
  }, [id]);

  const fetchClubData = async () => {
    try {
      const club = await getClubById(id);

      // Parse contact_information back to email/phone
      const contactInfo = club.contact_information || '';
      const emailMatch = contactInfo.match(/Email:\s*([^,]+)/);
      const phoneMatch = contactInfo.match(/Phone:\s*([^,]+)/);
      const email = emailMatch ? emailMatch[1].trim() : contactInfo;
      const phone = phoneMatch ? phoneMatch[1].trim() : '';

      // Parse location back to campus/building
      const locationStr = club.location || '';
      const locationParts = locationStr.split(' | ');
      const campus = locationParts[0] || '';
      const building = locationParts[1] || '';

      setFormData({
        name: club.name || '',
        description: club.description || '',
        category: club.category || '',
        location: locationStr,
        contact_information: contactInfo,
        president: club.president || '',
        email,
        phone,
        establishedYear: '',
        meetingDays: '',
        campus,
        building,
        socialMedia: { facebook: '', instagram: '', linkedin: '' },
      });

      if (club.image) {
        const imagePath = club.image.startsWith('http')
          ? club.image
          : `http://localhost:5000/${club.image.replace(/\\/g, '/')}`;
        setPreview(imagePath);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error loading club data: ' + err.toString() });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
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
    setSubmitting(true);
    setMessage(null);

    const contactInfo = `Email: ${formData.email || 'N/A'}, Phone: ${formData.phone || 'N/A'}`;
    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      contact_information: contactInfo,
      president: formData.president,
    };

    let submitData;
    if (image) {
      submitData = new FormData();
      Object.entries(payload).forEach(([k, v]) => submitData.append(k, v));
      submitData.append('image', image);
    } else {
      submitData = payload;
    }

    try {
      await updateClub(id, submitData);
      setMessage({ type: 'success', text: 'Club updated successfully! 🎉 Redirecting...' });
      setTimeout(() => navigate('/admin/clubs'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.toString() });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl mb-4 relative group">
            <PencilSquareIcon className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Edit Club
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Update the details of <span className="font-bold text-gray-800">{formData.name}</span>
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Tab Navigation */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex space-x-2 overflow-x-auto">
            {[
              { id: 'basic', label: 'Basic Info', icon: BuildingOfficeIcon },
              { id: 'location', label: 'Location', icon: MapPinIcon },
              { id: 'social', label: 'Social Media', icon: GlobeAltIcon },
              { id: 'media', label: 'Media', icon: PhotoIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
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
              <div
                className={`mb-6 p-4 rounded-xl flex items-start space-x-3 ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : message.type === 'info'
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                ) : message.type === 'info' ? (
                  <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                ) : (
                  <ExclamationCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <p
                  className={`text-sm ${
                    message.type === 'success'
                      ? 'text-green-800'
                      : message.type === 'info'
                      ? 'text-blue-800'
                      : 'text-red-800'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}

            {/* ── Basic Info Tab ── */}
            {activeTab === 'basic' && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-5">
                    {/* Club Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <BuildingOfficeIcon className="inline w-4 h-4 mr-1 text-amber-500" />
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
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
                          focusedField === 'name'
                            ? 'border-blue-500 ring-4 ring-blue-100 scale-[1.01]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="e.g., Leo Club, Tech Society"
                      />
                    </div>

                    {/* President */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <UserIcon className="inline w-4 h-4 mr-1 text-amber-500" />
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

                    {/* Meeting Days */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <CalendarIcon className="inline w-4 h-4 mr-1 text-amber-500" />
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

                    {/* Contact: phone + email */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <PhoneIcon className="inline w-4 h-4 mr-1 text-amber-500" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                          placeholder="+94 XX XXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <BuildingOfficeIcon className="inline w-4 h-4 mr-1 text-amber-500" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                          placeholder="club@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column — Category */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <TagIcon className="inline w-4 h-4 mr-1 text-amber-500" />
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, category: cat.value }))}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                              formData.category === cat.value
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
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DocumentTextIcon className="inline w-4 h-4 mr-1 text-amber-500" />
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                    placeholder="Describe what this club is about, its mission, activities..."
                  />
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>{formData.description.length} characters</span>
                    <span>Minimum 50 characters recommended</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Location Tab ── */}
            {activeTab === 'location' && (
              <div className="animate-fadeIn max-w-4xl mx-auto py-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl border border-blue-100 shadow-sm mb-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg text-white">
                      <BuildingOfficeIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Select Campus</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {sliitCampuses.map((campus) => (
                      <button
                        key={campus.id}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            campus: campus.name,
                            building: prev.campus === campus.name ? prev.building : '',
                            location:
                              prev.campus === campus.name && prev.building
                                ? `${campus.name} | ${prev.building}`
                                : campus.name,
                          }));
                        }}
                        className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                          formData.campus === campus.name
                            ? 'border-blue-500 bg-white shadow-xl scale-[1.02]'
                            : 'bg-white/50 border-transparent hover:border-blue-200 hover:bg-white hover:scale-[1.01]'
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                            formData.campus === campus.name ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          <AcademicCapIcon className="w-6 h-6" />
                        </div>
                        <p className={`font-bold leading-tight mb-1 text-base ${formData.campus === campus.name ? 'text-blue-900' : 'text-gray-800'}`}>
                          {campus.name}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">{campus.address}</p>
                        {formData.campus === campus.name && (
                          <div className="absolute top-4 right-4">
                            <CheckCircleIcon className="w-6 h-6 text-amber-500" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.campus && (
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-purple-600 p-2.5 rounded-xl shadow-lg text-white">
                        <MapPinIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Where in {formData.campus.split(' ')[1]}?
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sliitCampuses.find((c) => c.name === formData.campus)?.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              building: s,
                              location: `${prev.campus} | ${s}`,
                            }))
                          }
                          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            formData.building === s
                              ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-50'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                        Refined Location / Room Number
                      </label>
                      <input
                        type="text"
                        name="building"
                        value={formData.building}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            building: val,
                            location: val ? `${prev.campus} | ${val}` : prev.campus,
                          }));
                        }}
                        className="block w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 font-bold placeholder-gray-400"
                        placeholder="e.g., Main Building, Room 301..."
                      />
                    </div>

                    <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl shadow-2xl">
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Final Club Location</p>
                      <h4 className="text-2xl font-black text-white tracking-tight">
                        {formData.location || 'Not Selected Yet'}
                      </h4>
                    </div>
                  </div>
                )}

                {!formData.campus && (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <MapPinIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Select a campus above to set the location</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Social Media Tab ── */}
            {activeTab === 'social' && (
              <div className="animate-fadeIn space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'Facebook', icon: '📘', key: 'socialMedia.facebook', placeholder: 'https://facebook.com/yourclub' },
                    { label: 'Instagram', icon: '📸', key: 'socialMedia.instagram', placeholder: 'https://instagram.com/yourclub' },
                    { label: 'LinkedIn', icon: '🔗', key: 'socialMedia.linkedin', placeholder: 'https://linkedin.com/company/yourclub' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="mr-2">{field.icon}</span>{field.label}
                      </label>
                      <input
                        type="url"
                        name={field.key}
                        value={field.key.split('.').reduce((o, k) => o?.[k], formData)}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Media Tab ── */}
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
                          <p className="text-gray-700 font-medium">Click to upload a new club logo</p>
                          <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      </div>
                    </label>
                  )}
                  {preview && (
                    <div className="mt-4">
                      <label
                        htmlFor="club-image"
                        className="cursor-pointer text-sm font-bold text-blue-600 hover:text-amber-700 transition-colors"
                      >
                        Change Image
                      </label>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Image Guidelines</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Use a clear, high-quality logo. Recommended size: 500×500 px. Leave blank to keep the existing image.
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
                onClick={() => navigate('/admin/clubs')}
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
                      const idx = tabs.indexOf(activeTab);
                      if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
                    }}
                    className="px-6 py-2.5 rounded-xl text-blue-600 border-2 border-blue-500 hover:bg-blue-50 font-medium transition-all duration-200"
                  >
                    Next <ChevronRightIcon className="inline w-4 h-4 ml-1" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-8 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 flex items-center space-x-2 ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {submitting ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      <span>Update Club</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClub;

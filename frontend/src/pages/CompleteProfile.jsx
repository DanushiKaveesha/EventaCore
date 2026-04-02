import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { getCurrentUser, setCurrentUser } from '../utils/getCurrentUser';

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

export default function CompleteProfile() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const todayDate = new Date();
  const maxDateStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    // If no user or they already have everything filled out, send them to dashboard
    if (!user) {
      navigate('/login');
    } else if (user.dob && user.contactNumber && user.address) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dob || !formData.contactNumber || !addressParts.province || !addressParts.city || !addressParts.addressLine) {
      setError('Please fill in all required fields.');
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setError('Please enter a valid 10-digit phone number starting with 0.');
      return;
    }

    const combinedAddress = [
      addressParts.addressLine,
      addressParts.zone,
      addressParts.city,
      addressParts.province,
    ].filter(Boolean).join(', ');

    try {
      setLoading(true);
      setError('');
      
      const updateData = {
        dob: formData.dob,
        contactNumber: formData.contactNumber,
        address: combinedAddress
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/users/profile`,
        updateData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      data.token = user.token; // Keep their existing token
      data.serverSessionId = user.serverSessionId;

      setCurrentUser(data);
      setMessage('Profile completed! Redirecting...');
      
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 text-white font-bold text-3xl">
             <img src={logo} alt="EventraCore Logo" className="w-10 h-10 object-contain" />
             <span className="tracking-tight">EventraCore</span>
          </Link>
        </div>
        
        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] shadow-2xl p-8">
          <div className="text-center mb-8">
             <h1 className="text-3xl font-extrabold text-gray-900">Complete Your Profile</h1>
             <p className="mt-2 text-gray-600">You signed in with Google. Just a few more details before we can get you started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  max={maxDateStr}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleNumbersOnlyChange}
                  placeholder="07XXXXXXXX"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider">Address Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Province</label>
                  <select
                    name="province"
                    value={addressParts.province}
                    onChange={handleAddressChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select Province</option>
                    {provinces.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">City</label>
                  <select
                    name="city"
                    value={addressParts.city}
                    onChange={handleAddressChange}
                    disabled={!addressParts.province}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-50"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Zone/Code</label>
                  <input
                    type="text"
                    name="zone"
                    value={addressParts.zone}
                    onChange={handleAddressChange}
                    placeholder="E.g. 10400"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Address Line</label>
                  <input
                    type="text"
                    name="addressLine"
                    value={addressParts.addressLine}
                    onChange={handleAddressChange}
                    placeholder="Street name, house no."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {error}
              </div>
            )}
            
            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex items-center justify-center rounded-2xl px-5 py-4 text-base font-bold text-white transition mt-6 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
              }`}
            >
              {loading ? 'Saving...' : 'Finish Profile & Enter Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

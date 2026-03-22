import React, { useState } from 'react';
import { createEvent } from '../services/eventService';
import { PlusIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    time: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // dynamic tickets logic
  const addTicket = () => {
    setTickets([...tickets, { type: 'Regular', price: '', quantity: '' }]);
  };
  const updateTicket = (index, field, value) => {
    const newTickets = [...tickets];
    newTickets[index][field] = value;
    setTickets(newTickets);
  };
  const removeTicket = (index) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  // dynamic promotions logic
  const addPromotion = () => {
    setPromotions([...promotions, { code: '', discountPercentage: '' }]);
  };
  const updatePromotion = (index, field, value) => {
    const newPromotions = [...promotions];
    newPromotions[index][field] = value;
    setPromotions(newPromotions);
  };
  const removePromotion = (index) => {
    setPromotions(promotions.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Event name is required.";
    if (!formData.date) return "Event date is required.";
    
    // Check if date is in the past
    // Ensure we parse the date correctly by splitting the YYYY-MM-DD string to avoid timezone shifts
    const [year, month, day] = formData.date.split('-');
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return "Event date cannot be in the past.";
    
    if (!formData.time) return "Event time is required.";
    if (!formData.location.trim()) return "Location is required.";
    if (!formData.description.trim()) return "Description is required.";

    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) return setMessage({ text: errorMsg, type: 'error' });

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append('tickets', JSON.stringify(tickets));
      data.append('promotions', JSON.stringify(promotions));
      if (image) data.append('image', image);

      await createEvent(data);
      setMessage({ text: 'Event created successfully!', type: 'success' });

      // reset form optionally
      setFormData({ name: '', description: '', location: '', date: '', time: '' });
      setImage(null); setImagePreview(null);
      setTickets([]); setPromotions([]);
    } catch (err) {
      setMessage({ text: err.message || 'Failed to create event', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "mt-1 block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-4 bg-white text-gray-900 transition-all duration-300 outline-none hover:border-gray-300 focus:bg-white placeholder:text-gray-400";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 mb-10 transform transition-all">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Create New Event</h2>
          <p className="text-gray-500 text-lg">Define everything about your upcoming experience.</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl mb-8 font-medium animate-pulse ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Basic Information */}
          <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6 flex items-center">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">1</span>
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputStyles} placeholder="Enter an engaging title" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className={inputStyles} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleInputChange} className={inputStyles} />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className={inputStyles} placeholder="Venue or Online Link" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea rows={4} name="description" value={formData.description} onChange={handleInputChange} className={inputStyles} placeholder="Tell people what this event is about..." />
              </div>
            </div>
          </section>

          {/* Event Poster */}
          <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6 flex items-center">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">2</span>
              Event Poster
            </h3>
            <div className="flex justify-center flex-col items-center">
              {imagePreview ? (
                <div className="relative group w-full max-w-md rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full object-cover h-64 transition duration-300 group-hover:opacity-75" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <button type="button" onClick={() => { setImage(null); setImagePreview(null); }} className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-red-600 transition">Remove Image</button>
                  </div>
                </div>
              ) : (
                <label className="w-full max-w-md flex flex-col items-center px-4 py-8 bg-white text-blue-500 rounded-3xl tracking-wide uppercase border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition-all shadow-sm">
                  <PhotoIcon className="w-12 h-12 text-blue-400 mb-2" />
                  <span className="mt-2 text-base leading-normal font-semibold">Upload a file</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </section>

          {/* Ticket Configuration */}
          <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-3 mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">3</span>
                Ticket Types
              </h3>
              <button type="button" onClick={addTicket} className="flex items-center text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition">
                <PlusIcon className="w-4 h-4 mr-1" /> Add Ticket
              </button>
            </div>

            {tickets.length === 0 ? (
              <p className="text-gray-400 text-center py-4 bg-white rounded-xl border border-dashed border-gray-300">No tickets added yet. Click 'Add Ticket' to create tiers.</p>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Type</label>
                      <select value={ticket.type} onChange={(e) => updateTicket(index, 'type', e.target.value)} className={inputStyles}>
                        <option value="Regular">Regular</option>
                        <option value="VIP">VIP</option>
                        <option value="Early Bird">Early Bird</option>
                      </select>
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Price ($)</label>
                      <input type="number" value={ticket.price} onChange={(e) => updateTicket(index, 'price', e.target.value)} className={inputStyles} min="0" step="0.01" placeholder="0.00" />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Quantity</label>
                      <input type="number" value={ticket.quantity} onChange={(e) => updateTicket(index, 'quantity', e.target.value)} className={inputStyles} min="1" placeholder="Ex: 100" />
                    </div>
                    <button type="button" onClick={() => removeTicket(index)} className="p-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-200" title="Remove Ticket">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Promotions & Offers */}
          <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b pb-3 mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">4</span>
                Promotions
              </h3>
              <button type="button" onClick={addPromotion} className="flex items-center text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition">
                <PlusIcon className="w-4 h-4 mr-1" /> Add Promo
              </button>
            </div>

            {promotions.length === 0 ? (
              <p className="text-gray-400 text-center py-4 bg-white rounded-xl border border-dashed border-gray-300">No promotions added. Click 'Add Promo' to create discounts.</p>
            ) : (
              <div className="space-y-4">
                {promotions.map((promo, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Promo Code</label>
                      <input type="text" value={promo.code} onChange={(e) => updatePromotion(index, 'code', e.target.value)} className={inputStyles} placeholder="SUMMER50" />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Discount (%)</label>
                      <input type="number" value={promo.discountPercentage} onChange={(e) => updatePromotion(index, 'discountPercentage', e.target.value)} className={inputStyles} min="1" max="100" placeholder="Ex: 15" />
                    </div>
                    <button type="button" onClick={() => removePromotion(index)} className="p-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-200" title="Remove Promo">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="pt-8">
            <button type="submit" disabled={loading} className="w-full flex justify-center py-4 px-8 border border-transparent rounded-2xl shadow-sm tracking-wide text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Publishing Event...
                </span>
              ) : 'Publish Event'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

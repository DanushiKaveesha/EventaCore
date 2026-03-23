import React, { useState } from 'react';
import { createEvent } from '../services/eventService';
import { PlusIcon, TrashIcon, PhotoIcon, TicketIcon, SparklesIcon, GiftIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

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
  const [creationStep, setCreationStep] = useState('selection'); // selection, form
  const [eventType, setEventType] = useState(null); // paid, free

  // handleInputChange is defined after errors state, see below

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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // --- Basic Info ---
    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Event name must be at least 3 characters.';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required.';
    } else {
      const [year, month, day] = formData.date.split('-');
      const selectedDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.date = 'Event date cannot be in the past.';
    }

    if (!formData.time) {
      newErrors.time = 'Event time is required.';
    } else if (formData.date) {
      // If the event is today, the time must be in the future
      const [year, month, day] = formData.date.split('-');
      const selectedDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate.getTime() === today.getTime()) {
        const [h, m] = formData.time.split(':').map(Number);
        const now = new Date();
        if (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes())) {
          newErrors.time = 'Event time must be in the future for today.';
        }
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters.';
    }

    // --- Ticket validation (paid only) ---
    if (eventType === 'paid') {
      if (tickets.length === 0) {
        newErrors.tickets = 'Please add at least one ticket type.';
      } else {
        const ticketErrors = tickets.map((t) => {
          const te = {};
          if (t.price === '' || t.price === null) te.price = 'Price is required.';
          else if (Number(t.price) < 0) te.price = 'Price cannot be negative.';
          if (t.quantity === '' || t.quantity === null) te.quantity = 'Quantity is required.';
          else if (!Number.isInteger(Number(t.quantity)) || Number(t.quantity) < 1) te.quantity = 'Quantity must be ≥ 1.';
          return te;
        });
        if (ticketErrors.some((te) => Object.keys(te).length > 0)) {
          newErrors.ticketRows = ticketErrors;
        }
      }

      // --- Promotion validation ---
      if (promotions.length > 0) {
        const promoErrors = promotions.map((p) => {
          const pe = {};
          if (!p.code.trim()) pe.code = 'Promo code is required.';
          else if (p.code.trim().length < 2) pe.code = 'Promo code must be at least 2 characters.';
          if (p.discountPercentage === '' || p.discountPercentage === null) pe.discountPercentage = 'Discount is required.';
          else if (Number(p.discountPercentage) < 1 || Number(p.discountPercentage) > 100) pe.discountPercentage = 'Discount must be between 1 and 100.';
          return pe;
        });
        if (promoErrors.some((pe) => Object.keys(pe).length > 0)) {
          newErrors.promoRows = promoErrors;
        }
        // Check for duplicate promo codes
        const codes = promotions.map((p) => p.code.trim().toUpperCase()).filter(Boolean);
        const hasDuplicates = codes.length !== new Set(codes).size;
        if (hasDuplicates) newErrors.promos = 'Promo codes must be unique.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear the specific field error on change
    if (errors[e.target.name]) setErrors((prev) => { const n = { ...prev }; delete n[e.target.name]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return setMessage({ text: 'Please fix the errors below before submitting.', type: 'error' });

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      let finalTickets = tickets;
      let finalPromotions = promotions;

      if (eventType === 'free') {
        finalTickets = [{ type: 'Free Pass', price: 0, quantity: 999999 }];
        finalPromotions = [];
      }

      data.append('tickets', JSON.stringify(finalTickets));
      data.append('promotions', JSON.stringify(finalPromotions));
      if (image) data.append('image', image);

      await createEvent(data);
      setMessage({ text: 'Event created successfully!', type: 'success' });

      // reset form
      setFormData({ name: '', description: '', location: '', date: '', time: '' });
      setImage(null); setImagePreview(null);
      setTickets([]); setPromotions([]);
      setCreationStep('selection');
      setEventType(null);
    } catch (err) {
      setMessage({ text: err.message || 'Failed to create event', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "mt-1 block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:text-sm p-4 bg-white text-gray-900 transition-all duration-300 outline-none hover:border-gray-300 focus:bg-white placeholder:text-gray-400";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {creationStep === 'selection' ? (
        <div className="animate-fade-in py-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-4">Launch Your Experience</h2>
            <p className="text-xl text-gray-500 max-w-lg mx-auto font-medium">Choose how you want to manage your event entries and registration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Paid Event Card */}
            <button 
              onClick={() => { setEventType('paid'); setCreationStep('form'); }}
              className="group bg-white p-10 rounded-[2.5rem] border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all text-left relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:bg-blue-100 transition-colors"></div>
              <TicketIcon className="h-16 w-16 text-blue-600 mb-8 relative z-10 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-gray-900 mb-3 relative z-10">Ticket Booking</h3>
              <p className="text-gray-500 font-medium mb-6 relative z-10">Best for paid concerts, workshops, and exclusive gatherings with multiple ticket tiers and pricing.</p>
              <div className="flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                Start Paid Drop <span className="ml-2">→</span>
              </div>
            </button>

            {/* Free Event Card */}
            <button 
              onClick={() => { setEventType('free'); setCreationStep('form'); }}
              className="group bg-white p-10 rounded-[2.5rem] border-2 border-gray-100 hover:border-emerald-500 hover:shadow-2xl transition-all text-left relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:bg-emerald-100 transition-colors"></div>
              <SparklesIcon className="h-16 w-16 text-emerald-600 mb-8 relative z-10 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black text-gray-900 mb-3 relative z-10">Free Entry</h3>
              <p className="text-gray-500 font-medium mb-6 relative z-10">Perfect for open meetups, club socials, and free workshops. One-click registration for all students.</p>
              <div className="flex items-center text-emerald-600 font-bold group-hover:translate-x-2 transition-transform">
                Start Free Drop <span className="ml-2">→</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 mb-10 transform transition-all relative">
          <button 
            onClick={() => { setCreationStep('selection'); setEventType(null); }}
            className="absolute top-8 left-8 flex items-center text-gray-400 hover:text-gray-900 transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back
          </button>

          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              {eventType === 'free' ? 'Quick Free Entry Setup' : 'Create Paid Booking Event'}
            </h2>
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
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`${inputStyles} ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`} placeholder="Enter an engaging title" />
                {errors.name && <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1"><span>⚠</span>{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className={`${inputStyles} ${errors.date ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`} />
                {errors.date && <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1"><span>⚠</span>{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleInputChange} className={`${inputStyles} ${errors.time ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`} />
                {errors.time && <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1"><span>⚠</span>{errors.time}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className={`${inputStyles} ${errors.location ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`} placeholder="Venue or Online Link" />
                {errors.location && <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1"><span>⚠</span>{errors.location}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea rows={4} name="description" value={formData.description} onChange={handleInputChange} className={`${inputStyles} ${errors.description ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}`} placeholder="Tell people what this event is about..." />
                {errors.description && <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1"><span>⚠</span>{errors.description}</p>}
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

          {/* Ticket Configuration (Only for Paid) */}
          {eventType === 'paid' ? (
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

              {errors.tickets && <p className="mb-3 text-xs text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-1"><span>⚠</span>{errors.tickets}</p>}
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
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Price (RS.)</label>
                        <input type="number" value={ticket.price} onChange={(e) => { updateTicket(index, 'price', e.target.value); if (errors.ticketRows) setErrors((p) => { const n={...p}; if(n.ticketRows) n.ticketRows[index] && delete n.ticketRows[index].price; return n; }); }} className={`${inputStyles} ${errors.ticketRows?.[index]?.price ? 'border-red-400' : ''}`} min="0" step="0.01" placeholder="0.00" />
                        {errors.ticketRows?.[index]?.price && <p className="mt-1 text-xs text-red-600 font-medium">⚠ {errors.ticketRows[index].price}</p>}
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Quantity</label>
                        <input type="number" value={ticket.quantity} onChange={(e) => { updateTicket(index, 'quantity', e.target.value); if (errors.ticketRows) setErrors((p) => { const n={...p}; if(n.ticketRows) n.ticketRows[index] && delete n.ticketRows[index].quantity; return n; }); }} className={`${inputStyles} ${errors.ticketRows?.[index]?.quantity ? 'border-red-400' : ''}`} min="1" placeholder="Ex: 100" />
                        {errors.ticketRows?.[index]?.quantity && <p className="mt-1 text-xs text-red-600 font-medium">⚠ {errors.ticketRows[index].quantity}</p>}
                      </div>
                      <button type="button" onClick={() => removeTicket(index)} className="p-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-200" title="Remove Ticket">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className="bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/30 rounded-bl-full -mr-4 -mt-4"></div>
              <h3 className="text-2xl font-black text-emerald-900 mb-6 flex items-center">
                <GiftIcon className="h-8 w-8 text-emerald-500 mr-4" />
                Access Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="bg-emerald-100/50 p-6 rounded-2xl border border-emerald-200">
                  <label className="block text-sm font-bold text-emerald-800 mb-2 uppercase tracking-wide">Capacity</label>
                  <div className="flex items-center text-emerald-700">
                    <span className="text-3xl font-black mr-2">∞</span>
                    <span className="text-lg font-bold">Unlimited Capacity</span>
                  </div>
                  <p className="mt-3 text-sm text-emerald-600 font-medium italic">All students can register without limits.</p>
                </div>
                <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-emerald-100 text-center">
                   <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-3">One-Click Enabled</div>
                   <p className="text-gray-600 text-sm leading-relaxed">Registration will be instant and free for all students. No payment steps required.</p>
                </div>
              </div>
            </section>
          )}

          {/* Promotions & Offers (Only for Paid) */}
          {eventType === 'paid' && (
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

              {errors.promos && <p className="mb-3 text-xs text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-1"><span>⚠</span>{errors.promos}</p>}
              {promotions.length === 0 ? (
                <p className="text-gray-400 text-center py-4 bg-white rounded-xl border border-dashed border-gray-300">No promotions added. Click 'Add Promo' to create discounts.</p>
              ) : (
                <div className="space-y-4">
                  {promotions.map((promo, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Promo Code</label>
                        <input type="text" value={promo.code} onChange={(e) => updatePromotion(index, 'code', e.target.value)} className={`${inputStyles} ${errors.promoRows?.[index]?.code ? 'border-red-400' : ''}`} placeholder="SUMMER50" />
                        {errors.promoRows?.[index]?.code && <p className="mt-1 text-xs text-red-600 font-medium">⚠ {errors.promoRows[index].code}</p>}
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Discount (%)</label>
                        <input type="number" value={promo.discountPercentage} onChange={(e) => updatePromotion(index, 'discountPercentage', e.target.value)} className={`${inputStyles} ${errors.promoRows?.[index]?.discountPercentage ? 'border-red-400' : ''}`} min="1" max="100" placeholder="Ex: 15" />
                        {errors.promoRows?.[index]?.discountPercentage && <p className="mt-1 text-xs text-red-600 font-medium">⚠ {errors.promoRows[index].discountPercentage}</p>}
                      </div>
                      <button type="button" onClick={() => removePromotion(index)} className="p-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-200" title="Remove Promo">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <div className="pt-8">
            <button type="submit" disabled={loading} className={`w-full flex justify-center py-4 px-8 border border-transparent rounded-2xl shadow-sm tracking-wide text-lg font-bold text-white transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
              eventType === 'free' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            }`}>
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Publishing {eventType === 'free' ? 'Free entry' : 'Event'}...
                </span>
              ) : `Publish ${eventType === 'free' ? 'Free entry' : 'Event'}`}
            </button>
          </div>

        </form>
      </div>
      )}
    </div>
  );
};

export default CreateEvent;

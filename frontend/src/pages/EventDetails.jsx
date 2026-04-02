import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent } from '../services/eventService';
import { createBooking, uploadPaymentSlip } from '../services/bookingService';
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  TagIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import useWishlist from '../hooks/useWishlist';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Booking state
  const [selectedTickets, setSelectedTickets] = useState({}); // { type: quantity }
  const [promotionCode, setPromotionCode] = useState('');
  const isOneClickCandidate = event && event.tickets.length === 1 && event.tickets[0].price === 0;
  const [promoApplied, setPromoApplied] = useState(null); // { code, discountPercentage }
  const [bookingStep, setBookingStep] = useState('selection'); // selection, payment, confirmed
  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id);
        setEvent(data);
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleQuantityChange = (type, delta) => {
    setSelectedTickets(prev => {
      const current = prev[type] || 0;
      const newValue = Math.max(0, current + delta);
      return { ...prev, [type]: newValue };
    });
  };

  const calculateSubtotal = () => {
    if (!event) return 0;
    return Object.entries(selectedTickets).reduce((total, [type, qty]) => {
      const ticket = event.tickets.find(t => t.type === type);
      return total + (ticket ? ticket.price * qty : 0);
    }, 0);
  };

  const calculateTotal = () => {
    const base = calculateSubtotal();
    if (promoApplied) {
      return base - (base * promoApplied.discountPercentage) / 100;
    }
    return base;
  };

  const total = calculateTotal();

  const handleApplyPromo = () => {
    if (!promotionCode) return;
    const promo = event.promotions.find(p => p.code.toLowerCase() === promotionCode.toLowerCase());
    if (promo) {
      setPromoApplied(promo);
      alert('Promotion applied successfully!');
    } else {
      alert('Invalid promotion code.');
    }
  };

  const handleInitiateBooking = async () => {
    const ticketsToBook = Object.entries(selectedTickets)
      .filter(([_, qty]) => qty > 0)
      .map(([type, qty]) => ({ type, quantity: qty }));

    if (ticketsToBook.length === 0) {
      alert('Please select at least one ticket.');
      return;
    }

    try {
      const bookingData = {
        eventId: event._id,
        userId: "67d94e7732d84d1234567890", // Mocked User ID - in real app, get from Auth context
        selectedTickets: ticketsToBook,
        promotionCode: promoApplied ? promoApplied.code : null
      };

      const result = await createBooking(bookingData);
      setCreatedBooking(result);
      
      // If the event is free, it will be auto-confirmed by backend
      if (result.status === 'confirmed' || total === 0) {
        setBookingStep('confirmed');
      } else {
        setBookingStep('payment');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentSlip(file);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentSlip) {
      alert('Please upload your payment slip.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('paymentSlip', paymentSlip);
      await uploadPaymentSlip(createdBooking._id, formData);
      setBookingStep('confirmed');
    } catch (err) {
      alert('Failed to upload payment slip.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error || !event) return <div className="p-10 text-center text-red-600 font-bold">{error || "Event not found"}</div>;

  return (
    <div className="w-full py-16 px-4 sm:px-10 lg:px-20 xl:px-32">
      <div className="max-w-7xl mx-auto">

      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors font-bold">
        <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Discover
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">

        {/* Left side: Event Info */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-gray-50/50">
          <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg mb-8 border-4 border-white">
            <img
              src={event.imageUrl ? `http://localhost:5000/${event.imageUrl}` : 'https://via.placeholder.com/800x600?text=Event+Poster'}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(event._id)}
              className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
              aria-label={isWishlisted(event._id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted(event._id)
                ? <HeartSolid className="w-6 h-6 text-rose-500" />
                : <HeartIcon className="w-6 h-6 text-gray-400" />}
            </button>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">{event.name}</h1>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">{event.description}</p>

          <div className="space-y-4">
            <div className="flex items-center text-gray-700 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 italic">
              <CalendarIcon className="h-6 w-6 mr-4 text-blue-500" />
              <span className="font-semibold">{new Date(event.date).toLocaleDateString()} at {event.time}</span>
            </div>
            <div className="flex items-center text-gray-700 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <MapPinIcon className="h-6 w-6 mr-4 text-purple-500" />
              <span className="font-semibold">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Right side: Booking Workflow */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">

          {bookingStep === 'selection' && (
            <div className="animate-fade-in">
              {isOneClickCandidate ? (
                <div className="text-center">
                  {/* Free event — view only */}
                  <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-emerald-100/50">
                    <CheckCircleIcon className="h-10 w-10 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Free Event</h2>
                  <p className="text-gray-500 mb-8 font-medium">This is a free event — no registration required. Just show up and enjoy!</p>

                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 mb-10 text-left space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Entry</span>
                      <span className="text-xl font-black text-emerald-900 uppercase">Free — RS. 0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-emerald-200/50">
                      <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Date</span>
                      <span className="font-bold text-gray-900">{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-emerald-200/50">
                      <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Venue</span>
                      <span className="font-bold text-gray-900">{event.location}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center px-6 py-3 bg-emerald-100 text-emerald-700 rounded-full text-sm font-black uppercase tracking-widest">
                    ✓ Open to All — No ticket needed
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <TicketIcon className="h-8 w-8 mr-3 text-blue-600" />
                    Secure Your Spot
                  </h2>

                  <div className="space-y-4 mb-10">
                    {event.tickets.map((ticket) => (
                      <div key={ticket._id} className="p-5 rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-all bg-white shadow-sm flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg text-gray-800">{ticket.type}</p>
                          <p className={`font-black text-xl ${ticket.price === 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {ticket.price === 0 ? 'FREE' : `RS. ${ticket.price.toFixed(2)}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{ticket.quantity} Left</p>
                        </div>
                        <div className="flex items-center space-x-4 bg-gray-50 p-2 rounded-xl">
                          <button onClick={() => handleQuantityChange(ticket.type, -1)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors">-</button>
                          <span className="w-12 text-center font-black text-xl text-gray-900">{selectedTickets[ticket.type] || 0}</span>
                          <button onClick={() => handleQuantityChange(ticket.type, 1)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-500 transition-colors">+</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Section */}
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Promotion Code</label>
                      {event.promotions && event.promotions.length > 0 && (
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Offers</span>
                      )}
                    </div>

                    {event.promotions && event.promotions.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {event.promotions.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPromotionCode(p.code)}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-100 hover:-translate-y-0.5 transition-all border border-emerald-100/50 flex items-center gap-1.5 shadow-sm"
                            title="Click to apply code"
                          >
                            <TagIcon className="w-3.5 h-3.5" />
                            {p.code} <span className="opacity-60 font-bold ml-0.5">-{p.discountPercentage}%</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promotionCode}
                        onChange={(e) => setPromotionCode(e.target.value)}
                        placeholder="Ex: SAVE20"
                        className="flex-1 p-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-300"
                      />
                      <button onClick={handleApplyPromo} className="px-6 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">Apply</button>
                    </div>
                    {promoApplied && <p className="text-emerald-600 text-sm mt-2 font-bold flex items-center"><CheckCircleIcon className="h-4 w-4 mr-1" /> {promoApplied.discountPercentage}% Discount Applied!</p>}
                  </div>

                  <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Amount to Pay</span>
                      <span className="text-gray-400 text-xs line-through">{promoApplied ? `RS. ${calculateSubtotal().toFixed(2)}` : ''}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-4xl font-black text-blue-900">RS. {calculateTotal().toFixed(2)}</span>
                      <span className="text-blue-600/50 text-xs">Final Price</span>
                    </div>
                  </div>

                  <button
                    onClick={handleInitiateBooking}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Confirm Booking
                  </button>
                </>
              )}
            </div>
          )}

          {bookingStep === 'payment' && (
            <div className="animate-fade-in text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Payment</h2>
              <p className="text-gray-500 mb-8">Please upload your payment slip/screenshot to verify your booking.</p>

              <div className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200 mb-8 max-w-sm mx-auto">
                <CloudArrowUpIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg inline-block hover:bg-blue-700 transition-colors">
                    {paymentSlip ? paymentSlip.name : 'Choose Slip'}
                  </span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={uploading}
                className="w-full py-5 bg-gray-900 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-black transition-all disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Verify Payment'}
              </button>
            </div>
          )}

          {bookingStep === 'confirmed' && (
            <div className="animate-fade-in text-center py-10 px-6">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-emerald-200">
                <CheckCircleIcon className="h-16 w-16 text-emerald-500" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                {createdBooking && createdBooking.totalAmount === 0 ? 'Registration Success!' : 'Booking Requested!'}
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                {createdBooking && createdBooking.totalAmount === 0 
                  ? 'Your spot is secured. You can find your pass in your dashboard.' 
                  : 'Your payment slip has been sent for verification. You can track your status in your dashboard.'
                }
              </p>

              <div className="space-y-3">
                <button onClick={() => navigate('/my-bookings')} className="w-full py-5 bg-blue-600 text-white font-black text-xl rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                  View My Bookings
                </button>
                <button onClick={() => navigate('/events')} className="w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition-all">
                  Back to Browsing
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      </div>
    </div>
  );
};

export default EventDetails;

import React, { useEffect, useState } from 'react';
    import { getMyBookings } from '../services/bookingService';
    import { TicketIcon, ClockIcon, CheckCircleIcon, XCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';

    const MyBookings = () => {
      const [bookings, setBookings] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      // Mock User ID for demonstration - in real app, get from Auth context
      const userId = "67d94e7732d84d1234567890";

      useEffect(() => {
        const fetchBookings = async () => {
          try {
            const data = await getMyBookings(userId);
            setBookings(data);
          } catch (err) {
            setError('Failed to load your bookings history.');
          } finally {
            setLoading(false);
          }
        };
        fetchBookings();
      }, [userId]);

      const getStatusIcon = (status) => {
        switch(status) {
          case 'pending': return <ClockIcon className="h-6 w-6 text-amber-500" />;
          case 'confirmed': return <CheckCircleIcon className="h-6 w-6 text-emerald-500" />;
          case 'rejected': return <XCircleIcon className="h-6 w-6 text-red-500" />;
          case 'cancelled': return <XCircleIcon className="h-6 w-6 text-gray-500" />;
          default: return <ClockIcon className="h-6 w-6 text-gray-500" />;
        }
      };

      const getStatusStyles = (status) => {
        switch(status) {
          case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
          case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
          case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
          default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
      };

      if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
      
      return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Bookings</h1>
              <p className="text-gray-500 mt-2">Manage your tickets and track verification status.</p>
            </div>
            <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-100 flex items-center">
               <TicketIcon className="h-8 w-8 text-white" />
               <span className="ml-3 text-white font-black text-2xl">{bookings.length}</span>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-8">{error}</div>}

          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <TicketIcon className="mx-auto h-16 w-16 text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-700">No bookings yet</h3>
              <p className="text-gray-500 mt-2 mb-6">Explore events and start your adventure.</p>
              <a href="/events" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Browse Events</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col group">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img 
                      src={booking.event?.imageUrl ? `http://localhost:5000/${booking.event.imageUrl}` : 'https://via.placeholder.com/800x600?text=Event+Poster'} 
                      alt={booking.event?.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`flex items-center px-4 py-2 rounded-full font-bold text-sm shadow-md border ${getStatusStyles(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-2 uppercase tracking-wider">{booking.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1">{booking.event?.name || 'Unknown Event'}</h3>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-sm text-gray-500 font-medium">
                        <CalendarIcon className="h-5 w-5 mr-3 text-blue-400" />
                        {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'TBA'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 font-medium">
                        <TicketIcon className="h-5 w-5 mr-3 text-purple-400" />
                        {booking.tickets.map(t => `${t.quantity}x ${t.type}`).join(', ')}
                      </div>
                    </div>

                    <div className="mt-auto flex justify-between items-center pt-6 border-t border-gray-50">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Paid</p>
                        <p className="text-2xl font-black text-gray-900">${booking.totalAmount.toFixed(2)}</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-bold transition-colors">Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    export default MyBookings;

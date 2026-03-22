import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus } from '../../services/bookingService';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  MagnifyingGlassIcon,
  TicketIcon,
  UserIcon,
  CreditCardIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import AdminSidebar from './AdminSidebar';

const AdminEventPayments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (window.confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) {
      try {
        await updateBookingStatus(bookingId, newStatus);
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        ));
      } catch (error) {
        alert("Failed to update booking status.");
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const userName = booking.displayName || booking.userName || 'Unknown User';
    const eventName = booking.event?.name || 'Unknown Event';
    
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || booking.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col lg:flex-row w-full">
      <AdminSidebar activeOverride="payments" />
      <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] overflow-x-hidden min-h-screen p-4 sm:p-8 lg:p-12">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 capitalize tracking-tight">Payments Management</h1>
          <p className="text-gray-500 font-medium mt-2 lg:mt-3 text-base lg:text-lg">Monitor, update, and verify ticket bookings.</p>
        </div>
        <div className="animate-fade-in space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by user or event..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            className="px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold text-gray-700 bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Customer Info</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Event Detail</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Payment Slip</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Total Amount</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-tight">{booking.displayName || booking.userName || 'Unknown User'}</p>
                          <p className="text-xs font-bold text-gray-400 tracking-tight">{booking.displayEmail || booking.userEmail || 'No Email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 font-black text-xs">
                          <TicketIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-tight">{booking.event?.name || 'Unknown Event'}</p>
                          <p className="text-xs font-bold text-gray-400 tracking-tight">
                            {booking.tickets && booking.tickets.length > 0 ? booking.tickets.map(t => `${t.quantity}x ${t.type}`).join(', ') : 'No tickets'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {booking.paymentSlip ? (
                        <a 
                          href={`http://localhost:5000/${booking.paymentSlip}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
                        >
                          Preview Slip <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-gray-400 font-medium italic">No slip uploaded</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 text-lg">RS. {(booking.totalAmount || 0).toFixed(2)}</p>
                      {booking.discountAmount > 0 && (
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                          Promo Applied (-RS. {booking.discountAmount.toFixed(2)})
                        </p>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(booking.status)}`}>
                        {booking.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {booking.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Verify & Confirm"
                          >
                            <CheckCircleIcon className="w-6 h-6" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Reject Payment"
                          >
                            <XCircleIcon className="w-6 h-6" />
                          </button>
                        </div>
                      )}
                      {booking.status !== 'pending' && (
                         <span className="text-gray-300 italic text-xs font-bold">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <p className="text-gray-400 font-bold text-xl tracking-tight">No payment records found matching your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventPayments;

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
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
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

  // Helper: resolve customer display info from booking using all available sources
  const getCustomerInfo = (booking) => {
    // Priority 1: Snapshot fields stored directly on the booking
    if (booking.userName && booking.userName !== 'Guest User') {
      return { name: booking.userName, email: booking.userEmail || 'No Email' };
    }
    // Priority 2: Populated User object from DB
    if (booking.user && typeof booking.user === 'object') {
      const u = booking.user;
      const name = (u.firstName && u.lastName)
        ? `${u.firstName} ${u.lastName}`
        : (u.username || u.name || null);
      if (name) return { name, email: u.email || 'No Email' };
    }
    // Priority 3: Legacy display fields
    if (booking.displayName) return { name: booking.displayName, email: booking.displayEmail || 'No Email' };
    return { name: 'Unknown User', email: 'No Email' };
  };

  const filteredBookings = Array.isArray(bookings) ? bookings.filter(booking => {
    const { name } = getCustomerInfo(booking);
    const eventName = booking.event?.name || 'Unknown Event';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || booking.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  }) : [];

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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <AdminSidebar activeOverride="payments" />
      <div className="flex-1 min-w-0 p-5 lg:p-8 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">Event Payments</h1>
          <p className="text-gray-400 text-xs font-medium mt-0.5">Monitor, update, and verify ticket bookings.</p>
        </div>
        <div className="space-y-5">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[180px]">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user or event…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-violet-300 outline-none placeholder:text-gray-400 font-medium text-sm shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <select
                className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-violet-300 outline-none font-bold text-gray-700 text-xs shadow-sm"
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/60 border-b border-gray-100">
                    <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Info</th>
                    <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Detail</th>
                    <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Slip</th>
                    <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</th>
                    <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-violet-50/20 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                              <UserIcon className="w-4 h-4" />
                            </div>
                            <div>
                              {(() => {
                                const { name, email } = getCustomerInfo(booking);
                                return (
                                  <>
                                    <p className="text-xs font-black text-gray-900 leading-tight">{name}</p>
                                    <p className="text-[10px] font-bold text-gray-400">{email}</p>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100 shrink-0">
                              <TicketIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-900 leading-tight max-w-[140px] truncate">{booking.event?.name || 'Unknown Event'}</p>
                              <p className="text-[10px] font-bold text-gray-400">
                                {booking.tickets && booking.tickets.length > 0 ? booking.tickets.map(t => `${t.quantity}x ${t.type}`).join(', ') : 'No tickets'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {booking.paymentSlip ? (
                            <a
                              href={`http://localhost:5000/${booking.paymentSlip}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition"
                            >
                              Preview Slip <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-300 italic text-[10px]">No slip</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs font-black text-gray-900">RS. {(booking.totalAmount || 0).toFixed(2)}</p>
                          {booking.discountAmount > 0 && (
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                              Promo Applied (-RS. {booking.discountAmount.toFixed(2)})
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(booking.status)}`}>
                            {booking.status || 'unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {booking.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                className="w-9 h-9 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-all hover:scale-110 border border-emerald-100/50"
                                title="Confirm"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all hover:scale-110 border border-red-100/50"
                                title="Reject"
                              >
                                <XCircleIcon className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {booking.status !== 'pending' && (
                            <span className="text-gray-300 italic text-[10px]">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-20 text-center">
                        <p className="text-gray-400 font-bold text-sm">No payment records found.</p>
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

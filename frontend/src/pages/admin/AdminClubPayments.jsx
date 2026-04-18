import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import {
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  UserIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const PAYMENT_STATUS = {
  pending:  { label: 'Pending',  dot: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  verified: { label: 'Verified', dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', dot: 'bg-red-400',    badge: 'bg-red-50 text-red-700 border-red-200' },
};

const AdminClubPayments = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [slipModal, setSlipModal]     = useState(null); // url string

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get('http://localhost:5000/api/memberships');
      setMemberships(data);
    } catch (err) {
      console.error('Failed to fetch memberships:', err);
      setError('Failed to load memberships: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/memberships/${id}/payment-status`,
        { paymentStatus }
      );
      setMemberships(prev => prev.map(m => m._id === id ? { ...m, paymentStatus: data.paymentStatus } : m));
    } catch (err) {
      alert('Failed to update payment status: ' + err.message);
    }
  };

  const filtered = memberships.filter(m => {
    const q = search.toLowerCase();
    const matchSearch =
      m.studentName?.toLowerCase().includes(q) ||
      m.studentId?.toLowerCase().includes(q) ||
      m.clubId?.name?.toLowerCase().includes(q) ||
      m.bankName?.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || m.paymentStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'Total',    value: memberships.length,                                       color: 'from-violet-600 to-indigo-600' },
    { label: 'Pending',  value: memberships.filter(m => m.paymentStatus === 'pending').length,  color: 'from-amber-500 to-orange-500' },
    { label: 'Verified', value: memberships.filter(m => m.paymentStatus === 'verified').length, color: 'from-emerald-500 to-teal-500' },
    { label: 'Rejected', value: memberships.filter(m => m.paymentStatus === 'rejected').length, color: 'from-red-500 to-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <AdminSidebar activeOverride="payments" />

      <div className="flex-1 min-w-0 p-5 lg:p-8 space-y-6 overflow-y-auto">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <SparklesIcon className="h-4 w-4 text-violet-500" />
              <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Payment Management</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">Club & Membership Payments</h1>
            <p className="text-gray-400 text-xs font-medium mt-0.5">Review and verify membership payment slips submitted by students.</p>
          </div>
          <Link
            to="/admin/payments"
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-xs shadow-sm hover:bg-gray-50 transition"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Back
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, color }) => (
            <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white flex items-center gap-3 shadow-lg relative overflow-hidden`}>
              <div className="bg-white/20 rounded-xl p-2.5 shrink-0">
                <CreditCardIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/70 mb-0.5">{label}</p>
                <p className="text-2xl font-black leading-none">{value}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10" />
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, club, or bank…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder-gray-400"
            />
          </div>
          <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm p-1 gap-1">
            {['all', 'pending', 'verified', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  filterStatus === s ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin h-9 w-9 border-4 border-violet-500 border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="py-24 text-center px-4">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-8 max-w-md mx-auto">
                <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h3>
                <p className="text-red-500 mb-6">{error}</p>
                <button 
                  onClick={fetchAll}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <BuildingLibraryIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-bold">No payment records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-100 bg-gray-50/60">
                  <tr>
                    {['Student', 'Club', 'Bank Details', 'Payment Slip', 'Pay Status', 'Actions'].map(h => (
                      <th key={h} className={`px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest ${h === 'Actions' ? 'text-right pr-5' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(m => {
                    const ps = PAYMENT_STATUS[m.paymentStatus] || PAYMENT_STATUS.pending;
                    return (
                      <tr key={m._id} className="hover:bg-violet-50/20 transition-colors">
                        {/* Student */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0">
                              <UserIcon className="w-4 h-4 text-violet-500" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-900">{m.studentName}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <IdentificationIcon className="w-3 h-3 text-gray-400" />
                                <span className="text-[9px] font-bold text-gray-400">{m.studentId}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Club */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-gray-700">
                            {m.clubId?.name || <span className="text-gray-300 italic">Unknown</span>}
                          </span>
                        </td>
                        {/* Bank Details */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-xs font-bold text-gray-700">{m.bankName}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{m.branchName}</p>
                        </td>
                        {/* Payment Slip */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          {m.paymentSlip ? (
                            <button
                              onClick={() => setSlipModal(`http://localhost:5000/${m.paymentSlip}`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition"
                            >
                              <EyeIcon className="w-3.5 h-3.5" /> View Slip
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-300 italic">No slip</span>
                          )}
                        </td>
                        {/* Payment Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${ps.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ps.dot} animate-pulse`} />
                            {ps.label}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-4 whitespace-nowrap text-right pr-5">
                          {m.paymentStatus === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => updatePaymentStatus(m._id, 'verified')}
                                className="w-9 h-9 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-all hover:scale-110 border border-emerald-100/50"
                                title="Verify Payment"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updatePaymentStatus(m._id, 'rejected')}
                                className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all hover:scale-110 border border-red-100/50"
                                title="Reject Payment"
                              >
                                <XCircleIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-gray-300 italic uppercase tracking-wider">No action</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/30 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-gray-400">
                Showing <span className="text-gray-700">{filtered.length}</span> of <span className="text-gray-700">{memberships.length}</span> records
              </p>
              <div className="flex gap-1.5">
                {['pending', 'verified', 'rejected'].map(s => {
                  const c = PAYMENT_STATUS[s];
                  return (
                    <span key={s} className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${c.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      {memberships.filter(m => m.paymentStatus === s).length} {s}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Slip Modal */}
      {slipModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSlipModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-sm">Payment Slip</h3>
              <button onClick={() => setSlipModal(null)} className="text-gray-400 hover:text-gray-700 font-black text-lg leading-none">✕</button>
            </div>
            <div className="p-4">
              <img
                src={slipModal}
                alt="Payment Slip"
                className="w-full rounded-xl object-contain max-h-[60vh]"
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClubPayments;

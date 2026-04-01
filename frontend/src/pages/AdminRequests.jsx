import React, { useState, useEffect } from 'react';
import { getMyRequests, updateMembershipRequest } from '../services/membershipService';
import {
    ClipboardDocumentListIcon,
    CheckIcon,
    XMarkIcon,
    EyeIcon,
    InboxIcon,
    ChevronRightIcon,
    FunnelIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    CurrencyDollarIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [confirmModal, setConfirmModal] = useState({ show: false, ids: [], status: null, name: '' });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await getMyRequests();
            setRequests(data);
            setSelectedIds(new Set()); // Reset selection on fetch
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectAll = () => {
        const pendingIds = filteredRequests
            .filter(req => req.status === 'pending')
            .map(req => req._id);

        if (selectedIds.size === pendingIds.length && pendingIds.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(pendingIds));
        }
    };

    const toggleSelectOne = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleActionClick = (id, status, name) => {
        setConfirmModal({ show: true, ids: [id], status, name });
    };

    const handleBulkAction = (status) => {
        if (selectedIds.size === 0) return;
        setConfirmModal({
            show: true,
            ids: Array.from(selectedIds),
            status,
            name: `${selectedIds.size} selected requests`
        });
    };

    const processAction = async () => {
        const { ids, status } = confirmModal;
        try {
            // Process all in parallel
            await Promise.all(ids.map(id => updateMembershipRequest(id, { status })));

            setRequests(requests.map(req =>
                ids.includes(req._id) ? { ...req, status } : req
            ));

            setConfirmModal({ show: false, ids: [], status: null, name: '' });
            setSelectedIds(new Set()); // Clear selection after action
        } catch (err) {
            alert('Failed to update requests: ' + err);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesFilter = filter === 'all' || req.status === filter;
        const matchesSearch = req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (req.clubId?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
    );

    return (
        <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-slate-50/30 min-h-screen relative">
            {/* Confirmation Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 p-10 max-w-md w-full animate-in zoom-in-95 duration-200">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${confirmModal.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                confirmModal.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                            {confirmModal.status === 'approved' ? <CheckIcon className="h-8 w-8" /> :
                                confirmModal.status === 'rejected' ? <XMarkIcon className="h-8 w-8" /> : <ArrowPathIcon className="h-8 w-8 shrink-0" />}
                        </div>
                        <h3 className="text-xl font-black text-center text-slate-900 mb-2 capitalize">
                            Confirm {confirmModal.status === 'pending' ? 'Rollback' : confirmModal.status}
                        </h3>
                        <p className="text-slate-500 text-center font-medium mb-8">
                            Are you sure you want to <span className="font-bold text-slate-700">{confirmModal.status === 'pending' ? 'reset to pending' : confirmModal.status}</span> the {confirmModal.ids.length > 1 ? `${confirmModal.ids.length} selected requests` : `request from ${confirmModal.name}`}?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setConfirmModal({ show: false, id: null, status: null, name: '' })}
                                className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processAction}
                                className={`flex-1 py-4 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${confirmModal.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' :
                                        confirmModal.status === 'rejected' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                    }`}
                            >
                                Confirm {confirmModal.status === 'pending' ? 'Rollback' : confirmModal.status}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Action Bar */}
            {selectedIds.size > 1 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-[32px] px-8 py-5 flex items-center gap-10 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 border border-slate-800">
                    <div className="flex items-center gap-4 border-r border-slate-700 pr-10">
                        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xs">
                            {selectedIds.size}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selected Applications</span>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => handleBulkAction('approved')}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
                        >
                            <CheckIcon className="h-4 w-4" />
                            Bulk Approve
                        </button>
                        <button
                            onClick={() => handleBulkAction('rejected')}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/20"
                        >
                            <XMarkIcon className="h-4 w-4" />
                            Bulk Reject
                        </button>
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-6 py-3 hover:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-700 transition-all font-inter"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <SparklesIcon className="h-4 w-4 text-violet-500" />
                        <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Enrollment Command</span>
                    </div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-tight">Club Membership Requests</h1>
                    <p className="text-slate-400 text-[11px] font-bold mt-1">Review, validate, and manage incoming applications across all managed clubs.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Pending validation', value: requests.filter(r => r.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50', icon: ArrowPathIcon },
                    { label: 'System Approved', value: requests.filter(r => r.status === 'approved').length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckIcon },
                    { label: 'Rejected Protocol', value: requests.filter(r => r.status === 'rejected').length, color: 'text-red-500', bg: 'bg-red-50', icon: XMarkIcon },
                    { label: 'Verified Payments', value: requests.filter(r => r.paymentStatus === 'verified').length, color: 'text-blue-600', bg: 'bg-blue-50', icon: CurrencyDollarIcon },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{stat.label}</p>
                            <h3 className="text-xl font-black text-slate-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>


            {/* Bulk Action Bar Placeholder (if any) */}

            {/* Controls */}
            <div className="flex flex-wrap md:items-center md:justify-between mb-4 gap-4 bg-white/50 p-2 rounded-2xl">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify applicant..."
                            className="pl-11 pr-6 py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all w-full sm:w-56 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="bg-white p-1 rounded-xl flex space-x-1 border border-slate-100 shadow-sm">
                        {['pending', 'approved', 'rejected', 'all'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === s
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-4 py-3 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        onChange={toggleSelectAll}
                                        checked={selectedIds.size > 0 && selectedIds.size === filteredRequests.filter(r => r.status === 'pending').length}
                                        className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                    />
                                </th>
                                <th className="px-3 py-3 font-black text-[9px] text-slate-400 uppercase tracking-widest">Request #</th>
                                <th className="px-3 py-3 font-black text-[9px] text-slate-400 uppercase tracking-widest">Student</th>
                                <th className="px-3 py-3 font-black text-[9px] text-slate-400 uppercase tracking-widest">Club / Date</th>
                                <th className="px-3 py-3 font-black text-[9px] text-slate-400 uppercase tracking-widest">Motivation</th>
                                <th className="px-3 py-3 font-black text-[9px] text-slate-400 uppercase tracking-widest">Payment</th>
                                <th className="px-3 py-3 font-black text-[9px] text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-3 py-3 font-black text-[9px] text-slate-400 uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-24 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <InboxIcon className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm">No applications found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((req, idx) => (
                                    <tr key={req._id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="checkbox"
                                                disabled={req.status !== 'pending'}
                                                checked={selectedIds.has(req._id)}
                                                onChange={() => toggleSelectOne(req._id)}
                                                className={`w-3.5 h-3.5 rounded border-slate-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer ${req.status !== 'pending' ? 'opacity-20 cursor-not-allowed' : ''}`}
                                            />
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 whitespace-nowrap">
                                                REQ-{req._id.slice(-4).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-800 leading-tight mb-0.5 whitespace-nowrap">{req.studentName}</span>
                                                <span className="text-[10px] font-bold text-slate-400">{req.studentId}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{req.clubId?.name || 'Club'}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 max-w-[10rem]">
                                            <p className="text-[10px] text-slate-500 truncate font-medium bg-slate-50/50 px-2 py-1.5 rounded-lg border border-slate-100 italic">
                                                "{req.message || 'No message provided'}"
                                            </p>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="text-[9px] font-black uppercase tracking-widest flex items-center text-slate-400 mb-0.5">
                                                    <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                                                    Payment
                                                </span>
                                                <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${req.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                                        req.paymentStatus === 'verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                                            'bg-red-50 text-red-600 border border-red-200'
                                                    }`}>
                                                    {req.paymentStatus || 'pending'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${req.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200/50 shadow-sm shadow-amber-100/50' :
                                                    req.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200/50 shadow-sm shadow-emerald-100/50' :
                                                        'bg-red-100 text-red-700 border border-red-200/50 shadow-sm shadow-red-100/50'
                                                }`}>
                                                <span className={`w-1 h-1 rounded-full mr-1.5 ${req.status === 'pending' ? 'bg-amber-500' :
                                                        req.status === 'approved' ? 'bg-emerald-500' : 'bg-red-500'
                                                    }`}></span>
                                                {req.status}
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                {/* Rollback Action (Visible for non-pending) */}
                                                {req.status !== 'pending' && (
                                                    <button
                                                        onClick={() => handleActionClick(req._id, 'pending', req.studentName)}
                                                        title="Rollback to Pending"
                                                        className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 border border-blue-100/50 shadow-sm"
                                                    >
                                                        <ArrowPathIcon className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {/* Approve Action */}
                                                {req.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleActionClick(req._id, 'approved', req.studentName)}
                                                        disabled={req.paymentStatus !== 'verified'}
                                                        title={req.paymentStatus !== 'verified' ? "Payment must be verified first" : "Approve Request"}
                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border shadow-md ${req.paymentStatus !== 'verified'
                                                                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed shadow-none'
                                                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-100 shadow-emerald-100/50'
                                                            }`}
                                                    >
                                                        <CheckIcon className="h-4 w-4 stroke-[3px]" />
                                                    </button>
                                                )}

                                                {/* Reject Action */}
                                                {req.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleActionClick(req._id, 'rejected', req.studentName)}
                                                        title="Reject Request"
                                                        className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 border border-red-100 shadow-sm shadow-red-100/50"
                                                    >
                                                        <XMarkIcon className="h-4 w-4 stroke-[3px]" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Section */}
                <div className="px-8 py-5 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Showing {filteredRequests.length} of {requests.length} total entries
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRequests;

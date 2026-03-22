import React, { useState, useEffect } from 'react';
import { getAdminEventRequests, updateEventRequestStatus } from '../services/eventRegistrationService';
import { 
  ClipboardDocumentListIcon, 
  CheckIcon, 
  XMarkIcon, 
  InboxIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const AdminEventRequests = () => {
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
            const data = await getAdminEventRequests();
            setRequests(data);
            setSelectedIds(new Set());
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
            name: `${selectedIds.size} selected event RSVPs` 
        });
    };

    const processAction = async () => {
        const { ids, status } = confirmModal;
        try {
            await Promise.all(ids.map(id => updateEventRequestStatus(id, { status })));
            
            setRequests(requests.map(req => 
                ids.includes(req._id) ? { ...req, status } : req
            ));
            
            setConfirmModal({ show: false, ids: [], status: null, name: '' });
            setSelectedIds(new Set()); 
        } catch (err) {
            alert('Failed to update event requests: ' + err);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesFilter = filter === 'all' || req.status === filter;
        const matchesSearch = req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              req.eventName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              req.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/30 min-h-screen relative">
            {/* Confirmation Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 p-10 max-w-md w-full animate-in zoom-in-95 duration-200">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${
                            confirmModal.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                            confirmModal.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                            {confirmModal.status === 'approved' ? <CheckIcon className="h-8 w-8" /> : 
                             confirmModal.status === 'rejected' ? <XMarkIcon className="h-8 w-8" /> : <ArrowPathIcon className="h-8 w-8 shrink-0" />}
                        </div>
                        <h3 className="text-xl font-black text-center text-slate-900 mb-2 capitalize">
                            Confirm {confirmModal.status === 'pending' ? 'Rollback' : confirmModal.status}
                        </h3>
                        <p className="text-slate-500 text-center font-medium mb-8">
                            Are you sure you want to <span className="font-bold text-slate-700">{confirmModal.status === 'pending' ? 'reset to pending' : confirmModal.status}</span> the {confirmModal.ids.length > 1 ? `${confirmModal.ids.length} selected event RSVPs` : `event RSVP from ${confirmModal.name}`}?
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
                                className={`flex-1 py-4 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                                    confirmModal.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 
                                    confirmModal.status === 'rejected' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
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
                        <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center font-black text-xs">
                            {selectedIds.size}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selected RSVPs</span>
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center mb-1">
                        <CalendarDaysIcon className="h-7 w-7 mr-3 text-purple-600" />
                        Event Attendees
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Manage and review incoming event registrations.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative group">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search attendees..."
                            className="pl-11 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="bg-slate-50 p-1.5 rounded-2xl flex space-x-1 border border-slate-100">
                        {['pending', 'approved', 'rejected', 'all'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    filter === s 
                                        ? 'bg-white text-slate-900 shadow-sm' 
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
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5">
                                    <input 
                                        type="checkbox" 
                                        onChange={toggleSelectAll}
                                        checked={selectedIds.size > 0 && selectedIds.size === filteredRequests.filter(r => r.status === 'pending').length}
                                        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 transition-all cursor-pointer" 
                                    />
                                </th>
                                <th className="px-4 py-5 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">RSVP #</th>
                                <th className="px-4 py-5 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Student</th>
                                <th className="px-4 py-5 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Event & Club</th>
                                <th className="px-4 py-5 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Message</th>
                                <th className="px-4 py-5 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-4 py-5 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-24 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <InboxIcon className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm">No event registrations found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <tr key={req._id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                        <td className="px-8 py-6">
                                            <input 
                                                type="checkbox" 
                                                disabled={req.status !== 'pending'}
                                                checked={selectedIds.has(req._id)}
                                                onChange={() => toggleSelectOne(req._id)}
                                                className={`w-4 h-4 rounded border-slate-200 text-purple-600 focus:ring-purple-500 transition-all cursor-pointer ${req.status !== 'pending' ? 'opacity-20 cursor-not-allowed' : ''}`} 
                                            />
                                        </td>
                                        <td className="px-4 py-6">
                                            <span className="text-xs font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                                RSVP-{req._id.slice(-4).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-800 leading-tight mb-0.5">{req.studentName}</span>
                                                <span className="text-xs font-bold text-slate-400">{req.studentId}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-purple-700">{req.eventName}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {req.clubId?.name || 'Club'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-6 max-w-xs">
                                            <p className="text-xs text-slate-500 truncate font-medium bg-slate-50/50 px-3 py-2 rounded-xl border border-slate-100 italic">
                                                "{req.message || 'No message provided'}"
                                            </p>
                                        </td>
                                        <td className="px-4 py-6">
                                            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                req.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200/50 shadow-sm shadow-amber-100/50' :
                                                req.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200/50 shadow-sm shadow-emerald-100/50' : 
                                                'bg-red-100 text-red-700 border border-red-200/50 shadow-sm shadow-red-100/50'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                    req.status === 'pending' ? 'bg-amber-500' :
                                                    req.status === 'approved' ? 'bg-emerald-500' : 'bg-red-500'
                                                }`}></span>
                                                {req.status}
                                            </div>
                                        </td>
                                        <td className="px-4 py-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {req.status !== 'pending' && (
                                                    <button 
                                                        onClick={() => handleActionClick(req._id, 'pending', req.studentName)}
                                                        title="Rollback to Pending"
                                                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 border border-blue-100"
                                                    >
                                                        <ArrowPathIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                )}

                                                {req.status === 'pending' && (
                                                    <button 
                                                        onClick={() => handleActionClick(req._id, 'approved', req.studentName)}
                                                        title="Approve Request"
                                                        className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300 border border-emerald-100 shadow-sm shadow-emerald-100/50"
                                                    >
                                                        <CheckIcon className="h-3.5 w-3.5 stroke-[3px]" />
                                                    </button>
                                                )}

                                                {req.status === 'pending' && (
                                                    <button 
                                                        onClick={() => handleActionClick(req._id, 'rejected', req.studentName)}
                                                        title="Reject Request"
                                                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 border border-red-100 shadow-sm shadow-red-100/50"
                                                    >
                                                        <XMarkIcon className="h-3.5 w-3.5 stroke-[3px]" />
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
            </div>
        </div>
    );
};

export default AdminEventRequests;

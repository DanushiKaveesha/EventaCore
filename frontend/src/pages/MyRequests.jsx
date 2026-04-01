import React, { useState, useEffect } from 'react';
import { getMyRequests, updateMembershipRequest, deleteMembershipRequest } from '../services/membershipService';
import {
    ClipboardDocumentListIcon,
    PencilSquareIcon,
    TrashIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRequest, setEditingRequest] = useState(null);
    const [editMessage, setEditMessage] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await getMyRequests();
            setRequests(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to cancel this request?')) {
            try {
                await deleteMembershipRequest(id);
                setRequests(requests.filter(req => req._id !== id));
            } catch (error) {
                alert(error);
            }
        }
    };

    const handleEdit = (request) => {
        setEditingRequest(request);
        setEditMessage(request.message);
    };

    const handleUpdate = async () => {
        try {
            await updateMembershipRequest(editingRequest._id, { message: editMessage });
            setRequests(requests.map(req => req._id === editingRequest._id ? { ...req, message: editMessage } : req));
            setEditingRequest(null);
        } catch (error) {
            alert(error);
        }
    };

    const getStatusTheme = (status) => {
        switch (status) {
            case 'approved': return { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircleIcon, iconColor: 'text-emerald-500' };
            case 'rejected': return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: XCircleIcon, iconColor: 'text-red-500' };
            default: return { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: ClockIcon, iconColor: 'text-amber-500' };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/30 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center mb-1">
                        <ClipboardDocumentListIcon className="h-7 w-7 mr-3 text-blue-600" />
                        My Membership Requests
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Track and manage your club applications and membership status.</p>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white rounded-[32px] p-16 text-center border border-slate-100 shadow-sm animate-in fade-in duration-700">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-6">
                        <InformationCircleIcon className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No Membership Requests Yet</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Explore clubs and apply to join them. Your application history will appear here.</p>
                    <Link to="/clubs" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-200">
                        Browse Clubs
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request, idx) => {
                        const theme = getStatusTheme(request.status);
                        const StatusIcon = theme.icon;

                        return (
                            <div 
                                key={request._id} 
                                className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${theme.bg} ${theme.border}`}>
                                            <StatusIcon className={`w-6 h-6 ${theme.iconColor}`} />
                                        </div>
                                        <div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${theme.bg} ${theme.color} ${theme.border}`}>
                                                {request.status}
                                            </span>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">
                                                REQ-{request._id.slice(-4).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {request.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(request)}
                                                className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100/50"
                                                title="Edit Message"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(request._id)}
                                                className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100/50"
                                                title="Cancel Request"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shrink-0">
                                            {request.clubId?.image ? (
                                                <img
                                                    src={request.clubId.image.startsWith('http') ? request.clubId.image : `http://localhost:5000/${request.clubId.image.replace(/\\/g, '/')}`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-lg">🎯</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                                                {request.clubId?.name || 'Unknown Club'}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-xs text-slate-500 font-medium italic line-clamp-3 leading-relaxed">
                                            "{request.message}"
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied Date</span>
                                        <span className="text-[10px] font-bold text-slate-600">{new Date(request.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Edit Modal */}
            {editingRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-900 p-8 text-white relative">
                            <button
                                onClick={() => setEditingRequest(null)}
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                                <PencilSquareIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">Edit Application</h3>
                            <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">Update your message to {editingRequest.clubId?.name}</p>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Your Message</label>
                                <textarea
                                    rows="4"
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all resize-none shadow-inner"
                                    placeholder="Enter your updated message..."
                                    value={editMessage}
                                    onChange={(e) => setEditMessage(e.target.value)}
                                />
                            </div>
                            
                            <button
                                onClick={handleUpdate}
                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRequests;

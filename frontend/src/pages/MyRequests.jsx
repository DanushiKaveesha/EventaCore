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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
            case 'rejected': return <XCircleIcon className="w-5 h-5 text-red-500" />;
            default: return <ClockIcon className="w-5 h-5 text-amber-500" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <div className="flex items-center space-x-4 mb-10">
                <div className="bg-blue-600 p-3 rounded-[20px] shadow-lg shadow-blue-100">
                    <ClipboardDocumentListIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Membership Requests</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Manage your club applications</p>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                    <InformationCircleIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">You haven't made any membership requests yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {requests.map((request) => (
                        <div key={request._id} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center space-x-5">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center border border-slate-100 shrink-0">
                                        {request.clubId?.image ? (
                                            <img 
                                                src={request.clubId.image.startsWith('http') ? request.clubId.image : `http://localhost:5000/${request.clubId.image.replace(/\\/g, '/')}`} 
                                                alt="" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl">🎯</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {request.clubId?.name || 'Unknown Club'}
                                        </h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            {getStatusIcon(request.status)}
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                request.status === 'approved' ? 'text-emerald-600' : 
                                                request.status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                                            }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-grow max-w-md">
                                    <p className="text-slate-500 text-xs font-medium line-clamp-2 italic">
                                        "{request.message}"
                                    </p>
                                </div>

                                <div className="flex items-center space-x-3 shrink-0">
                                    {request.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => handleEdit(request)}
                                                className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                            >
                                                <PencilSquareIcon className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(request._id)}
                                                className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl p-8 sm:p-10 relative animate-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setEditingRequest(null)}
                            className="absolute top-6 right-6 p-2 rounded-2xl hover:bg-slate-100 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6 text-slate-400" />
                        </button>

                        <h3 className="text-xl font-black text-slate-900 mb-6">Edit Membership Request</h3>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Message to the club</label>
                            <textarea 
                                rows="4"
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all resize-none"
                                value={editMessage}
                                onChange={(e) => setEditMessage(e.target.value)}
                            />
                            <button 
                                onClick={handleUpdate}
                                className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all mt-4"
                            >
                                Update Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRequests;

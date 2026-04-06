import React, { useState, useEffect } from 'react';
import { getMyEventRequests } from '../services/eventRegistrationService';
import {
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    MapPinIcon,
    InboxIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MyEventRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            const data = await getMyEventRequests(user?._id);
            setRequests(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
        </div>
    );

    const getStatusTheme = (status) => {
        switch (status) {
            case 'approved': return { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircleIcon, iconColor: 'text-emerald-500' };
            case 'rejected': return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: XCircleIcon, iconColor: 'text-red-500' };
            default: return { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: ClockIcon, iconColor: 'text-amber-500' };
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/30 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center mb-1">
                        <CalendarDaysIcon className="h-7 w-7 mr-3 text-purple-600" />
                        My Events
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Track your upcoming event registrations and attendances.</p>
                </div>
            </div>

            {/* List */}
            {requests.length === 0 ? (
                <div className="bg-white rounded-[32px] p-16 text-center border border-slate-100 shadow-sm animate-in fade-in duration-700">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-6">
                        <InboxIcon className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No Event RSVPs Yet</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Explore clubs and register for their upcoming events to see them tracked here.</p>
                    <Link to="/clubs" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-purple-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-purple-200">
                        Explore Clubs
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((req, idx) => {
                        const theme = getStatusTheme(req.status);
                        const StatusIcon = theme.icon;

                        return (
                            <div
                                key={req._id}
                                className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${theme.bg} ${theme.border}`}>
                                            <StatusIcon className={`w-6 h-6 ${theme.iconColor}`} />
                                        </div>
                                        <div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${theme.bg} ${theme.color} ${theme.border}`}>
                                                {req.status}
                                            </span>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">
                                                RSVP-{req._id.slice(-4).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-600 transition-colors leading-tight mb-1">
                                            {req.eventName}
                                        </h3>
                                        <div className="flex items-center text-sm font-bold text-slate-500">
                                            <span>Hosted by {req.clubId?.name || 'Club'}</span>
                                        </div>
                                    </div>

                                    {/* Additional info visually grouped */}
                                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                        <div className="flex items-start text-xs font-medium text-slate-600">
                                            <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400 w-24">Message:</span>
                                            <span className="italic truncate" title={req.message}>"{req.message}"</span>
                                        </div>
                                        <div className="flex items-start text-xs font-medium text-slate-600">
                                            <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-400 w-24">Applied:</span>
                                            <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyEventRequests;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getClubById } from '../services/clubService';
import { requestMembership } from '../services/membershipService';
import {
  ArrowLeftIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  SparklesIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const MembershipRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        studentName: 'John Doe',
        studentId: 'ST12345',
        email: 'john@example.com',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        getClubById(id)
            .then(setClub)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await requestMembership({ ...formData, clubId: id });
            setSubmitStatus({ type: 'success', message: 'Request submitted successfully!' });
            setTimeout(() => {
                navigate('/my-requests');
            }, 2000);
        } catch (err) {
            setSubmitStatus({ type: 'error', message: err || 'Failed to submit request' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (!club) {
        return (
            <div className="py-24 text-center">
                <p className="text-gray-400 text-lg mb-4">Club not found.</p>
                <Link to="/clubs" className="inline-flex items-center text-blue-600 font-bold hover:underline">
                    <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Clubs
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
                <Link to="/clubs" className="hover:text-blue-600 transition-colors">Clubs</Link>
                <ChevronRightIcon className="w-3 h-3" />
                <Link to={`/clubs/${id}`} className="hover:text-blue-600 transition-colors">{club.name}</Link>
                <ChevronRightIcon className="w-3 h-3" />
                <span className="text-slate-900">Request Membership</span>
            </nav>

            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col md:flex-row">
                {/* Sidebar Info */}
                <div className="md:w-1/3 bg-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl w-fit mb-6 border border-white/10">
                            <UserGroupIcon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-4 leading-tight text-white">Join the {club.name}</h1>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            Become a member and start contributing to our amazing community.
                        </p>
                    </div>

                    <div className="mt-12 space-y-6 relative z-10">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <CheckBadgeIcon className="w-5 h-5 text-blue-400" />
                            </div>
                            <p className="text-xs font-bold text-slate-300">Fast Application Process</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <SparklesIcon className="w-5 h-5 text-purple-400" />
                            </div>
                            <p className="text-xs font-bold text-slate-300">Exclusive Club Events</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="md:w-2/3 p-8 sm:p-12">
                    {submitStatus && (
                        <div className={`mb-8 p-6 rounded-3xl text-sm font-bold flex items-center space-x-4 animate-in slide-in-from-top-4 duration-300 ${
                            submitStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                            <div className={`p-2 rounded-xl ${submitStatus.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                {submitStatus.type === 'success' ? <CheckBadgeIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                            </div>
                            <span>{submitStatus.message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Enter your name"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all placeholder:text-slate-300"
                                    value={formData.studentName}
                                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Student ID</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="ST00000"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all placeholder:text-slate-300"
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                            <input 
                                type="email" 
                                required
                                placeholder="name@university.com"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all placeholder:text-slate-300"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Why do you want to join?</label>
                            <textarea 
                                required
                                rows="5"
                                placeholder="Share your motivation and skills..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all resize-none placeholder:text-slate-300"
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            />
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full sm:flex-1 py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                            >
                                {submitting ? 'Sending Application...' : 'Submit Application'}
                            </button>
                            <Link 
                                to={`/clubs/${id}`}
                                className="w-full sm:w-auto px-8 py-5 bg-slate-100 text-slate-600 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] text-center hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MembershipRequest;

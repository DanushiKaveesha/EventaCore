import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClubById } from '../services/clubService';
import { registerForEvent } from '../services/eventRegistrationService';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const EventRegistration = () => {
    const { clubId, eventId } = useParams();
    const navigate = useNavigate();
    
    const [club, setClub] = useState(null);
    const [targetEvent, setTargetEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        studentName: 'John Doe',
        studentId: 'ST12345',
        email: 'john@student.university.edu',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        getClubById(clubId)
            .then(data => {
                setClub(data);
                const ev = data.events?.find(e => e._id === eventId);
                setTargetEvent(ev || null);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [clubId, eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus({ type: 'processing', message: 'Securing your spot...' });
        
        try {
            await registerForEvent({
                ...formData,
                clubId: clubId,
                eventId: eventId,
                eventName: targetEvent.name
            });
            
            setSubmitStatus({ type: 'success', message: 'You have successfully RSVPd!' });
            setTimeout(() => {
                navigate('/my-requests');
            }, 2500);
        } catch (err) {
            setSubmitStatus({ type: 'error', message: err || 'Registration failed. Please try again.' });
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
    );

    if (!club || !targetEvent) return (
        <div className="py-24 text-center">
            <CalendarDaysIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Event Not Found</h2>
            <p className="text-slate-500 font-medium.">This event may have been cancelled or removed.</p>
        </div>
    );

    const eventDate = new Date(targetEvent.date);

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-purple-100 to-blue-50 border border-purple-100 shadow-inner mb-6">
                    <CalendarDaysIcon className="w-10 h-10 text-purple-600" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 drop-shadow-sm">
                    {targetEvent.name}
                </h1>
                <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                    Hosted by <span className="font-bold text-slate-800">{club.name}</span>
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs font-black uppercase tracking-widest text-purple-600 bg-purple-50 w-fit mx-auto px-4 py-1.5 rounded-full">
                    {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {/* Application Form */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <form onSubmit={handleSubmit} className="p-8 sm:p-12">
                    
                    {submitStatus && (
                        <div className={`mb-8 p-6 rounded-2xl flex items-center space-x-4 border animate-in slide-in-from-top-4 ${
                            submitStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                            submitStatus.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' :
                            'bg-blue-50 border-blue-100 text-blue-800'
                        }`}>
                            {submitStatus.type === 'success' ? <CheckCircleIcon className="w-8 h-8 text-emerald-500 shrink-0" /> :
                             submitStatus.type === 'processing' ? <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin shrink-0"/> :
                             <span className="text-2xl shrink-0">⚠️</span>}
                            <div>
                                <h4 className="font-black tracking-tight">{submitStatus.type === 'success' ? 'Registration Complete!' : submitStatus.type === 'error' ? 'Attention Needed' : 'Processing...'}</h4>
                                <p className="text-sm font-medium opacity-90">{submitStatus.message}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-10">
                        {/* Section 1: Student Identity */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <UserCircleIcon className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 flex-grow tracking-tight">Student Information</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
                                        value={formData.studentName}
                                        onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Student ID</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">University Email</label>
                                    <div className="relative">
                                        <EnvelopeIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input 
                                            type="email" 
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-300"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Motivation */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                                    <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 flex-grow tracking-tight">Additional Notes</h3>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Any dietary requirements or questions?</label>
                                <textarea 
                                    required
                                    rows="4"
                                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-slate-300 resize-none leading-relaxed"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="I'm excited to attend! I have a vegetarian diet..."
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-6 border-t border-slate-100">
                            <button 
                                type="submit" 
                                disabled={submitting || submitStatus?.type === 'success'}
                                className={`w-full group relative inline-flex items-center justify-center px-8 py-5 text-sm font-black text-white uppercase tracking-widest transition-all duration-300 rounded-2xl overflow-hidden ${
                                    submitStatus?.type === 'success' ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-1'
                                }`}
                            >
                                <span className="relative z-10 flex items-center">
                                    {submitting ? 'Processing...' : submitStatus?.type === 'success' ? 'Success' : 'Secure My Spot'}
                                    {!submitting && submitStatus?.type !== 'success' && <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventRegistration;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getClubById } from '../services/clubService';
import { requestMembership } from '../services/membershipService';
import {
    ArrowLeftIcon,
    UserGroupIcon,
    CheckBadgeIcon,
    SparklesIcon,
    ChevronRightIcon,
    BuildingLibraryIcon,
    DocumentArrowUpIcon,
    MapPinIcon
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
    const [paymentDetails, setPaymentDetails] = useState({
        bankName: '',
        branchName: '',
        paymentSlip: null
    });
    const [debouncedBankName, setDebouncedBankName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        getClubById(id)
            .then(setClub)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    // Debounce bank name for the live map to prevent iframe flashing while typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedBankName(paymentDetails.bankName);
        }, 800);
        return () => clearTimeout(timer);
    }, [paymentDetails.bankName]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paymentDetails.paymentSlip) {
            setSubmitStatus({ type: 'error', message: 'Please upload a payment slip.' });
            return;
        }

        setSubmitting(true);
        setSubmitStatus({ type: 'processing', message: 'Uploading your application and payment receipt...' });

        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('studentName', formData.studentName);
            formDataToSubmit.append('studentId', formData.studentId);
            formDataToSubmit.append('email', formData.email);
            formDataToSubmit.append('message', formData.message);
            formDataToSubmit.append('clubId', id);
            formDataToSubmit.append('bankName', paymentDetails.bankName);
            formDataToSubmit.append('branchName', paymentDetails.branchName);
            formDataToSubmit.append('paymentSlip', paymentDetails.paymentSlip);

            await requestMembership(formDataToSubmit);

            setSubmitStatus({ type: 'success', message: 'Application submitted successfully!' });
            setTimeout(() => {
                navigate('/my-requests');
            }, 2500);
        } catch (err) {
            setSubmitStatus({ type: 'error', message: err || 'Payment failed. Please try again.' });
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
                        <div className={`mb-8 p-6 rounded-3xl text-sm font-bold flex items-center space-x-4 animate-in slide-in-from-top-4 duration-300 ${submitStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
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
                                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Why do you want to join?</label>
                            <textarea
                                required
                                rows="3"
                                placeholder="Share your motivation and skills..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all resize-none placeholder:text-slate-300"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        {/* Payment Details Section */}
                        <div className="pt-6 mt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 flex items-center">
                                        <BuildingLibraryIcon className="h-5 w-5 mr-2 text-blue-600" />
                                        Bank Transfer Details
                                    </h3>
                                    <p className="text-xs font-bold text-slate-400 mt-1">Please transfer the fee and upload your bank slip.</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Bank Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Bank of Ceylon"
                                            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all placeholder:text-slate-300"
                                            value={paymentDetails.bankName}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, bankName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Branch Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. City Branch"
                                            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all placeholder:text-slate-300"
                                            value={paymentDetails.branchName}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, branchName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Map Section */}
                                {debouncedBankName.length > 2 && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center">
                                            <MapPinIcon className="h-4 w-4 mr-1 text-slate-400" />
                                            Find Nearest {debouncedBankName} Branches
                                        </label>
                                        <div className="w-full h-64 rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 relative group">
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse">
                                                <MapPinIcon className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                loading="lazy"
                                                className="relative z-10"
                                                src={`https://maps.google.com/maps?q=${encodeURIComponent(debouncedBankName + ' branches')}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                                            />
                                            {/* Premium Overlay Shadow */}
                                            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_20px_rgba(0,0,0,0.05)] pointer-events-none z-20 transition-opacity duration-300"></div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Upload Payment Slip</label>
                                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-colors p-6 text-center cursor-pointer">
                                        <input
                                            type="file"
                                            required
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentSlip: e.target.files[0] })}
                                        />
                                        <div className="pointer-events-none">
                                            <DocumentArrowUpIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                                            {paymentDetails.paymentSlip ? (
                                                <span className="text-sm font-black text-blue-600 block truncate">{paymentDetails.paymentSlip.name}</span>
                                            ) : (
                                                <span className="text-sm font-bold text-slate-400">Click to upload or drag and drop<br /><span className="text-xs font-medium text-slate-300">PNG, JPG up to 5MB</span></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
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

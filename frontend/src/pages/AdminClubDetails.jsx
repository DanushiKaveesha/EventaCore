import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClubById } from '../services/clubService';
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ClockIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import AdminSidebar from './admin/AdminSidebar';

const AdminClubDetails = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        const data = await getClubById(id);
        setClub(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-200 text-center">
          <InformationCircleIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-2xl font-bold mb-2">Club Not Found</h3>
          <p className="mb-6">{error || "The club you're looking for doesn't exist or has been removed."}</p>
          <Link to="/admin/clubs" className="inline-flex items-center text-blue-600 font-bold hover:underline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryImage = (category) => {
    switch (category) {
      case 'Academic': return '📚';
      case 'Sports': return '⚽';
      case 'Arts': return '🎨';
      case 'Community Service': return '🤝';
      case 'Technology': return '💻';
      default: return '🎯';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <AdminSidebar activeOverride="clubs" />
      
      <div className="flex-1 w-full pb-20 relative px-0">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#173F8E] via-[#2F217A] to-[#40136A] pt-12 pb-32 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-20"></div>
          <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
            <Link to="/admin/clubs" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-8 group">
              <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold tracking-tight">Back to Dashboard</span>
            </Link>

            <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[40px] bg-white p-2 shadow-2xl relative">
                <div className="w-full h-full rounded-[32px] overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                  {club.image ? (
                    <img
                      src={club.image.startsWith('http') ? club.image : `http://localhost:5000/${club.image.replace(/\\/g, '/')}`}
                      alt={club.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BuildingOfficeIcon className="w-16 h-16 text-gray-300" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
                  <span className="text-2xl">{getCategoryImage(club.category)}</span>
                </div>
              </div>

              <div className="text-center md:text-left text-white flex-grow">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  {club.category || 'Official Club'}
                </div>
                <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight tracking-tight drop-shadow-lg">
                  {club.name}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center space-x-2 text-white/80 font-medium">
                    <MapPinIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">{club.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80 font-medium">
                    <UserIcon className="w-5 h-5 text-purple-400" />
                    <span className="text-sm">Led by {club.president}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: About & Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/60 border border-slate-100">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                    <InformationCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">About the Club</h3>
                </div>
                <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line font-medium">
                  {club.description}
                </p>
              </div>

              {/* Internal Events Section */}
              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
                {/* Event background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 blur-[100px] -mr-32 -mt-32"></div>

                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-600 p-2.5 rounded-2xl shadow-lg shadow-purple-200">
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Club Calendar</h3>
                  </div>
                  <span className="bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                    {club.events?.length || 0} Total Events
                  </span>
                </div>

                <div className="space-y-6 relative z-10">
                  {(!club.events || club.events.length === 0) ? (
                    <div className="text-center py-12 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                      <SparklesIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold">No internal events scheduled yet.</p>
                    </div>
                  ) : (
                    club.events.map((event, index) => (
                      <div
                        key={index}
                        className="group bg-slate-50/50 hover:bg-white p-6 rounded-[32px] border border-transparent hover:border-purple-100 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-5">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex flex-col items-center justify-center p-2 border border-purple-50 shrink-0">
                              <span className="text-[10px] font-black text-purple-600 uppercase tracking-tighter">
                                {new Date(event.date).toLocaleString('default', { month: 'short' })}
                              </span>
                              <span className="text-2xl font-black text-slate-900 leading-none">
                                {new Date(event.date).getDate()}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-base font-black text-slate-900 group-hover:text-purple-600 transition-colors uppercase tracking-tight">
                                {event.name}
                              </h4>
                              <div className="flex items-center space-x-4 mt-1 text-slate-500 font-bold text-xs uppercase tracking-widest">
                                <span className="flex items-center text-purple-600">
                                  <ClockIcon className="w-3.5 h-3.5 mr-1" />
                                  {event.startTime || "TBA"}
                                </span>
                                <span className="flex items-center">
                                  <MapPinIcon className="w-3.5 h-3.5 mr-1" />
                                  {event.location || 'Club Premises'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-500 text-xs font-medium line-clamp-2 max-w-sm ml-0 sm:ml-4">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Contact & Sidebar */}
            <div className="space-y-8">
              <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></div>
                  Connect Today
                </h3>

                <div className="space-y-5">
                  <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 transition-all group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2.5 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <EnvelopeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">Club Email</p>
                        <p className="text-xs font-bold text-slate-900 break-all">{club.contact_information?.split(',')[0]?.replace('Email: ', '') || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-purple-100 transition-all group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-2.5 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <PhoneIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">Support Contact</p>
                        <p className="text-xs font-bold text-slate-900 break-all">{club.contact_information?.split(',')[1]?.replace(' Phone: ', '') || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-slate-400 tracking-widest uppercase">Platform Status</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Verified active</span>
                  </div>
                  <button className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-[0.1em] hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                    Join Community
                  </button>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-md">
                  <UserGroupIcon className="w-8 h-8 text-blue-500 mb-2" />
                  <h5 className="text-xl font-black text-slate-900 leading-none">Global</h5>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Impact</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-md">
                  <GlobeAltIcon className="w-8 h-8 text-amber-500 mb-2" />
                  <h5 className="text-xl font-black text-slate-900 leading-none">SLIIT</h5>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClubDetails;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllClubs, deleteClub, addEvent } from '../services/clubService';
import { MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, CalendarIcon, UserGroupIcon, BuildingOfficeIcon, DocumentTextIcon, CheckBadgeIcon, EyeIcon } from '@heroicons/react/24/outline';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    name: '',
    date: '',
    description: '',
    location: ''
  });
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const data = await getAllClubs();
      setClubs(data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to drop the club ${name}? This action cannot be undone.`)) {
      try {
        await deleteClub(id);
        setClubs(clubs.filter(club => club._id !== id));
      } catch (err) {
        alert('Error deleting club: ' + err.toString());
      }
    }
  };

  const handleAddEvent = (club) => {
    setSelectedClub(club);
    setEventFormData({
      name: '',
      date: '',
      description: '',
      location: club.location || ''
    });
    setIsEventModalOpen(true);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingEvent(true);
    try {
      const response = await addEvent(selectedClub._id, eventFormData);
      // Update local state to reflect the new event count/data
      setClubs(clubs.map(c => c._id === selectedClub._id ? response : c));
      setIsEventModalOpen(false);
      alert('Event added successfully!');
    } catch (err) {
      alert('Error adding event: ' + err.toString());
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  const filteredClubs = clubs.filter(club =>
    club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalClubs = clubs.length;
  const categoriesCount = new Set(clubs.map(c => c.category)).size;
  const activeLocations = new Set(clubs.map(c => c.location)).size;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          <h3 className="font-bold text-lg mb-1">Error Loading Clubs</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-[#173F8E] via-[#2F217A] to-[#40136A] rounded-3xl pt-8 pb-16 px-6 relative overflow-hidden shadow-lg">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between relative z-10 gap-4">
          <div className="max-w-xl text-white">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight drop-shadow-md">Club Dashboard</h1>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed opacity-90 max-w-md">
              Monitor platform metrics, curate active clubs, and organize your master club schedule with absolute precision.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/create-club"
              className="inline-flex items-center space-x-2 bg-white text-[#2F217A] hover:bg-blue-50 px-5 py-2.5 rounded-xl font-bold shadow-md transition-transform hover:-translate-y-0.5 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              <span>Launch New Club</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Row (Overlapping the banner) */}
      <div className="w-full relative -mt-8 z-20 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Clubs</p>
              <h3 className="text-xl font-black text-gray-900 leading-none">{totalClubs}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Categories</p>
              <h3 className="text-xl font-black text-gray-900 leading-none">{categoriesCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <BuildingOfficeIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Locations</p>
              <h3 className="text-xl font-black text-gray-900 leading-none">{activeLocations}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
              <CheckBadgeIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Status</p>
              <h3 className="text-lg font-black text-gray-900 leading-none mt-1">Active</h3>
            </div>
          </div>

        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full mb-6">
        <div className="bg-white rounded-2xl p-1.5 flex items-center shadow-sm border border-gray-100">
          <div className="flex items-center flex-grow bg-slate-50/80 rounded-xl px-4 py-2 border border-gray-100/50">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clubs by name or location…"
              className="bg-transparent border-none outline-none w-full text-[13px] font-medium text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="px-4 shrink-0 hidden sm:block">
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-widest">
              {filteredClubs.length} Results
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100">
                  <th className="py-3 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Club Identification</th>
                  <th className="py-3 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">President & Category</th>
                  <th className="py-3 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                  <th className="py-3 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Status/Events</th>
                  <th className="py-3 px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredClubs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center text-gray-500 font-medium">
                      No clubs found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredClubs.map((club) => (
                    <tr key={club._id} className="hover:bg-violet-50/20 transition-colors group">

                      {/* Identity */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
                            {club.image ? (
                              <img
                                src={club.image.startsWith('http') ? club.image : `http://localhost:5000/${club.image.replace(/\\/g, '/')}`}
                                alt={club.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <BuildingOfficeIcon className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-gray-900 text-xs mb-0.5 truncate max-w-[140px]">{club.name}</h3>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] font-black bg-blue-50 text-blue-600 uppercase tracking-widest border border-blue-100">
                              {club.category || 'General'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* President & Bio */}
                      <td className="py-3 px-4">
                        <div className="font-black text-gray-800 text-xs mb-0.5">{club.president || 'Unassigned'}</div>
                        <div className="text-gray-400 text-[10px] flex items-center font-bold">
                          <DocumentTextIcon className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate max-w-[140px]">{club.description || 'No description'}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4">
                        <span className="inline-block whitespace-nowrap px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 rounded-lg text-[10px] font-black tracking-wide max-w-[140px] truncate">
                          {club.location || 'TBA'}
                        </span>
                      </td>

                      {/* Status & Events */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col space-y-1.5 items-start">
                          <span className="inline-flex px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[8px] font-black uppercase tracking-widest">
                            Active
                          </span>
                          <span className="inline-flex items-center space-x-1 text-[9px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{club.events?.length || 0} Events</span>
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5 opacity-100 transition-opacity">
                          <button
                            onClick={() => handleAddEvent(club)}
                            className="inline-flex items-center justify-center w-8 h-8 text-purple-600 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 hover:scale-105 transition-all"
                            title="Add Event"
                          >
                            <CalendarIcon className="w-4 h-4" />
                          </button>

                          <Link
                            to={`/admin/clubs/${club._id}`}
                            className="inline-flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 hover:scale-105 transition-all"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/clubs/${club._id}/edit`}
                            className="inline-flex items-center justify-center w-8 h-8 text-amber-600 bg-amber-50 border border-amber-100 rounded-lg hover:bg-amber-100 hover:scale-105 transition-all"
                            title="Edit Club"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(club._id, club.name)}
                            className="inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:scale-105 transition-all"
                            title="Drop Club"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
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

      {/* Event Creation Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 animate-scaleIn">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white relative">
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <CalendarIcon className="w-12 h-12 mb-4 opacity-50" />
              <h2 className="text-3xl font-extrabold tracking-tight">Add Club Event</h2>
              <p className="text-purple-100 text-sm mt-2 font-medium opacity-90">Organize a new activity for {selectedClub?.name}</p>
            </div>

            <form onSubmit={handleEventSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventFormData.name}
                  onChange={(e) => setEventFormData({ ...eventFormData, name: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-bold text-gray-800 placeholder-gray-400"
                  placeholder="e.g. Weekly Workshop, Annual Meetup"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Location</label>
                  <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-bold text-gray-800 placeholder-gray-400"
                    placeholder="e.g. Room 301"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  required
                  rows="3"
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-bold text-gray-800 placeholder-gray-400 resize-none"
                  placeholder="What's happening in this event?"
                />
              </div>

              <div className="pt-2 flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={isSubmittingEvent}
                  className={`w-full py-4 rounded-2xl font-black text-white shadow-xl shadow-purple-200 transition-all active:scale-[0.98]
                    ${isSubmittingEvent
                      ? 'bg-purple-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-300'
                    }`}
                >
                  {isSubmittingEvent ? 'Saving Event...' : 'Launch Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="w-full py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Discard Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clubs;

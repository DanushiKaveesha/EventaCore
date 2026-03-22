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
      alert('Event added successfully! 🎉');
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
      <div className="bg-gradient-to-r from-[#173F8E] via-[#2F217A] to-[#40136A] rounded-[32px] pt-14 pb-28 px-10 relative overflow-hidden shadow-xl">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between relative z-10">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">Club Dashboard</h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed opacity-90 max-w-md">
              Monitor platform metrics, curate active clubs, and organize your master club schedule with absolute precision.
            </p>
          </div>

          <div className="mt-8 lg:mt-0">
            <Link
              to="/create-club"
              className="inline-flex items-center space-x-2 bg-white text-[#2F217A] hover:bg-blue-50 px-6 py-3.5 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              <span>Launch New Club</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Row (Overlapping the banner) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-16 z-20 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-white rounded-[20px] p-6 shadow-md border border-gray-100 flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Clubs</p>
              <h3 className="text-3xl font-extrabold text-gray-900 leading-none">{totalClubs}</h3>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-md border border-gray-100 flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Categories</p>
              <h3 className="text-3xl font-extrabold text-gray-900 leading-none">{categoriesCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-md border border-gray-100 flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <BuildingOfficeIcon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Locations</p>
              <h3 className="text-3xl font-extrabold text-gray-900 leading-none">{activeLocations}</h3>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-md border border-gray-100 flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
              <CheckBadgeIcon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Platform Status</p>
              <h3 className="text-xl font-extrabold text-gray-900 leading-none mt-1">Active</h3>
            </div>
          </div>

        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="bg-white rounded-[16px] p-2 flex items-center shadow-sm border border-gray-100">
          <div className="flex items-center flex-grow bg-gray-50 rounded-xl px-4 py-3 border border-gray-100/50">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clubs by name or location..."
              className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="px-6 shrink-0 hidden sm:block">
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
              Showing {filteredClubs.length} results
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-5 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest bg-white">Club Identification</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest bg-white">President & Category</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest bg-white">Location</th>
                  <th className="py-5 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest bg-white">Status/Events</th>
                  <th className="py-5 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest bg-white text-right">Actions</th>
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
                    <tr key={club._id} className="hover:bg-gray-50/50 transition-colors group">

                      {/* Identity */}
                      <td className="py-4 px-8">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-2xl bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
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
                                <BuildingOfficeIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-gray-900 text-sm mb-1">{club.name}</h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wide">
                              {club.category || 'General'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* President & Bio */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-800 text-sm mb-1">{club.president || 'Unassigned'}</div>
                        <div className="text-gray-400 text-xs flex items-center font-medium">
                          <DocumentTextIcon className="w-3.5 h-3.5 mr-1" />
                          <span className="truncate max-w-[150px]">{club.description || 'No description provided'}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6">
                        <span className="px-3.5 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[11px] font-bold tracking-wide">
                          {club.location || 'TBA'}
                        </span>
                      </td>

                      {/* Status & Events */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col space-y-2">
                          <span className="inline-flex px-3.5 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-extrabold uppercase tracking-wide w-fit">
                            Active
                          </span>
                          <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md w-fit">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>{club.events?.length || 0} Events</span>
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-8 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-100 lg:opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleAddEvent(club)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>Add Event</span>
                          </button>

                          <Link
                            to={`/admin/clubs/${club._id}`}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <EyeIcon className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>

                          <Link
                            to={`/clubs/${club._id}/edit`}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                          >
                            <PencilSquareIcon className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>

                          <button
                            onClick={() => handleDelete(club._id, club.name)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                            <span>Drop</span>
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
                  onChange={(e) => setEventFormData({...eventFormData, name: e.target.value})}
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
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({...eventFormData, date: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-bold text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Location</label>
                  <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({...eventFormData, location: e.target.value})}
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
                  onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
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

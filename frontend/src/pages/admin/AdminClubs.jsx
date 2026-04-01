import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { getAllClubs, deleteClub, addEvent } from '../../services/clubService';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  TrashIcon,
  EyeIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

const AdminClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    name: '',
    date: '',
    startTime: '',
    description: '',
    location: ''
  });
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
  const [eventTimeError, setEventTimeError] = useState("");

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const data = await getAllClubs();
      setClubs(data);
    } catch (err) {
      console.error('Failed to fetch clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently delete the club "${name}"?`)) {
      try {
        await deleteClub(id);
        setClubs(clubs.filter(c => c._id !== id));
      } catch (err) {
        alert('Failed: ' + err);
      }
    }
  };

  const handleAddEvent = (club) => {
    setSelectedClub(club);
    setEventFormData({
      name: '',
      date: '',
      startTime: '',
      description: '',
      location: club.location || ''
    });
    setIsEventModalOpen(true);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (eventTimeError) return;
    setIsSubmittingEvent(true);
    try {
      const updatedClub = await addEvent(selectedClub._id, eventFormData);
      // Update local state to reflect the new event count
      setClubs(clubs.map(c => c._id === selectedClub._id ? updatedClub : c));
      setIsEventModalOpen(false);
      alert('Event added successfully!');
    } catch (err) {
      alert('Error adding event: ' + err.toString());
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  // Compute analytics
  const totalClubs = clubs.length;

  // Categories Map
  const categoryMap = {};
  clubs.forEach(c => {
    const cat = c.category || 'General';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const pieData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  // Active Clubs by Events
  const topActiveClubs = [...clubs]
    .sort((a, b) => (b.events?.length || 0) - (a.events?.length || 0))
    .slice(0, 5)
    .map(c => ({
      name: c.name,
      events: c.events?.length || 0
    }));

  const categories = ['all', ...Object.keys(categoryMap)];

  const filtered = clubs.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchSearch = c.name?.toLowerCase().includes(q) || c.location?.toLowerCase().includes(q);
    const matchCat = filterCategory === 'all' || (c.category || 'General') === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar activeOverride="clubs" />

      {/* Main scrollable area */}
      <div className="flex-1 min-w-0 p-5 lg:p-8 space-y-6 overflow-y-auto w-full">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <SparklesIcon className="h-4 w-4 text-violet-500" />
              <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Admin Panel</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">Club Management</h1>
            <p className="text-gray-400 text-xs font-medium mt-0.5">Overview, analytics, and control center for all campus clubs.</p>
          </div>
          <Link
            to="/create-club"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-black text-[10px] shadow-lg shadow-violet-200 hover:-translate-y-0.5 transition-all uppercase tracking-wider whitespace-nowrap"
          >
            <UserGroupIcon className="h-4 w-4" />
            + Register New Club
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
              <BuildingOfficeIcon className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Clubs</p>
              <h3 className="text-2xl font-black text-slate-800 leading-none mt-1">{totalClubs}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categories</p>
              <h3 className="text-2xl font-black text-slate-800 leading-none mt-1">{categories.length - 1}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <CalendarDaysIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Events</p>
              <h3 className="text-2xl font-black text-slate-800 leading-none mt-1">
                {clubs.reduce((acc, c) => acc + (c.events?.length || 0), 0)}
              </h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <CheckBadgeIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Clubs</p>
              <h3 className="text-2xl font-black text-slate-800 leading-none mt-1">{totalClubs > 0 ? totalClubs : 0}</h3>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {totalClubs > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-80 flex flex-col">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Clubs by Category</h2>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-80 flex flex-col">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Top 5 Clubs (By Events)</h2>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topActiveClubs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="events" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-3 items-center mt-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search clubs by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${filterCategory === c ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-700 shadow-sm'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <BuildingOfficeIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-bold">No clubs found matching criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Club Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Events</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(club => (
                    <tr key={club._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {club.image ? (
                            <img src={club.image.startsWith('http') ? club.image : `http://localhost:5000/${club.image.replace(/\\/g, '/')}`} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0 shadow-sm" alt="" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                              <BuildingOfficeIcon className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-black text-slate-900 leading-tight">{club.name}</p>
                            <span className="inline-flex mt-1 text-[9px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                              {club.category || 'General'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          {club.location || 'Not Set'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black border border-emerald-100">
                            {club.events?.length || 0}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scheduled</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAddEvent(club)}
                            className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all shadow-sm border border-emerald-100/50"
                            title="Add Event"
                          >
                            <CalendarDaysIcon className="w-4 h-4" />
                          </button>
                          <Link to={`/admin/clubs/${club._id}`} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all shadow-sm border border-blue-100/50" title="View details">
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                          <Link to={`/clubs/${club._id}/edit`} className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-all shadow-sm border border-amber-100/50" title="Edit club">
                            <PencilSquareIcon className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(club._id, club.name)} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-all shadow-sm border border-red-100/50" title="Delete club">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
            <span>Showing {filtered.length} of {clubs.length} Clubs</span>
          </div>
        </div>

        {/* Event Creation Modal */}
        {isEventModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-r from-violet-600 to-indigo-700 p-8 text-white relative">
                <button
                  onClick={() => setIsEventModalOpen(false)}
                  className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <CalendarDaysIcon className="w-12 h-12 mb-4 opacity-50" />
                <h2 className="text-3xl font-extrabold tracking-tight leading-none">Add Club Event</h2>
                <p className="text-violet-100 text-xs mt-2 font-medium opacity-90 tracking-wide uppercase">Organize a new activity for {selectedClub?.name}</p>
              </div>

              <form onSubmit={handleEventSubmit} className="p-8 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventFormData.name}
                    onChange={(e) => setEventFormData({ ...eventFormData, name: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-bold text-slate-800 placeholder-slate-400 text-sm"
                    placeholder="e.g. Weekly Workshop, Annual Meetup"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={eventFormData.date}
                      onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-bold text-slate-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Start Time</label>
                    <input
                      type="time"
                      required
                      min={eventFormData.date === new Date().toISOString().split('T')[0] ? new Date().toTimeString().slice(0, 5) : undefined}
                      value={eventFormData.startTime}
                      onChange={(e) => {
                        const time = e.target.value;
                        const now = new Date();
                        const today = now.toISOString().split('T')[0];
                        if (eventFormData.date === today && time) {
                          const [h, m] = time.split(':').map(Number);
                          const sel = new Date();
                          sel.setHours(h, m, 0, 0);
                          if (sel <= now) {
                            setEventTimeError("Please select a future time");
                          } else {
                            setEventTimeError("");
                          }
                        } else {
                          setEventTimeError("");
                        }
                        setEventFormData({ ...eventFormData, startTime: time });
                      }}
                      className={`w-full px-5 py-3 rounded-2xl bg-slate-50 border transition-all outline-none font-bold text-slate-800 text-sm
                        ${eventTimeError ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-100 focus:bg-white focus:border-violet-500 focus:ring-violet-500/10'}`}
                    />
                    {eventTimeError && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{eventTimeError}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</label>
                  <input
                    type="text"
                    required
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-bold text-slate-800 placeholder-slate-400 text-sm"
                    placeholder="e.g. SLIIT Malabe Campus"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    required
                    rows="3"
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-bold text-slate-800 placeholder-slate-400 text-sm resize-none"
                    placeholder="What's happening in this event?"
                  />
                </div>

                <div className="pt-2 flex flex-col space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmittingEvent || !!eventTimeError}
                    className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-[0.98]
                      ${(isSubmittingEvent || !!eventTimeError)
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:shadow-violet-400 shadow-violet-200'
                      }`}
                  >
                    {isSubmittingEvent ? 'Saving Event...' : 'Launch Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEventModalOpen(false)}
                    className="w-full py-2 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                  >
                    Discard Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminClubs;

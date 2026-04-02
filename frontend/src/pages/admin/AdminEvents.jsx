import React, { useEffect, useState } from 'react';
import { getEvents, deleteEvent } from '../../services/eventService';
import {
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  TagIcon,
  CheckCircleIcon,
  MapPinIcon,
  ClockIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminStats from '../../components/admin/AdminStats';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#38bdf8', '#34d399', '#94a3b8'];

const STATUS_CONFIG = {
  upcoming: { label: 'Upcoming', dot: 'bg-sky-400', badge: 'bg-sky-50 text-sky-700 border-sky-200' },
  ongoing: { label: 'Ongoing', dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', dot: 'bg-gray-300', badge: 'bg-gray-100 text-gray-500 border-gray-200' },
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)));
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Permanently delete this event?')) {
      try {
        await deleteEvent(id);
        setEvents(events.filter(e => e._id !== id));
      } catch (err) { alert('Failed: ' + err); }
    }
  };

  const filtered = events.filter(e => {
    const q = searchTerm.toLowerCase();
    const matchSearch = (e.name || '').toLowerCase().includes(q) || (e.location || '').toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'Total', value: events.length, icon: ChartBarIcon, from: 'from-violet-600', to: 'to-indigo-600' },
    { label: 'Upcoming', value: events.filter(e => e.status === 'upcoming').length, icon: CalendarDaysIcon, from: 'from-sky-500', to: 'to-cyan-500' },
    { label: 'Ongoing', value: events.filter(e => e.status === 'ongoing').length, icon: TagIcon, from: 'from-emerald-500', to: 'to-teal-500' },
    { label: 'Completed', value: events.filter(e => e.status === 'completed').length, icon: CheckCircleIcon, from: 'from-slate-500', to: 'to-slate-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <AdminSidebar />

      {/* Main scrollable area */}
      <div className="flex-1 min-w-0 p-5 lg:p-8 space-y-6 overflow-y-auto">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <SparklesIcon className="h-4 w-4 text-violet-500" />
              <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Admin Panel</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">Events Management</h1>
            <p className="text-gray-400 text-xs font-medium mt-0.5">Monitor, update, and control your platform's events.</p>
          </div>
          <Link
            to="/create-event"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-black text-[10px] shadow-lg shadow-violet-200 hover:-translate-y-0.5 transition-all uppercase tracking-wider whitespace-nowrap"
          >
            <PlusIcon className="h-4 w-4" />
            + Launch New Event
          </Link>
        </div>

        {/* Overall Stats Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {stats.map(({ label, value, icon: Icon, from, to }) => (
            <div key={label} className={`group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br ${from} ${to} shadow-lg shadow-violet-200/20`}>
              <div className="flex items-center justify-between relative z-10">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-4xl font-black text-white">{value}</p>
              </div>
              <p className="mt-4 text-[11px] font-black uppercase tracking-[3px] text-white/70 relative z-10">{label} Events</p>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-700" />
            </div>
          ))}
        </div>


        {/* Analytics Section - Un-redundant Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <AdminStats events={events} />
          </div>
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-100 transition-opacity opacity-0" />
            
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-4 ring-amber-100/30">
              <SparklesIcon className="w-8 h-8 text-amber-500" />
            </div>
            
            <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Pro Admin Tip</h3>
            <ul className="space-y-4 text-xs font-bold text-gray-500 leading-relaxed max-w-[240px]">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0"></div>
                Keep event statuses updated for accurate SEO metrics.
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                Photos drive 80% higher engagement on club drops.
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0"></div>
                Promoted events often see 2.4x higher RSVP rates.
              </li>
            </ul>
            
            <div className="mt-8 pt-8 border-t border-gray-100 w-full">
              <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest bg-violet-50 px-4 py-2 rounded-full inline-block">
                View Admin Guides →
              </p>
            </div>
          </div>
        </div>

        {/* Search + Table Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-[2.5rem] border border-white shadow-2xl shadow-gray-200/50 overflow-hidden">
          <div className="p-8 border-b border-gray-100/50 flex flex-wrap gap-4 items-center justify-between bg-white/40">
            <div className="relative flex-1 min-w-[280px]">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, locations, or descriptions…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-violet-500/10 placeholder-gray-400 transition-all"
              />
            </div>
            <div className="flex items-center bg-gray-50/50 rounded-2xl border border-gray-100 p-1.5 gap-1.5">
              {['all', 'upcoming', 'ongoing', 'completed'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s 
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                      : 'text-gray-400 hover:text-gray-700 hover:bg-white'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="animate-spin h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full shadow-lg" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Catalog...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-32 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CalendarDaysIcon className="w-8 h-8 text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Events Found</h3>
              <p className="text-xs font-bold text-gray-300 mt-1">Try adjusting your filters or launch a new event</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-100 bg-gray-50/60">
                  <tr>
                    {['Event', 'Date & Time', 'Location', 'Status', 'Actions'].map(h => (
                      <th key={h} className={`px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest ${h === 'Actions' ? 'text-right pr-5' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(event => {
                    const s = STATUS_CONFIG[event.status] || STATUS_CONFIG.completed;
                    return (
                      <tr key={event._id} className="hover:bg-violet-50/20 transition-colors">
                        {/* Event */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {event.imageUrl ? (
                              <img src={`http://localhost:5000/${event.imageUrl}`} className="h-11 w-11 rounded-xl object-cover shrink-0 border border-gray-100" alt="" />
                            ) : (
                              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0">
                                <CalendarDaysIcon className="h-5 w-5 text-violet-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-black text-gray-900 truncate max-w-[180px]">{event.name}</p>
                              <span className="text-[9px] font-black text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                {event.tickets?.length || 0} tiers
                              </span>
                            </div>
                          </div>
                        </td>
                        {/* Date & Time */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                            <CalendarDaysIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-0.5">
                            <ClockIcon className="w-3 h-3 shrink-0" />
                            {event.time || '—'}
                          </div>
                        </td>
                        {/* Location */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600">
                            <MapPinIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate max-w-[120px]">{event.location}</span>
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${s.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
                            {s.label}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/edit-event/${event._id}`} className="w-9 h-9 flex items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-all hover:scale-110 border border-amber-100/50" title="Edit">
                              <PencilIcon className="h-4 w-4" />
                            </Link>
                            <button onClick={() => handleDelete(event._id)} className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all hover:scale-110 border border-red-100/50" title="Delete">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/30 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-gray-400">
                Showing <span className="text-gray-700">{filtered.length}</span> of <span className="text-gray-700">{events.length}</span> events
              </p>
              <div className="flex gap-1.5">
                {['upcoming', 'ongoing', 'completed'].map(s => {
                  const c = STATUS_CONFIG[s];
                  return (
                    <span key={s} className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${c.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      {events.filter(e => e.status === s).length} {s}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminEvents;

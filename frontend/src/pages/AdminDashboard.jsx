import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './admin/AdminSidebar';
import { getEvents, deleteEvent } from '../services/eventService';
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    CalendarIcon,
    MapPinIcon,
    TicketIcon,
    UserGroupIcon,
    ChartBarIcon,
    EyeIcon,
    CheckBadgeIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        upcoming: 0,
        ongoing: 0,
        completed: 0
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await getEvents();
            setEvents(data || []);
            
            // Calculate real stats
            const s = {
                total: data.length,
                upcoming: data.filter(e => e.status === 'upcoming').length,
                ongoing: data.filter(e => e.status === 'ongoing').length,
                completed: data.filter(e => e.status === 'completed').length
            };
            setStats(s);
        } catch (err) {
            console.error('Failed to fetch events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Permanently delete "${name}"?`)) {
            try {
                await deleteEvent(id);
                setEvents(events.filter(event => event._id !== id));
            } catch (err) {
                alert('Error deleting event: ' + err);
            }
        }
    };

    const filteredEvents = events.filter(event =>
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Analytics Mock Data (Trend of events)
    const chartData = [
        { name: 'Jan', count: 4 },
        { name: 'Feb', count: 7 },
        { name: 'Mar', count: stats.total || 5 },
        { name: 'Apr', count: 8 },
        { name: 'May', count: 12 },
        { name: 'Jun', count: 15 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <AdminSidebar activeOverride="dashboard" />

            {/* Main content area */}
            <div className="flex-1 min-w-0 p-5 lg:p-8 space-y-6 overflow-y-auto">
                
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <SparklesIcon className="h-4 w-4 text-violet-500" />
                            <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest leading-none">Global Control Center</span>
                        </div>
                        <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight leading-tight">Admin Dashboard</h1>
                        <p className="text-gray-400 text-xs font-medium mt-1">Real-time platform metrics and event synchronization.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to="/create-event"
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-black text-[10px] shadow-lg shadow-violet-200 hover:-translate-y-0.5 transition-all uppercase tracking-wider"
                        >
                            <CalendarIcon className="h-4 w-4" />
                            + New Event
                        </Link>
                    </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Impact</p>
                            <h3 className="text-2xl font-black text-slate-800">{stats.total}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                            <ChartBarIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Upcoming</p>
                            <h3 className="text-2xl font-black text-slate-800">{stats.upcoming}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <ClockIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Now</p>
                            <h3 className="text-2xl font-black text-slate-800">{stats.ongoing}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <ArrowTrendingUpIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
                            <h3 className="text-2xl font-black text-slate-800">{stats.completed}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <CheckBadgeIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Main Visualization */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-80">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">Growth Analytics</h2>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">↑ 12.5% vs Last Month</span>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[32px] text-white flex flex-col justify-between relative overflow-hidden ring-1 ring-white/10 group h-80">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                                <SparklesIcon className="w-6 h-6 text-violet-400" />
                            </div>
                            <h3 className="text-2xl font-black mb-2 leading-tight">Elite Platform Insights</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">Your platform is currently outperforming 85% of similar systems in active event engagement.</p>
                        </div>
                        <button className="relative z-10 w-full py-4 bg-violet-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-violet-900/50 hover:bg-violet-500 transition-colors">Generate Report</button>
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                </div>

                {/* Recent Events Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">Active Event Schedule</h2>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Sync search..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300 w-48"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date & Schedule</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right pr-8">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr><td colSpan="4" className="py-20 text-center animate-pulse font-black text-slate-300 text-xs tracking-widest uppercase">Initializing Stream...</td></tr>
                                    ) : filteredEvents.length === 0 ? (
                                        <tr><td colSpan="4" className="py-20 text-center font-bold text-slate-400 text-sm italic">No records found matching sync criteria.</td></tr>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <tr key={event._id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                                            {event.imageUrl ? (
                                                                <img src={`http://localhost:5000/${event.imageUrl}`} className="w-full h-full object-cover rounded-2xl" alt="" />
                                                            ) : (
                                                                <CalendarIcon className="w-5 h-5 text-slate-300" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 leading-tight mb-1">{event.name}</p>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                                                                event.status === 'upcoming' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                event.status === 'ongoing' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                'bg-slate-100 text-slate-500 border-slate-200'
                                                            }`}>
                                                                {event.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-xs font-black text-slate-800 mb-0.5">
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                                                        <ClockIcon className="w-3 h-3 mr-1" />
                                                        {event.time}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                                        <MapPinIcon className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                                        <span className="truncate max-w-[150px]">{event.location}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right pr-8">
                                                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                        <Link to={`/event/${event._id}`} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors" title="Inspect Sync">
                                                            <EyeIcon className="w-4 h-4" />
                                                        </Link>
                                                        <Link to={`/edit-event/${event._id}`} className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors" title="Modify Record">
                                                            <PencilSquareIcon className="w-4 h-4" />
                                                        </Link>
                                                        <button onClick={() => handleDelete(event._id, event.name)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" title="Terminate Entry">
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

            </div>
        </div>
    );
};

export default AdminDashboard;
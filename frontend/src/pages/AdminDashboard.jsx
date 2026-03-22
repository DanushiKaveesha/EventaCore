import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    ClockIcon
} from '@heroicons/react/24/outline';

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
        // Demo data - replace with actual API call
        const demoEvents = [
            {
                _id: '1',
                name: 'Thaalai Music Event',
                description: 'Annual music festival featuring local artists',
                date: '2026-03-05',
                time: '18:00',
                location: 'University Auditorium',
                status: 'completed',
                ticketTiers: ['VIP', 'Regular', 'Student'],
                organizer: 'Ishini kavishka',
                attendees: 245,
                image: null
            },
            {
                _id: '2',
                name: 'Tech Symposium 2026',
                description: 'Annual technology conference',
                date: '2026-03-20',
                time: '19:28',
                location: 'Main Hall',
                status: 'upcoming',
                ticketTiers: ['VIP', 'Regular', 'Early Bird'],
                organizer: 'Dr. Sanath Jayasuriya',
                attendees: 156,
                image: null
            },
            {
                _id: '3',
                name: 'Sports Day Championship',
                description: 'Inter-university sports competition',
                date: '2026-03-15',
                time: '09:00',
                location: 'Sports Complex',
                status: 'ongoing',
                ticketTiers: ['Regular', 'Student'],
                organizer: 'Sports Council',
                attendees: 432,
                image: null
            },
            {
                _id: '4',
                name: 'Art Exhibition 2026',
                description: 'Showcasing student artwork',
                date: '2026-02-28',
                time: '10:00',
                location: 'Art Gallery',
                status: 'completed',
                ticketTiers: ['Regular'],
                organizer: 'Art Club',
                attendees: 89,
                image: null
            },
            {
                _id: '5',
                name: 'Career Fair 2026',
                description: 'Connect with top companies',
                date: '2026-03-25',
                time: '10:00',
                location: 'Convention Center',
                status: 'upcoming',
                ticketTiers: ['VIP', 'Regular', 'Student'],
                organizer: 'Career Center',
                attendees: 0,
                image: null
            }
        ];

        setEvents(demoEvents);

        // Calculate stats
        const stats = {
            total: demoEvents.length,
            upcoming: demoEvents.filter(e => e.status === 'upcoming').length,
            ongoing: demoEvents.filter(e => e.status === 'ongoing').length,
            completed: demoEvents.filter(e => e.status === 'completed').length
        };
        setStats(stats);
        setLoading(false);
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            try {
                // API call to delete event
                setEvents(events.filter(event => event._id !== id));
            } catch (err) {
                alert('Error deleting event: ' + err);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'ongoing':
                return 'bg-green-50 text-green-600 border-green-200';
            case 'completed':
                return 'bg-gray-50 text-gray-600 border-gray-200';
            case 'cancelled':
                return 'bg-red-50 text-red-600 border-red-200';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'upcoming':
                return 'UPCOMING';
            case 'ongoing':
                return 'ONGOING';
            case 'completed':
                return 'COMPLETED';
            case 'cancelled':
                return 'CANCELLED';
            default:
                return status.toUpperCase();
        }
    };

    const filteredEvents = events.filter(event =>
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Banner Section */}
            <div className="bg-gradient-to-r from-[#173F8E] via-[#2F217A] to-[#40136A] rounded-[32px] pt-12 pb-24 px-8 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between relative z-10">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">Admin Dashboard</h1>
                        <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
                            Monitor platform metrics, curate active venues, and organize your master event schedule with absolute precision.
                        </p>
                    </div>
                    <div className="mt-6 lg:mt-0">
                        <Link
                            to="/create-event"
                            className="inline-flex items-center space-x-2 bg-white text-[#2F217A] hover:bg-blue-50 px-6 py-3.5 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>Create New Event</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-16 z-20 mb-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Events</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                <ClockIcon className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">{stats.upcoming}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Upcoming</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                                <ChartBarIcon className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">{stats.ongoing}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Ongoing</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center">
                                <CheckBadgeIcon className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">{stats.completed}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Completed</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
                <div className="bg-white rounded-xl p-2 flex items-center shadow-sm border border-gray-100">
                    <div className="flex items-center flex-grow bg-gray-50 rounded-lg px-4 py-3">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search events by name or location..."
                            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                        />
                    </div>
                    <div className="px-5 shrink-0 hidden sm:block">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-full">
                            {filteredEvents.length} events found
                        </span>
                    </div>
                </div>
            </div>

            {/* Events Table */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Event Identification</th>
                                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredEvents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-16 text-center text-gray-500">
                                            No events found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEvents.map((event) => (
                                        <tr key={event._id} className="hover:bg-gray-50/50 transition-colors group">
                                            {/* Event Info */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shrink-0">
                                                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-base mb-1">{event.name}</h3>
                                                        <div className="flex items-center space-x-3 text-xs">
                                                            <span className="text-gray-500 flex items-center">
                                                                <TicketIcon className="w-3 h-3 mr-1" />
                                                                {event.ticketTiers?.length || 0} TICKET TIERS
                                                            </span>
                                                            <span className="text-gray-400">•</span>
                                                            <span className="text-gray-500 flex items-center">
                                                                <UserGroupIcon className="w-3 h-3 mr-1" />
                                                                {event.organizer}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date & Time */}
                                            <td className="py-5 px-6">
                                                <div className="font-semibold text-gray-800 text-sm">
                                                    {new Date(event.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="text-gray-500 text-xs mt-1">{event.time}</div>
                                            </td>

                                            {/* Location */}
                                            <td className="py-5 px-6">
                                                <div className="flex items-center text-gray-600 text-sm">
                                                    <MapPinIcon className="w-4 h-4 mr-1 text-gray-400" />
                                                    {event.location}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-5 px-6">
                                                <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(event.status)}`}>
                                                    {getStatusLabel(event.status)}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-5 px-6 text-right">
                                                <div className="flex items-center justify-end space-x-2 opacity-100 lg:opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        to={`/events/${event._id}/edit`}
                                                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                                                    >
                                                        <PencilSquareIcon className="w-3.5 h-3.5" />
                                                        <span>Edit</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(event._id, event.name)}
                                                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
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
        </div>
    );
};

export default AdminDashboard;
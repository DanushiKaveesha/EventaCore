import React, { useEffect, useState } from 'react';
import { getEvents, deleteEvent } from '../../services/eventService';
import {
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  TagIcon,
  CheckCircleIcon,
  CreditCardIcon,
  UsersIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      // Most recent first for admin view
      setEvents(data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)));
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you certain you want to delete this event permanently?')) {
      try {
        await deleteEvent(id);
        setEvents(events.filter(e => e._id !== id));
      } catch (err) {
        alert('Failed to delete event: ' + err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming': return <span className="px-4 py-1.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wider">Upcoming</span>;
      case 'ongoing': return <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">Ongoing</span>;
      case 'completed': return <span className="px-4 py-1.5 bg-gray-100 text-gray-800 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider">Completed</span>;
      default: return <span className="px-4 py-1.5 bg-gray-100 text-gray-800 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col lg:flex-row w-full">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] overflow-x-hidden min-h-screen p-4 sm:p-8 lg:p-12">

        <div className="mb-8 lg:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 capitalize tracking-tight">Events Management</h1>
            <p className="text-gray-500 font-medium mt-2 lg:mt-3 text-base lg:text-lg">Monitor, update, and control your platform's events.</p>
          </div>
          <Link 
            to="/create-event" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-2xl font-bold shadow-lg shadow-sky-200 hover:bg-sky-600 transition-all transform hover:-translate-y-0.5"
          >
            <PlusIcon className="h-5 w-5" />
            Launch New Event
          </Link>
        </div>

        <div className="animate-fade-in space-y-6 lg:space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 flex items-center space-x-5 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><ChartBarIcon className="w-8 h-8" /></div>
                <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Events</p><p className="text-3xl font-black text-gray-900">{events.length}</p></div>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 flex items-center space-x-5 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl"><CalendarIcon className="w-8 h-8" /></div>
                <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Upcoming</p><p className="text-3xl font-black text-gray-900">{events.filter(e => e.status === 'upcoming').length}</p></div>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 flex items-center space-x-5 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl"><TagIcon className="w-8 h-8" /></div>
                <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ongoing</p><p className="text-3xl font-black text-gray-900">{events.filter(e => e.status === 'ongoing').length}</p></div>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 flex items-center space-x-5 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="p-4 bg-gray-50 text-gray-600 rounded-2xl"><CheckCircleIcon className="w-8 h-8" /></div>
                <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Completed</p><p className="text-3xl font-black text-gray-900">{events.filter(e => e.status === 'completed').length}</p></div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-200 flex flex-col sm:flex-row items-center justify-between">
              <div className="relative flex-1 w-full sm:max-w-md">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search events by name or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 shadow-inner transition-all font-medium text-gray-700 outline-none" />
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Event Identification</th>
                    <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                    <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Location</th>
                    <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-blue-50/40 transition-colors duration-200 group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-14 w-14">
                            {event.imageUrl ? (
                              <img className="h-14 w-14 rounded-2xl object-cover border border-gray-200 shadow-sm" src={`http://localhost:5000/${event.imageUrl}`} alt="" />
                            ) : (
                              <div className="h-14 w-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center"><CalendarIcon className="h-7 w-7 text-gray-400" /></div>
                            )}
                          </div>
                          <div className="ml-5">
                            <div className="text-sm font-black text-gray-900">{event.name}</div>
                            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider">{event.tickets?.length || 0} TIERS</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-800">{new Date(event.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400 font-bold">{event.time}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-bold border border-gray-200">{event.location}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">{getStatusBadge(event.status)}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-3 transition-opacity">
                          <Link to={`/edit-event/${event._id}`} className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="Edit"><PencilIcon className="h-5 w-5" /></Link>
                          <button onClick={() => handleDelete(event._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

      </div>
    </div>
  );
};

export default AdminEvents;
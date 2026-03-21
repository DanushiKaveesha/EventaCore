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
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const ongoingEvents = events.filter(e => e.status === 'ongoing').length;
  const completedEvents = events.filter(e => e.status === 'completed').length;

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12 font-sans -mt-8 mx-[-1rem] sm:mx-[-2rem] px-4 sm:px-8">

      {/* Premium Header Banner */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 pt-16 pb-32 px-4 sm:px-6 lg:px-8 shadow-2xl rounded-b-[3rem] overflow-hidden -mx-4 sm:-mx-8">
        {/* Abstract Overlays */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white tracking-tight drop-shadow-md">
                Admin Dashboard
              </h2>
              <p className="mt-4 text-lg text-blue-100 font-light max-w-2xl">
                Monitor platform metrics, curate active venues, and organize your master event schedule with absolute precision.
              </p>
            </div>
            <div className="mt-8 flex md:mt-0 md:ml-4">
              <Link to="/create-event" className="group inline-flex items-center px-8 py-4 border border-transparent rounded-full shadow-xl text-base font-bold text-blue-900 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
                <PlusIcon className="-ml-1 mr-2 h-6 w-6 text-blue-600 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
                Launch New Event
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area overlapping the banner */}
      <div className="relative max-w-7xl mx-auto -mt-20 z-10">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 flex items-center space-x-5 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><ChartBarIcon className="w-8 h-8" /></div>
            <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Events</p><p className="text-3xl font-black text-gray-900">{totalEvents}</p></div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 flex items-center space-x-5 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl"><CalendarIcon className="w-8 h-8" /></div>
            <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Upcoming</p><p className="text-3xl font-black text-gray-900">{upcomingEvents}</p></div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 flex items-center space-x-5 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl"><TagIcon className="w-8 h-8" /></div>
            <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ongoing</p><p className="text-3xl font-black text-gray-900">{ongoingEvents}</p></div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 flex items-center space-x-5 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="p-4 bg-gray-50 text-gray-600 rounded-2xl"><CheckCircleIcon className="w-8 h-8" /></div>
            <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Completed</p><p className="text-3xl font-black text-gray-900">{completedEvents}</p></div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 bg-white p-3 rounded-2xl shadow-md border border-gray-200 flex flex-col sm:flex-row items-center justify-between">
          <div className="relative flex-1 w-full sm:max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search events by name or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium text-gray-700 outline-none" />
          </div>
          <div className="mt-4 sm:mt-0 px-4 py-2 bg-blue-50 rounded-xl text-blue-700 font-bold text-sm tracking-wide">
            Showing {filteredEvents.length} results
          </div>
        </div>

        {/* Data Table */}
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow-2xl overflow-hidden border border-gray-100 sm:rounded-3xl bg-white relative">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/80 backdrop-blur-md border-b-2 border-gray-100">
                    <tr>
                      <th scope="col" className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Event Identification</th>
                      <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                      <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Location</th>
                      <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th scope="col" className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                          <CalendarIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-xl font-bold text-gray-900 mb-1">No matches found</p>
                          <p className="text-gray-500">We couldn't find any events matching your current search constraints.</p>
                        </td>
                      </tr>
                    ) : filteredEvents.map((event) => (
                      <tr key={event._id} className="hover:bg-blue-50/40 transition-colors duration-200 group">
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-14 w-14">
                              {event.imageUrl ? (
                                <img className="h-14 w-14 rounded-2xl object-cover border border-gray-200 shadow-sm" src={`http://localhost:5000/${event.imageUrl}`} alt="" onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }} />
                              ) : (
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center shadow-sm">
                                  <CalendarIcon className="h-7 w-7 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-5">
                              <div className="text-sm font-black text-gray-900 mb-0.5">{event.name}</div>
                              <div className="text-xs font-bold text-blue-600 tracking-wider bg-blue-50 inline-block px-2 py-0.5 rounded-md border border-blue-100">
                                {event.tickets?.length || 0} TICKET TIERS
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-800 mb-1">
                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center font-medium">
                            <CalendarIcon className="w-4 h-4 mr-1.5 opacity-70" /> {event.time}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-gray-700 font-bold inline-flex items-center px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200 line-clamp-1 max-w-[200px]">
                            {event.location}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {getStatusBadge(event.status)}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Link to={`/edit-event/${event._id}`} className="flex items-center text-amber-600 hover:text-white bg-amber-50 hover:bg-amber-500 border border-amber-200 hover:border-amber-500 px-3 py-2 rounded-xl shadow-sm transition-all duration-200" title="Edit">
                              <PencilIcon className="h-5 w-5 mr-1.5" />
                              <span className="font-bold">Edit</span>
                            </Link>
                            <button onClick={() => handleDelete(event._id)} className="flex items-center text-red-600 hover:text-white bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500 px-3 py-2 rounded-xl shadow-sm transition-all duration-200" title="Delete">
                              <TrashIcon className="h-5 w-5 mr-1.5" />
                              <span className="font-bold">Drop</span>
                            </button>
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
      </div>
    </div>
  );
};

export default AdminEvents;

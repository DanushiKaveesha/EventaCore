import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/eventService';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, free, paid

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    const isFree = event.tickets && event.tickets.some(t => t.price === 0);
    if (filter === 'free') return isFree;
    if (filter === 'paid') return !isFree;
    return true;
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        // optionally sort by date closest first
        const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sorted);
      } catch (err) {
        console.error(err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 shadow-sm">
          <h3 className="text-xl font-bold mb-2">Oops!</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-black tracking-widest uppercase mb-4 border border-blue-100 shadow-sm animate-pulse">
            Explore Campus Drops
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 tracking-tight">
            Upcoming Events
          </h2>
          <p className="mt-4 text-xl text-gray-500 font-medium max-w-2xl">
            Join the most happening clubs and activities around the campus.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200 shadow-inner backdrop-blur-sm self-end">
          {['all', 'free', 'paid'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-[1.25rem] text-sm font-black tracking-wider uppercase transition-all duration-300 ${
                filter === f
                  ? 'bg-white text-blue-600 shadow-md transform scale-105'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
          <CalendarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No {filter !== 'all' ? filter : ''} events found</h3>
          <p className="text-gray-500 mb-6">There are currently no events published in the system.</p>
          <a href="/create-event" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Create First Event
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col group border border-gray-100">

              {/* Event Image */}
              <div className="relative h-60 w-full overflow-hidden bg-gray-200">
                {event.imageUrl ? (
                  <img
                    src={`http://localhost:5000/${event.imageUrl}`}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Event+Poster+Missing' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <CalendarIcon className="h-20 w-20 text-gray-300" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{event.name}</h3>

                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-700">
                    <CalendarIcon className="h-5 w-5 mr-3 text-blue-500" />
                    <span className="font-medium text-sm">
                      {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {event.time}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPinIcon className="h-5 w-5 mr-3 text-purple-500" />
                    <span className="font-medium text-sm line-clamp-1">{event.location}</span>
                  </div>
                  {event.tickets && event.tickets.length > 0 && (
                    <div className="flex items-center text-gray-700">
                      <CurrencyDollarIcon className="h-5 w-5 mr-3 text-emerald-500" />
                      <span className="font-medium text-sm">
                        Starting from ${Math.min(...event.tickets.map(t => t.price)).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {event.promotions && event.promotions.length > 0 && (
                    <div className="flex items-center text-gray-700">
                      <TagIcon className="h-5 w-5 mr-3 text-amber-500" />
                      <span className="font-medium text-sm text-amber-600">
                        {event.promotions.length} Promo Codes Available!
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <Link to={`/event/${event._id}`} className="w-full bg-gray-50 hover:bg-blue-50 text-blue-600 font-bold py-3 px-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white flex justify-center items-center">
                    Book Tickets
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
